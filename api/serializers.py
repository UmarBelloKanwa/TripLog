from rest_framework import serializers

class TripData(serializers.Serializer):
    current_location = serializers.CharField(max_length=100)
    pickup_location = serializers.CharField(max_length=100)
    dropoff_location = serializers.CharField(max_length=100)
    hours = serializers.IntegerField() # current_cycle_hours 

    def validate_hours(self, value):
        if value < 1:
            raise serializers.ValidationError("Invalid current cycle hours")
        return value
