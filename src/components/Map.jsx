import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Box, Typography } from "@mui/material";

// Default icon
let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});

// Create Leaflet icon
const fuelIcon = L.icon({
  iconUrl: "/icons/fuel_icon.png",
  iconSize: [51, 51],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const currentLocation = L.icon({
  iconUrl: "/icons/location_icon.png",
  iconSize: [51, 51],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Rest Stop Icon
const restIcon = L.icon({
  iconUrl: "/icons/rest_icon.png",
  iconSize: [51, 51],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Fit the map to the bounds of GeoJSON data
const FitBoundsToGeoJSON = ({ data }) => {
  const map = useMap();

  React.useEffect(() => {
    if (data && data.features?.length) {
      const bounds = L.geoJSON(data).getBounds();
      if (bounds.isValid()) map.fitBounds(bounds);
    }
  }, [data, map]);

  return null;
};

const Map = ({ tripData }) => {
  const geoJson = tripData?.route;
  const fuelStops = tripData?.fuel_stops || [];
  const restPoints = tripData?.rest_info?.rest_points || [];
  // Extract coordinates from the first LineString
  const lineFeature = geoJson?.features?.find(
    (f) => f.geometry?.type === "LineString"
  );
  const coords = lineFeature?.geometry?.coordinates;

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON data={geoJson} />
      <FitBoundsToGeoJSON data={geoJson} />

      {/* Start Marker */}
      {coords && (
        <Marker position={[coords[0][1], coords[0][0]]} icon={currentLocation}>
          <Popup>
            <Box sx={{ p: 0 }}>
              <Typography variant="h6" gutterBottom>
                Start Location
              </Typography>
              <Typography variant="body2">
                This is the pickup point where the trip begins.
              </Typography>
            </Box>
          </Popup>
        </Marker>
      )}

      {/* End Marker */}
      {coords && (
        <Marker
          position={[
            coords[coords.length - 1][1],
            coords[coords.length - 1][0],
          ]}
        >
          <Popup>
            <Box sx={{ p: 0 }}>
              <Typography variant="h6" gutterBottom>
                End Location
              </Typography>
              <Typography variant="body2">
                This is the dropoff point where the trip concludes.
              </Typography>
            </Box>
          </Popup>
        </Marker>
      )}

      {/* Fuel Stop Markers */}
      {fuelStops.map((stop, index) => (
        <Marker
          key={`fuel-stop-${index}`}
          position={[stop.coordinates.lat, stop.coordinates.lon]}
          icon={fuelIcon}
        >
          <Popup>
            <strong>Fuel Stop:</strong> {stop.location}
            <br />
            <em>Distance into trip: {stop.distance_into_trip_miles} miles</em>
            <br />
            <small>{stop.note}</small>
          </Popup>
        </Marker>
      ))}

      {/* Rest Stop Markers */}
      {restPoints.map((point, index) => (
        <Marker
          key={`rest-point-${index}`}
          position={[point.coordinates.lat, point.coordinates.lon]}
          icon={restIcon}
        >
          <Popup>
            <strong>Rest Stop:</strong> {point.location}
            <br />
            <em>Expected arrival: {point.expected_arrival} hours</em>
            <br />
            <small>{point.note}</small>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
