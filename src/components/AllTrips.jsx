import * as React from "react";
import {
  Box,
  TextField,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  InputAdornment,
  Divider,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  Skeleton,
  useTheme,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import AppTitle from "./AppTitle";
import useAllTrips from "../hooks/useAllTrips";
import { Search, Delete, Add, PushPin, DeleteSweep } from "@mui/icons-material";
import DeleteDialog from "./DeleteDialog";

export default function AllTrips() {
  const {
    trips,
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
  } = useAllTrips();

  const loading = tripStatus.trips.isLoading;

  const theme = useTheme();

  // Skeleton loading component
  const TripSkeleton = () => (
    <>
      {[1, 2, 3].map((item) => (
        <React.Fragment key={item}>
          <ListItem
            sx={{
              py: 2,
              px: 3,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ mr: 2, mt: 0.5 }}>
              <Skeleton variant="circular" width={24} height={24} />
            </Box>
            <Box sx={{ width: "100%" }}>
              <Skeleton variant="text" width="40%" height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="20%" sx={{ mt: 1 }} />
            </Box>
            <Box sx={{ ml: 2, mt: 0.5 }}>
              <Skeleton variant="circular" width={24} height={24} />
            </Box>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </>
  );

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        pt: 0,
        mt: 0,
        pl: 0,
        pr: 0,
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 1,
          mt: 1,
          pb: 2,
        }}
      >
        <AppTitle />
        <Typography
          variant="subtitle1"
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: "600px" }}
        >
          - Simplifying Your Journey, One Log at a Time!
        </Typography>
      </Box>
      {/* Search Bar */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 10 }}>
        <Paper
          elevation={0}
          sx={{
            p: 0.5,
            mb: 2,
            borderRadius: 20,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
            },
          }}
        >
          <TextField
            fullWidth
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              px: 2,
              py: 1,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 15,
            }}
          />
        </Paper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            rowGap: 1,
            columnGap: 2,
            mt: 0,
            height: "fit-content",
            pb: 2,
          }}
        >
          {/* Filter Chips on the left */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip
              className={activeFilter === "all" ? "Mui-active" : ""}
              label="All"
              onClick={() => setActiveFilter("all")}
            />
            <Chip
              className={activeFilter === "pinned" ? "Mui-active" : ""}
              label="Pinned"
              onClick={() => setActiveFilter("pinned")}
            />
            <Chip
              className={activeFilter === "unpinned" ? "Mui-active" : ""}
              label="Unpinned"
              onClick={() => setActiveFilter("unpinned")}
            />
          </Stack>

          {/* Clear All Button on the right */}
          {trips.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteSweep />}
              onClick={handleClearAllClick}
              sx={{
                borderRadius: 5,
                textTransform: "none",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                },
              }}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Box>

      {/* trips List */}
      <Paper
        elevation={1}
        sx={{ borderRadius: 2, overflow: "auto", height: "70vh", mt: 0 }}
      >
        {loading ? (
          <List disablePadding>
            <TripSkeleton />
          </List>
        ) : sortedTrips.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography>No trips found</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {sortedTrips.map((trip, index) => (
              <React.Fragment key={trip.id}>
                {index > 0 && <Divider />}
                <ListItem
                  onClick={() => navigateToTrip(trip)}
                  alignItems="flex-start"
                  sx={{
                    py: 2,
                    px: 3,
                    bgcolor: trip.pinned
                      ? "rgba(25, 118, 210, 0.04)"
                      : "transparent",
                    "&:hover": {
                      bgcolor: trip.pinned
                        ? "rgba(25, 118, 210, 0.08)"
                        : "action.hover",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      width: "100%",
                    }}
                  >
                    {/* Pin Icon */}
                    <Tooltip title={trip.pinned ? "Unpin" : "Pin"}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(trip.id);
                        }}
                        size="small"
                        sx={{
                          mt: 0.5,
                          mr: 1,
                          color: trip.pinned
                            ? "primary.main"
                            : "action.disabled",
                          transform: trip.pinned
                            ? "rotate(0deg)"
                            : "rotate(90deg)",
                          transition: "transform 0.2s, color 0.2s",
                        }}
                      >
                        <PushPin fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* Trip Content */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          fontWeight: trip.pinned ? 600 : 500,
                          fontSize: "1.1rem",
                          color: trip.pinned
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
                          transition: "color 0.2s ease",
                          mb: 0.5,
                        }}
                      >
                        {trip.trip_name}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{
                          color: theme.palette.text.primary,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          mb: 1,
                          lineHeight: 1.6,
                        }}
                      >
                        {trip.pickup_location} to {trip.dropoff_location}
                      </Typography>
                      <Typography
                        variant="caption"
                        component="div"
                        color="text.secondary"
                      >
                        {formatDate(trip.created_at)}
                      </Typography>
                    </Box>

                    {/* Delete Button */}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(trip);
                      }}
                      edge="end"
                      aria-label="delete"
                      size="small"
                      sx={{ mt: 0.5 }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title={`Delete ${tripToDelete?.trip_name}`}
        warning={"This action cannot be undone."}
        body={"Are you sure you want to delete ?"}
        onClickToCancel={() => setDeleteDialogOpen(false)}
        onClickToDelete={confirmDelete}
      />

      {/* Clear All Confirmation Dialog */}
      <DeleteDialog
        open={clearAllDialogOpen}
        onClose={() => setClearAllDialogOpen(false)}
        title={"Clear All Trips"}
        warning={"This will delete all your trips!"}
        body={
          "Are you sure you want to delete all trips? This action cannot be undone."
        }
        onClickToCancel={() => setClearAllDialogOpen(false)}
        onClickToDelete={async () => await confirmClearAll()}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
