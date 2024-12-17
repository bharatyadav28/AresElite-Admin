import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {
  Typography,
  CircularProgress,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AddDoctor, updateDoctor } from "../Redux/ApiCalls";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const AddDoctorForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetching } = useSelector((state) => state.users);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    startTime: "",
    endTime: "",
    prefix: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    zip: "",
    state: "",
    email: "",
    phone: "",
    password: "",
    role: "doctor",
  });
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const isEdit = location.state && location.state.editMode;
  const object = location.state && location.state.obj;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (date) => {
    // const formattedDate = date ? `${date?.$D}/${date?.$M}/${date?.$y}` : "";
    const formattedDate = dayjs(date).toISOString();
    setFormData((prevData) => ({ ...prevData, dob: formattedDate }));
  };

  const handleTimeChange = (time, setter) => {
    const formattedTime = time
      ? `${time?.$H > 12 ? time?.$H - 12 : time?.$H}:${time?.$m} ${
          time?.$H > 12 ? "PM" : "AM"
        }`
      : "";
    setter(time);
    setFormData((prevData) => ({
      ...prevData,
      [setter === setStartTime ? "startTime" : "endTime"]: formattedTime,
    }));
  };
  console.log("FormData", formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await updateDoctor(dispatch, formData, object._id);
    } else {
      AddDoctor(dispatch, formData).then((_) => {
        navigate("/user_management");
      });
    }
  };

  useEffect(() => {
    if (isEdit) {
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
      <Typography variant="h3">{isEdit ? "Edit" : "Add"} Doctor</Typography>
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
                  {
                    label: "Prefix",
                    name: "prefix",
                    value: formData.prefix,
                  },
                  {
                    label: "First Name",
                    name: "firstName",
                    value: formData.firstName,
                  },
                  {
                    label: "Last Name",
                    name: "lastName",
                    value: formData.lastName,
                  },
                ].map((field) =>
                  isEdit ? (
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
                <Grid item xs={3}>
                  {" "}
                </Grid>
                {[
                  {
                    label: "Address",
                    name: "address",
                    value: formData.address,
                  },
                  { label: "City", name: "city", value: formData.city },
                  { label: "State", name: "state", value: formData.state },
                  {
                    label: "Zip Code",
                    name: "zip",
                    type: "number",
                    value: formData.zip,
                  },
                  {
                    label: "Phone",
                    name: "phone",
                    type: "string",
                    value: formData.phone,
                  },
                ].map((field) =>
                  isEdit ? (
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
                {[{ label: "Email", name: "email", value: formData.email }].map(
                  (field) =>
                    isEdit ? (
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

                <p style={{ display: "hidden", marginTop: "5.8rem" }}></p>

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
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="Prefer not to say">
                        Prefer not to say
                      </MenuItem>
                    </Select>
                  </FormControl>
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
                  <DatePicker
                    fullWidth
                    name="dob"
                    label="Date of birth"
                    value={dayjs(formData.dob)}
                    onChange={handleDateChange}
                    // slotProps={{
                    //   textField: {
                    //     helperText: "MM/DD/YYYY",
                    //   },
                    // }}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" />
                    )}
                    disableFuture
                  />
                </Grid>

                {/* <Grid
                  item
                  xs={3}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <TimePicker
                    label="Start time"
                    value={startTime}
                    onChange={(time) => handleTimeChange(time, setStartTime)}
                    required
                  />
                </Grid> */}
                {/* <Grid
                  item
                  xs={3}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <TimePicker
                    label="End time"
                    value={endTime}
                    onChange={(time) => handleTimeChange(time, setEndTime)}
                    required
                  />
                </Grid> */}

                <Grid item xs={7} style={{ marginTop: "1rem" }}>
                  <Typography variant="subTitle" color={"error"}>
                    Password will be automatically generated combining First
                    Name and Phone
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

export default AddDoctorForm;
