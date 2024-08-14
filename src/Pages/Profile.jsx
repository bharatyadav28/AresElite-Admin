import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useResponsiveness } from "../hooks/useResponsiveness";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import axiosInstance from "../utils/axiosUtil";
import Swal from "sweetalert2";
import { useState } from "react";

export default function Profile() {
  const token = localStorage.getItem("token");
  const { userInfo } = useSelector((state) => state.auth);
  const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false);

  const { sm } = useResponsiveness();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
    getValues,
  } = useForm({ mode: "all" });

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setIsPasswordResetLoading(true);
    try {
      const res = await axiosInstance.put(
        "/api/doctor/reset-password",
        { ...data, email: userInfo.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data) {
        reset();
        Swal.fire({
          icon: "success",
          title: "Done...",
          text: "Password changed successfully...",
        });
      }
    } catch (err) {
      console.log("..error", err);
      Swal.fire({
        icon: "error",
        title: "Opps...",
        text: "Failed to reset password...",
      });
    } finally {
      setIsPasswordResetLoading(false);
    }
  };

  return (
    <Box
      component={Paper}
      sx={{
        display: "flex",
        height: "100vh",
        justifyItems: "start",
        alignItems: "start",
        margin: "1%",
        borderRadius: "1rem",
        padding: "2%",
        flexDirection: "column",
      }}
    >
      <Box style={{ display: "flex", alignItems: "center", gap: "10%" }}>
        <Avatar alt="profile avatar" src={userInfo?.profilePic}>
          {userInfo?.fullname}
        </Avatar>
        <Typography variant="h5" style={{ fontFamily: "monospace" }}>
          {userInfo?.fullname}
        </Typography>
      </Box>
      <Grid style={{ marginTop: "5%", marginInline: "3%" }}>
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
          Password Change
        </Typography>
        <form
          style={{
            marginBlock: "2%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: sm ? "70vw" : "40vw",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            error={errors?.newPassword?.message}
            id="outlined-basic"
            label="Password"
            placeholder="Enter new password"
            variant="outlined"
            helperText={errors?.newPassword?.message}
            {...register("newPassword", {
              required: "Password is required",
              validate(v) {
                return (
                  v.length >= 8 ||
                  "Password should be at least 8 characters long"
                );
              },
            })}
          />
          <TextField
            error={errors?.confirmPassword?.message}
            id="outlined-basic"
            label="Confirm Password"
            placeholder="Enter confirm password"
            variant="outlined"
            helperText={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate(v) {
                const { newPassword } = getValues();
                return (
                  v === newPassword ||
                  "Confirm password should match the password"
                );
              },
            })}
          />
          <Button
            variant="contained"
            style={{ textTransform: "none" }}
            type="submit"
            disableElevation
            color="primary"
            sx={{ marginInline: "20%" }}
            disabled={isPasswordResetLoading}
            startIcon={isPasswordResetLoading && <CircularProgress size={25} />}
          >
            {!isPasswordResetLoading && "Submit"}
          </Button>
        </form>
      </Grid>
    </Box>
  );
}
