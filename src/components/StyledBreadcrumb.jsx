import Chip from "@mui/material/Chip";
import { emphasize, styled } from "@mui/material/styles";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: "white",
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(theme.palette.grey[100], 0.06),
      ...theme.applyStyles("dark", {
        backgroundColor: emphasize(theme.palette.grey[800], 0.06),
      }),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[100], 0.12),
      ...theme.applyStyles("dark", {
        backgroundColor: emphasize(theme.palette.grey[800], 0.12),
      }),
    },
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  };
});

export default StyledBreadcrumb;