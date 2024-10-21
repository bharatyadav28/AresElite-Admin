import { styled, alpha } from "@mui/material/styles";
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
import { useState } from "react";
import { useSelector } from "react-redux";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
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
import { useDispatch } from "react-redux";
import { GetAllUsers } from "../Redux/ApiCalls";
import SportsMartialArtsIcon from "@mui/icons-material/SportsMartialArts";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { DeleteUser, ActivateUser, GetBookings } from "../Redux/ApiCalls";
import { stringAvatar, debounce, formatTime } from "../utils/function";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import Shipment from "../components/shipment/Shipment";
import Transactions from "../components/Transactions";
import { formatPhoneNumber } from "../utils/function";
import Forms from "../components/Forms";

import { GetAllShipmentUsers } from "../Redux/ApiCalls";
import { useEffect } from "react";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
const ShipmentManagement = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [users, setUsers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  const [selectedUser, setSelectedUser] = useState({});
  const [openView, setOpenView] = React.useState(false);

  const { state } = useLocation();
  const dispatch = useDispatch();
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

  const [filters, setFilters] = React.useState({
    completed: true,
    pending: true,
  });

  const fetchUsers = async (page, searchQuery, filterData) => {
    setIsFetching(true);

    setSearch(searchQuery);
    const data = filterData ? filterData : filters;
    const users = await GetAllShipmentUsers(dispatch, page, searchQuery, data);
    setUsers(users.users);
    setShipments(users.shipments);
    setTotalPages(users.totalPages);
    setCurrentPage(page);

    setIsFetching(false);
    return users;
  };

  const isShipmentCompleted = (userId) => {
    const shipped = shipments.find(
      (item) =>
        String(item.ClientId) === userId && item.shipmentStatus.length === 5
    );
    console.log("Shipped", shipped);
    return shipped;
  };

  const handleChange = (_, value) => {
    fetchUsers(value);
  };

  const isUserVisible = (userId) => {
    const val = isShipmentCompleted(userId) ? "completed" : "pending";
    return filters[val];
  };

  const handleFilterChange = async (event) => {
    const updatedFilters = {
      ...filters,
      [event.target.name]: event.target.checked,
    };
    console.log("sasa", event.target.checked);
    setFilters(updatedFilters);
    setVisible(false);
  };

  useEffect(() => {
    fetchUsers(1, "", filters).then((data) => {
      console.log("data", data);
    });
  }, [filters]);

  useEffect(() => {
    if (state && state?.user) {
      handleClickOpenView(state?.user);
      setSelectedUser(state?.user);
    }
  }, [state]);

  return (
    <>
      <Typography
        variant="h3"
        style={{ paddingTop: "1rem", marginLeft: "2rem" }}
      >
        Shipping Management
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
                  debounce(await fetchUsers(1, e.target.value), 3000);
                }}
                value={search}
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
              <IconButton
                aria-label="clear button"
                // onClick={() => handleGetAll(1, "")}
              >
                <ClearIcon />
              </IconButton>
            </Search>
          </Box>
          <Table>
            <TableHead>
              <TableRow sx={{ fontWeight: "bold" }}>
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
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    >
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
                    xs={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    >
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
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    >
                      Phone
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    flexDirection: "row",
                    gap: "10px",
                    position: "relative",
                  }}
                >
                  <Box
                    xs={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
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
                      <div> Status</div>{" "}
                      <FilterAltIcon
                        color="primary"
                        onClick={() => setVisible(!visible)}
                        sx={{ cursor: "pointer" }}
                      />
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
                              checked={filters?.completed}
                              onChange={handleFilterChange}
                              name="completed"
                            />
                          }
                          label="Completed"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={filters?.pending}
                              onChange={handleFilterChange}
                              name="pending"
                            />
                          }
                          label="Pending"
                        />
                      </FormGroup>
                    )}
                  </Box>
                </TableCell>
                <TableCell
                  color="primary"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                  sx={{ fontWeight: "bold" }}
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
                users.map((user) => {
                  return (
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
                        {user.email}
                      </TableCell>
                      <TableCell
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        {formatPhoneNumber(user.phone)}
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
                            // handleActive(user._id);
                          }}
                        >
                          <Chip
                            color={user.is_completed ? "success" : "error"}
                            variant="filled"
                            label={user.is_completed ? "Completed" : "Pending"}
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
                          aria-label="view"
                          onClick={() => {
                            // setActiveView(user);
                            handleClickOpenView(user);
                            setSelectedUser(user);
                          }}
                        >
                          <RemoveRedEyeIcon color="primary" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
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
                {selectedUser?.firstName}'s Shipments
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
            ></Box>

            <CustomTabPanel value={4} index={4}>
              <Shipment user={selectedUser} />
            </CustomTabPanel>
          </Box>
        </Dialog>
      </Box>
    </>
  );
};
export default ShipmentManagement;
