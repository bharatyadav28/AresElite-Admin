import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import {
  DialogActions,
  TextField,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  Avatar,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import LinearProgress from "@mui/material/LinearProgress";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import RampRightIcon from "@mui/icons-material/RampRight";
import { formatTime, stringAvatar } from "../utils/function";
import axiosInstance from "../utils/axiosUtil";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import {
  GetAllDoctors,
  GetAllClinics,
  AddSlot,
  GetAllSlots,
  updateSlot,
} from "../Redux/ApiCalls";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SlotManagement() {
  const dispatch = useDispatch();
  const {
    isFetching: fetchingDoc,
    clinics,
    error: errorDoc,
  } = useSelector((state) => state.clinic);
  const { isFetching, error, msg, doctors } = useSelector((state) => state.doc);
  const {
    isFetching: fetchingSlots,
    error: errorSlot,
    slots,
    doctor,
  } = useSelector((state) => state.slot);

  const [slot, setSlot] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("");
  const [date, setDate] = React.useState(dayjs(new Date()));
  const [startTime, setStartTime] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [setToId, setSetToId] = React.useState(null);
  const [formData, setFormData] = React.useState({
    startDate: `${date.$D}/${date.$M + 1}/${date.$y}`,
    endDate: `${date.$D}/${date.$M + 1}/${date.$y}`,
    doctor: null,
    clinic: null,
    address: null,
    startTime: null,
    endTime: null,
  });

  const [formDataUpdate, setFormDataUpdate] = React.useState({
    startDate: `${date.$D}/${date.$M + 1}/${date.$y}`,
    endDate: `${date.$D}/${date.$M + 1}/${date.$y}`,
    doctor: null,
    clinic: null,
    address: null,
    startTime: null,
    endTime: null,
  });

  const [openMapper, setOpenMapper] = React.useState(false);

  const handleClickOpenMapper = (clinic) => {
    setSetToId(clinic);
    setOpenMapper(true);
    setFormData({ ...formData, address: clinic.address, clinic: clinic._id });
  };

  const handleTimeChange = (time, setter) => {
    const formattedTime = time
      ? `${time.$H === 0 ? 12 : time.$H > 12 ? time.$H - 12 : time.$H}:${
          time.$m < 10 ? `0${time.$m}` : time.$m
        } ${time.$H >= 12 ? "PM" : "AM"}`
      : "";

    setter(time);
    setFormData((prevData) => ({
      ...prevData,
      [setter === setStartTime ? "startTime" : "endTime"]: formattedTime,
    }));
  };

  function createDateWithTime(timeString) {
    // Parse the time string (e.g., "01:21 PM")

    if (timeString) {
      const [time, period] = timeString?.split(" ");
      const [hours, minutes] = time.split(":")?.map(Number);

      // Convert 12-hour time to 24-hour time
      let hours24 = hours;
      if (period === "PM" && hours !== 12) {
        hours24 += 12;
      } else if (period === "AM" && hours === 12) {
        hours24 = 0;
      }

      return dayjs()
        .set("hour", hours24)
        .set("minute", minutes)
        .set("second", 0);
    }
  }

  const handleTimeChangeUpdate = (time, setter) => {
    const formattedTime = time
      ? `${time?.$H > 12 ? time?.$H - 12 : time?.$H}:${time?.$m} ${
          time?.$H > 12 ? "PM" : "AM"
        }`
      : "";

    setter(time);

    setFormDataUpdate((prevData) => ({
      ...prevData,
      [setter === setStartTime ? "startTime" : "endTime"]: formattedTime,
    }));
  };

  const handleCloseMapper = () => {
    setOpenMapper(false);
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    const address = clinics.find((c) => c._id === event.target.value)?.address;
    setFormDataUpdate({
      ...formDataUpdate,
      clinic: event.target.value,
      address,
    });
  };

  const handleChangeDone = (event) => {
    console.log(event.target.value);
    setSelectedOption(event.target.value);
    setFormData({ ...formData, doctor: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({
      ...formData,
      startDate: `${date.$D}/${date.$M + 1}/${date.$y}`,
      endDate: `${date.$D}/${date.$M + 1}/${date.$y}`,
    });
    await AddSlot(dispatch, formData);
    fetch();
    setStartTime(null);
    setEndTime(null);
    handleCloseMapper();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("data", formDataUpdate);
    await updateSlot(dispatch, slot._id, formDataUpdate, date).then((res) => {
      console.log(res);
      fetch();
    });

    setSelectedOption("");
    setStartTime(null);
    setEndTime(null);
    setOpen(false);
  };

  const handleSlotDelete = async (id) => {
    let token = localStorage.getItem("token");
    await axiosInstance.delete("/api/admin/delete_slot", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id,
      },
    });
    fetch();
    return Swal.fire({
      icon: "success",
      title: "Deleted...",
      text: "The selected slot is deleted!",
    });
  };

  const handleClickOpen = (slot) => {
    setFormDataUpdate({
      ...formData,
      doctor: slot.doctor,
      clinic: slot.clinic._id,
      address: slot.address,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });
    setSlot(slot);
    setOpen(true);
  };

  const fetch = async () => {
    await GetAllDoctors(dispatch);
    await GetAllClinics(dispatch);
    await GetAllSlots(dispatch, date);
  };
  React.useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const isTodayOrFutureDate = () => {
    const today = dayjs().startOf("day");
    return date.isSame(today, "day") || date.isAfter(today);
  };

  const [getIndex, setIndex] = useState(-1);

  const doctorPic = (name) => {
    const pic = doctor.find((d) => d.firstName === name)?.profilePic;

    return pic;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h3" gutterBottom style={{ padding: "50px" }}>
        Slot Management
      </Typography>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          lg={4}
          xl={4}
          md={4}
          sm={4}
          style={{ height: "100vh" }}
          container
          justifyContent="start"
          alignItems="start"
        >
          <Container
            component={Paper}
            style={{
              margin: "0 5vw",
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <DateCalendar
              value={date}
              maxDate={dayjs().add(5, "day")}
              onChange={(newValue) => {
                setFormData({
                  ...formData,
                  startDate: `${newValue.$D}/${newValue.$M + 1}/${newValue.$y}`,
                  endDate: `${newValue.$D}/${newValue.$M + 1}/${newValue.$y}`,
                });
                setDate(newValue);
              }}
              // disablePast={true}
            />
            <Typography
              variant="subtitle2"
              color="initial"
              sx={{ marginBottom: "20px" }}
            >
              Today's Slots
            </Typography>
            <Box
              sx={{
                width: "100%",
                overflow: "scroll",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
              fullWidth
            >
              {fetchingSlots ? (
                <CircularProgress disableShrink />
              ) : (
                <>
                  {slots?.length > 0 ? (
                    slots.map((slot, index) => (
                      <Grid
                        key={index}
                        container
                        spacing={2}
                        sx={{
                          width: "95%",
                          margin: "5px",
                          padding: "10px",
                          background: "#F2F0FF",
                        }}
                        component={Paper}
                      >
                        <Grid
                          style={{ display: "flex", alignItems: "center" }}
                          xs={3}
                        >
                          {doctorPic(slot.doctor) ? (
                            <img
                              src={doctorPic(slot.doctor)}
                              style={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                              }}
                              alt="Profile"
                            />
                          ) : (
                            <Avatar
                              {...stringAvatar(`Dr. ${slot?.doctor}`)}
                              sx={{ width: 56, height: 56 }}
                            />
                          )}
                        </Grid>
                        <Grid
                          xs={9}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle1" color="primary">
                              {slot?.doctor}
                            </Typography>
                            <Typography variant="caption" color="textPrimary">
                              {formatTime(slot?.startTime)} to{" "}
                              {formatTime(slot?.endTime)} at{" "}
                              {slot?.clinic?.name}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "0.2rem",
                            }}
                          >
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleSlotDelete(slot?._id)}
                              disabled={!isTodayOrFutureDate()}
                              sx={{
                                "&.Mui-disabled": {
                                  cursor: "not-allowed",
                                },
                                padding: 0,
                              }}
                            >
                              <DeleteIcon color="secondary" />
                            </IconButton>
                            <IconButton
                              aria-label="edit"
                              onClick={() => {
                                setIndex(index);
                                handleClickOpen(slot);
                              }}
                              disabled={!isTodayOrFutureDate()}
                              sx={{
                                "&.Mui-disabled": {
                                  cursor: "not-allowed",
                                },
                                padding: 0,
                              }}
                            >
                              <EditIcon color="success" />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    ))
                  ) : (
                    <Typography
                      style={{ marginBottom: "1rem" }}
                      color="textSecondary"
                    >
                      No slots for today
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Container>
        </Grid>
        <Grid
          item
          xs={12}
          lg={8}
          xl={8}
          md={8}
          sm={8}
          style={{ height: "100vh" }}
          container
          justifyContent="start"
          alignItems="start"
        >
          <TableContainer component={Paper} style={{ margin: "0 5vw" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    Sl. No.
                  </TableCell>
                  <TableCell
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    Address
                  </TableCell>
                  {/* <TableCell style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    Status
                  </TableCell> */}
                  <TableCell
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              {isFetching ? (
                <TableRow sx={{ width: "100%" }}>
                  <TableCell colSpan={7}>
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              ) : (
                <TableBody>
                  {clinics?.map((clinic, index) => (
                    <TableRow key={index}>
                      <TableCell
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        {clinic.name}
                      </TableCell>
                      <TableCell
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        {clinic.address}
                      </TableCell>
                      <TableCell
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          endIcon={<RampRightIcon />}
                          aria-label="map"
                          disabled={!clinic.isActive || !isTodayOrFutureDate()}
                          onClick={() => handleClickOpenMapper(clinic)}
                          sx={{
                            "& .Mui-disabled": {
                              cursor: "not-allowed",
                              color: "red",
                            },
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Dialog
        fullScreen
        open={openMapper}
        onClose={handleCloseMapper}
        TransitionComponent={Transition}
      >
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseMapper}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Slot Mapper
            </Typography>
            <Button autoFocus color="inherit" onClick={handleCloseMapper}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: "20px",
            padding: "10vh 10vw",
          }}
        >
          <Typography variant="h3">Map Doctor to {setToId?.name}</Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              marginTop: "40px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Doctor</InputLabel>
                        <Select
                          label="Doctor"
                          name="doctor"
                          onChange={handleChangeDone}
                          value={selectedOption}
                        >
                          {doctors?.map((doc, i) => (
                            <MenuItem key={i} value={doc.firstName}>
                              {doc.firstName} {doc.lastName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        gap: "40px",
                      }}
                    >
                      <TimePicker
                        label="Start time"
                        value={startTime}
                        onChange={(time) =>
                          handleTimeChange(time, setStartTime)
                        }
                        required
                      />
                      <TimePicker
                        label="End time"
                        value={endTime}
                        onChange={(time) => handleTimeChange(time, setEndTime)}
                        required
                      />
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    disabled={
                      isFetching || !selectedOption || !startTime || !endTime // Disable if form is incomplete
                    }
                    type="submit"
                    fullWidth
                  >
                    {fetchingSlots ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </form>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Dialog>
      <Dialog
        open={open}
        // onClose={handleClose}
        color="primary"
        PaperProps={{
          component: "form",
          onSubmit: handleUpdate,
        }}
      >
        <DialogTitle style={{ fontWight: 600 }}>Update Slot</DialogTitle>
        <DialogContent style={{ paddingBottom: "0.5rem" }}>
          <TextField
            autoFocus
            disabled={true}
            margin="dense"
            id="name"
            name="name"
            label="Doctor Assigned"
            type="name"
            fullWidth
            variant="standard"
            defaultValue={slot?.doctor}
            value={formDataUpdate.doctor}
            style={{
              marginTop: "0.5rem",
            }}
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Clinic</InputLabel>
            <Select
              label="Clinic"
              name="clinic"
              onChange={handleChange}
              value={
                formDataUpdate.clinic
                  ? formDataUpdate.clinic
                  : selectedOption === ""
                  ? clinics[getIndex]?._id
                  : selectedOption
              }
            >
              {clinics?.map((clinic, i) => (
                <MenuItem key={i} value={clinic._id}>
                  {clinic.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              display: "flex",
              // justifyContent: "space-around",
              gap: "12px",
              marginTop: "12px",
              marginBottom: "12px",
            }}
          >
            <TimePicker
              label="Start time"
              // value={dayjs(new Date())}
              value={createDateWithTime(formDataUpdate.startTime)}
              onChange={(time) => handleTimeChangeUpdate(time, setStartTime)}
              required
            />
            <TimePicker
              label="End time"
              value={createDateWithTime(formDataUpdate.endTime)}
              onChange={(time) => handleTimeChangeUpdate(time, setEndTime)}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions
          style={{ marginBottom: "0.5rem", marginRight: "0.5rem" }}
        >
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
