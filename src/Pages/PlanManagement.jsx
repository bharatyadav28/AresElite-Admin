import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../utils/axiosUtil";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
const PlanManagement = () => {
  const token = localStorage.getItem("token");
  const [plans, setPlans] = useState([]);
  const [newPlanOpen, setNewPlanOpen] = useState(false);
  const [editPlanOpen, setEditPlanOpen] = useState(false);
  const [planPhaseCount, setPlanPhaseCount] = useState(1);
  const [newPlan, setNewPlan] = useState({
    name: "",
    phases: [],
    features: [],
    recurring: true,
    validity: 0,
    oneTimeCharge: false,
  });
  console.log(newPlan.oneTimeCharge)
  const [editPlan, setEditPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState([]);
  const [featureText, setFeatureText] = useState("");

  // Fetch the list of plans from the API
  const fetchPlans = async () => {
    try {
      const { data } = await axiosInstance.get("/api/admin/plans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlans(data.plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Function to handle adding new plan
  const handleNewPlanOpen = () => {
    setNewPlanOpen(true);
    setNewPlan({
      name: "",
      phases: [{ name: "", duration: 0, cost: 0 }], // Start with one phase by default
      features: [],
      recurring: true,
      validity: 0,
      oneTimeCharge: false,
    });
    setPlanPhaseCount(1);
    setFeatures([]);
  };

  // Function to handle closing new plan modal
  const handleNewPlanClose = () => {
    setNewPlanOpen(false);
    setLoading(false);
  };

  // Handle opening edit plan dialog
  const handleEditPlanOpen = async (planId) => {
    setEditPlanOpen(true);
    try {
      const { data } = await axiosInstance.get(`/api/admin/plan/${planId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditPlan(data.plan);
      setPlanPhaseCount(data.plan.phases.length);
      setFeatures(data.plan.features);
    } catch (error) {
      console.error("Error fetching plan details:", error);
    }
  };

  const handleEditPlanClose = () => {
    setEditPlanOpen(false);
    setLoading(false);
  };

  // Add new feature
  const handleAddFeature = () => {
    if (featureText.trim() !== "") {
      setFeatures((prevFeatures) => [...prevFeatures, featureText]);
      setFeatureText("");
    }
  };

  // Delete a feature
  const handleDeleteFeature = (index) => {
    setFeatures((prevFeatures) => prevFeatures.filter((_, i) => i !== index));
  };

  // Update the newPlan object with phase values
  const handlePhaseCountChange = (e) => {
    const inputValue = e.target.value;

    // Convert input to integer, ensure it's a positive number
    let count = parseInt(inputValue, 10);

    // If the input is not a valid number or negative, reset to 0
    if (isNaN(count) || count < 0) {
      count = 0;
    }

    setPlanPhaseCount(count);

    // Initialize phases if not already initialized
    const phases = newPlan.phases ? [...newPlan.phases] : [];

    // Add new phases if the count is larger than the current phases array
    if (count > phases.length) {
      for (let i = phases.length; i < count; i++) {
        phases.push({ name: "", duration: 0, cost: 0 });
      }
    }
    // Remove extra phases if the count is smaller than the current phases array
    else if (count < phases.length) {
      phases.splice(count, phases.length - count);
    }

    // Set the new phase count and updated phases array
    setNewPlan({ ...newPlan, phases });
  };


  const handlePhaseChange = (index, field, value) => {
    const updatedPhases = [...newPlan.phases];

    // Ensure the phase at this index exists
    if (updatedPhases[index]) {
      updatedPhases[index][field] = value;
      setNewPlan({ ...newPlan, phases: updatedPhases });
    }
  };


  // Handle submission of new plan
  const handleNewPlanSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const planData = {
      ...newPlan,
      features,
    };

    try {
      await axiosInstance.post("/api/admin/plans", planData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPlans();
      handleNewPlanClose();
    } catch (error) {
      console.error("Error adding plan:", error);
      setLoading(false);
    }
  };

  const handleEditPlanSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    const phases = [];
    for (let i = 0; i < planPhaseCount; i++) {
      phases.push({
        name: formJson[`phaseName${i}`],
        duration: formJson[`phaseDuration${i}`],
        cost: formJson[`phaseCost${i}`],
      });
    }

    const updatedPlanData = {
      name: formJson.name,
      oneTimeCharge: formJson.oneTimeCharge === true,
      recurring: formJson.recurring === true,
      validity: formJson.validity,
      phases,
      features,
    };

    console.log("Updated plan data", updatedPlanData)

    try {
      await axiosInstance.put(`/api/admin/plans`, { data: updatedPlanData }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { planId: editPlan._id }
      });
      fetchPlans();
      handleEditPlanClose();
    } catch (error) {
      console.error("Error updating plan:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h3" style={{ paddingTop: "1rem", marginLeft: "2rem" }}>
        Plans Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        style={{ position: "absolute", top: "6rem", right: "2rem" }}
        onClick={handleNewPlanOpen}
      >
        Add Plan
      </Button>

      <Container maxWidth="xl" sx={{ paddingBlock: "2rem" }}>
        <Box sx={{ gap: "10px", display: "flex", flexWrap: "wrap" }}>
          {plans.length === 0 ? (
            <Typography variant="h5" color="textSecondary">
              No plans available. Add a new plan to get started.
            </Typography>
          ) : (
            plans.map((plan, index) => (
              <Box key={index} flexGrow={1}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "30px 16px",
                    background: "white",
                    height: "100%",
                    borderRadius: "16px",
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Typography variant="h3" style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {plan.name}
                    </Typography>
                    {plan.phases.map((phase, index) => (
                      <Box key={index} marginBlock={"4%"}>
                        <Typography variant="subtitle2">{phase.name}</Typography>
                        <Typography variant="h5" color="primary" style={{ fontSize: '3rem', fontWeight: '800' }}>
                          ${phase.cost} <span style={{ fontSize: '1rem', fontWeight: '800' }}>per Month</span>
                        </Typography>
                      </Box>
                    ))}
                    <Box sx={{ margin: "62px 0px" }}>
                      <List>
                        {plan.features.map((feature, index) => (
                          <ListItem disablePadding key={index} disableGutters>
                            <ListItemIcon>
                              <CheckCircleIcon color="disabled" />
                            </ListItemIcon>
                            <ListItemText
                              primary={feature}
                              style={{ color: "#8C90AA", fontSize: "16px" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Box>
                  {/* <Typography variant="h6">Features:</Typography> */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditPlanOpen(plan._id)}
                  >
                    Update Plan
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Container >

      {/* Add New Plan Dialog */}
      <Dialog Dialog open={newPlanOpen} onClose={handleNewPlanClose} >
        <DialogTitle>Add New Plan</DialogTitle>
        <DialogContent>
          <form id="newPlanForm" onSubmit={handleNewPlanSubmit}>
            <TextField
              required
              id="name"
              name="name"
              label="Plan Name"
              fullWidth
              margin="normal"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
            />
            <TextField
              required
              id="validity"
              name="validity"
              label="Validity (Months)"
              type="number"
              fullWidth
              margin="normal"
              value={newPlan.validity}
              onChange={(e) => setNewPlan({ ...newPlan, validity: e.target.value })}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="oneTimeCharge"
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setNewPlan((prevPlan) => ({
                      ...prevPlan,
                      oneTimeCharge: isChecked,
                    }));
                    console.log("Checkbox is checked:", isChecked);
                  }}
                  checked={newPlan.oneTimeCharge}
                />
              }
              label="One-Time Charge (Select for Novice plan)"
            />
            <TextField
              required
              id="phaseCount"
              name="phaseCount"
              label="Number of Phases"
              type="number"
              fullWidth
              margin="normal"
              value={planPhaseCount}
              onChange={handlePhaseCountChange}
            />

            {[...Array(planPhaseCount)].map((_, i) => (
              <div key={i}>
                <TextField
                  required
                  id={`phaseName${i}`}
                  name={`phaseName${i}`}
                  label={`Phase ${i + 1} Name`}
                  fullWidth
                  margin="normal"
                  value={newPlan.phases[i]?.name || ""} // Safely access name
                  onChange={(e) => handlePhaseChange(i, "name", e.target.value)}
                />
                <TextField
                  required
                  id={`phaseDuration${i}`}
                  name={`phaseDuration${i}`}
                  label={`Phase ${i + 1} Duration (Months)`}
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newPlan.phases[i]?.duration} // Safely access duration
                  onChange={(e) => handlePhaseChange(i, "duration", e.target.value)}
                />
                <TextField
                  required
                  id={`phaseCost${i}`}
                  name={`phaseCost${i}`}
                  label={`Phase ${i + 1} Cost`}
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newPlan.phases[i]?.cost} // Safely access cost
                  onChange={(e) => handlePhaseChange(i, "cost", e.target.value)}
                />
              </div>
            ))}


            <Typography variant="h6">Features:</Typography>
            {features.map((feature, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2">{feature}</Typography>
                <IconButton onClick={() => handleDeleteFeature(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <TextField
              value={featureText}
              onChange={(e) => setFeatureText(e.target.value)}
              label="Add Feature"
              fullWidth
            />
            <Button onClick={handleAddFeature}>Add Feature</Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewPlanClose}>Cancel</Button>
          <Button type="submit" form="newPlanForm" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog >
      {/* Edit Plan Dialog */}
      {
        editPlan && (
          <Dialog open={editPlanOpen} onClose={handleEditPlanClose}>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogContent>
              <form id="editPlanForm" onSubmit={handleEditPlanSubmit}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="Plan Name"
                  defaultValue={editPlan.name}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  required
                  id="validity"
                  name="validity"
                  label="Validity (Months)"
                  type="number"
                  defaultValue={editPlan.validity}
                  fullWidth
                  margin="normal"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="oneTimeCharge"
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setNewPlan((prevPlan) => ({
                          ...prevPlan,
                          oneTimeCharge: isChecked, // Update oneTimeCharge value in the state
                        }));
                        console.log("Checkbox is checked:", isChecked);
                      }}
                      checked={newPlan.oneTimeCharge} // Reflect current value in checkbox
                    />
                  }
                  label="One-Time Charge (Select for Novice plan)"
                />
                <TextField
                  required
                  id="phaseCount"
                  name="phaseCount"
                  label="Number of Phases"
                  type="number"
                  fullWidth
                  margin="normal"
                  defaultValue={planPhaseCount}
                  onChange={(e) => setPlanPhaseCount(e.target.value)}
                />

                {editPlan.phases.map((phase, i) => (
                  <div key={i}>
                    <TextField
                      required
                      id={`phaseName${i}`}
                      name={`phaseName${i}`}
                      label={`Phase ${i + 1} Name`}
                      defaultValue={phase.name}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      required
                      id={`phaseDuration${i}`}
                      name={`phaseDuration${i}`}
                      label={`Phase ${i + 1} Duration (Months)`}
                      defaultValue={phase.duration}
                      type="number"
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      required
                      id={`phaseCost${i}`}
                      name={`phaseCost${i}`}
                      label={`Phase ${i + 1} Cost`}
                      defaultValue={phase.cost}
                      type="number"
                      fullWidth
                      margin="normal"
                    />
                  </div>
                ))}

                <Typography variant="h6">Features:</Typography>
                {features.map((feature, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2">{feature}</Typography>
                    <IconButton onClick={() => handleDeleteFeature(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <TextField
                  value={featureText}
                  onChange={(e) => setFeatureText(e.target.value)}
                  label="Add Feature"
                  fullWidth
                />
                <Button onClick={handleAddFeature}>Add Feature</Button>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEditPlanClose}>Cancel</Button>
              <Button type="submit" form="editPlanForm" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </DialogActions>
          </Dialog>
        )
      }
    </>
  );
};

export default PlanManagement;
