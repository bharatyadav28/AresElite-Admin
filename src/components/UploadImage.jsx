import {
  Box,
  Button,
  CircularProgress,
  Typography,
  colors,
} from "@mui/material";

import UploadIcon from "@mui/icons-material/Upload";
import React, { useEffect, useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
            progress < 100 &&
            progress > 0 && <CircularProgressWithLabel value={progress} />
          )
        }
      >
        {btnText || "Select Image"}
      </Button>
    </Box>
  );
}

export function UploadVideo({
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
  const [error, setError] = useState("");
  const [videoPreview, setVideoPreview] = useState(null);

  useEffect(() => setVideoPreview(null), []);

  // Validate video file
  const validateVideo = (file) => {
    setError("");

    // Check if it's a video file
    if (!file.type.startsWith("video/")) {
      setError("Please upload only video files");
      return false;
    }

    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError("Video size should not exceed 100MB");
      return false;
    }

    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateVideo(file)) {
      setVideoPreview(URL.createObjectURL(file));
      onDrop(e);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateVideo(file)) {
      setVideoPreview(URL.createObjectURL(file));
      onChange(e);
    }
  };

  // Cleanup preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

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
        borderColor: error ? "red" : isDragging ? "black" : "green",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="video/*"
      />

      {showDropArea && (
        <>
          <CloudUploadIcon />
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
            Upload Video
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
            Drag and drop your video file here or click to browse from your
            device
          </Typography>
        </>
      )}

      {error && (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
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
            progress < 100 &&
            progress > 0 && <CircularProgressWithLabel value={progress} />
          )
        }
      >
        {btnText || "Select Video"}
      </Button>

      {/* {videoPreview && (
        <Box sx={{ mt: 2, maxWidth: "300px", width: "100%" }}>
          <video
            controls
            src={videoPreview}
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Box>
      )} */}
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
