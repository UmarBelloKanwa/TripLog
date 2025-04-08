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