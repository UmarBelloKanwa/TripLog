from openrouteservice import Client
from datetime import datetime, timedelta
from openrouteservice.exceptions import ApiError
from .serializers import TripData
import os
from dotenv import load_dotenv

load_dotenv()


API_KEY: str = os.getenv("OPENROUTESERVICE_API_KEY")

client = Client(key=API_KEY)  

class GeocodingError(Exception):
    """Custom exception for geocoding issues."""
    pass

def get_location_coordinate(location: str, label: str) -> list:
    try:
        response = client.pelias_search(text=location)
        features = response.get("features", [])
        if features:
            return features[0]["geometry"]["coordinates"]
        else:
            raise GeocodingError(f"{label} not found. Please check the name and try again.")
    except Exception as e:
        raise GeocodingError(f"Error while looking up {label}")

def get_route_directions(coordinates: list):
    try:
        return client.directions(
            coordinates=coordinates,
            profile="driving-car",
            format="geojson",
            instructions=True,
        )
    except ApiError as e:
        # e.args is something like: (status_code, response_dict)
        # find the dict in e.args:
        body = next((arg for arg in e.args if isinstance(arg, dict)), None)
        if body and 'error' in body:
            message = body['error'].get('message', str(e))
        else:
            message = str(e)
        # raise exception with that message
        raise GeocodingError(message)

def extract_summary(route_data: dict):
    try:
        summary = route_data["features"][0]["properties"]["summary"]
        return {
            "distance_miles": round(summary["distance"] / 1609.34, 2),  # meters to miles
            "duration_hours": round(summary["duration"] / 3600, 2)     # seconds to hour
        }
    except (KeyError, IndexError):
        raise GeocodingError("Could not extract route summary.")

def reverse_geocode(lat, lon):
    try:
        # Note: order must be (lon, lat)
        response = client.pelias_reverse((lon, lat))
        features = response.get('features', [])
        if features:
            return features[0]['properties']['label']
        else:
            return f"Lat: {lat}, Lon: {lon}"
    except Exception as e:
        return f"Lat: {lat}, Lon: {lon} (Error: {e})"

