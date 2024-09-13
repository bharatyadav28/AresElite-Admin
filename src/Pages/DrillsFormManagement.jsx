import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import {
//   Box,
//   Typography,
//   Grid,
//   Button,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   CircularProgress,
// } from "@material-ui/core";
import { GetAllPlans } from "../Redux/ApiCalls";
import axiosInstance from "../utils/axiosUtil";
import {
  InputAdornment,
  LinearProgress,
  colors,
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Button,
} from "@mui/material";
import DrillActivityForm from "../components/DrillActivityForm";
import { useResponsiveness } from "../hooks/useResponsiveness";
import Swal from "sweetalert2";
import CustomDialog from "../components/CustomDialog";

const DrillsFormManagement = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { Plans, isFetching } = useSelector((state) => state.plan);
  const [phases, setPhases] = useState([]);
  const { sm, md, xs, lg, theme } = useResponsiveness();
  const [isEditableIndex, setIsEditableIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActivityDeleting, setIsActivityDeleting] = useState(false);
  const [formData, setFormData] = useState({
    plan: "",
    phase: "",
    week: "",
    day: "",
    activities: [],
  });
  const [id, setId] = useState("");

  const isFormEmpty =
    !formData.day || !formData.week || !formData.phase || !formData.plan;

  const handleChange = (event) => {
    let p = Plans.filter((plan) => plan.name === event.target.value);
    setFormData({ ...formData, plan: event.target.value });
    setPhases(p[0].phases);
  };

  const handleAddNewActivity = (index) => {
    const newActivity = {
      activityName: "",
      fileLinks: [],
      description: "",
      form: [
        {
          key: "",
          label: "",
          options: [""],
          type: "",
        },
      ],
    };
    setFormData((prevData) => {
      const updatedActivities = [...prevData.activities];
      updatedActivities.splice(index + 1, 0, newActivity);
      return { ...prevData, activities: updatedActivities };
    });
    setIsEditableIndex(index + 1);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsEditableIndex(null);
    try {
      const res = await axiosInstance.get("/api/admin/drill", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          day: formData.day.toString(),
          phase: formData.phase,
          plan: formData.plan,
          week: formData.week.toString(),
        },
      });
      console.log("get:", res.data.drill);
      if (res.data.drill.length) {
        setFormData(res.data.drill.at(-1));
        setId(res.data.drill.at(-1)._id);
      } else {
        setFormData({
          plan: formData.plan,
          phase: formData.phase,
          week: formData.week,
          day: formData.day,
          activities: [],
        });
        setId("");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [formData.day, formData.phase, formData.plan, formData.week, token]);

  const handleOneAcitivityDelete = async (index) => {
    let updatedActivities = [...formData.activities];
    updatedActivities = updatedActivities.filter((_, i) => i !== index);
    setFormData((prevData) => {
      return { ...prevData, activities: updatedActivities };
    });

    setIsSaving(true);
    try {
      const updateRes = await axiosInstance.put(
        "/api/admin/drill",
        {
          data: { ...formData, activities: updatedActivities },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id,
          },
        }
      );
      if (updateRes.data.success === true) {
        setIsEditableIndex(null);
      }
    } catch (e) {
      console.log(e);
      fetchData();
      Swal.fire({
        icon: "error",
        title: "Opps...",
        text: "Failed to delete activity...",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (index, data) => {
    if (!formData.plan || !formData.phase || !formData.week || !formData.day) {
      Swal.fire({
        icon: "error",
        title: "Opps...",
        text: "Plan , Phase, Week & Day is required to create an activity",
      });
      return;
    }

    let updatedActivities = [...formData.activities];
    const updatedFileLinks = data.fileLinks.map((link) => {
      if (link.type === "video" && !link.link) {
        return null;
      } else {
        return link;
      }
    });

    updatedActivities[index] = { ...data, fileLinks: updatedFileLinks };
    const updatedFormData = { ...formData, activities: updatedActivities };

    if (
      !updatedFormData.activities.every(
        (activity) => activity.activityName && activity.description
      )
    ) {
      Swal.fire({
        icon: "error",
        title: "Opps...",
        text: "Activity name and description is required to created a new activity",
      });
      return;
    }

    console.log("......activities saving:", updatedFormData);

    setIsSaving(true);

    setFormData(updatedFormData);

    try {
      const res = await axiosInstance.post(
        "/api/admin/set_drillform_form",
        {
          formdata: { ...formData, activities: updatedActivities },
          name: "Prescription",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("...saving", { ...formData, activities: updatedActivities });
      Swal.fire({
        icon: "success",
        title: "Done...",
        text: "Successfully created new activity",
      });
      setId(res.data.formNew._id);
      setIsEditableIndex(null);
    } catch (e) {
      console.log(e);
      if (
        !e.response.data.success &&
        e.response.data.error.message === "Already created"
      ) {
        try {
          const updateRes = await axiosInstance.put(
            "/api/admin/drill",
            {
              data: updatedFormData,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                id,
              },
            }
          );
          if (updateRes.data.success === true) {
            Swal.fire({
              icon: "success",
              title: "Done...",
              text: "Sucessfully updated the activity",
            });
            setIsEditableIndex(null);
          }
        } catch (e) {
          console.log(e);
          Swal.fire({
            icon: "error",
            title: "Opps...",
            text: "Failed to update activity...",
          });
        } finally {
          setIsSaving(false);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Opps...",
          text: "Failed to create activity...",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await GetAllPlans(dispatch);
    };
    fetch();
  }, [dispatch]);

  useEffect(() => {
    if (isFormEmpty) return;
    fetchData();
  }, [fetchData, isFormEmpty]);

  const handleDialogClose = () => setIsDeleteDialogOpen(false);
  const handleDialogOpen = () => setIsDeleteDialogOpen(true);

  const handleDeleteAllActivities = async () => {
    if (isDeleteDialogOpen) {
      handleDialogClose();
      setIsActivityDeleting(true);
      try {
        const res = await axiosInstance.delete("/api/admin/drill", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id,
          },
        });
        if (res.data.success) {
          fetchData();
          Swal.fire({
            icon: "success",
            title: "Done...",
            text: "Sucessfully deleted all the activities",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to deleted activity",
        });
      } finally {
        setIsActivityDeleting(false);
      }
    } else {
      handleDialogOpen();
    }
  };

  return (
    <Box color="red" sx={{ margin: "2%" }}>
      {/* <Box sx={{ paddingY: "2.5%", bgcolor: "white", borderRadius: "1rem" }}>
        {isLoading && <LinearProgress />}
      </Box> */}
      {isLoading && <LinearProgress />}
      <Box
        color="red"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h4"
          sx={{ display: "flex" }}
          style={{ marginBlock: "1.5%", fontWeight: "500" }}
          color="primary"
        >
          Drills Management
        </Typography>

        {/* selections */}
        <Box style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <Grid
            style={{
              paddingInline: xs
                ? "1%"
                : sm
                ? "2%"
                : md
                ? "4%"
                : lg
                ? "6%"
                : "12%",
              paddingBlock: "2%",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "space-between",
              gap: "3%",
              flexDirection: sm ? "column" : "row",
              flexWrap: "wrap",
              borderRadius: "1rem",
            }}
          >
            <Grid style={{ width: sm ? "100%" : "48%" }}>
              <InputLabel
                id="Select-Plan"
                style={{ fontWeight: "bold", marginBottom: "3%" }}
              >
                Select Plan <span style={{ color: "red" }}>*</span>
              </InputLabel>
              <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
                <Select
                  id="Select-Plan-required"
                  labelId="Select-Plan"
                  label="Select-Plan"
                  value={formData.plan}
                  onChange={handleChange}
                  disabled={isFetching || isLoading}
                  placeholder="Select Plan"
                  variant="standard"
                  disableUnderline
                  required
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    padding: "1rem",
                    color: theme.palette.primary.main,
                  }}
                  startAdornment={
                    isFetching && (
                      <InputAdornment position="start">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    )
                  }
                >
                  {Plans?.map((plan, index) => (
                    <MenuItem value={plan.name} key={index}>
                      {plan.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid style={{ width: sm ? "100%" : "48%" }}>
              <InputLabel
                id="Select-Phase"
                style={{
                  fontWeight: "bold",
                  marginBottom: "3%",
                  marginTop: sm ? "3%" : "",
                }}
              >
                Select Phase <span style={{ color: "red" }}>*</span>
              </InputLabel>
              <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
                <Select
                  labelId="Select-Phase"
                  label="Select-Phase"
                  id="Select-Phase-required"
                  placeholder="Select Plan"
                  variant="standard"
                  disableUnderline
                  required
                  value={formData.phase}
                  disabled={isFetching || isLoading}
                  onChange={(e) => {
                    setFormData({ ...formData, phase: e.target.value });
                  }}
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    padding: "1rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  {phases?.map((p, i) => (
                    <MenuItem key={i} value={p.name}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid style={{ width: sm ? "100%" : "48%" }}>
              <InputLabel
                id="Select-Week"
                style={{ fontWeight: "bold", marginBlock: "3%" }}
              >
                Select Week <span style={{ color: "red" }}>*</span>
              </InputLabel>
              <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
                <Select
                  labelId="Select-Week"
                  label="Select-Week"
                  id="Select-Week-required"
                  placeholder="Select Week"
                  variant="standard"
                  disableUnderline
                  required
                  value={formData.week}
                  disabled={isFetching || isLoading}
                  onChange={(e) => {
                    setFormData({ ...formData, week: e.target.value });
                  }}
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    padding: "1rem",
                    color: theme.palette.primary.main,
                  }}
                >
                  {Array.from({ length: 24 }, (_, index) => (
                    <MenuItem value={index + 1} key={index}>
                      {index + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid style={{ width: sm ? "100%" : "48%" }}>
              <InputLabel
                id="Select-Day"
                style={{ fontWeight: "bold", marginBlock: "3%" }}
              >
                Select Day <span style={{ color: "red" }}>*</span>
              </InputLabel>
              <FormControl required sx={{ m: 1, minWidth: 500 }} fullWidth>
                <Select
                  labelId="Select-Day"
                  label="Select-Day"
                  id="Select-Day-required"
                  placeholder="Select Day"
                  required
                  value={formData.day}
                  disabled={isFetching || isLoading}
                  onChange={(e) => {
                    setFormData({ ...formData, day: e.target.value });
                  }}
                  style={{
                    borderRadius: "0.5rem",
                    backgroundColor: colors.grey[100],
                    padding: "1rem",
                    color: theme.palette.primary.main,
                  }}
                  variant="standard"
                  disableUnderline
                >
                  <MenuItem value={1}>Day 1</MenuItem>
                  <MenuItem value={2}>Day 2</MenuItem>
                  <MenuItem value={3}>Day 3</MenuItem>
                  <MenuItem value={4}>Day 4</MenuItem>
                  <MenuItem value={5}>Day 5</MenuItem>
                  <MenuItem value={6}>Day 6</MenuItem>
                  <MenuItem value={7}>Day 7</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Activity */}
          {!formData.activities.length ? (
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Button
                color="primary"
                // variant="contained"
                onClick={() => handleAddNewActivity(0)}
              >
                Add New Activity
              </Button>
            </Box>
          ) : (
            <>
              {id && (
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  {/* <Button
                    color="primary"
                    variant="contained"
                    onClick={handleDeleteAllActivities}
                    style={{ textTransform: "none" }}
                    disabled={isActivityDeleting || isLoading}
                    startIcon={
                      isActivityDeleting && (
                        <CircularProgress
                          size={15}
                          style={{ color: theme.palette.secondary.light }}
                        />
                      )
                    }
                  >
                    Delete All Activities
                  </Button> */}
                </Box>
              )}
              {formData?.activities?.map((activity, i) => {
                return (
                  <DrillActivityForm
                    activity={activity}
                    index={i}
                    onSave={handleSubmit}
                    onEdit={(index) => {
                      setIsEditableIndex(index);
                    }}
                    isSaving={isSaving}
                    isEditable={isEditableIndex}
                    onCancel={fetchData}
                    onDelete={handleOneAcitivityDelete}
                    onAddNewActivity={handleAddNewActivity}
                  />
                );
              })}
            </>
          )}

          {/* saving  */}
          {isSaving && (
            <Box
              sx={{
                position: "fixed",
                right: 0,
                top: 0,
                margin: "2%",
              }}
            >
              <CircularProgress size={30} />
            </Box>
          )}
        </Box>
      </Box>
      <CustomDialog
        onClose={handleDialogClose}
        open={isDeleteDialogOpen}
        title="Are you sure?"
        captain="You want to delete all activities associated with this plan, phase,
          week and day?"
        onAgree={handleDeleteAllActivities}
      />
    </Box>
  );
};

export default DrillsFormManagement;
