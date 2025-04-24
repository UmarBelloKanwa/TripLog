import { db } from "./db";

export function populate() {
  db.trips.bulkAdd([
    {
      current_location: "New York, NY, USA",
      pickup_location: "Chicago, IL, USA",
      dropoff_location: "Dallas, TX, USA",
      hours: 15, // Current driving time spent before the trip (can be used to calculate required rest or breaks
      trip_name: "Demo Trip",
      created_at: new Date().toISOString() 
    },
  ]);
}