def get_fuel_stops(route_data, every_miles=1000):
    try:
        geometry = route_data["features"][0]["geometry"]["coordinates"]
        total_miles = round(route_data["features"][0]["properties"]["summary"]["distance"] / 1609.34, 2)
        num_stops = int(total_miles // every_miles)

        if num_stops == 0:
            return []

        points_interval = len(geometry) // (num_stops + 1)
        fuel_stops = []

        for i in range(1, num_stops + 1):
            point = geometry[i * points_interval]
            lon, lat = point[0], point[1]

            location = reverse_geocode(lat, lon)

            fuel_stops.append({
                "location": location,
                "coordinates": {"lat": lat, "lon": lon},
                "distance_into_trip_miles": round(i * every_miles, 1),
                "note": f"Fuel stop after {i * every_miles} miles."
            })

        return fuel_stops

    except (KeyError, IndexError):
        raise GeocodingError("Could not extract fuel stops.")

def calculate_required_rests(route_data, current_hours, rest_interval=10, max_hours=70):
    try:
        steps = route_data["features"][0]["properties"]["segments"][0]["steps"]
        geometry = route_data["features"][0]["geometry"]["coordinates"]

        total_duration = sum(step["duration"] for step in steps)  # in seconds
        geometry_len = len(geometry)

        total_hours = current_hours + 2  # 1 hour each for pickup and drop-off
        hours_since_last_rest = 0
        time_accumulator = 0  # in seconds
        rest_points = []

        for step in steps:
            step_duration = step["duration"]  # in seconds
            step_hours = step_duration / 3600
            total_hours += step_hours
            hours_since_last_rest += step_hours
            time_accumulator += step_duration

            if hours_since_last_rest >= rest_interval:
                # Determine current progress to find corresponding coordinate
                progress = time_accumulator / total_duration
                geometry_index = min(int(progress * geometry_len), geometry_len - 1)
                lon, lat = geometry[geometry_index]

                location = reverse_geocode(lat, lon)

                rest_points.append({
                    "location": location,
                    "coordinates": {"lat": lat, "lon": lon},
                    "expected_arrival": round(time_accumulator / 3600, 2),
                    "note": f"Take a rest after driving for {round(hours_since_last_rest, 1)} hours."
                })

                hours_since_last_rest = 0

        if total_hours > max_hours:
            warning = "Driver exceeds allowed driving hours. Mandatory rest(s) required."
        elif total_hours >= max_hours - 10:
            warning = "Caution: Approaching 70-hour limit. Plan your final rest soon."
        else:
            warning = "Driving time within limits."

        return {
            "total_hours": round(total_hours, 2),
            "rest_points": rest_points,
            "warning": warning
        }

    except (KeyError, IndexError) as e:
        raise ValueError(f"Error while calculating rest points: {e}")


def generate_map_data(data: TripData) -> dict:
    if not API_KEY:
        raise GeocodingError("We're having a technical issue with location lookup. Please try again later.")
    
    locations_coordinates = {}

    # Custom labels for user clarity
    field_labels = {
        "current_location": "Current location",
        "pickup_location": "Pickup location",
        "dropoff_location": "Dropoff location",
    }

    for field, value in data.items():
        if isinstance(value, dict):
            raise ValueError(f"Invalid data format for field '{field}': Nested dictionaries are not allowed.")
        if field != "hours":
            label = field_labels.get(field, field.replace("_", " ").capitalize())
            coords = get_location_coordinate(location=value, label=label)
            locations_coordinates[field] = coords

    # Build the coordinates array in the right order
    coordinates_list = [
        locations_coordinates.get("current_location"),
        locations_coordinates.get("pickup_location"),
        locations_coordinates.get("dropoff_location"),
    ]

    # Use the coordinates to get route directions
    route_directions = get_route_directions(coordinates=coordinates_list)
    summary = extract_summary(route_directions)
    fuel_stops = get_fuel_stops(route_directions)
    rest_info = calculate_required_rests(route_data=route_directions, current_hours=data["hours"]) 

    return {
        "route": route_directions,
        "summary": summary,
        "fuel_stops": fuel_stops,
        "rest_info": rest_info,
    }

from datetime import datetime, timedelta
import math
import requests

# Constants
MAX_DRIVING_HOURS = 11  # Max driving hours per day
MAX_ON_DUTY_HOURS = 14  # Max on-duty hours (driving + other tasks)
BREAK_AFTER_HOURS = 8   # Required break after this many hours of driving
MIN_BREAK_HOURS = 0.5   # 30 minutes minimum break
REST_PERIOD_HOURS = 10  # Minimum off-duty rest period between shifts

def convert_to_utc(local_time, timezone_offset=-4):  # Default Eastern Time
    """Convert local time to UTC based on timezone offset"""
    return local_time - timedelta(hours=timezone_offset)

def reverse_geocode(lat, lon):
    """Get location name from coordinates using Nominatim"""
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
        response = requests.get(url, headers={"User-Agent": "ELD-Log-Generator"})
        data = response.json()
        if "display_name" in data:
            return data["display_name"]
        return f"{lat}, {lon}"
    except Exception as e:
        print(f"Geocoding error: {e}")
        return f"{lat}, {lon}"
    

def generate_eld_logs(route_data: dict, start_time: datetime, timezone_offset=-4):
    """
    Generate canvas-compatible ELD logs from OpenRouteService route data
    Returns:
    - canvas_logs: List of log days with entries in the canvas-compatible format
    """
    canvas_logs = []
    current_time = start_time
    on_duty_time_seconds = 0
    driving_time_seconds = 0
    time_since_last_break_seconds = 0
    log_day = 1

    steps = route_data['route']['features'][0]['properties']['segments'][0]['steps']
    def add_canvas_entry(log_type, start, end):
        status_map = {
            "Driving": "D",
            "On Duty": "ON",
            "Off Duty": "OFF",
            "Rest": "SB",
            "Break": "SB"
        }
        status = status_map.get(log_type, "OFF")
        midnight = datetime(start.year, start.month, start.day, 0, 0, 0)
        start_hour = (start - midnight).total_seconds() / 3600
        end_hour = (end - midnight).total_seconds() / 3600
        if end_hour < start_hour:
            end_hour = 24.0
        return {
            "status": status,
            "startHour": round(start_hour, 2),
            "endHour": round(end_hour, 2)
        }

    current_canvas_log = {
        "log_day": log_day,
        "entries": []
    }

    # Add Off Duty at start if necessary
    midnight = datetime(current_time.year, current_time.month, current_time.day, 0, 0, 0)
    if current_time > midnight:
        start_hour = 0
        end_hour = (current_time - midnight).total_seconds() / 3600
        if end_hour > 0:
            current_canvas_log["entries"].append({
                "status": "OFF",
                "startHour": start_hour,
                "endHour": round(end_hour, 2)
            })

    for step in steps:
        segment_duration_seconds = step.get('duration', 0)
        if (driving_time_seconds + segment_duration_seconds > MAX_DRIVING_HOURS * 3600 or
            on_duty_time_seconds + segment_duration_seconds > MAX_ON_DUTY_HOURS * 3600):
            rest_start = current_time
            rest_end = rest_start + timedelta(hours=REST_PERIOD_HOURS)
            current_canvas_log["entries"].append(add_canvas_entry("Rest", rest_start, rest_end))

            driving_time_seconds = 0
            on_duty_time_seconds = 0
            time_since_last_break_seconds = 0
            current_time = rest_end
            canvas_logs.append(current_canvas_log)
            log_day += 1
            current_canvas_log = {
                "log_day": log_day,
                "entries": []
            }

        if time_since_last_break_seconds >= BREAK_AFTER_HOURS * 3600:
            break_start = current_time
            break_end = break_start + timedelta(hours=MIN_BREAK_HOURS)
            current_canvas_log["entries"].append(add_canvas_entry("Break", break_start, break_end))

            time_since_last_break_seconds = 0
            current_time = break_end
            on_duty_time_seconds += MIN_BREAK_HOURS * 3600

        segment_start = current_time
        segment_end = segment_start + timedelta(seconds=segment_duration_seconds)

        # Handle segment across midnight
        midnight = datetime(segment_start.year, segment_start.month, segment_start.day, 0, 0, 0)
        next_midnight = midnight + timedelta(days=1)

        if segment_end > next_midnight:
            # Split the segment
            current_canvas_log["entries"].append(
                add_canvas_entry("Driving", segment_start, next_midnight)
            )
            canvas_logs.append(current_canvas_log)
            log_day += 1
            current_canvas_log = {
                "log_day": log_day,
                "entries": [add_canvas_entry("Driving", next_midnight, segment_end)]
            }
        else:
            current_canvas_log["entries"].append(
                add_canvas_entry("Driving", segment_start, segment_end)
            )

        driving_time_seconds += segment_duration_seconds
        on_duty_time_seconds += segment_duration_seconds
        time_since_last_break_seconds += segment_duration_seconds
        current_time = segment_end

    if current_canvas_log["entries"]:
        canvas_logs.append(current_canvas_log)

    for canvas_log in canvas_logs:
        totals = {"OFF": 0, "SB": 0, "D": 0, "ON": 0}
        for entry in canvas_log["entries"]:
            duration = entry["endHour"] - entry["startHour"]
            totals[entry["status"]] += duration
        formatted_totals = {}
        for status, hours in totals.items():
            total_minutes = int(hours * 60)
            formatted_totals[status] = f"{total_minutes // 60:02d}:{total_minutes % 60:02d}"
        canvas_log["totals"] = formatted_totals

    return {
        "canvas_logs": canvas_logs
    }