import * as React from "react";
import { db, resetDatabase } from "../models/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";

export default function useAllTrips() {
  const navigate = useNavigate();
  const [tripStatus, setTripStatus] = React.useState({
    trips: { isLoading: true, error: null },
    pinned: { isLoading: true, error: null },
  });

  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredTrips, setFilteredTrips] = React.useState([]);
  const [activeFilter, setActiveFilter] = React.useState("all");

  // Fetch pinned trips
  const pinnedTrips = useLiveQuery(async () => {
    try {
      const data = await db.pinedTrips.toArray();
      setTripStatus((prev) => ({
        ...prev,
        pinned: { isLoading: false, error: null },
      }));
      return data;
    } catch (err) {
      setTripStatus((prev) => ({
        ...prev,
        pinned: {
          isLoading: false,
          error: `Error fetching pinned trips: ${err}`,
        },
      }));
      return [];
    }
  }, []);

  const allTrips = useLiveQuery(() => db.trips.toArray(), []);

  React.useEffect(() => {
    if (allTrips === undefined) {
      // Still loading
      return;
    }

    if (allTrips === null) {
      setTripStatus((prev) => ({
        ...prev,
        trips: {
          isLoading: false,
          error: "Something went wrong. Please try again.",
        },
      }));
      return;
    }

    if (Array.isArray(allTrips) && allTrips.length === 0) {
      setTripStatus((prev) => ({
        ...prev,
        trips: {
          isLoading: false,
          error: "No trips found.",
        },
      }));
      return;
    }

    // Success
    setTripStatus((prev) => ({
      ...prev,
      trips: {
        isLoading: false,
        error: null,
      },
    }));
  }, [allTrips]);

  // Memoize enriched trips
  const enrichedTrips = React.useMemo(() => {
    if (!allTrips) return [];
    const pinnedIds = pinnedTrips?.map((p) => p.tripId) || [];

    return allTrips.map((trip) => ({
      ...trip,
      pinned: pinnedIds.includes(trip.id),
    }));
  }, [allTrips, pinnedTrips]);

  React.useEffect(() => {
    let filtered = enrichedTrips;

    // Apply search filter by name, date, hours, index,
    if (searchTerm !== "") {
      filtered = filtered.filter(
        (trip) =>
          trip.trip_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trip.current_location
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          trip.pickup_location
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          trip.dropoff_location
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          String(trip.hours).includes(searchTerm.toLowerCase()) ||
          String(trip.id).includes(searchTerm.toLowerCase())
      );
    }

    // Apply pin filter
    if (activeFilter === "pinned") {
      filtered = filtered.filter((trip) => trip.pinned);
    } else if (activeFilter === "unpinned") {
      filtered = filtered.filter((trip) => !trip.pinned);
    }

    setFilteredTrips(filtered);
  }, [searchTerm, enrichedTrips, activeFilter]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle pin status
  const togglePin = async (id) => {
    const trip = enrichedTrips.find((trip) => trip.id === id);
    if (!trip) return;

    if (trip.pinned) {
      // If trip is pinned, remove it from pinnedTrips table
      await db.pinedTrips.delete(id);
    } else {
      // If trip is not pinned, add it to pinnedTrips table
      await db.pinedTrips.add({ tripId: id });
    }
  };

  // Sort trips - pinned trips first, then by date (newest first)
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [tripToDelete, setTripToDelete] = React.useState(null);
  const [clearAllDialogOpen, setClearAllDialogOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  // Open delete confirmation dialog
  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setDeleteDialogOpen(true);
  };

  // Confirm delete trip
  const confirmDelete = async () => {
    if (tripToDelete) {
      await db.pinedTrips.delete(tripToDelete.id);

      // Then, delete the trip from the trips table
      await db.trips.delete(tripToDelete.id);
      setSnackbarMessage(`"${tripToDelete.trip_name}" has been deleted`);
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setTripToDelete(null);
  };

  // Open clear all confirmation dialog
  const handleClearAllClick = () => {
    setClearAllDialogOpen(true);
  };

  // Confirm clear all trips
  const confirmClearAll = async () => {
    await resetDatabase();
    setClearAllDialogOpen(false);
    setSnackbarMessage("All trips have been cleared");
    setSnackbarOpen(true);
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const navigateToTrip = (trip) => {
    const slug = trip.trip_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace spaces and special chars
      .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens

    const url = `/my-trips/trip-${slug}-${trip.id}`;
    navigate(url);
  };

  return {
    trips: enrichedTrips,
    tripStatus,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    sortedTrips,
    togglePin,
    formatDate,
    handleClearAllClick,
    handleDeleteClick,
    setClearAllDialogOpen,
    confirmClearAll,
    snackbarOpen,
    handleSnackbarClose,
    snackbarMessage,
    deleteDialogOpen,
    setDeleteDialogOpen,
    clearAllDialogOpen,
    confirmDelete,
    tripToDelete,
    navigateToTrip,
  };
}
