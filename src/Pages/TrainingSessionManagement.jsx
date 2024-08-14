import React, { useState, Fragment, useCallback, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  Button,
  Typography,
  TableContainer,
  Paper,
  LinearProgress,
  IconButton,
  TextField,
  Modal,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  CircularProgress,
  TableBody,
  colors,
  MenuItem,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useResponsiveness } from "../hooks/useResponsiveness";
import axiosInstance from "../utils/axiosUtil";
import Swal from "sweetalert2";
import CustomDialog from "../components/CustomDialog";

function Row(props) {
  const { row, token, shouldRefetch } = props;
  const [deletingId, setDeletingId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    session_type: row.session_type,
    cost: row.cost,
    sessions: row.sessions,
    frequency: row.frequency,
  });

  const handleEdit = async () => {
    setIsUpdating(true);
    console.log(data);
    try {
      const res = await axiosInstance.put("/api/admin/training-session", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: row._id,
        },
      });

      if (res.data.success) {
        shouldRefetch(true);
        setIsEditing(false);
        Swal.fire({
          icon: "success",
          title: "Done...",
          text: "Successfully updated the service",
        });
      }
    } catch (err) {
      console.log("... update services error", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update service",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteService = async () => {
    setDeletingId(row._id);
    try {
      const res = await axiosInstance.delete("/api/admin/training-session", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: row._id,
        },
      });

      if (res.data.success) {
        shouldRefetch(true);
        setDeletingId(null);
        Swal.fire({
          icon: "success",
          title: "Done...",
          text: "Successfully deleted the service",
        });
      }
    } catch (err) {
      console.log("... delete services error", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete service",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        {isEditing ? (
          <>
            <TableCell
              component="th"
              scope="row"
              sx={{ paddingBlock: "1.5rem" }}
            >
              <FormControl
                fullWidth
                style={{
                  borderRadius: "0.5rem",
                  backgroundColor: colors.grey[100],
                  width: "20rem",
                }}
              >
                <InputLabel id="type Selector">Type</InputLabel>
                <Select
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    width: "20rem",
                  }}
                  labelId="type Selector"
                  id="type Selector-select"
                  value={data.session_type}
                  label="Type"
                  onChange={(e) =>
                    setData({ ...data, session_type: e.target.value })
                  }
                >
                  <MenuItem value={"in_office"}>In Office</MenuItem>
                  <MenuItem value={"tele_session"}>Tele Session</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                style={{
                  borderRadius: "0.5rem",
                  backgroundColor: colors.grey[100],
                  width: "20rem",
                }}
              >
                <InputLabel id="type Selector">Frequency Type</InputLabel>
                <Select
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    width: "20rem",
                  }}
                  labelId="frequency Selector"
                  id="frequency Selector-select"
                  value={data.frequency}
                  label="Frequency"
                  onChange={(e) =>
                    setData({ ...data, frequency: e.target.value })
                  }
                >
                  <MenuItem value={"per_month"}>Per Month</MenuItem>
                  <MenuItem value={"package"}>Package</MenuItem>
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>
              <TextField
                value={data.cost}
                placeholder="Cost"
                onChange={(e) => setData({ ...data, cost: e.target.value })}
              />
            </TableCell>
            <TableCell>
              <TextField
                value={data.sessions}
                placeholder="Session per month"
                onChange={(e) => setData({ ...data, sessions: e.target.value })}
              />
            </TableCell>
          </>
        ) : (
          <>
            <TableCell
              component="th"
              scope="row"
              sx={{ paddingBlock: "1.5rem" }}
            >
              {row.session_type === "in_office" ? "In Office" : "Tele Session"}
            </TableCell>
            <TableCell>
              {" "}
              {row.frequency === "per_month" ? "Per Month" : "Package"}
            </TableCell>
            <TableCell>{row.sessions}</TableCell>
            <TableCell>{row.cost}</TableCell>
          </>
        )}
        <TableCell>
          {isEditing ? (
            isUpdating ? (
              <IconButton>
                <CircularProgress size={20} />
              </IconButton>
            ) : (
              <>
                <IconButton onClick={handleEdit}>
                  <CheckIcon color="success" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setIsEditing(false);
                    setData({
                      session_type: row.session_type,
                      cost: row.cost,
                      sessions: row.sessions,
                      frequency: row.frequency,
                    });
                  }}
                >
                  <CloseIcon color="warning" />
                </IconButton>
              </>
            )
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyItems: "center",
              }}
            >
              <IconButton
                sx={{
                  paddingLeft: 0,
                  paddingRight: "0.005 rem",
                }}
                onClick={() => setIsEditing(true)}
              >
                <EditIcon color="primary" />
              </IconButton>

              <IconButton
                onClick={handleDeleteService}
                sx={{
                  paddingLeft: "0.1rem",
                  marginRight: "0.1rem",
                }}
              >
                {deletingId === row._id ? (
                  <CircularProgress size={20} color="secondary" />
                ) : (
                  <DeleteIcon color="secondary" />
                )}
              </IconButton>
            </Box>
          )}

          <CustomDialog
            onClose={() => setIsOpen(false)}
            open={isOpen}
            title="Are you sure?"
            captain="You want to delete this service"
            onAgree={handleDeleteService}
          />
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

