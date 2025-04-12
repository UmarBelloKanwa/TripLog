from openrouteservice import Client, convert
from openrouteservice.exceptions import ApiError
from .serializers import TripData
import os
from dotenv import load_dotenv

load_dotenv()


# This is using www.openrouteservice.org
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
        # raise your own exception with that message
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
    
def get_fuel_stops(route_data, every_miles=1000):
    try:
        geometry = route_data["features"][0]["geometry"]["coordinates"]
        
        total_miles = round(route_data["features"][0]["properties"]["summary"]["distance"] / 1609.34, 2)
        num_stops = int(total_miles // every_miles)

        if num_stops == 0:        
            return []

        points_interval = len(geometry) // (num_stops + 1)
        fuel_stops = [geometry[i * points_interval] for i in range(1, num_stops + 1)]

        return fuel_stops
    except (KeyError, IndexError):
        raise GeocodingError("Could not extract fuel stops.")

def calculate_required_rests(current_hours, added_hours):
    total_hours = current_hours + added_hours
    if total_hours > 70:
        return "Driver exceeds allowed driving hours. Schedule mandatory rest."
    elif total_hours >= 60:
        return "Caution: Approaching 70-hour limit. Consider a rest soon."
    else:
        return "Driving time within limits."


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
    rest_info = calculate_required_rests(data["hours"], summary["duration_hours"] + 2)  # +2 for pickup/dropoff buffers

    return {
        "route": route_directions,
        "summary": summary,
        "fuel_stops": fuel_stops,
        "rest_info": rest_info,
    }