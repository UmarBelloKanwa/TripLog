import Chip from "@mui/material/Chip";
import { emphasize, styled } from "@mui/material/styles";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(theme.palette.grey[100], 0.06),
      ...theme.applyStyles("dark", {
        backgroundColor: emphasize(theme.palette.grey[800], 0.06),
      }),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      background:
        "linear-gradient(45deg,rgb(54, 82, 169) 30%,rgb(45, 11, 112) 90%)", // Gradient from soft green to deep green
      color: "white",
    },
    background:
      "linear-gradient(45deg,rgb(54, 82, 169) 30%,rgb(45, 11, 112) 90%)", // Gradient from soft green to deep green
    color: "white",
  };
});

export default StyledBreadcrumb;
