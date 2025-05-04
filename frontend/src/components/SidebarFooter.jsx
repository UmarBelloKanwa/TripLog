import * as React from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import AppTitle from "./AppTitle";

export default function SidebarFooter({ mini }) {
  const [selectedCard, setSelectedCard] = React.useState(false);

  return (
    <Card>
      <CardActionArea
        onClick={() => setSelectedCard(true)}
        data-active={selectedCard ? "" : undefined}
        sx={{
          height: "100%",
          "&[data-active]": {
            backgroundColor: "action.selected",
            "&:hover": {
              backgroundColor: "action.selectedHover",
            },
          },
        }}
      >
        <CardContent sx={{ height: "100%" }}>
        <Typography variant="body2" color="text.secondary">
  {mini ? "© TripLog" : `© ${new Date().getFullYear()} Powered by `}
  <span style={{ verticalAlign: 'middle' }}>
    <AppTitle />
  </span>
</Typography>

        </CardContent>
      </CardActionArea>
    </Card>
  );
}
