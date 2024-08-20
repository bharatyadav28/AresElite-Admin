import React, { useState, useEffect } from "react";
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
import Swal from "sweetalert2";

import CustomModal from "../components/Modal";
import axiosInstance from "../utils/axiosUtil";

const PageBox = ({
  title,
  selectedOption,
  handleChangeOption,
  options,
  isColumn,
  handleAddItem,
  handleUpdate,
  handleDelete,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [input, setInput] = useState("");

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  console.log("aaaaaaaaaaaaaaa", typeof selectedOption);

  console.log("soptions", selectedOption);
  return (
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
          {title}
        </Typography>

        <FormControl
          fullWidth
          variant="outlined"
          margin="normal"
          style={{ maxWidth: "30rem" }}
        >
          <InputLabel>{title}</InputLabel>
          <Select
            label={title}
            name="colValues"
            onChange={handleChangeOption}
            value={selectedOption || ""} // Keep the entire object as the selected value
          >
            {options?.map((doc, i) => (
              <MenuItem key={i} value={doc}>
                {" "}
                {isColumn ? doc.columnName : doc}
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
              setIsEdit(selectedOption);

              setInput(isColumn ? selectedOption.columnName : selectedOption);
            }}
          >
            <EditIcon color="primary" size="large" />
          </IconButton>
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
            label={isEdit ? `Edit ${title}` : `New ${title}`}
            variant="outlined"
            sx={{ width: "100%" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
                !isEdit && handleAddItem(input);
                isColumn && isEdit && handleUpdate(isEdit, input);
                !isColumn &&
                  isEdit &&
                  handleUpdate(input, "update", selectedOption);
                handleDialogClose();
              }}
              autoFocus
            >
              {isEdit ? "Update" : "Add"}
            </Button>

            {isEdit && (
              <Button
                onClick={() => {
                  console.log("success");
                  isColumn && handleDelete(isEdit);
                  !isColumn && handleDelete(selectedOption, "delete");
                  handleDialogClose();
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
};

function DrillColVal() {
  const [allColumns, setAllColumns] = useState([]);
  const [selectedcolumn, setSelectedColumn] = useState("");

  const [values, setValues] = useState([]);
  const [selectedValues, setSelectedValues] = useState("");

  console.log("Values", values);
  const token = localStorage.getItem("token");

  const getColVal = async () => {
    try {
      let url = `/api/admin/dynamic-drills/col`;

      const { data } = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllColumns(data?.columns);

      if (selectedcolumn) {
        const vdata = data?.columns.find(
          (item) => item._id === selectedcolumn._id
        );
        console.log("selcected column", selectedcolumn, vdata);
        setSelectedValues(vdata.values);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const handleColumnChange = (event) => {
    const selectedColumn = event.target.value;
    setSelectedColumn(selectedColumn);
    console.log("selectedc: ", selectedColumn);
  };

  const handleAddColumn = async (value) => {
    try {
      let url = `/api/admin/dynamic-drills/col`;

      await axiosInstance.post(
        url,
        { columnName: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Done...",
        text: "Column added successfully",
      });
      await getColVal();
    } catch (error) {
      console.log("error");
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: "Column addition failed",
      });
    }
  };

  const handleUpdateColumn = async (colObj, value) => {
    try {
      let url = `/api/admin/dynamic-drills/col/${colObj._id}`;

      await axiosInstance.put(
        url,
        { ...colObj, columnName: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Done...",
        text: "Column updated successfully",
      });

      await getColVal();
    } catch (error) {
      console.log("error");
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: "Column updation failed",
      });
    }
  };

  const handleDeleteColumn = async (colObj) => {
    try {
      let url = `/api/admin/dynamic-drills/col/${colObj._id}`;

      await axiosInstance.delete(
        url,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Done...",
        text: "Column  deleted successfully",
      });
      await getColVal();
    } catch (error) {
      console.log("error");
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: "Column deletion failed",
      });
    }
  };

  const handleUpdateValues = async (value, type, prevValue) => {
    try {
      let url = `/api/admin/dynamic-drills/col/${selectedcolumn._id}`;

      let data = "";

      if (type === "update") {
        const updatedValues = selectedcolumn.values.map((val) => {
          if (val === prevValue) {
            return value;
          }
          return val;
        });
        data = { ...selectedcolumn, values: updatedValues };
      } else if (type === "delete") {
        const updatedValues = selectedcolumn.values.filter((val) => {
          if (val !== value) {
            return value;
          }
        });
        data = { ...selectedcolumn, values: updatedValues };
      } else {
        data = { ...selectedcolumn, values: [...selectedcolumn.values, value] };
      }

      await axiosInstance.put(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Done...",
        text: "Values updated successfully",
      });
      await getColVal();
    } catch (error) {
      console.log("error");
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: "Values updation failed",
      });
    }
  };

  const handleValuesChange = (event) => {
    console.log("ddddd", event.target.value);
    setSelectedValues(event.target.value);
  };

  useEffect(() => {
    getColVal();
  }, []);

  useEffect(() => {
    setValues(selectedcolumn.values);
  }, [selectedcolumn]);

  console.log("selectedvalue", selectedValues);

  return (
    <Box color="red" sx={{ margin: "2%" }}>
      <PageBox
        title="Column Name"
        selectedOption={selectedcolumn}
        handleChangeOption={handleColumnChange}
        options={allColumns}
        isColumn={true}
        handleAddItem={handleAddColumn}
        handleUpdate={handleUpdateColumn}
        handleDelete={handleDeleteColumn}
      />
      {selectedcolumn && (
        <PageBox
          title="Column Values"
          selectedOption={selectedValues}
          handleChangeOption={handleValuesChange}
          options={values}
          isColumn={false}
          handleAddItem={handleUpdateValues}
          handleUpdate={handleUpdateValues}
          handleDelete={handleUpdateValues}
        />
      )}
    </Box>
  );
}

export default DrillColVal;
