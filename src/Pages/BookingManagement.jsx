import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  colors,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import { Fragment, useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useResponsiveness } from "../hooks/useResponsiveness";
import CloseIcon from "@mui/icons-material/Close";
import CustomModal from "../components/Modal";
import { GetAllPlans } from "../Redux/ApiCalls";
import { useDispatch, useSelector } from "react-redux";
import CheckIcon from "@mui/icons-material/Check";
import axiosInstance from "../utils/axiosUtil";

import { formatDateToMMDDYYYY } from "../utils/function";

function Row(props) {
  const { row, token, shouldRefetch } = props;
  const [open, setOpen] = useState(false);
  const { theme } = useResponsiveness();
  const [status, setStatus] = useState(row.status);
  const [serviceStatus, setServiceStatus] = useState(row.service_status);
  const [isLoading, setIsLoading] = useState(false);
  const [isServiceUpdating, setIsServiceUpdating] = useState(false);

  const isPaid = row.status === "paid";
  const isStatusUpdated = status === row.status;
  const isServiceStatusUpdated = serviceStatus === row.service_status;

  const handleBookingUpdate = async (type) => {
    if (type === "status") {
      setIsLoading(true);
    } else {
      setIsServiceUpdating(true);
    }
    try {
      const res = await axiosInstance.put(
        "/api/admin/bookings",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id: row._id,
            status,
            service_status: serviceStatus,
          },
        }
      );

      if (res.data.success) {
        shouldRefetch(true);
        Swal.fire({
          icon: "success",
          title: "Done...",
          text: `Sucessfully updated ${
            type === "status" ? "payment" : "service"
          } status...`,
        });
      }
    } catch (err) {
      console.log("...error", err);
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: "Failed to update payment status",
      });
    } finally {
      if (type === "status") {
        setIsLoading(false);
      } else {
        setIsServiceUpdating(false);
      }
    }
  };

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row" sx={{ paddingBlock: "1.5rem" }}>
          {row.client !== null
            ? `${row.client.prefix} ${row.client.firstName} ${row.client.lastName}`
            : "---"}
        </TableCell>
        <TableCell component="th" scope="row" sx={{ paddingBlock: "1.5rem" }}>
          {row.doctor_trainer}
        </TableCell>
        <TableCell>{formatDateToMMDDYYYY(row.app_date)}</TableCell>
        <TableCell>{row.app_time}</TableCell>
        <TableCell>
          <Chip
            label={row.service_status}
            sx={{
              bgcolor:
                row.service_status === "upcoming"
                  ? theme.palette.primary.light
                  : row.service_status === "completed"
                  ? theme.palette.success.light
                  : theme.palette.warning.light,
              paddingInline: "0.5rem",
              fontFamily: "monospace",
              fontWeight: "bold",
              color: "white",
            }}
          />
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <VisibilityOffIcon color="primary" />
            ) : (
              <RemoveRedEyeIcon color="primary" />
            )}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 0.3,
                paddingBlock: "1rem",
                borderBottom: "1px solid",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.01rem",
                  color: theme.palette.primary.main,
                }}
              >
                Booking Details
              </Typography>
              <Box
                sx={{
                  margin: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                  Service Type -{" "}
                  <p style={{ fontWeight: "normal", margin: 0 }}>
                    {row.service_type}
                  </p>
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                  Location -{" "}
                  <p style={{ fontWeight: "normal", margin: 0 }}>
                    {row.location || "---"}
                  </p>
                </Typography>
                <Box>
                  <Typography sx={{ fontSize: "0.9rem" }}>
                    Service Status{" "}
                    <span
                      style={{
                        // fontWeight: "normal",
                        margin: 0,
                        color:
                          row.service_status === "upcoming"
                            ? theme.palette.primary.main
                            : row.service_status === "completed"
                            ? theme.palette.success.main
                            : theme.palette.warning.main,
                      }}
                    >
                      ({row.service_status})
                    </span>
                  </Typography>
                  <Box sx={{ display: "flex", gap: "3%" }}>
                    <Select
                      value={serviceStatus}
                      onChange={(e) => setServiceStatus(e.target.value)}
                      fullWidth
                      variant="standard"
                      disableUnderline
                      disabled={isServiceUpdating}
                    >
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="upcoming">Upcoming</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                    <Grid display="flex" gap="3%">
                      <IconButton
                        style={{
                          backgroundColor: isServiceStatusUpdated
                            ? colors.grey[100]
                            : colors.blue[50],
                          borderRadius: "0.5rem",
                        }}
                        disabled={isServiceStatusUpdated || isServiceUpdating}
                        onClick={handleBookingUpdate}
                      >
                        {isServiceUpdating ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CheckIcon
                            color={
                              isServiceStatusUpdated
                                ? "formBackground"
                                : "primary"
                            }
                          />
                        )}
                      </IconButton>
                      <IconButton
                        style={{
                          backgroundColor: isServiceStatusUpdated
                            ? colors.grey[100]
                            : colors.orange[50],
                          borderRadius: "0.5rem",
                        }}
                        disabled={isServiceStatusUpdated || isServiceUpdating}
                        onClick={() => setServiceStatus(row.service_status)}
                      >
                        <CloseIcon
                          color={
                            isServiceStatusUpdated
                              ? "formBackground"
                              : "warning"
                          }
                        />
                      </IconButton>
                    </Grid>
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                    Payment Status{" "}
                    <span
                      style={{
                        fontWeight: "normal",
                        margin: 0,
                        color: isPaid
                          ? theme.palette.success.main
                          : theme.palette.warning.main,
                      }}
                    >
                      ({row.status})
                    </span>
                  </Typography>
                  <Box sx={{ display: "flex", gap: "3%" }}>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      fullWidth
                      variant="standard"
                      disableUnderline
                      disabled={isLoading}
                    >
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                    <Grid display="flex" gap="3%">
                      <IconButton
                        style={{
                          backgroundColor: isStatusUpdated
                            ? colors.grey[100]
                            : colors.blue[50],
                          borderRadius: "0.5rem",
                        }}
                        disabled={isStatusUpdated || isLoading}
                        onClick={() => handleBookingUpdate("status")}
                      >
                        {isLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CheckIcon
                            color={
                              isStatusUpdated ? "formBackground" : "primary"
                            }
                          />
                        )}
                      </IconButton>
                      <IconButton
                        style={{
                          backgroundColor: isStatusUpdated
                            ? colors.grey[100]
                            : colors.orange[50],
                          borderRadius: "0.5rem",
                        }}
                        disabled={isStatusUpdated || isLoading}
                        onClick={() => setStatus(row.status)}
                      >
                        <CloseIcon
                          color={isStatusUpdated ? "formBackground" : "warning"}
                        />
                      </IconButton>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default function BookingManagement({ user }) {
  const token = localStorage.getItem("token");
  const { theme, md, sm, xs } = useResponsiveness();

  const [isLoading, setIsLoading] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [bookings, setBookings] = useState([]);

  const date = new Date();
  const to = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
  date.setDate(String(date.getDate() - 1).padStart(2, "0"));
  const from = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${date.getDate()}`;
  console.log("bookings: ", bookings);

  const [filterData, setFilterData] = useState({
    status: "all",
    serviceStatus: "all",
    from,
    to,
    currentPage: 1,
    searchQuery: "",
    count: 10,
  });

  const handleGetBookings = useCallback(async () => {
    // if (filterData.from === filterData.to) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "oops...",
    //     text: "Start and End date should not match",
    //   });
    //   return;
    // }
    setIsLoading(true);

    try {
      const res = await axiosInstance.get("/api/admin/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: filterData.from,
          end_date: filterData.to,
          page_no: filterData.currentPage,
          per_page_count: filterData.count,
          searchQuery: filterData.searchQuery,
        },
      });

      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.log("...error", err);
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: "Failed to load bookings",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    filterData.from,
    filterData.to,
    filterData.currentPage,
    filterData.count,
    filterData.searchQuery,
    token,
  ]);

  useEffect(() => {
    handleGetBookings();
  }, [handleGetBookings]);

  useEffect(() => {
    if (!shouldRefetch) return;
    handleGetBookings();
    setShouldRefetch(false);
  }, [handleGetBookings, shouldRefetch]);

  console.log("...bookings", bookings);

  return (
    <>
      <Box sx={{ m: "2%" }}>
        <Typography variant="h3">Bookings Management</Typography>
        <TableContainer
          elevation={0}
          sx={{ borderRadius: "0.5rem", mt: "2rem" }}
          component={Paper}
        >
          {isLoading && (
            <div>
              <LinearProgress />
            </div>
          )}
          <div
            style={{
              float: "left",
              // backgroundColor: theme.palette.grey[100],
              borderRadius: "1rem",
              padding: "1rem",
              marginLeft: "0.5rem",
              marginTop: "0.5rem",
              width: xs ? "100%" : sm ? "90%" : md ? "70%" : "60%",
            }}
          >
            {/* <Accordion
              expanded={isFilterExpanded}
              onChange={(_, isExpanded) => setIsFilterExpanded(isExpanded)}
              sx={{
                width: isFilterExpanded ? "20rem" : "3rem",
                transition: "width 0.3s ease-in-out",
                backgroundColor: colors.grey[100],
                borderRadius: "1rem",
              }}
              elevation={0}
            >
              <AccordionSummary expandIcon={<FilterListIcon color="primary" />}>
                {isFilterExpanded && (
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    Filter
                  </Typography>
                )}
              </AccordionSummary> */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                marginBottom: "0.5rem",
              }}
              color="primary"
            >
              Filter
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  style={{
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    marginBottom: "0.3rem",
                  }}
                >
                  Search
                </Typography>
                <TextField
                  placeholder="Search by Doctor Name"
                  value={filterData.searchQuery}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      searchQuery: e.target.value,
                    })
                  }
                  sx={{ width: "15rem" }}
                />
              </Box>
              <Box>
                <Typography
                  style={{
                    fontWeight: "bold",
                    fontSize: sm ? "0.6rem" : "0.8rem",
                    marginBottom: "0.3rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  Payment Status
                </Typography>

                <Select
                  variant="outlined"
                  fullWidth
                  value={filterData.status}
                  onChange={(e) =>
                    setFilterData({ ...filterData, status: e.target.value })
                  }
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography
                  style={{
                    fontWeight: "bold",
                    fontSize: sm ? "0.6rem" : "0.8rem",
                    marginBottom: "0.3rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  Appointment Status
                </Typography>

                <Select
                  variant="outlined"
                  fullWidth
                  value={filterData.serviceStatus}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      serviceStatus: e.target.value,
                    })
                  }
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </Box>

              <Box>
                <Typography
                  style={{
                    fontWeight: "bold",
                    fontSize: sm ? "0.6rem" : "0.8rem",
                    marginBottom: "0.3rem",
                  }}
                >
                  Date
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2%",
                  }}
                >
                  <OutlinedInput
                    value={filterData.from}
                    onChange={(e) => {
                      if (filterData.to === e.target.value) {
                        Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: "Start and end date should not match",
                        });
                        return;
                      } else {
                        setFilterData({
                          ...filterData,
                          from: e.target.value,
                        });
                      }
                    }}
                    fullWidth
                    // sx={{
                    //   border: "none",
                    //   "& fieldset": { border: "none" },
                    // }}
                    placeholder="Select start date"
                    type="date"
                    className="remove-calender-icon"
                    inputProps={{
                      max: filterData.to,
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    style={{
                      fontSize: "0.8rem",
                    }}
                  >
                    To
                  </Typography>
                  <OutlinedInput
                    value={filterData.to}
                    onChange={(e) => {
                      if (filterData.from === e.target.value) {
                        Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: "Start and end date should not match",
                        });
                        return;
                      } else {
                        setFilterData({
                          ...filterData,
                          to: e.target.value,
                        });
                      }
                    }}
                    fullWidth
                    // sx={{
                    //   border: "none",
                    //   "& fieldset": { border: "none" },
                    // }}
                    placeholder="Select start date"
                    type="date"
                    className="remove-calender-icon"
                    inputProps={{
                      min: filterData.from,
                    }}
                  />
                </Box>
              </Box>
            </Box>
            {/* </Accordion> */}
          </div>
          <Divider sx={{ width: "100%", mb: "0.5rem" }} />
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow
                sx={{ borderBottom: `2px solid ${theme.palette.primary.main}` }}
              >
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                    paddingBlock: "1rem",
                  }}
                >
                  Doctor Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Athlete Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Booking Date
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Booking Time
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Service Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.01rem" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading &&
                bookings
                  .filter(
                    (booking) =>
                      filterData.status === "all" ||
                      booking.status === filterData.status
                  )
                  .filter(
                    (booking) =>
                      filterData.serviceStatus === "all" ||
                      booking.service_status === filterData.serviceStatus
                  )
                  .map((row) => (
                    <Row
                      key={row._id}
                      row={row}
                      token={token}
                      shouldRefetch={setShouldRefetch}
                    />
                  ))}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: "1rem",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  marginRight: "1rem",
                }}
              >
                Per page rows count
              </Typography>
              <Select
                variant="standard"
                fullWidth
                value={filterData.count}
                onChange={(e) =>
                  setFilterData({ ...filterData, count: e.target.value })
                }
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
            </Box>
            <Pagination
              count={10}
              page={filterData.currentPage}
              onChange={(_, v) =>
                setFilterData({ ...filterData, currentPage: v })
              }
              variant="outlined"
              color="primary"
            />
          </Box>
        </TableContainer>
      </Box>
    </>
  );
}
