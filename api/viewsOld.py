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

        # ✅ Ensure logs are retrieved correctly
        logs = DriverLog.objects.filter(trip=trip)
        log_serializer: DriverLogSerializer = DriverLogSerializer(logs, many=True)

        return Response({
            "trip": trip_serializer.data,
            "route": route_serializer.data,
            "logs": log_serializer.data if logs.exists() else [],
            "message": "No driver logs found for this trip." if not logs.exists() else None
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

        log_data = [{
            "date": log.date,
            "off_duty_hours": log.off_duty_hours,
            "sleeper_berth_hours": log.sleeper_berth_hours,
            "driving_hours": log.driving_hours,
            "on_duty_hours": log.on_duty_hours,
            "remarks": log.remarks
        } for log in logs]

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

    params = {
        "api_key": API_KEY,
        "start": start,
        "end": end
    }

    try:
        response = requests.get(BASE_URL, params=params)
        if response.status_code == 200:
            data = response.json()
            return {
                "duration": data["routes"][0]["summary"]["duration"],
                "fuel_stops": get_fuel_stops(data),
                "rest_stops": get_rest_stops(data),
                "route_path": data["routes"][0]["geometry"]
            }
    except requests.RequestException:
        pass

    return None

def get_fuel_stops(route_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    total_distance = route_data["routes"][0]["summary"]["distance"]
    fuel_stops = []
    miles_per_stop = 1000  
    meters_per_mile = 1609.34

    num_stops = max(1, int(total_distance // (miles_per_stop * meters_per_mile)))

    coordinates = route_data["routes"][0]["geometry"]["coordinates"]
    step_size = max(1, len(coordinates) // num_stops)

    for i in range(num_stops):
        index = min(i * step_size, len(coordinates) - 1)
        lon, lat = coordinates[index]

        fuel_stops.append({
            "location": f"Fuel Stop {i+1}",
            "latitude": lat,
            "longitude": lon,
            "mile_marker": round((i + 1) * miles_per_stop, 2)
        })

    return fuel_stops

def get_rest_stops(route_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    total_duration = route_data["routes"][0]["summary"]["duration"]
    rest_stops = []
    hours_per_stop = 8  
    seconds_per_hour = 3600

    num_stops = max(1, int(total_duration // (hours_per_stop * seconds_per_hour)))

    coordinates = route_data["routes"][0]["geometry"]["coordinates"]
    step_size = max(1, len(coordinates) // num_stops)

    for i in range(num_stops):
        index = min(i * step_size, len(coordinates) - 1)
        lon, lat = coordinates[index]

        rest_stops.append({
            "location": f"Rest Stop {i+1}",
            "latitude": lat,
            "longitude": lon,
            "hour_marker": (i + 1) * hours_per_stop
        })

    return rest_stops
