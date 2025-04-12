from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpRequest
from .serializers import TripData
from .utils import generate_map_data, GeocodingError

@api_view(["POST"])
def create_trip(request: HttpRequest) -> Response:
  serializer = TripData(data=request.data)
  
  if not serializer.is_valid():
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
  validated_data = serializer.validated_data

  try:  
    map_data = generate_map_data(validated_data)
  except GeocodingError as e:
    return Response(
        {"message": str(e)},  # This will be a cleaned up string like “Pickup location not found.”
        status=status.HTTP_400_BAD_REQUEST
    )
 

  return Response({
    "message": "Trip created succesfully",
    "data": {
      "map": map_data
    }
  })

""" 
Error while generating route directions: 404 ({'er…version': '9.1.1'}, 'timestamp': 1744431002482}})"}message: "Error while generating route directions: 404 ({'error': {'code': 2010, 'message': 'Could not find routable point within a radius of 350.0 meters of specified coordinate 2: -96.9591190 40.9104270.'}, 'info': {'engine': {'build_date': '2025-03-14T11:07:03Z', 'graph_version': '1', 'version': '9.1.1'}, 'timestamp': 1744431002482}})"[[Prototype]]: Object
"""