import {
  Box,
  Button,
  CircularProgress,
  Typography,
  colors,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useRef, useState } from "react";

export default function UploadImage({
  disabled = false,
  onChange,
  onDrop,
  showDropArea = true,
  btnText,
  loading = false,
  progress,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    setIsDragging(false);
    onDrop(e);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        justifyContent: "center",
        alignItems: "center",
        padding: isDragging ? "0.3rem" : "0",
        width: showDropArea ? "70%" : "fit-content",
        borderRadius: "1rem",
        borderStyle: "dashed",
        borderWidth: isDragging ? "1px" : "0",
        borderColor: isDragging ? "black" : "green",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onChange}
      />
      {showDropArea && (
        <>
          <UploadIcon />
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
            Upload media
          </Typography>

          <Typography
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={handleDrop}
            sx={{
              marginInline: "20%",
              textAlign: "center",
              color: colors.grey[400],
              fontSize: "0.8rem",
            }}
          >
            Drag and drop your image file here or click to browse from your
            device
          </Typography>
        </>
      )}
      <Button
        color="primary"
        variant="contained"
        disabled={disabled}
        onClick={() => fileInputRef.current.click()}
        style={{ textTransform: "none" }}
        startIcon={
          loading ? (
            <CircularProgress sx={{ color: "white" }} size={20} />
          ) : (
            progress < 100 && progress > 0 && <CircularProgressWithLabel value={progress} />
          )
        }
      >
        {btnText || "Select Image"}
      </Button>
    </Box>
  );
}

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: props.value < 100 ? "black" : "white" }}
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
