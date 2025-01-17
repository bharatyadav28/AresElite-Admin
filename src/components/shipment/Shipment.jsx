import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosUtil";
import Swal from "sweetalert2";
import dayjs from "dayjs";

import CustomDialog from "../CustomDialog";

export default function ShipmentTable({ user }) {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [shipmentId, setShipmentId] = useState(null);

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setShipmentId(null);
  };
  const handleDeleteDialogOpen = (shipmentId) => {
    setShipmentId(shipmentId);
    setIsDeleteDialogOpen(true);
  };

  const fetchShipments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/api/admin/shipment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          clientId: user._id,
        },
      });
      const shipmentData = res.data.shipments || [];
      setShipments(shipmentData);
    } catch (err) {
      // Swal.fire({
      //   icon: "error",
      //   title: "oops...",
      //   text: "No Shipments Found",
      // });
      console.log("... get shipment error", err);
    } finally {
      setIsLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const handleShipmentDelete = async (id) => {
    setIsDeleting(id);
    try {
      handleDeleteDialogClose();
      const res = await axiosInstance.delete("/api/admin/shipment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id,
        },
      });

      if (res.data.success === true) {
        fetchShipments();
        Swal.fire({
          icon: "success",
          title: "Done...",
          text: "Successfully deleted a shipment",
        });
      }
    } catch (err) {
      console.log("... get shipment error", err);
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: "Failed to load shipments",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        {isLoading ? (
          <div>
            <LinearProgress />
          </div>
        ) : (
          <div style={{ float: "right", padding: "1rem" }}>
            <Button
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={() =>
                navigate("shipment/create", { state: { user, shipment: {} } })
              }
            >
              Add Shipment
            </Button>
          </div>
        )}
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.01rem" }}>
                Athlete Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.01rem" }}>
                Plan
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.01rem" }}>
                Phase
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.01rem" }}>
                Delivery date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.01rem" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((shipment, i) => {
              const date = shipment.shipmentStatus
                .at(-1)
                ?.endDate?.split("T")[0];
              return (
                <TableRow key={i}>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{shipment.plan}</TableCell>
                  <TableCell>{shipment.phase}</TableCell>
                  <TableCell>
                    {date ? dayjs(date).format("MM/DD/YYYY") : "---"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        navigate("shipment", { state: { user, shipment } })
                      }
                      disabled={isDeleting === shipment._id}
                    >
                      <RemoveRedEyeIcon color="warning" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteDialogOpen(shipment._id)}
                    >
                      {isDeleting === shipment._id ? (
                        <CircularProgress size={15} />
                      ) : (
                        <DeleteIcon color="secondary" />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomDialog
        onClose={handleDeleteDialogClose}
        open={isDeleteDialogOpen}
        title="Are you sure?"
        captain="You want to delete this Shipment?"
        onAgree={() => handleShipmentDelete(shipmentId)}
      />
    </Box>
  );
}
