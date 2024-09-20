import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AddAthlete, updateAthlete } from "../Redux/ApiCalls";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const AddAthleteForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetching } = useSelector((state) => state.users);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    prefix: "",
    email: "",
    city: "",
    phone: "",
    state: "",
    dob: "",
    gender: "",
    address: "",
    zip: "",
    mode: "",
  });
  const isEdit = location.state && location.state.editMode;
  const object = location.state && location.state.obj;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? `${date.$D}/${date.$M}/${date.$y}` : "";
    setFormData((prevData) => ({ ...prevData, dob: formattedDate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const is_online = formData.mode === "online" ? true : false;

    if (isEdit) {
      await updateAthlete(dispatch, { ...formData, is_online }, object._id);
    } else {
      const res = await AddAthlete(dispatch, { ...formData, is_online });
      if (res) {
        navigate("/user_management");
      }
    }
  };

  useEffect(() => {
    if (isEdit && !formData.email) {
      setFormData(object);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: "20px",
        padding: "10vh 10vw",
      }}
    >
      <Typography variant="h3">{isEdit ? "Edit" : "Add"} Athlete</Typography>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
          backgroundColor: "white",
          padding: "50px",
          borderRadius: "15px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {[
                  { label: "Prefix", name: "prefix" },
                  { label: "First Name", name: "firstName" },
                  { label: "Last Name", name: "lastName" },
                ].map((field) =>
                  isEdit ? (
                    <Grid item xs={3} key={field.name}>
                      <TextField
                        fullWidth
                        label={field.label}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        type={field.type}
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={3} key={field.name}>
                      <TextField
                        fullWidth
                        label={field.label}
                        name={field.name}
                        value={field.value}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        required={field.name === "password"}
                        type={field.type}
                      />
                    </Grid>
                  )
                )}{" "}
                <Grid xs={3}></Grid>
                {[
                  { label: "Address", name: "address" },
                  { label: "City", name: "city" },
                  { label: "State", name: "state" },
                  { label: "Zip Code", name: "zip" },
                  { label: "Phone", name: "phone", type: "number" },
                ].map((field) =>
                  isEdit ? (
                    <Grid item xs={3} key={field.name}>
                      <TextField
                        fullWidth
                        label={field.label}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        type={field.type}
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={3} key={field.name}>
                      <TextField
                        fullWidth
                        label={field.label}
                        name={field.name}
                        value={field.value}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        required={field.name === "password"}
                        type={field.type}
                      />
                    </Grid>
                  )
                )}
                {[{ label: "Email", name: "email" }].map((field) =>
                  isEdit ? (
                    <Grid item xs={6} key={field.name}>
                      <TextField
                        fullWidth
                        label={field.label}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        type={field.type}
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={6} key={field.name}>
                      <TextField
                        fullWidth
                        label={field.label}
                        name={field.name}
                        value={field.value}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        required={field.name === "password"}
                        type={field.type}
                      />
                    </Grid>
                  )
                )}
                <Grid item xs={3}>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ marginBottom: "1rem" }}>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={3}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        marginTop: "0.5rem",
                      }}
                    >
                      <DatePicker
                        fullWidth
                        name="dob"
                        label="Date of Birth"
                        value={dayjs(formData.dob)}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" />
                        )}
                        disableFuture
                      />
                    </Grid>

                    <Grid
                      item
                      xs={3}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Mode</InputLabel>
                        <Select
                          label="Mode"
                          name="mode"
                          value={
                            formData.mode
                              ? ["online", "offline"].includes(formData.mode)
                                ? formData.mode
                                : formData.is_online
                                ? "online"
                                : "offline"
                              : ""
                          }
                          onChange={handleChange}
                        >
                          <MenuItem value="">None</MenuItem>
                          <MenuItem value="online">Online</MenuItem>
                          <MenuItem value="offline">In-Office</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={7} style={{ marginTop: "0.5rem" }}>
                  <Typography variant="subTitle" color={"error"}>
                    Password will be automatically generated combining Phone and
                    First Name
                  </Typography>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                size="large"
                color="primary"
                disabled={isFetching}
                type="submit"
                fullWidth
                style={{ marginTop: "0.5rem" }}
              >
                {isFetching ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AddAthleteForm;
