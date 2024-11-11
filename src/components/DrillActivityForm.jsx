import { Box, Button, FormControl, Grid, InputLabel } from "@mui/material";
import {
  Divider,
  IconButton,
  TextField,
  Typography,
  colors,
} from "@mui/material";
import ActivityForm from "./ActivityForm";
import { Fragment, useEffect, useState } from "react";
import { useResponsiveness } from "../hooks/useResponsiveness";
import axiosInstance from "../utils/axiosUtil";
import UploadImage from "./UploadImage";
import { UploadVideo } from "./UploadImage";
import Swal from "sweetalert2";
import DeletableImage from "./DeletableImage.jsx";
import CustomModal from "./Modal.jsx";
// import { Clear, Delete } from "@material-ui/icons";
import CustomDialog from "./CustomDialog.jsx";
import { Clear, Delete } from "@mui/icons-material";
import { max } from "moment/moment.js";

export default function DrillActivityForm({
  isEditable,
  activity,
  index,
  onEdit,
  onCancel,
  onAddNewActivity,
  onDelete,
  onSave,
  isSaving,
}) {
  const token = localStorage.getItem("token");

  const [isEditableIndex, setIsEditableIndex] = useState(null);
  const [formElements, setFormElements] = useState([]);
  const [activityName, setActivityName] = useState("");
  const [description, setDescription] = useState("");
  const [videoLink, setVideoLink] = useState({ type: "video", link: "" });
  const [images, setImages] = useState([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoUploadingProgress, setVideoUploadingProgress] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { sm, md, xs, lg, theme } = useResponsiveness();

  const handleDeleteDialogClose = () => setIsDeleteDialogOpen(false);
  const handleDeleteDialogOpen = () => setIsDeleteDialogOpen(true);

  const handleRemoveAcitivity = () => {
    if (isDeleteDialogOpen) {
      handleDeleteDialogOpen();
      onDelete(index);
    } else {
      handleDeleteDialogOpen();
    }
  };

  useEffect(() => {
    if (
      !activity.form &&
      !activity.activityName &&
      !activity.description &&
      !activity.fileLinks
    )
      return;

    const imageFiles = [];
    setFormElements(activity.form);
    setActivityName(activity.activityName);
    activity.fileLinks.forEach((file) => {
      if (file.type === "image") {
        imageFiles.push(file);
      } else if (file.type === "video") {
        setVideoLink(file);
      }
    });
    const videoFiles = activity.fileLinks.find((file) => file.type === "video");
    console.log("Activities: ", activity);
    setImages(imageFiles);
    setVideoLink(videoFiles || { type: "video", link: "" });
    setDescription(activity.description);
  }, [
    activity.form,
    activity.activityName,
    activity.fileLinks,
    activity.description,
  ]);

  const isEditableOn = isEditable !== index;

  const handleActivityDelete = (index) => {
    setFormElements((prevEl) => {
      return prevEl.filter((_, i) => i !== index);
    });
  };

  const handleUploadFile = async (e, type) => {
    console.log("...file uploading...");
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("image", file);
    if (type === "image") {
      setIsImageUploading(true);
    } else if (type === "video") {
      setIsVideoUploading(true);
    }
    try {
      if (
        type === "image" &&
        file.type !== "image/png" &&
        file.type !== "image/jpg" &&
        file.type !== "image/jpeg"
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Only image with .png, .jpg or .jpeg extension are supported",
        });
        return;
      } else if (
        type === "video" &&
        file.type !== "video/mp4" &&
        file.type !== "video/mkv" &&
        file.type !== "video/webm"
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Only video with .mp4 extension are supported",
        });
        return;
      } else {
        const res = await axiosInstance.post("/api/admin/upload_file", fd, {
          onUploadProgress: (e) => {
            const { progress } = e;
            setVideoUploadingProgress(progress * 100);
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (type === "image") {
          setImages([...images, { type, link: res.data.link }]);
        } else if (type === "video") {
          console.log("...video", { type, link: res.data.link });
          setVideoLink({ type, link: res.data.link });
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "oops...",
        text:
          type === "image"
            ? "Image Upload Failed..."
            : "Video Upload Failed...",
      });
    } finally {
      if (type === "image") {
        setIsImageUploading(false);
      } else if (type === "video") {
        setIsVideoUploading(false);
      }
    }
  };

  return (
    <Box
      sx={{ bgcolor: "white", borderRadius: "1rem" }}
      style={{ paddingBlock: "2%" }}
    >
      {/* add activity */}
      <Box>
        <Typography
          variant="h5"
          sx={{ display: "flex" }}
          style={{ marginInline: "2%", fontWeight: "500" }}
          color="primary"
        >
          Add Activity
        </Typography>
        <Grid
          style={{
            paddingInline: xs
              ? "1%"
              : sm
              ? "2%"
              : md
              ? "4%"
              : lg
              ? "6%"
              : "12%",
            paddingTop: "1%",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "space-between",
            gap: "3%",
            flexDirection: sm ? "column" : "row",
            flexWrap: "wrap",
            borderRadius: "1rem",
          }}
        >
          <Grid style={{ width: sm ? "100%" : "48%" }}>
            <InputLabel
              id="Activity-Name"
              style={{
                fontWeight: "bold",
                marginBottom: "3%",
                marginTop: sm ? "3%" : "",
              }}
            >
              Activity Name
            </InputLabel>
            <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
              <TextField
                style={{
                  borderRadius: "0.5rem",
                  backgroundColor: colors.grey[100],
                  padding: "1rem",
                }}
                disabled={isEditableOn}
                onChange={(e) => setActivityName(e.target.value)}
                value={activityName}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
                placeholder="Enter your activity name"
              />
            </FormControl>
          </Grid>
          <Grid style={{ width: sm ? "100%" : "48%" }}>
            <InputLabel
              id="Description"
              style={{
                fontWeight: "bold",
                marginBottom: "3%",
                marginTop: sm ? "3%" : "",
              }}
            >
              Description
            </InputLabel>
            <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
              <TextField
                style={{
                  borderRadius: "0.5rem",
                  backgroundColor: colors.grey[100],
                  padding: "1rem",
                }}
                disabled={isEditableOn}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
                multiline
                placeholder="Enter your activity name"
              />
            </FormControl>
          </Grid>

          <Grid style={{ width: sm ? "100%" : "48%" }}>
            <InputLabel
              id="Image"
              style={{
                fontWeight: "bold",
                marginBottom: "3%",
                marginTop: "3%",
              }}
            >
              Images <small>({images?.length} images uploaded)</small>
            </InputLabel>
            <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
              <UploadImage
                disabled={isImageUploading || isEditableOn}
                btnText="Upload Images"
                loading={isImageUploading}
                showDropArea={false}
                onChange={(e) => handleUploadFile(e, "image")}
              />

              <Box
                sx={{
                  marginTop: "2%",
                  display: "flex",
                  gap: "0.5%",
                  flexWrap: "wrap",
                  maxHeight: "fit-content",
                  overflow: "hidden",
                }}
              >
                {images.map((img, i) => {
                  return (
                    <DeletableImage
                      onClick={() => {
                        setImages((prevImgs) => {
                          let updatedImages = [...prevImgs];
                          updatedImages = updatedImages.filter(
                            (_, index) => index !== i
                          );
                          return updatedImages;
                        });
                      }}
                      disabled={isEditableOn}
                      src={img.link}
                      containerStyle={{ width: "20%" }}
                    />
                  );
                })}
              </Box>
            </FormControl>
          </Grid>
          <Grid style={{ width: sm ? "100%" : "48%" }}>
            <InputLabel
              id="Video-Link"
              style={{
                fontWeight: "bold",
                marginBottom: "3%",
                marginTop: "3%",
              }}
            >
              Video{" "}
              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "800",
                  textDecoration: "underline",
                  textDecorationColor: theme.palette.primary.main,
                  marginLeft: "1rem",
                }}
              >
                {!videoLink.link ? (
                  <small>(Video not uploaded)</small>
                ) : (
                  <small
                    className="hover2"
                    style={{
                      color: isEditableOn
                        ? colors.grey[400]
                        : theme.palette.primary.main,
                    }}
                    onClick={() => !isEditableOn && setIsVideoModalOpen(true)}
                  >
                    See uploaded video
                  </small>
                )}
              </span>
            </InputLabel>

            <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
              <UploadVideo
                disabled={isVideoUploading || isEditableOn}
                btnText="Upload Video"
                loading={isVideoUploading}
                progress={videoUploadingProgress}
                showDropArea={false}
                onChange={(e) => handleUploadFile(e, "video")}
              />

              <CustomModal
                open={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
              >
                <Box
                  style={{
                    backgroundColor: colors.grey[50],
                    borderRadius: "1rem",
                    padding: "4%",
                  }}
                >
                  <video width={"100%"} height="500rem" autoPlay controls>
                    <source src={videoLink.link} type="video/mp4" />
                    Your browser does not support the playing a video.
                  </video>
                  <div
                    style={{
                      padding: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        setVideoLink({ type: "video", link: "" });
                        setIsVideoModalOpen(false);
                      }}
                    >
                      <Delete color="error" />
                    </IconButton>
                    <IconButton onClick={() => setIsVideoModalOpen(false)}>
                      <Clear color="primary" />
                    </IconButton>
                  </div>
                </Box>
              </CustomModal>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Drill Form */}

      <Box marginTop={"2%"}>
        <Typography
          variant="h5"
          sx={{ display: "flex" }}
          style={{
            marginInline: "2%",
            fontWeight: "500",
            marginBottom: "2%",
          }}
          color="primary"
        >
          Drill Form
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: sm ? "1fr" : "1fr 1fr",
          }}
          style={{
            paddingInline: xs
              ? "1%"
              : sm
              ? "2%"
              : md
              ? "4%"
              : lg
              ? "6%"
              : "12%",
          }}
        >
          <Box>
            {formElements.map((el, i) => {
              return (
                <Fragment key={i}>
                  <ActivityForm
                    label={el.label}
                    type={el.type}
                    options={el.options}
                    isEditable={isEditableIndex}
                    index={i}
                    // onDelete={(index) => {
                    //   setFormElements((prevEl) => {
                    //     return prevEl.filter((_, i) => i !== index);
                    //   });
                    // }}
                    onDelete={handleActivityDelete}
                    onEdit={(index) => {
                      setIsEditableIndex(index);
                    }}
                    onCancel={() => setIsEditableIndex(null)}
                    onSave={(index, data) => {
                      data = {
                        ...data,
                        key: data.label.replace(/\s/g, ""),
                      };
                      const updatedFormElements = [...formElements];
                      updatedFormElements[index] = data;
                      setFormElements(updatedFormElements);
                      setIsEditableIndex(null);
                    }}
                  />
                  <Divider
                    sx={{ marginBlock: "0.8rem", borderWidth: "0.1rem" }}
                  />
                </Fragment>
              );
            })}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "5%",
              }}
            >
              <Button
                disableElevation
                variant="contained"
                color="primary"
                style={{
                  paddingInline: "5%",
                  paddingBlock: "2%",
                  textTransform: "none",
                  fontSize: lg ? "0.9rem" : "1.1rem",
                  borderRadius: "0.5rem",
                  width: "80%",
                }}
                onClick={() => {
                  const newObj = {
                    type: "",
                    label: "",
                    options: [""],
                    key: "",
                  };
                  setFormElements([...formElements, newObj]);
                }}
                disabled={isEditableOn}
              >
                Add New Questions
              </Button>
            </Box>
          </Box>

          {/* action buttons */}
          <Box
            sx={{
              backgroundColor: "white",
              display: "flex",
              gap: "0.5rem",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: md ? "4%" : "8%",
            }}
          >
            <Button
              disableElevation
              variant="contained"
              color="primary"
              style={{
                paddingInline: "5%",
                paddingBlock: "2%",
                textTransform: "none",
                fontSize: lg ? "0.9rem" : "1.1rem",
                width: lg ? "40%" : "50%",
                borderRadius: "0.5rem",
              }}
              onClick={() => onAddNewActivity(index)}
            >
              Add New Activity
            </Button>
            <Button
              disableElevation
              variant="contained"
              color="primary"
              disabled={
                isEditableOn || isSaving || isVideoUploading || isImageUploading
              }
              style={{
                color: isEditableOn ? colors.grey[500] : "white",
                paddingInline: "5%",
                paddingBlock: "2%",
                textTransform: "none",
                fontSize: lg ? "0.9rem" : "1.1rem",
                width: lg ? "40%" : "50%",
                borderRadius: "0.5rem",
              }}
              onClick={() => {
                onSave(index, {
                  form: formElements,
                  activityName,
                  fileLinks: [videoLink, ...images].filter(
                    (file) => file.link !== ""
                  ),
                  description,
                });

                setFormElements([]);
                setActivityName("");
                setDescription("");
                setVideoLink({ type: "video", link: "" });
                setImages([]);
              }}
            >
              Save
            </Button>
            <Button
              disableElevation
              variant="contained"
              disabled={isEditableOn}
              style={{
                backgroundColor: isEditableOn
                  ? colors.grey[300]
                  : theme.palette.secondary.main,
                color: isEditableOn ? colors.grey[500] : "white",
                paddingInline: "5%",
                paddingBlock: "2%",
                textTransform: "none",
                fontSize: lg ? "0.9rem" : "1.1rem",
                width: lg ? "40%" : "50%",
                borderRadius: "0.5rem",
              }}
              onClick={handleRemoveAcitivity}
            >
              Remove Activity
            </Button>
            {!isEditableOn ? (
              <Button
                disableElevation
                variant="contained"
                // color="red"
                style={{
                  color: "white",
                  paddingInline: "5%",
                  paddingBlock: "2%",
                  textTransform: "none",
                  fontSize: lg ? "0.9rem" : "1.1rem",
                  width: lg ? "40%" : "50%",
                  borderRadius: "0.5rem",
                }}
                onClick={() => onCancel()}
              >
                Cancel
              </Button>
            ) : (
              <Button
                disableElevation
                variant="contained"
                color={isEditableOn ? "primary" : "primary"}
                style={{
                  color: !isEditableOn && "white",
                  paddingInline: "5%",
                  paddingBlock: "2%",
                  textTransform: "none",
                  fontSize: lg ? "0.9rem" : "1.1rem",
                  width: lg ? "40%" : "50%",
                  borderRadius: "0.5rem",
                }}
                onClick={() => onEdit(index)}
              >
                Edit Activity
              </Button>
            )}
          </Box>
        </Box>
        <CustomDialog
          onClose={handleDeleteDialogClose}
          open={isDeleteDialogOpen}
          title="Are you sure?"
          captain="You want to delete this activity?"
          onAgree={handleRemoveAcitivity}
        />
      </Box>
    </Box>
  );
}
