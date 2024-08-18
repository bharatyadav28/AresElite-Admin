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
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../components/Modal";

function DrillColVal() {
  const [formElements, setFormElements] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

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
              {["Name 1", "Name 2"]?.map((doc, i) => (
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

          <FormControl
            fullWidth
            variant="outlined"
            margin="normal"
            style={{ maxWidth: "30rem" }}
          >
            <InputLabel>Column Values</InputLabel>
            <Select
              label="Column Values"
              name="colValues"
              // onChange={handleChangeDone}
              // value={selectedOption}
            >
              {["Value 1", "Value 2"]?.map((doc, i) => (
                <MenuItem key={i} value={doc}>
                  {doc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{
              display: "flex",
              marginTop: "2rem",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <IconButton
              sx={{
                paddingLeft: 0,
                paddingRight: "0.005 rem",
              }}
              onClick={() => {
                setIsDialogOpen(true);
                setIsEdit(false);
              }}
            >
              <AddIcon color="secondary" size="large" />
            </IconButton>

            <IconButton
              sx={{
                paddingLeft: 0,
                paddingRight: "0.005 rem",
              }}
              onClick={() => {
                setIsDialogOpen(true);
                setIsEdit(true);
              }}
            >
              <EditIcon color="primary" size="large" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <CustomModal
        open={isDialogOpen}
        onClose={handleDialogClose}
        style={{
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "15px",
        }}
      >
        <Box>
          <TextField
            id="outlined-basic"
            label={isEdit ? "Edit Input" : "New Input"}
            variant="outlined"
            sx={{ width: "100%" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "1rem",
              marginTop: "3rem",
            }}
          >
            <Button onClick={handleDialogClose}>close</Button>
            <Button
              onClick={() => {
                console.log("success");
              }}
              autoFocus
            >
              {isEdit ? "Update" : "Add"}
            </Button>

            {isEdit && (
              <Button
                onClick={() => {
                  console.log("success");
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </Box>
      </CustomModal>
    </Box>
  );
}

export default DrillColVal;
