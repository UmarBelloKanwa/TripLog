from django.urls import path
from . import views

urlpatterns = [
    path("trip/create/", views.create_trip, name="create-trip"),
    path("trip/<int:trip_id>/", views.get_trip_details, name="trip-details"),
    path("driver-log/create/", views.create_driver_log, name="create-driver-log"),
    path("trip/<int:trip_id>/map/", views.generate_map, name="generate-map"),
    path("trip/<int:trip_id>/logs/", views.generate_eld_logs, name="generate-eld-logs"),
]
