import { Box, Button, Paper, Typography } from "@mui/material";

export default function InputCard({editText="Edit", label, children, onClick, isEditable }) {
  return (
    <Paper
      sx={{
        bgcolor: "white",
        p: "2%",
        borderRadius: "1rem",
        display: "flex",
        gap: "0.5rem",
        flexDirection: "column",
      }}
      elevation={0}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1">{label}</Typography>
        {isEditable && (
          <Button
            color="primary"
            sx={{ textTransform: "none", fontSize: "0.8rem" }}
            onClick={onClick}
          >
            {editText}
          </Button>
        )}
      </Box>
      <Box>{children}</Box>
    </Paper>
  );
}
