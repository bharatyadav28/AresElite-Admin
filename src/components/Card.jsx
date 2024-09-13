import { Box, Grid, Typography, colors } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { useNavigate } from "react-router-dom";

const CONTAINER_COLORS = [
  { color1: "#9861A5", color2: " #5D3F6A" },
  { color1: "#86608E", color2: " #5D3F6A" },
  { color1: "#907F9F", color2: " #5D3F6A" },
  { color1: "#645394 ", color2: " #5D3F6A" },
  { color1: "#6F7D8C", color2: " #5D3F6A" },
];

export default function Card({ count, title, icon, index, link }) {
  const navigate = useNavigate();

  return (
    <Grid
      sx={{
        bgcolor: CONTAINER_COLORS[index].color1,
        borderRadius: "0.3rem",
        color: "white",
        mt: "1%",
        minWidth: "20rem",
      }}
      lg={2}
      md={3}
      sm={8}
      xs={12}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          padding: "4%",
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: "2rem", fontWeight: "bold" }}
          >
            {count}
          </Typography>
          <Typography variant="subtitle2">{title}</Typography>
        </Box>
        <Box sx={{ color: colors.common.black, opacity: 0.2 }}>{icon}</Box>
      </Box>
      <Box
        sx={{
          paddingBlock: "0.2rem",
          bgcolor: CONTAINER_COLORS[index].color2,
          display: "flex",
          justifyContent: "center",
          alignitems: "center",
          gap: "2%",
          borderBottomRightRadius: "0.3rem",
          borderBottomLeftRadius: "0.3rem",
          "&:hover": { cursor: "pointer", filter: "contrast(1.2)" },
        }}
        onClick={() => navigate(link)}
      >
        More Info <ArrowCircleRightIcon sx={{ fontSize: "1rem" }} />
      </Box>
    </Grid>
  );
}
