const BASE_URL = "http://127.0.0.1:8000/api/";

const url = (path) => `${BASE_URL}${path}`;

const api = {
  createTrip: async (data) => {
    try {
      const response = await fetch(
        url("/create-trip"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP! Status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (err) {
      console.error("Error creating trip:", err);
      throw err;
    }
  },
  storeTrip: () => {},
  getLastTrip: () => {},
  getAllTrip: () => {},
  deleteTrip: () => {},
  clearData: () => {},
};

export default api;