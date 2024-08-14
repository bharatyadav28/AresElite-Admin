import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Modal,
  Paper,
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
// import DeleteIcon from "@mui/icons-material/Delete";
import { Fragment, useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useResponsiveness } from "../hooks/useResponsiveness";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import axiosInstance from "../utils/axiosUtil";
import CustomDialog from "../components/CustomDialog";

function Row(props) {
  const { row, token, shouldRefetch } = props;
  // const [isDeleting, setIsDeleting] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    name: row.name,
    cost: row.cost,
    duration: row.duration,
  });

  // const handleDelete = async (id) => {
  //   setIsDeleting(id);

  //   try {
  //     const res = await axiosInstance.delete("/api/admin/service", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       params: {
  //         id,
  //       },
  //     });

  //     if (res.data.success) {
  //       shouldRefetch(true);
  //     }
  //   } catch (err) {
  //     console.log("... delete services error", err);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Failed to delete service",
  //     });
  //   } finally {
  //     setIsDeleting(null);
  //   }
  // };

  const handleEdit = async () => {
    setIsUpdating(true);

    try {
      const res = await axiosInstance.put("/api/admin/service", data, {
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

  const handleDeleteService = () => {
    if (isOpen) {
      setIsOpen(false);
      // handleDelete(row._id);
    } else {
      setIsOpen(true);
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
              <TextField
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Service name"
              />
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
                value={data.duration}
                placeholder="Duration"
                onChange={(e) => setData({ ...data, duration: e.target.value })}
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
              {row.name}
            </TableCell>
            <TableCell>{row.cost}</TableCell>
            <TableCell>{row.duration}</TableCell>
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
                      name: row.name,
                      cost: row.cost,
                      duration: row.duration,
                    });
                  }}
                >
                  <CloseIcon color="warning" />
                </IconButton>
              </>
            )
          ) : (
            <IconButton onClick={() => setIsEditing(true)}>
              <EditIcon color="primary" />
            </IconButton>
          )}
          {/* <IconButton onClick={handleDeleteService}>
            {isDeleting === row._id ? (
              <CircularProgress size={20} color="secondary" />
            ) : (
              <DeleteIcon color="secondary" />
            )}
          </IconButton> */}
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

export default function ServiceManagement({ user }) {
  const token = localStorage.getItem("token");
  const { theme } = useResponsiveness();

  const [isLoading, setIsLoading] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [services, setServices] = useState([]);
  const [isServiceAdding, setIsServiceAdding] = useState(false);
  const [data, setData] = useState({ name: "", cost: "", duration: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const [filterData, setFilterData] = useState({
    name: "",
  });

  const handleGetServices = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await axiosInstance.get("/api/admin/service", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setServices(res.data.plans);
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

  const handleAddService = async () => {
    setIsServiceAdding(true);

    try {
      const res = await axiosInstance.post("/api/admin/service", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setShouldRefetch(true);
        handleModalClose();
        setData({ name: "", cost: "", duration: "" });
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
    handleGetServices();
  }, [handleGetServices]);

  useEffect(() => {
    if (!shouldRefetch) return;
    handleGetServices();
    setShouldRefetch(false);
  }, [handleGetServices, shouldRefetch]);

  return (
    <>
      <Box sx={{ m: "2%" }}>
        <Typography variant="h3">Service Management</Typography>
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
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", fontSize: "1rem" }}
              color="primary"
            >
              Filter
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "0.5rem",
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
                  Name
                </Typography>
                <TextField
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    paddingBlock: "0.4rem",
                    paddingInline: "1rem",
                  }}
                  value={filterData.name}
                  onChange={(e) =>
                    setFilterData({ ...filterData, name: e.target.value })
                  }
                  disabled={isLoading}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  placeholder="Search by service name"
                />
              </Box>
            </Box>
            {/* </Accordion> */}
          </div>
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: "15%",
              marginInline: "1rem",
            }}
          >
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
                <Typography>Add Service Details</Typography>
                <TextField
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    width: "20rem",
                  }}
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  variant="filled"
                  InputProps={{ disableUnderline: true }}
                  disabled={isLoading}
                  placeholder="Service name"
                  label="Service name"
                />
                <TextField
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    width: "20rem",
                  }}
                  value={data.cost}
                  onChange={(e) => setData({ ...data, cost: e.target.value })}
                  variant="filled"
                  InputProps={{ disableUnderline: true }}
                  disabled={isLoading}
                  placeholder="Service cost"
                  label="Service cost"
                />
                <TextField
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    width: "20rem",
                  }}
                  value={data.duration}
                  onChange={(e) =>
                    setData({ ...data, duration: e.target.value })
                  }
                  variant="filled"
                  InputProps={{ disableUnderline: true }}
                  disabled={isLoading}
                  placeholder="Service duration"
                  label="Service duration"
                />
                <Button
                  onClick={handleAddService}
                  disabled={isServiceAdding}
                  sx={{ textTransform: "none" }}
                  variant="contained"
                >
                  {isServiceAdding ? <CircularProgress size={30} /> : "Submit"}
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
                  Name
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
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  Duration
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.01rem" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading && filterData.name === ""
                ? services.map((row) => (
                  <Row
                    key={row._id}
                    row={row}
                    token={token}
                    shouldRefetch={setShouldRefetch}
                  />
                ))
                : services
                  .filter((service) =>
                    service.name
                      .toLowerCase()
                      .includes(filterData.name.toLowerCase())
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
        </TableContainer>
      </Box>
    </>
  );
}
