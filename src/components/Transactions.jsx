import {
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosUtil";
import Swal from "sweetalert2";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function Transactions({ user }) {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const handleGetTransactions = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await axiosInstance.get("/api/admin/transaction", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          clientId: user._id,
        },
      });

      console.log("...client transactions", res.data);
      if (res.data.success) {
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.log("... get client transactions error", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to load transactions",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, user._id]);

  useEffect(() => {
    handleGetTransactions();
  }, [handleGetTransactions]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="large" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Doctor name</TableCell>
            <TableCell align="center">Transaction date</TableCell>
            <TableCell align="center">Service Type</TableCell>
            <TableCell align="center">Amount</TableCell>
            <TableCell align="center">Payment Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => {
            return (
              <TableRow
                key={transaction._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="center">
                  {transaction.doctor || "---"}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    color="primary"
                    avatar={
                      <Avatar>
                        <CalendarMonthIcon style={{ color: "orange" }} />
                      </Avatar>
                    }
                    label={transaction.date.split("T")[0]}
                  />
                </TableCell>
                <TableCell align="center">{transaction.service_type}</TableCell>
                <TableCell align="center">{transaction.amount}</TableCell>
                <TableCell align="center">
                  <Chip
                    color={
                      transaction?.payment_status === "pending"
                        ? "warning"
                        : transaction?.payment_status === "paid"
                        ? "success"
                        : "danger"
                    }
                    sx={{ width: "50%", textTransform: "uppercase" }}
                    label={transaction?.payment_status}
                  />
                </TableCell>
              </TableRow>
            );
          })}
          {isLoading && (
            <TableRow sx={{ width: "100%" }}>
              <TableCell colSpan={10}>
                <LinearProgress />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
