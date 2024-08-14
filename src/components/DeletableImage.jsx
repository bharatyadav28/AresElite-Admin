import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useResponsiveness } from "../hooks/useResponsiveness";
import { useState } from "react";
import { Box, IconButton } from "@mui/material";

export default function DeletableImage({
  onClick,
  src,
  containerStyle,
  disabled = false,
}) {
  const { theme } = useResponsiveness();
  const [isHovering, setIsHovering] = useState(false);
  return (
    <Box
      sx={{
        objectFit: "cover",
        position: "relative",
        "&:hover": { cursor: "pointer" },
        ...containerStyle,
      }}
      onClick={() => isHovering && !disabled && onClick()}
    >
      <img
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseOver={() => setIsHovering(true)}
        style={{ width: "100%", height: "100%" }}
        src={src}
        alt="images"
      />
      {isHovering && !disabled && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            justifySelf: "center",
            alignSelf: "center",
            "&:hover": { cursor: "pointer" },
          }}
        >
          <IconButton>
            <DeleteOutlineIcon
              // sx={{
              //   color: theme.palette.error.dark,
              // }}
            />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
