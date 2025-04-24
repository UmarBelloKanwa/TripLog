from django.urls import path
from . import views

urlpatterns = [
    path("create-trip/", views.create_trip, name="create-trip")
]
