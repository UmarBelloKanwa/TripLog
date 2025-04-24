from rest_framework import serializers

class TripData(serializers.Serializer):
    current_location = serializers.CharField(max_length=100)
    pickup_location = serializers.CharField(max_length=100)
    dropoff_location = serializers.CharField(max_length=100)
    hours = serializers.IntegerField(min_value=1, max_value=24) # current_cycle_hours 
    trip_name = serializers.CharField()

    def validate_hours(self, value):
        if value < 1:
            raise serializers.ValidationError("Invalid current cycle hours")
        return value
