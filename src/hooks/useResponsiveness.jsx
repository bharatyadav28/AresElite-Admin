import { useTheme, useMediaQuery } from "@mui/material";

const useResponsiveness = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));
  const sm = useMediaQuery(theme.breakpoints.down("sm"));
  const md = useMediaQuery(theme.breakpoints.down("md"));
  const lg = useMediaQuery(theme.breakpoints.down("lg"));

  return { xs, sm, md, lg, theme };
};

export { useResponsiveness };
