import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Login } from "../Redux/ApiCalls";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const { isFetching, error, userInfo, token } = useSelector(
    (state) => state.auth
  );
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });
  const [showPwd, setShowPwd] = useState(false);

  const handleSignIn = async () => {
    await Login(dispatch, formdata);
  };
  useEffect(() => {
    if (userInfo && token) {
      navigate("/");
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} sm={6} md={4}>
        <Box boxShadow={3} p={4} borderRadius={4} style={{ margin: "0 20px" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Ares Admin Panel
          </Typography>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                onChange={(e) =>
                  setFormdata({ ...formdata, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs>
              <FormControl variant="outlined" fullWidth>
                <InputLabel
                  label="Password"
                  variant="outlined"
                  fullWidth
                  htmlFor="outlined-adornment-password"
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setFormdata({ ...formdata, password: e.target.value })
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </Grid>
            <Grid item xs>
              <Button
                variant="contained"
                size="large"
                color="primary"
                disabled={isFetching}
                onClick={handleSignIn}
                fullWidth
              >
                {isFetching ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
