const BASE_URL = "http://127.0.0.1:8000/api";
const url = (path) => `${BASE_URL}${path}`;
const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;

const api = {
  fetchLocations: async (query = "") => {
    if (!query.length) {
      return [];
    }
    try {
      const res = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${query}`
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch locations: ${res.statusText}`);
      }
      const data = await res.json();
      return data.features.map((place) => ({
        label: place.properties.label,
        lat: place.geometry.coordinates[1],
        lon: place.geometry.coordinates[0],
      }));
    } catch /*(error)*/ {
      //console.error("Error fetching locations:", error);
      return [];
    }
  },
  reverseGeocode: async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lat=${latitude}&point.lon=${longitude}`
      );
      if (!res.ok) {
        throw new Error(`Failed to reverse geocode: ${res.statusText}`);
      }
      const data = await res.json();

      return data.features.map((place) => ({
        label: place.properties.label,
        lat: place.geometry.coordinates[1],
        lon: place.geometry.coordinates[0],
      }));
    } catch /*(error)*/ {
      //console.error("Error reverse geocoding:", error);
      return [];
    }
  },

  createTrip: async (data) => {
    data.hours = parseInt(data.hours, 10);
    try {
      const response = await fetch(url("/create-trip/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        //throw new Error(`HTTP! Status: ${response.status}`);
      }
      return response;
    } catch (error) {
      ((err) => {
        throw err;
      })(error);
    }
  },
};

export default api;
