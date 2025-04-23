export interface Trips {
  id?: number;
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  hours: number;
  trip_name: string;
  created_at: string;
}