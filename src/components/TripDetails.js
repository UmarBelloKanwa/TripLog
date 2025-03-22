import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [route, setRoute] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/trip/${id}/`
        );
        setTrip(response.data.trip);
        setRoute(response.data.route);
        setLogs(response.data.logs);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchTripDetails();
  }, [id]);

  if (!trip || !route) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Trip Details</h2>
      <p>Current Location: {trip.current_location}</p>
      <p>Pickup Location: {trip.pickup_location}</p>
      <p>Dropoff Location: {trip.dropoff_location}</p>
      <p>Current Cycle Hours: {trip.current_cycle_hours}</p>

      <h3>Route Map</h3>
      <MapContainer
        center={route.route_coordinates[0]}
        zoom={10}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={route.route_coordinates} color="blue" />
        {route.fuel_stops.map((stop, index) => (
          <Marker key={index} position={[stop.latitude, stop.longitude]}>
            <Popup>{stop.location}</Popup>
          </Marker>
        ))}
        {route.rest_stops.map((stop, index) => (
          <Marker key={index} position={[stop.latitude, stop.longitude]}>
            <Popup>{stop.location}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <h3>Driver Logs</h3>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            <p>Date: {log.date}</p>
            <p>Off Duty Hours: {log.off_duty_hours}</p>
            <p>Sleeper Berth Hours: {log.sleeper_berth_hours}</p>
            <p>Driving Hours: {log.driving_hours}</p>
            <p>On Duty Hours: {log.on_duty_hours}</p>
            <p>Remarks: {log.remarks}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripDetails;
