import Dexie, { Table } from "dexie";
import { Trips } from "./Trips";
import { PinedTrips } from "./PinedTrips";
import { populate } from "./populate";

export class TripDB extends Dexie {
  trips!: Table<Trips, number>;
  pinedTrips!: Table<PinedTrips, number>;

  constructor() {
    super("TripDB");

    this.version(1).stores({
      trips:
        "++id, current_location, pickup_location, dropoff_location, hours, trip_name, created_at",
      pinedTrips: "++id, tripId",
    });

    this.trips = this.table("trips");
    this.pinedTrips = this.table("pinedTrips");
  }
}

export const db = new TripDB();
db.on("populate", populate);

export function resetDatabase(): Promise<void> {
  return db.transaction("rw", db.trips, db.pinedTrips, async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
  });
}
