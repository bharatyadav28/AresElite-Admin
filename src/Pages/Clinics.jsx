import React, { useState } from "react";
import {
  Box,
  Grid,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  IconButton,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Chip,
  Slide,
} from "@mui/material";
import Swal from "sweetalert2";
import Divider from "@mui/material/Divider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  GetAllClinics,
  ActivateClinic,
  AddClinic,
  DeleteClinic,
  updateClinic,
} from "../Redux/ApiCalls";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosUtil";

const Clinics = () => {
  const dispatch = useDispatch();
  const { isFetching, clinics, DeleteClinicSuccess,
    DeleteClinicFailure } = useSelector((state) => state.clinic);
  const [value, setValue] = React.useState(dayjs(new Date()));
  const [addClinicAdd, setAddClinicAdd] = useState(false);
  const [openalert, setOpenalert] = React.useState(false);
  const [idtoDel, setIdtoDel] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [clinic, setClinic] = React.useState({});
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const getAll = async () => {
    await GetAllClinics(dispatch);
    dateController(value);
  };

  const handleClickOpenAlert = () => {
    setOpenalert(true);
  };
  const handleCloseAlert = () => {
    setOpenalert(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const dateController = async (newValue) => {
    setIsLoading(true);
    setValue(newValue);
    console.log(newValue);
    await axiosInstance
      .get("/api/admin/clinic_status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          date: newValue.$d,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setStatus(res.data.status);
      });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    handleClose();
    await updateClinic(dispatch, clinic._id, formJson);
  };

  const handleDel = async () => {
    if (openalert) {
      handleCloseAlert();  // Close the alert if already open

      try {
        // Await the DeleteClinic function to handle the promise correctly
        const result = await DeleteClinic(dispatch, idtoDel);

        // Show success message only if the deletion was successful
        if (result?.success) {
          Swal.fire({
            icon: "success",
            title: "Done...",
            text: "Clinic is deleted successfully",
          });
          setIdtoDel(null); // Reset the ID to delete after deletion
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }

      } catch (error) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        // No need to handle error here as it's already handled in DeleteClinic
        console.error("Error during deletion:", error);
      }
    } else {
      handleClickOpenAlert(); // Open alert confirmation
    }
  };

  const handleClickOpen = (clinic) => {
    setClinic(clinic);
    setOpen(true);
  };

  function findClinicStatus(clinics, clinicName) {
    const clinic = clinics.find(
      (clinic) => clinic.clinicName.toLowerCase() === clinicName.toLowerCase()
    );
    return clinic ? clinic.isActiveStatus : "Clinic not found";
  }

  const handleActive = async (id) => {
    try {
      await axiosInstance
        .get("/api/admin/make_active_clinic", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id,
            date: value.$d,
          },
        })
        .then((res) => {
          getAll();
        });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: error?.response?.data?.error?.message,
      });
    }

    // ActivateClinic(dispatch, id, value);
  };

  React.useEffect(() => {
    getAll();
    dateController(dayjs(new Date()));
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h2" gutterBottom style={{ padding: "50px" }}>
        Clinics Management
      </Typography>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          lg={4}
          xl={4}
          style={{ height: "100vh" }}
          container
          justifyContent="start"
          alignItems="start"
        >
          <Container component={Paper} style={{ margin: "0 5vw" }}>
            <DateCalendar
              value={value}
              onChange={(newValue) => {
                dateController(newValue);
              }}
            />
          </Container>
        </Grid>
        <Grid
          item
          xs={12}
          lg={8}
          xl={8}
          style={{ height: "100vh" }}
          container
          justifyContent="start"
          alignItems="start"
        >
          <TableContainer component={Paper} style={{ margin: "0 5vw" }}>
            <Box
              sx={{
                height: "5vh",
                width: "98%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "10px",
              }}
            >
              <Typography variant="h6">Clinics</Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setAddClinicAdd(true);
                }}
              >
                Add Clinic
              </Button>
            </Box>
            <Divider />
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
                  {/* <TableCell
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    Start Time
                  </TableCell> */}
                  {/* <TableCell
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    End Time
                  </TableCell> */}
                  <TableCell
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    colSpan={2}
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
              {isFetching || isLoading ? (
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
                      {/* <TableCell
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        {clinic?.startTime}
                      </TableCell> */}
                      {/* <TableCell
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        {clinic?.endTime}
                      </TableCell> */}
                      <TableCell
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <IconButton
                          aria-label="activate"
                          type="button"
                          onClick={() => {
                            handleActive(clinic._id);
                          }}
                        >
                          <Chip
                            color={
                              findClinicStatus(status, clinic.name)
                                ? "success"
                                : "error"
                            }
                            variant="filled"
                            label={
                              findClinicStatus(status, clinic.name)
                                ? "Active"
                                : "Inactive"
                            }
                          />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <IconButton
                          aria-label="edit clinic"
                          onClick={() => handleClickOpen(clinic)}
                        >
                          <EditIcon color="success" />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <IconButton
                          aria-label="delete clinic"
                          onClick={() => {
                            setIdtoDel(clinic._id);
                            handleDel();
                          }}
                        >
                          <DeleteIcon color="secondary" />
                        </IconButton>
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
        open={addClinicAdd}
        onClose={() => setAddClinicAdd(false)}
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            console.log(formJson);
            await AddClinic(dispatch, formJson);
            setAddClinicAdd(false);
          },
        }}
      >
        <DialogTitle>Add Clinic</DialogTitle>
        <DialogContent>
          <DialogContentText>Add details to add clinic</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Clinic name"
            type="name"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="address"
            name="address"
            label="Clinic Address"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddClinicAdd(false)}>Cancel</Button>
          <Button type="submit" disabled={isFetching}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openalert}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseAlert}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle color={"primary"}>{"Are You Sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this span Clinic.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>No</Button>
          <Button onClick={handleDel}>Yes</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        onClose={handleClose}
        color="primary"
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Update Clinic</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change things you want to update
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Clinic name"
            type="name"
            fullWidth
            variant="standard"
            defaultValue={clinic?.name}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="address"
            name="address"
            label="Clinic Address"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={clinic?.address}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Clinics;
