import React, { useEffect } from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Pagination,
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import { useSelector, useDispatch } from "react-redux";

import { useResponsiveness } from "../hooks/useResponsiveness";
import CustomDialog from "../components/CustomDialog";
import {
  AddDynamicDrill,
  DeleteDynamicDrill,
  GetAllDynamicDrills,
  UpdateDynamicDrill,
} from "../Redux/ApiCalls";
import axiosInstance from "../utils/axiosUtil";

const DrillNameForm = ({
  isDialogOpen,
  handleDialogClose,
  isEdit,
  value,
  handleChangeValue,
  dynamicDrills,
  setIsEdit,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "15px",
  };

  const dispatch = useDispatch();
  const handleUpdateOrAdd = async () => {
    const data = dynamicDrills.find((drill) => {
      if (drill._id === isEdit) {
        return true;
      }
      return false;
    });

    isEdit
      ? UpdateDynamicDrill(dispatch, { ...data, drillName: value }, isEdit)
      : AddDynamicDrill(dispatch, { drillName: value });

    setIsEdit(false);
    handleDialogClose();
  };

  return (
    <Modal
      open={isDialogOpen}
      onClose={handleDialogClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} style={{ overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <Typography variant="h5">
            {" "}
            {isEdit ? "Edit Drill Name" : "Add Drill Name"}{" "}
          </Typography>
          <div>
            <TextField
              value={value}
              onChange={handleChangeValue}
              sx={{ width: "100%" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "1rem",
            }}
          >
            <Button onClick={handleDialogClose}>close</Button>
            <Button onClick={handleUpdateOrAdd} autoFocus>
              {isEdit ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

function DrillNames() {
  const { theme } = useResponsiveness();
  const [drills, setDrills] = useState([
    { name: "Virtual reality Neuro trainer" },
  ]);
  const [filterName, setFilterName] = useState(null);
  console.log("filterName:", filterName);
  const { isFetching, error, errorMsg, dynamicDrills } = useSelector(
    (state) => state.dynamicDrills
  );
  console.log("isFetching: ", isFetching);
  const dispatch = useDispatch();

  console.log("drills", dynamicDrills, isFetching);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [input, setInput] = useState("");

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setInput("");
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };
  const handleDeleteDialogOpen = (id) => {
    setIsDeleteDialogOpen(true);
  };

  useEffect(() => {
    GetAllDynamicDrills(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (filterName !== null) {
      const timeoutId = setTimeout(
        () => GetAllDynamicDrills(dispatch, filterName),
        200
      );
      return () => clearInterval(timeoutId);
    }
  }, [dispatch, filterName]);

  return (
    <>
      <Box sx={{ m: "2%" }}>
        <Typography variant="h3">Drill Names</Typography>
        <TableContainer
          elevation={0}
          sx={{
            borderRadius: "0.5rem",
            mt: "2rem",
            width: "max-content",
          }}
          component={Paper}
        >
          {isFetching && (
            <div>
              <LinearProgress />
            </div>
          )}

          <div
            style={{
              float: "left",
              //   backgroundColor: theme.palette.grey[100],
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
                gap: "1rem",
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
                  Search
                </Typography>
                <TextField
                  placeholder="Search by Name"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  sx={{ width: "15rem" }}
                />
              </Box>
            </Box>
          </div>
          <Divider sx={{ width: "100%", mb: "0.5rem" }} />

          <Table
            sx={{
              width: {
                xs: "100vw", // 100% of viewport width on mobile screens
                sm: "50rem", // Resets minWidth for screens larger than mobile
              },
              position: "relative",
            }}
            size="small"
            aria-label="a dense table"
          >
            <Box
              sx={{
                position: "absolute",
                right: 0,
                top: "-0.5rem",
                marginInline: "1rem",
              }}
            >
              <Button
                onClick={() => {
                  setIsDialogOpen(true);
                  setIsEdit(false);
                }}
                variant="contained"
                sx={{ textTransform: "none" }}
              >
                Add Drill Name
              </Button>
            </Box>

            <TableHead>
              <TableRow
                sx={{
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.01rem",
                    color: theme.palette.primary.main,
                    paddingBlock: "1rem",
                  }}
                >
                  Drill Name
                </TableCell>

                <TableCell sx={{ fontWeight: "bold", fontSize: "1.01rem" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                // !isLoading &&
                dynamicDrills.map((drill, index) => (
                  <TableRow key={index}>
                    <TableCell>{drill?.drillName}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          justifyItems: "center",
                        }}
                      >
                        <IconButton
                          sx={{
                            paddingLeft: 0,
                            paddingRight: "0.005 rem",
                          }}
                          onClick={() => {
                            setIsDialogOpen(true);
                            setIsEdit(drill._id);
                            setInput(drill.drillName);
                          }}
                        >
                          <EditIcon color="primary" />
                        </IconButton>

                        <IconButton
                          onClick={() => {
                            handleDeleteDialogOpen();
                            setIsEdit(drill._id);
                          }}
                          sx={{
                            paddingLeft: "0.1rem",
                            marginRight: "0.1rem",
                          }}
                        >
                          <DeleteIcon color="secondary" />

                          {/* {deletingId === row._id ? (
                  <CircularProgress size={20} color="secondary" />
                ) : (
                  <DeleteIcon color="secondary" />
                )} */}
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "end",
              marginTop: "10px",
            }}
          >
            <Pagination
              count={10}
              //   page={filterData.currentPage}
              //   onChange={(_, v) =>
              //     setFilterData({ ...filterData, currentPage: v })
              //   }
              variant="outlined"
              color="primary"
            />
          </Box>
        </TableContainer>

        <DrillNameForm
          isDialogOpen={isDialogOpen}
          handleDialogClose={handleDialogClose}
          isEdit={isEdit}
          value={input}
          handleChangeValue={(e) => setInput(e.target.value)}
          dynamicDrills={dynamicDrills}
          setIsEdit={setIsEdit}
        />

        <CustomDialog
          onClose={handleDeleteDialogClose}
          open={isDeleteDialogOpen}
          title="Are you sure?"
          captain="You want to delete this Drill?"
          onAgree={() => {
            DeleteDynamicDrill(dispatch, isEdit, setIsEdit);
            handleDeleteDialogClose();
          }}
        />
      </Box>
    </>
  );
}

export default DrillNames;
