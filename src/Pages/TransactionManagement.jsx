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
  const [status, setStatus] = useState(row.payment_status);
  const [isLoading, setIsLoading] = useState(false);

  const isPaid = row.payment_status === "paid";
  const isStatusUpdated = status === row.payment_status;

  const handleStatusUpdate = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.put(
        "/api/admin/transaction",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id: row._id,
            status,
          },
        }
      );

      if (res.data.success) {
        shouldRefetch(true);
        Swal.fire({
          icon: "success",
          title: "Done...",
          text: "Sucessfully updated payment status...",
        });
      }
    } catch (err) {
      console.log("...error", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update payment status",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row" sx={{ paddingBlock: "1.5rem" }}>
          {row.clientId !== null
            ? `${row.clientId.suffix} ${row.clientId.firstName} ${row.clientId.lastName}`
            : "---"}
        </TableCell>
        <TableCell>{formatDateToMMDDYYYY(row.date)}</TableCell>
        <TableCell>$ {row.amount?.toLocaleString("en-US") || "0"}</TableCell>
        <TableCell>{row.plan || "---"}</TableCell>
        <TableCell>
          <Chip
            label={row.payment_status}
            sx={{
              bgcolor: isPaid
                ? theme.palette.success.main
                : theme.palette.warning.main,
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
                Transaction Details
              </Typography>
              <Box
                sx={{
                  margin: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                  Doctor Name -{" "}
                  <p style={{ fontWeight: "normal", margin: 0 }}>
                    {row.doctor || "---"}
                  </p>
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                  Service Type -{" "}
                  <p style={{ fontWeight: "normal", margin: 0 }}>
                    {row.service_type}
                  </p>
                </Typography>
                <Box>
                  <Typography sx={{ fontSize: "0.9rem" }}>
                    Payment Status{" "}
                    <span
                      style={{
                        // fontWeight: "normal",
                        margin: 0,
                        color: isPaid
                          ? theme.palette.success.main
                          : theme.palette.warning.main,
                      }}
                    >
                      ({row.payment_status})
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
                        onClick={handleStatusUpdate}
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
                        onClick={() => setStatus(row.payment_status)}
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

export default function TransactionManagement({ user }) {
  const token = localStorage.getItem("token");
  const { theme } = useResponsiveness();
  const { sm } = useResponsiveness();

  const dispatch = useDispatch();
  const { Plans, isFetching } = useSelector((state) => state.plan);

  const [isLoading, setIsLoading] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [transactions, setTransactions] = useState([]);

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

  const [filterData, setFilterData] = useState({
    plan: "All",
    from,
    to,
    currentPage: 1,
    count: 10,
    searchQuery: "",
  });

  const handleGetTransactions = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await axiosInstance.get("/api/admin/transaction", {
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
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.log("... get shipment error", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to load transactions",
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
    handleGetTransactions();
  }, [handleGetTransactions]);

  useEffect(() => {
    if (!shouldRefetch) return;
    handleGetTransactions();
    setShouldRefetch(false);
  }, [handleGetTransactions, shouldRefetch]);

  useEffect(() => {
    const fetch = async () => {
      await GetAllPlans(dispatch);
    };
    fetch();
  }, [dispatch]);

  console.log("...transactions", transactions);

  return (
    <>
      <Box sx={{ m: "2%" }}>
        <Typography variant="h3">Transactions Management</Typography>
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
              width: "30%",
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
                gap: "1rem",
                justifyContent: "space-between",
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
                  placeholder="Search by keyword"
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
                    fontSize: "0.8rem",
                    marginBottom: "0.3rem",
                  }}
                >
                  Plan Type
                </Typography>

                <Select
                  variant="outlined"
                  disabled={isFetching}
                  fullWidth
                  value={filterData.plan}
                  onChange={(e) =>
                    setFilterData({ ...filterData, plan: e.target.value })
                  }
                  sx={{ width: "10rem" }}
                >
                  {[{ name: "All" }, ...Plans].map((plan) => (
                    <MenuItem key={plan} value={plan.name}>
                      {plan.name}
                    </MenuItem>
                  ))}
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
                  Athlete Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Transaction Date
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Amount
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Plan Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Payment Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.01rem" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading && filterData.plan === "All"
                ? transactions.map((row) => (
                    <Row
                      key={row._id}
                      row={row}
                      token={token}
                      shouldRefetch={setShouldRefetch}
                    />
                  ))
                : transactions
                    .filter((tra) => tra.plan === filterData.plan)
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
                disabled={isFetching}
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
