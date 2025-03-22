import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const TripForm = () => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [currentCycleHours, setCurrentCycleHours] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tripData = {
      current_location: currentLocation,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      current_cycle_hours: currentCycleHours,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/trip/create/",
        tripData
      );
      history.push(`/trip/${response.data.trip.id}`);
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Current Location:</label>
        <input
          type="text"
          value={currentLocation}
          onChange={(e) => setCurrentLocation(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Pickup Location:</label>
        <input
          type="text"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Dropoff Location:</label>
        <input
          type="text"
          value={dropoffLocation}
          onChange={(e) => setDropoffLocation(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Current Cycle Hours:</label>
        <input
          type="number"
          value={currentCycleHours}
          onChange={(e) => setCurrentCycleHours(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Trip</button>
    </form>
  );
};

export default TripForm;
