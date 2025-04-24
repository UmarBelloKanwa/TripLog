import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const useIsMobile = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
};

export default useIsMobile;