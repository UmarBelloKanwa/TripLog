from rest_framework import serializers
from .models import Trip, Route, DriverLog, ShippingDetail

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

class DriverLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverLog
        fields = '__all__'

class ShippingDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingDetail
        fields = '__all__'
