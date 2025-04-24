import * as React from "react";
import { styled } from "@mui/material/styles";
import useTrip from "../hooks/useTrip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import CardActions from "@mui/material/CardActions";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import NormalStepper from "./NormalStepper";
import Map from "./Map";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogSheetsContainer from "./LogSheetsContainer";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import MediaLoadingCard from "./MediaLoadingCard";
import ReplayIcon from "@mui/icons-material/Replay";
import DeleteDialog from "./DeleteDialog";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  expand; // Just call it for not showing it as non call variable;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "0",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

const Trip = () => {
  const {
    tripStatus,
    tripDetails,
    tripResponse,
    groupedSteps,
    forceRerender,
    snackbarOpen,
    snackbarMessage,
    deleteDialogOpen,
    setDeleteDialogOpen,
    confirmDelete,
    tripToDelete,
    handleSnackbarClose,
    handleDeleteClick,
  } = useTrip();

  const [isMap, setIsMap] = React.useState(true);

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const date = new Date(tripDetails?.created_at);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const formattedDate = date.toLocaleString("en-US", options);

  const detailsStatus = tripStatus.details;
  const responseStatus = tripStatus.response;
  const isLoading = detailsStatus.isLoading || responseStatus.isLoading;
  const error = detailsStatus.error || responseStatus.error;
  const isError = Boolean(error);

  function formatDistance(miles) {
    if (!miles) {
      return "0";
    }
    if (miles < 1) return `${(miles * 5280).toFixed(0)} feet`;
    return `${miles.toFixed(2)} miles`;
  }

  function formatDuration(hours) {
    if (!hours) {
      return "0:00";
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h} hour${h !== 1 ? "s" : ""}${m > 0 ? ` ${m} minute${m !== 1 ? "s" : ""}` : ""}`;
  }

  const distance = formatDistance(
    tripResponse?.data?.map?.summary?.distance_miles
  );

  const duration = formatDuration(
    tripResponse?.data?.map?.summary?.duration_hours
  );

  return (
    <Box
      sx={{
        textAlign: "left",
        width: {
          xs: "100%",
          sm: "83%",
        },
        m: "auto",
        mb: 5,
      }}
    >
      <div>
        <Box
          sx={{
            pt: isError ? 0 : 2,
            m: {
              xs: -1.5,
              sm: -5,
            },
            mt: {
              xs: 0,
              sm: 3,
            },
          }}
        >
          {isLoading ? (
            <MediaLoadingCard />
          ) : isError ? (
            <>
              <Alert
                severity="error"
                elevation={2}
                sx={{ mb: 1, borderRadius: 4 }}
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={forceRerender}
                  >
                    <ReplayIcon />
                  </IconButton>
                }
              >
                {detailsStatus.error || responseStatus.error}
              </Alert>

              <MediaLoadingCard />
            </>
          ) : (
            <Card
              variant="outlined"
              sx={{
                width: "100%",
                gridColumn: "span 2",
                flexDirection: "row",
                flexWrap: "wrap",
                resize: "none",
                borderRadius: 7,
                overflow: "hidden",
                gap: "clamp(0px, (100% - 360px + 32px) * 999, 16px)",
              }}
            >
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe">
                    <Box
                      component="img"
                      src="/images/truck.jpg"
                      alt="Triplog Logo"
                      sx={{
                        width: {
                          xs: 70,
                          sm: 100,
                        },
                        height: {
                          xs: 50,
                          sm: 63,
                        },
                      }}
                    />
                  </Avatar>
                }
                action={
                  <IconButton onClick={handleDeleteClick} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                }
                title={<h2 style={{ margin: 0 }}>{tripDetails?.trip_name}</h2>}
                subheader={<h6 style={{ margin: 0 }}> {formattedDate} </h6>}
              />
              <CardActions>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={(theme) => ({
                    width: "fit-content",
                    height: "50%",
                    mt: -0.5,
                    mb: 5,
                    ml: 1,
                    p: 0.5,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                  })}
                >
                  <Chip
                    icon={<MapOutlinedIcon color="white" />}
                    label="Map"
                    className={isMap ? "Mui-active" : ""}
                    size="small"
                    onClick={() => setIsMap(true)}
                  />
                  <Divider orientation="vertical" variant="middle" flexItem />
                  <Chip
                    icon={<AssessmentOutlinedIcon color="white" />}
                    label="Log Sheet"
                    className={isMap ? "" : "Mui-active"}
                    size="small"
                    onClick={() => setIsMap(false)}
                  />
                </Stack>
              </CardActions>
              <CardMedia
                sx={{
                  width: "100%",
                  m: 0,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: !isMap
                      ? "fit-content"
                      : {
                          xs: 600,
                          sm: 511,
                        },
                    p: 0,
                    overflow: "",
                    m: 0,
                    borderRadius: 5,
                  }}
                >
                  {isMap ? (
                    <Map tripData={tripResponse?.data?.map} />
                  ) : (
                    <LogSheetsContainer
                      logsData={tripResponse["data"]["logs"]}
                    />
                  )}
                </Paper>
              </CardMedia>
              <CardContent>
                <Paper elevation={2} sx={{ p: 2, pt: 1, borderRadius: 5 }}>
                  <h3 style={{ marginTop: 0 }}>Trip Summary</h3>
                  <Typography variant="body1">
                    <strong>Distance:</strong>
                    {distance} miles
                  </Typography>
                  <Typography variant="body1">
                    <strong>Duration:</strong> {duration} hours
                  </Typography>
                  <Typography variant="body1">
                    <strong>Fuel Stops:</strong>{" "}
                    {tripResponse?.data?.map?.fuel_stops?.length || 0}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Rest Points:</strong>{" "}
                    {tripResponse?.data?.map?.rest_info?.rest_points?.length ||
                      0}
                  </Typography>
                  <Typography variant="body1" color="error">
                    <strong>Warning:</strong>{" "}
                    {tripResponse?.data?.map?.rest_info?.warning}
                  </Typography>
                </Paper>
              </CardContent>

              <CardActions disableSpacing>
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
                <Typography
                  level="title-lg"
                  onClick={handleExpandClick}
                  sx={{ display: expanded ? "none" : "block" }}
                >
                  See More..
                </Typography>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography variant="h1" fontSize="large">
                    Steps need to be followed:
                  </Typography>

                  <NormalStepper steps={groupedSteps} />
                </CardContent>
              </Collapse>
            </Card>
          )}
        </Box>
      </div>
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
    </Box>
  );
};

export default Trip;
