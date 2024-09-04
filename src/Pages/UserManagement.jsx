import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  Table,
  Button,
  Modal,
  TableHead,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Paper,
  Typography,
  Snackbar,
  InputBase,
  Chip,
  Avatar,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FaUserDoctor } from "react-icons/fa6";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Slide from "@mui/material/Slide";
import { useDispatch, useSelector } from "react-redux";
import { GetAllUsers } from "../Redux/ApiCalls";
import SportsMartialArtsIcon from "@mui/icons-material/SportsMartialArts";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { DeleteUser, ActivateUser, GetBookings } from "../Redux/ApiCalls";
import { stringAvatar, debounce } from "../utils/function";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import Shipment from "../components/shipment/Shipment";
import Transactions from "../components/Transactions";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ m: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme?.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "50px",
  pt: 2,
  px: 4,
  pb: 3,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openalert, setOpenalert] = React.useState(false);
  const [idtoDel, setIdtoDel] = React.useState(null);
  const { state } = useLocation();

  const { isFetching, users, error, msg, currentPage, totalPages } =
    useSelector((state) => state?.users);

  const { isFetching: loadingBooking, bookings } = useSelector(
    (state) => state?.booking
  );

  const [open, setOpen] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [activeView, setActiveView] = React.useState(null);
  const [openNotifiication, setOpenNotifiication] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [search, setSearch] = React.useState("");
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const handleChangeValue = (event, newValue) => {
    setValue(newValue);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpenAlert = () => {
    setOpenalert(true);
  };
  const handleCloseAlert = () => {
    setOpenalert(false);
  };
  const handleClickOpenView = React.useCallback(
    (user) => {
      let name = `${user?.firstName}`;
      GetBookings(dispatch, name, user?.role);
      setOpenView(true);
    },
    [dispatch]
  );
  const handleCloseView = () => {
    setOpenView(false);
  };
  const handleDel = async () => {
    if (openalert) {
      handleCloseAlert();
      await DeleteUser(dispatch, idtoDel);
      setIdtoDel(null);
    } else {
      handleClickOpenAlert();
    }
  };
  const handleActive = async (id) => {
    setTimeout(() => {
      ActivateUser(dispatch, id);
    }, 1000);
    setIdtoDel(null);
    handleCloseAlert();
  };
  const handleClick = () => {
    setOpenNotifiication(true);
  };

  React.useEffect(() => {
    if (!state) return;
    setActiveView(state?.user);
    handleClickOpenView(state?.user);
    setValue(state?.index);
  }, [state, handleClickOpenView]);

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setOpenNotifiication(false)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const [filters, setFilters] = React.useState({
    doctor: true,
    athlete: true,
  });

  const handleFilterChange = (event) => {
    const updatedFilters = {
      ...filters,
      [event.target.name]: event.target.checked,
    };
    setFilters(updatedFilters);
    setVisible(false);
  };

  const [visible, setVisible] = React.useState(false);

  const handleGetAll = async (page, searchQuery) => {
    setSearch(searchQuery);
    await GetAllUsers(dispatch, page, searchQuery);
  };

  const handleChange = (_, value) => {
    handleGetAll(value);
  };

  React.useEffect(() => {
    handleGetAll(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!isFetching && error) {
      handleClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  // React.useEffect(() => {
  //   (async (e) => {
  //     debounce(await handleGetAll(1, searchTerm), 300000);
  //   })();
  // }, [handleGetAll, searchTerm]);

  return (
    <>
      <Typography
        variant="h3"
        style={{ paddingTop: "1rem", marginLeft: "2rem" }}
      >
        User Management
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          justifyContent: "start",
          alignItems: "center",
        }}
        style={{ width: "100vw", height: "90vh", marginTop: "2rem" }}
        // component={Paper}
      >
        <Grid container spacing={2} style={{ width: "95vw" }} component={Paper}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "92vw",
              height: "30px",
              padding: "10px",
            }}
            // component={Paper}
          >
            <Search
              component={Paper}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                onChange={async (e) => {
                  debounce(await handleGetAll(1, e.target.value), 3000);
                }}
                value={search}
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
              <IconButton
                aria-label="clear button"
                onClick={() => handleGetAll(1, "")}
              >
                <ClearIcon />
              </IconButton>
            </Search>
            <Button variant="contained" onClick={handleOpen}>
              Add User
            </Button>
          </Box>
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
                  <Box
                    xs={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1" color="primary">
                      Full Name
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box
                    color="primary"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: "10px",
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      User Type
                    </Typography>
                    {visible && (
                      <FormGroup
                        sx={{
                          position: "absolute",
                          top: "2.5rem",
                          zIndex: "9",
                          background: "white",
                          padding: "10px",
                          borderRadius: "10px",
                          boxShadow: "10px 10px 5px -3px rgba(0,0,0,0.13)",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={filters?.doctor}
                              onChange={handleFilterChange}
                              name="doctor"
                            />
                          }
                          label="Doctor"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={filters?.athlete}
                              onChange={handleFilterChange}
                              name="athlete"
                            />
                          }
                          label="Athlete"
                        />
                      </FormGroup>
                    )}
                    <FilterAltIcon
                      color="primary"
                      onClick={() => setVisible(!visible)}
                    />{" "}
                    {/* Toggle visibility on click */}
                  </Box>
                </TableCell>
                <TableCell
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box
                    xs={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1" color="primary">
                      Email
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box
                    xs={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1" color="primary">
                      Phone
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box
                    xs={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1" color="primary">
                      Start Time
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box
                    xs={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1" color="primary">
                      End Time
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box
                    xs={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1" color="primary">
                      Status
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell
                  color="primary"
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

            <TableBody>
              {isFetching ? (
                <TableRow sx={{ width: "100%" }}>
                  <TableCell colSpan={10}>
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              ) : (
                users.map(
                  (user) =>
                    filters[user?.role] && (
                      <TableRow key={user._id} className="capitalize">
                        <TableCell
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >{`${user.firstName} ${user.lastName}`}</TableCell>
                        <TableCell
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          <Chip
                            color="primary"
                            avatar={
                              <Avatar>
                                {user?.role === "doctor" ? (
                                  <FaUserDoctor
                                    style={{ color: "lightgreen" }}
                                  />
                                ) : (
                                  <SportsMartialArtsIcon
                                    style={{ color: "orange" }}
                                  />
                                )}
                              </Avatar>
                            }
                            label={
                              user?.role === "doctor" ? "Doctor" : "Athlete"
                            }
                          />
                        </TableCell>
                        <TableCell
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          {user.email}
                        </TableCell>
                        <TableCell
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          {user.phone}
                        </TableCell>
                        <TableCell
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          {user.startTime || "-"}
                        </TableCell>
                        <TableCell
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          {user.endTime || "-"}
                        </TableCell>
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
                              handleActive(user._id);
                            }}
                          >
                            <Chip
                              color={user.isActive ? "success" : "error"}
                              variant="filled"
                              label={user.isActive ? "Active" : "Inactive"}
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
                            aria-label="edit"
                            onClick={() =>
                              navigate(
                                user.role === "doctor" ? "/addDoc" : "/addAth",
                                { state: { editMode: true, obj: user } }
                              )
                            }
                          >
                            <EditIcon color="success" />
                          </IconButton>
                          <IconButton
                            aria-label="view"
                            onClick={() => {
                              setActiveView(user);
                              handleClickOpenView(user);
                            }}
                          >
                            <RemoveRedEyeIcon color="warning" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => {
                              setIdtoDel(user._id);
                              handleDel();
                            }}
                          >
                            <DeleteIcon color="secondary" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                )
              )}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "end",
              margin: "10px",
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChange}
              variant="outlined"
              color="primary"
            />
          </Box>
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/addDoc")}
              >
                Add Doctor
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/addAth")}
              >
                Add Athlete
              </Button>
            </Box>
          </Box>
        </Modal>
        <Snackbar
          open={openNotifiication}
          autoHideDuration={2000}
          onClose={() => setOpenNotifiication(false)}
          message={msg}
          action={action}
        />
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
              Are you sure you want to delete this User.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAlert}>No</Button>
            <Button onClick={handleDel}>Yes</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          fullScreen
          open={openView}
          onClose={handleCloseView}
          TransitionComponent={Transition}
          sx={{ background: "#F2F0FF" }}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseView}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {activeView?.firstName}'s profile
              </Typography>
              <Button autoFocus color="inherit" onClick={handleCloseView}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                marginTop: "1%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChangeValue}
                aria-label="basic tabs example"
              >
                <Tab label="Personal Information" {...a11yProps(0)} />
                <Tab label="Bookings" {...a11yProps(1)} />
                <Tab label="Transactions" {...a11yProps(2)} />
                {activeView?.role === "athlete" && (
                  <Tab label="Forms" {...a11yProps(3)} />
                )}
                {activeView?.role === "athlete" && (
                  <Tab label="Shipment" {...a11yProps(4)} />
                )}
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Box
                component={Paper}
                sx={{
                  display: "flex",
                  height: "100vh",
                  justifyItems: "start",
                  alignItems: "start",
                  margin: "1%",
                  borderRadius: "1rem",
                }}
              >
                <Grid
                  container
                  spacing={10}
                  xs={12}
                  sx={{ display: "flex", margin: "50px", gap: "50px" }}
                >
                  <Grid container spacing={2} xs={12}>
                    <Grid
                      xs={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        {...stringAvatar(
                          `${activeView?.firstName} ${activeView?.lastName}`
                        )}
                        sx={{ width: 70, height: 70 }}
                      />
                    </Grid>
                    <Grid
                      xs={11}
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h3" color="primary">
                        {activeView?.role === "doctor"
                          ? "Dr. "
                          : activeView?.gender === "Female"
                          ? Math.floor(
                              (new Date() - new Date(activeView?.dob)) /
                                (1000 * 60 * 60 * 24 * 365.25)
                            ) < 25
                            ? "Miss. "
                            : "Mrs. "
                          : "Mr. "}
                        {activeView?.firstName} {activeView?.lastName}
                        {}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} xs={12} gap={2}>
                    <Grid xs={1} />
                    <Grid xs={5}>
                      <Typography variant="h5" color="initial">
                        Date of Birth :{" "}
                        {activeView?.dob?.split("T").length > 0
                          ? activeView?.dob?.split("T")[0]
                          : activeView?.dob}
                      </Typography>
                    </Grid>
                    <Grid xs={5}>
                      <Typography
                        variant="h5"
                        color="initial"
                        sx={{ textTransform: "capitalize" }}
                      >
                        Gender : {activeView?.gender}{" "}
                        {activeView?.gender === "male" ? (
                          <MaleIcon color="primary" />
                        ) : (
                          <FemaleIcon color="primary" />
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} xs={12} gap={2}>
                    <Grid xs={1} />
                    <Grid xs={5}>
                      <Typography
                        variant="h5"
                        color="initial"
                        sx={{ textTransform: "capitalize" }}
                      >
                        Phone : {activeView?.phone}
                      </Typography>
                    </Grid>
                    <Grid xs={5}>
                      <Typography
                        variant="h5"
                        color="initial"
                        sx={{ textTransform: "capitalize" }}
                      >
                        Activity status :{" "}
                        <Chip
                          color={activeView?.isActive ? "success" : "error"}
                          variant="filled"
                          label={activeView?.isActive ? "Active" : "Inactive"}
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} xs={12} gap={2}>
                    <Grid xs={1} />
                    <Grid xs={5}>
                      <Typography
                        variant="h5"
                        color="initial"
                        sx={{ textTransform: "" }}
                      >
                        Email : {activeView?.email}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 650 }}
                  size="large"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Appoinment date</TableCell>
                      <TableCell align="center">Appoinment time</TableCell>
                      {activeView?.role !== "athlete" && (
                        <TableCell align="center">Client address</TableCell>
                      )}
                      {activeView?.role !== "athlete" && (
                        <TableCell align="center">Client email</TableCell>
                      )}
                      {activeView?.role !== "athlete" && (
                        <TableCell align="center">Client Name</TableCell>
                      )}
                      <TableCell align="center">At Clinic Location</TableCell>
                      <TableCell align="center">Doctor</TableCell>
                      <TableCell align="center">Payment Status</TableCell>
                      <TableCell align="center">Service Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loadingBooking &&
                      bookings?.map((booking, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">
                            <Chip
                              color="primary"
                              avatar={
                                <Avatar>
                                  <CalendarMonthIcon
                                    style={{ color: "orange" }}
                                  />
                                </Avatar>
                              }
                              label={booking?.app_date?.split("T")[0]}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              color="primary"
                              avatar={
                                <Avatar>
                                  <QueryBuilderIcon
                                    style={{ color: "orange" }}
                                  />
                                </Avatar>
                              }
                              label={booking.app_time}
                            />
                          </TableCell>
                          {activeView?.role !== "athlete" && (
                            <TableCell align="center">
                              {booking?.client?.address}
                            </TableCell>
                          )}
                          {activeView?.role !== "athlete" && (
                            <TableCell align="center">
                              {booking?.client?.email}
                            </TableCell>
                          )}
                          {activeView?.role !== "athlete" && (
                            <TableCell align="center">
                              {booking?.client?.first_name ||
                                booking?.client?.firstName}{" "}
                              {booking?.client?.lastName}
                            </TableCell>
                          )}
                          <TableCell align="center">
                            {booking?.location}
                          </TableCell>
                          <TableCell align="center">
                            Dr. {booking?.doctor_trainer}
                          </TableCell>
                          <TableCell
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Chip
                              color={
                                booking?.status === "pending"
                                  ? "warning"
                                  : booking?.status === "paid"
                                  ? "success"
                                  : "danger"
                              }
                              sx={{ width: "50%", textTransform: "uppercase" }}
                              label={booking?.status}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              color={
                                booking?.service_status === "upcoming"
                                  ? "warning"
                                  : booking?.service_status === "completed"
                                  ? "success"
                                  : booking?.service_status === "cancelled"
                                  ? "error"
                                  : "primary"
                              }
                              // color="primary"
                              sx={{ width: "100%", textTransform: "uppercase" }}
                              label={booking?.service_status}
                            />

                            {/* {booking?.service_status} */}
                          </TableCell>
                        </TableRow>
                      ))}
                    {loadingBooking && (
                      <TableRow sx={{ width: "100%" }}>
                        <TableCell colSpan={10}>
                          <LinearProgress />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CustomTabPanel>

            {/* ////////////transaction/////////// */}
            <CustomTabPanel value={value} index={2}>
              <Transactions user={activeView} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              Forms
            </CustomTabPanel>
            {activeView?.role === "athlete" && (
              <CustomTabPanel value={value} index={4}>
                <Shipment user={activeView} />
              </CustomTabPanel>
            )}
          </Box>
        </Dialog>
      </Box>
    </>
  );
};

export default UserManagement;
