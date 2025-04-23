import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useLocation, useParams } from "react-router-dom";
import api from "../services";
import { db } from "../models/db";
import groupSteps from "../services/groupSteps";
import { useNavigate } from "react-router-dom";

export default function useTrip() {
  const { tripSlug } = useParams();
  const location = useLocation();
  const [, pathname] = location.pathname
    .split("/")
    .filter((segment) => segment);

  const [render, setRerender] = React.useState(0);

  const forceRerender = () => {
    setRerender((prev) => prev + 1); // changes state → re-render
  };

  const cacheRef = React.useRef(new Map()); //  Cache trip responses

  const [tripResponse, setTripResponse] = React.useState({});
  const [tripStatus, setTripStatus] = React.useState({
    details: {
      error: null,
      isLoading: true,
    },
    response: {
      error: null,
      isLoading: true,
    },
  });

  const extractTripId = (slug) => {
    const match = slug?.match(/-(\d+)$/); // Extract ID at the end of the slug
    return match ? parseInt(match[1], 10) : null;
  };

  const tripDetails = useLiveQuery(async () => {
    if (pathname.endsWith("last-created")) {
      return await db.trips.orderBy("created_at").last();
    }

    if (!tripSlug) return null;

    const tripId = extractTripId(tripSlug);
    return !isNaN(tripId) ? await db.trips.get(tripId) : null;
  }, [pathname, tripSlug]);

  // In your component logic (outside the hook)
  React.useEffect(() => {
    if (tripDetails === undefined) {
      return;
    }
    if (!tripDetails) {
      setTripStatus((prev) => ({
        ...prev,
        response: { isLoading: false },
        details: {
          error: pathname.endsWith("last-created")
            ? "No last created trip found!"
            : "Trip not found or invalid URL.",
          isLoading: false,
        },
      }));
    } else if (tripDetails) {
      setTripStatus((prev) => ({
        ...prev,
        details: { error: null, isLoading: false },
        response: { isLoading: false },
      }));
    }
  }, [tripDetails, pathname]);

  React.useEffect(() => {
    if (!tripDetails) return;

    const cacheKey = JSON.stringify(tripDetails);

    //  Use cached result if available
    if (cacheRef.current.has(cacheKey)) {
      setTripResponse(cacheRef.current.get(cacheKey));
      setTripStatus((prev) => ({
        ...prev,
        response: {
          error: null,
          isLoading: false,
        },
      }));
      return;
    }

    (async () => {
      setTripStatus((prev) => ({
        ...prev,
        response: {
          ...prev.response,
          isLoading: true,
        },
      }));

      try {
        const response = await api.createTrip(tripDetails);
        if (response.ok) {
          const data = await response.json();

          // ✅ Cache the data
          cacheRef.current.set(cacheKey, data);
          setTripResponse(data);

          setTripStatus((prev) => ({
            ...prev,
            response: {
              error: null,
              isLoading: false,
            },
          }));
        } else {
          setTripStatus((prev) => ({
            ...prev,
            response: {
              error: "Failed to fetch trip data. Please try again.",
              isLoading: false,
            },
          }));
        }
      } catch (err) {
        setTripStatus((prev) => ({
          ...prev,
          response: {
            error: `Network error: ${err}`,
            isLoading: false,
          },
        }));
      }
    })();
  }, [tripDetails, render]);

  const groupedSteps =
    groupSteps(
      tripResponse?.data?.map?.route?.features?.[0]?.properties?.segments?.[0]
        ?.steps
    ) || [];

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [tripToDelete, setTripToDelete] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  // Open delete confirmation dialog
  const handleDeleteClick = () => {
    setTripToDelete(tripDetails);
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
      navigate("/my-trips");
    }

    setDeleteDialogOpen(false);
    setTripToDelete(null);
  };

  const navigate = useNavigate();

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return {
    tripStatus,
    tripDetails,
    tripResponse,
    groupedSteps,
    forceRerender,
    handleDeleteClick,
    snackbarOpen,
    snackbarMessage,
    deleteDialogOpen,
    setDeleteDialogOpen,
    confirmDelete,
    tripToDelete,
    handleSnackbarClose,
  };
}
