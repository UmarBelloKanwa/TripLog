from typing import Dict, Any, Optional, List
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpRequest
from .models import Trip, Route, DriverLog
from .serializers import TripSerializer, RouteSerializer, DriverLogSerializer
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# ================================
# 1️⃣ CREATE A NEW TRIP
# ================================
@api_view(['POST'])
def create_trip(request: HttpRequest) -> Response:
    serializer: TripSerializer = TripSerializer(data=request.data)
    if serializer.is_valid():
        trip: Trip = serializer.save()

        # Calculate route details
        route_data: Optional[Dict[str, Any]] = calculate_route(
            trip.pickup_location, trip.dropoff_location
        )
        if route_data:
            route: Route = Route.objects.create(
                trip=trip,
                total_duration=route_data['duration'],
                fuel_stops=route_data['fuel_stops'],
                rest_stops=route_data['rest_stops'],
                route_path=route_data['route_path']
            )
            route_serializer: RouteSerializer = RouteSerializer(route)

        return Response({
            "trip": serializer.data,
            "route": route_serializer.data if route_data else None
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ================================
# 2️⃣ RETRIEVE TRIP DETAILS
# ================================
@api_view(['GET'])
def get_trip_details(request: HttpRequest, trip_id: int) -> Response:
    try:
        trip: Trip = Trip.objects.get(id=trip_id)
        trip_serializer: TripSerializer = TripSerializer(trip)
        route_serializer: RouteSerializer = RouteSerializer(trip.route)
        logs = DriverLog.objects.filter(trip=trip)
        log_serializer: DriverLogSerializer = DriverLogSerializer(logs, many=True)

        return Response({
            "trip": trip_serializer.data,
            "route": route_serializer.data,
            "logs": log_serializer.data
        })
    except Trip.DoesNotExist:
        return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)

# ================================
# 3️⃣ SUBMIT DRIVER LOG
# ================================
@api_view(['POST'])
def create_driver_log(request: HttpRequest) -> Response:
    serializer: DriverLogSerializer = DriverLogSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ================================
# 4️⃣ GENERATE MAP WITH ROUTE AND STOPS
# ================================
@api_view(['GET'])
def generate_map(request: HttpRequest, trip_id: int) -> Response:
    try:
        trip: Trip = Trip.objects.get(id=trip_id)
        route: Route = trip.route

        # Prepare map data
        route_coordinates = [(coord[1], coord[0]) for coord in route.route_path['coordinates']]
        fuel_stops = [{"location": stop["location"], "latitude": stop["latitude"], "longitude": stop["longitude"]} for stop in route.fuel_stops]
        rest_stops = [{"location": stop["location"], "latitude": stop["latitude"], "longitude": stop["longitude"]} for stop in route.rest_stops]

        return Response({
            "route_coordinates": route_coordinates,
            "fuel_stops": fuel_stops,
            "rest_stops": rest_stops
        }, status=status.HTTP_200_OK)
    except Trip.DoesNotExist:
        return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)

# ================================
# 5️⃣ GENERATE ELD LOG SHEETS
# ================================
@api_view(['GET'])
def generate_eld_logs(request: HttpRequest, trip_id: int) -> Response:
    try:
        trip: Trip = Trip.objects.get(id=trip_id)
        logs = DriverLog.objects.filter(trip=trip)

        log_data = []
        for log in logs:
            log_data.append({
                "date": log.date,
                "off_duty_hours": log.off_duty_hours,
                "sleeper_berth_hours": log.sleeper_berth_hours,
                "driving_hours": log.driving_hours,
                "on_duty_hours": log.on_duty_hours,
                "remarks": log.remarks
            })

        return Response({"logs": log_data}, status=status.HTTP_200_OK)
    except Trip.DoesNotExist:
        return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)

# ================================
# HELPER FUNCTIONS
# ================================
def calculate_route(start: str, end: str) -> Optional[Dict[str, Any]]:
    API_KEY: str = os.getenv("OPENROUTESERVICE_API_KEY")
  
    if not API_KEY:
        raise ValueError("Missing API Key! Set OPENROUTESERVICE_API_KEY in environment variables.")

    BASE_URL: str = "https://api.openrouteservice.org/v2/directions/driving-car"
    GEOCODE_URL: str = "https://api.openrouteservice.org/geocode/search"

    def get_coordinates(location: str) -> Optional[Dict[str, float]]:
        params: Dict[str, str] = {
            "api_key": API_KEY,
            "text": location
        }
        try:
            response: requests.Response = requests.get(GEOCODE_URL, params=params)
            if response.status_code == 200:
                data: Dict[str, Any] = response.json()
                if data["features"]:
                    coordinates = data["features"][0]["geometry"]["coordinates"]
                    return {"longitude": coordinates[0], "latitude": coordinates[1]}
        except requests.RequestException:
            pass
        return None

    start_coords = get_coordinates(start)
    end_coords = get_coordinates(end)

    if not start_coords or not end_coords:
        return None

    params: Dict[str, str] = {
        "api_key": API_KEY,
        "start": f"{start_coords['longitude']},{start_coords['latitude']}",
        "end": f"{end_coords['longitude']},{end_coords['latitude']}"
    }

    try:
        response: requests.Response = requests.get(BASE_URL, params=params)
        if response.status_code == 200:
            data: Dict[str, Any] = response.json()
            if "features" in data and data["features"]:
                route = data["features"][0]
                # Add 1 hour for pickup and 1 hour for drop-off (7200 seconds)
                total_duration = route["properties"]["segments"][0]["duration"] + (2 * 3600)

                return {
                    "duration": total_duration,
                    "fuel_stops": get_fuel_stops(route),
                    "rest_stops": get_rest_stops(route),
                    "route_path": route["geometry"]
                }
    except requests.RequestException:
        pass

    return None

def get_fuel_stops(route_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    total_distance = route_data["properties"]["segments"][0]["distance"]  # Distance in meters
    fuel_stops = []
    miles_per_stop = 1000  # Fuel stop every 1000 miles
    meters_per_mile = 1609.34

    # Ensure at least one fuel stop if distance exceeds threshold
    num_stops = max(1, int(total_distance // (miles_per_stop * meters_per_mile)))

    # Loop through and determine fuel stop positions along the route
    for i in range(num_stops):
        fuel_stops.append({
            "location": f"Fuel Stop {i+1}",
            "latitude": route_data["geometry"]["coordinates"][i][1],
            "longitude": route_data["geometry"]["coordinates"][i][0],
            "mile_marker": round((i + 1) * miles_per_stop, 2)
        })

    return fuel_stops

def get_rest_stops(route_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    total_duration = route_data["properties"]["segments"][0]["duration"]  # Duration in seconds
    rest_stops = []
    hours_per_stop = 8  # Rest stop every 8 driving hours
    seconds_per_hour = 3600

    # Ensure at least one rest stop if duration exceeds threshold
    num_stops = max(1, int(total_duration // (hours_per_stop * seconds_per_hour)))

    # Loop through and determine rest stop positions
    for i in range(num_stops):
        rest_stops.append({
            "location": f"Rest Stop {i+1}",
            "latitude": route_data["geometry"]["coordinates"][i][1],
            "longitude": route_data["geometry"]["coordinates"][i][0],
            "hour_marker": (i + 1) * hours_per_stop
        })

    return rest_stops