const TrainingSessionManagement = () => {
  const [filterData, setFilterData] = useState({
    name: "",
  });
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const token = localStorage.getItem("token");
  const [services, setServices] = useState([]);
  const { theme } = useResponsiveness();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isServiceAdding, setIsServiceAdding] = useState(false);
  const handleModalClose = () => setIsModalOpen(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const [data, setData] = useState({
    sessions: "",
    cost: "",
    session_type: "",
    frequency: "",
  });

  const handleGetSessions = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await axiosInstance.get("/api/admin/training-session", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setServices(res.data.trainigSessionModel);
      }
    } catch (err) {
      console.log("... get services error", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to load services",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const handleAddSession = async () => {
    setIsServiceAdding(true);
    console.log(data);
    try {
      const res = await axiosInstance.post(
        "/api/admin/training-session",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setShouldRefetch(true);
        handleModalClose();
        setData({ sessions: "", cost: "", session_type: "", frequency: "" });
      }
    } catch (err) {
      console.log("... add services error", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add service",
      });
    } finally {
      setIsServiceAdding(false);
    }
  };

  useEffect(() => {
    handleGetSessions();
  }, [handleGetSessions]);

  useEffect(() => {
    if (!shouldRefetch) return;
    handleGetSessions();
    setShouldRefetch(false);
  }, [handleGetSessions, shouldRefetch]);

  return (
    <>
      <Box sx={{ m: "2%" }}>
        <Typography variant="h3">Training Session Management</Typography>
        <TableContainer
          elevation={0}
          sx={{ borderRadius: "0.5rem", mt: "2rem", position: "relative" }}
          component={Paper}
        >
          {isLoading && (
            <div>
              <LinearProgress />
            </div>
          )}

          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: "0",
              marginInline: "1rem",
            }}
          >
            <Button
              onClick={handleModalOpen}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Add Training Session
            </Button>
            <Modal
              open={isModalOpen}
              sx={{
                position: "fixed",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClose={handleModalClose}
            >
              <Box
                sx={{
                  padding: "1rem",
                  bgcolor: "white",
                  borderRadius: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <Typography>Add Details</Typography>
                <FormControl
                  fullWidth
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    width: "20rem",
                  }}
                >
                  <InputLabel id="type Selector">Type</InputLabel>
                  <Select
                    style={{
                      borderRadius: "0.5rem",
                      backgroundColor: colors.grey[100],
                      width: "20rem",
                    }}
                    labelId="type Selector"
                    id="type Selector-select"
                    value={data.session_type}
                    label="Type"
                    disabled={isLoading}
                    onChange={(e) =>
                      setData({ ...data, session_type: e.target.value })
                    }
                  >
                    <MenuItem value={"in_office"}>In Office</MenuItem>
                    <MenuItem value={"tele_session"}>Tele Session</MenuItem>
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    width: "20rem",
                  }}
                >
                  <InputLabel id="type Selector">Frequency Type</InputLabel>
                  <Select
                    style={{
                      borderRadius: "0.5rem",
                      backgroundColor: colors.grey[100],
                      width: "20rem",
                    }}
                    labelId="frequency type Selector"
                    id="frequency type Selector-select"
                    value={data.frequency}
                    label="Type"
                    disabled={isLoading}
                    onChange={(e) =>
                      setData({ ...data, frequency: e.target.value })
                    }
                  >
                    <MenuItem value={"per_month"}>Per Month</MenuItem>
                    <MenuItem value={"package"}>Package</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    width: "20rem",
                  }}
                  type="number"
                  value={data.sessions}
                  onChange={(e) =>
                    setData({ ...data, sessions: e.target.value })
                  }
                  variant="filled"
                  InputProps={{ disableUnderline: true }}
                  disabled={isLoading}
                  placeholder="Sessions"
                  label="Sessions"
                />
                <TextField
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    width: "20rem",
                  }}
                  type="number"
                  value={data.cost}
                  onChange={(e) => setData({ ...data, cost: e.target.value })}
                  variant="filled"
                  InputProps={{ disableUnderline: true }}
                  disabled={isLoading}
                  placeholder="Cost"
                  label="Cost"
                />
                <Button
                  onClick={handleAddSession}
                  disabled={isServiceAdding}
                  sx={{ textTransform: "none" }}
                  variant="contained"
                >
                  {false ? <CircularProgress size={30} /> : "Submit"}
                </Button>
                <Button
                  sx={{ textTransform: "none" }}
                  color="warning"
                  onClick={() => !isServiceAdding && handleModalClose()}
                >
                  Cancel
                </Button>
              </Box>
            </Modal>
          </Box>
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
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Frequency Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Sessions
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Cost
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.01rem" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((row) => (
                <Row
                  key={row._id}
                  row={row}
                  token={token}
                  shouldRefetch={setShouldRefetch}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default TrainingSessionManagement;
