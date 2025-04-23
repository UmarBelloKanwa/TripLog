import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Paper from "@mui/material/Paper";
import CardActions from "@mui/material/CardActions";
import Skeleton from "@mui/material/Skeleton";

const MediaLoadingCard = () => {
  return (
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
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton variant="text" width={210} height={40} />}
        subheader={<Skeleton variant="text" width={150} height={20} />}
      />
      <CardActions>
        <Skeleton variant="rounded" width={150} height={40} />
      </CardActions>
      <CardMedia
        sx={{
          width: "100%",
          m: 0,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            height: {
              xs: 300,
              sm: 400,
            },
            m: 1.5,
            borderRadius: 5,
          }}
        >
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </Paper>
      </CardMedia>
      <CardContent sx={{ width: "100%" }}>
        <Paper elevation={2} sx={{ p: 2, pt: 1, borderRadius: 5 }}>
          <Skeleton variant="text" width={150} height={30} />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="85%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="75%" />
        </Paper>
      </CardContent>
      <CardActions disableSpacing sx={{ width: "100%" }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={80} sx={{ ml: 1 }} />
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          sx={{ ml: "auto" }}
        />
      </CardActions>
    </Card>
  );
};

export default MediaLoadingCard;
