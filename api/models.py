from django.db import models

# Create your models here.

class Trip(models.Model):
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_hours = models.IntegerField()  # Hours used in current cycle
    total_miles = models.FloatField(null=True, blank=True)  # Calculated miles
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trip from {self.pickup_location} to {self.dropoff_location}"
  
class Route(models.Model):
    trip = models.OneToOneField(Trip, on_delete=models.CASCADE, related_name="route")
    total_duration = models.IntegerField()  # Duration in minutes
    fuel_stops = models.JSONField(default=list)  # List of fuel stop locations
    rest_stops = models.JSONField(default=list)  # List of rest stop locations
    route_path = models.JSONField(default=list)  # GPS coordinates for the route

    def __str__(self):
        return f"Route for Trip {self.trip.id}"

class DriverLog(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="logs")
    date = models.DateField()
    off_duty_hours = models.FloatField()
    sleeper_berth_hours = models.FloatField()
    driving_hours = models.FloatField()
    on_duty_hours = models.FloatField()
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Log for Trip {self.trip.id} on {self.date}"

class ShippingDetail(models.Model):
    trip = models.OneToOneField(Trip, on_delete=models.CASCADE, related_name="shipping")
    document_number = models.CharField(max_length=255)
    shipper_name = models.CharField(max_length=255)
    commodity = models.CharField(max_length=255)

    def __str__(self):
        return f"Shipping Doc {self.document_number} for Trip {self.trip.id}"
