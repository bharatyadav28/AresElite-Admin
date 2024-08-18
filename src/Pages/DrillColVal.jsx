import React, { useState } from "react";

import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  Button,
  Divider,
  TextField,
  colors,
} from "@mui/material";

function DrillColVal() {
  const [formElements, setFormElements] = useState([]);
  return (
    <Box color="red" sx={{ margin: "2%" }}>
      {" "}
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "1rem",
          marginBottom: "3rem",
        }}
        style={{ paddingBlock: "2%" }}
      >
        <Typography
          variant="h5"
          sx={{ display: "flex" }}
          style={{
            marginInline: "2%",
            marginBottom: "2%",
            fontWeight: "500",
          }}
        >
          Column Name
        </Typography>

        <Box style={{ textAlign: "center", marginBottom: "2rem" }}>
          <FormControl
            fullWidth
            variant="outlined"
            margin="normal"
            style={{ maxWidth: "30rem" }}
          >
            <InputLabel>Column Name</InputLabel>
            <Select
              label="Column Name"
              name="colName"
              // onChange={handleChangeDone}
              // value={selectedOption}
            >
              {["sdsd", "dsdsd"]?.map((doc, i) => (
                <MenuItem key={i} value={doc}>
                  {doc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "1rem",
            marginBottom: "3rem",
          }}
          style={{ paddingBlock: "2%" }}
        >
          <Typography
            variant="h5"
            sx={{ display: "flex" }}
            style={{
              marginInline: "2%",
              marginBottom: "2%",
              fontWeight: "500",
            }}
          >
            Column Values
          </Typography>

          <ul
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              listStyle: "none",
            }}
          >
            {formElements?.map((element, index) => {
              return (
                <li>
                  {/* <OutlinedInput />{" "} */}
                  {/* <TextField
                    style={{
                      //   borderRadius: "0.5rem",
                      backgroundColor: colors.grey[100],
                      padding: "1rem",
                    }}
                    // onChange={(e) => setActivityName(e.target.value)}
                    // value={activityName}
                    label="Input"
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
                  /> */}
                  <TextField
                    id="outlined-basic"
                    label="Input"
                    variant="outlined"
                  />
                </li>
              );
            })}
          </ul>
          <Box
            style={{
              paddingLeft: "3rem",
              paddingRight: "3rem",
              marginTop: "2.5rem",
            }}
          >
            <Divider
              sx={{
                marginBlock: "0.8rem",
                borderWidth: "0.1rem",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5%",
            }}
          >
            <Button
              disableElevation
              variant="contained"
              color="primary"
              style={{
                paddingInline: "5%",
                paddingBlock: "1%",

                textTransform: "none",
                fontSize: "1.1rem",
                borderRadius: "0.5rem",
                width: "80%",
                maxWidth: "25rem",
              }}
              onClick={() => {
                const newObj = {
                  type: "",
                  label: "",
                  options: [""],
                  key: "",
                };
                setFormElements([...formElements, newObj]);
              }}
              // disabled={isLoading}
            >
              Add new Value
            </Button>
          </Box>
          <Box
            sx={{
              backgroundColor: "white",
              display: "flex",
              gap: "0.5rem",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "4%",
            }}
          >
            <Button
              disableElevation
              variant="contained"
              color="primary"
              // disabled={isLoading}
              style={{
                paddingInline: "5%",
                paddingBlock: "1%",
                textTransform: "none",
                fontSize: "1.1rem",
                width: "50%",
                borderRadius: "0.5rem",
                maxWidth: "15rem",
              }}
              // onClick={onSubmit}
            >
              Submit
              {/* {isSubmiting ? (
                      <CircularProgress size={sm ? 24 : 30} />
                    ) : (
                      "Submit"
                    )} */}
            </Button>
            <Button
              disableElevation
              variant="contained"
              color="primary"
              // disabled={isLoading || isSubmiting}
              style={{
                // color: theme.palette.primary.main,
                paddingInline: "5%",
                paddingBlock: "1%",
                textTransform: "none",
                fontSize: "1.1rem",

                width: "50%",
                borderRadius: "0.5rem",
                maxWidth: "15rem",
              }}
              // onClick={getData}
            >
              Cancel
              {/* {isLoading ? (
                      <CircularProgress size={sm ? 24 : 30} />
                    ) : (
                      "Cancel"
                    )} */}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default DrillColVal;
