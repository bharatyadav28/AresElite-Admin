import React, { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import {
  Typography,
  List,
  TextField,
  Button,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemText,
  ListItemIcon,
  LinearProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axiosInstance from "../utils/axiosUtil";

const PlanManagement = () => {
  const token = localStorage.getItem("token");
  const [open, setOpen] = React.useState(false);
  const [plan, setPlan] = useState({});
  const [plans, setPlans] = useState([]);
  const fetchPlans = async () => {
    const { data } = await axiosInstance.get("/api/admin/plans", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPlans(data.plans);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    const updatedPhases = [...plan.phases];
    updatedPhases.forEach((phase, index) => {
      updatedPhases[index] = {
        ...phase,
        name: formJson[`phaseName${index}`],
        duration: formJson[`phaseDuration${index}`],
        cost: formJson[`phaseCost${index}`],
      };
    });

    const updatedPlan = {
      ...plan,
      name: formJson.name,
      features: formJson.features.split("\n"),
      phases: updatedPhases,
    };

    setPlan(updatedPlan);
    const { data } = await axiosInstance.put(
      "/api/admin/plans",
      { data: updatedPlan },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          planId: updatedPlan._id,
        },
      }
    );
    setPlans(data.plans);
    handleClose();
  };

  const handleClickOpen = (index) => {
    setPlan(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography
        variant="h3"
        style={{ paddingTop: "1rem", marginLeft: "2rem" }}
      >
        Plans Management
      </Typography>
      <Container
        maxWidth="xl"
        sx={{
          height: "100vh",
          paddingBlock: "2rem",
          paddingInline: { xs: "3%", sm: "4%", md: "2%" },
        }}
      >
        <Box
          sx={{
            gap: "10px",
            display: "flex",
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {plans?.map((plan, index) => (
            <Box
              flexGrow={1}
              key={index}
              sx={{ marginBottom: { xs: "14%", sm: "10%" } }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  paddingBlock: "30px",
                  paddingInline: "16px",
                  background: "white",
                  height: "100%",
                  borderRadius: "16px",
                }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    style={{ fontSize: "18px", fontWeight: "bold" }}
                  >
                    {plan.name}
                  </Typography>
                  {plan?.phases.map((phase, index) => (
                    <Box key={index} marginBlock={"4%"}>
                      <Typography
                        variant="subtitle2"
                        style={{
                          textTransform: "uppercase",
                          marginBottom: "-0.5rem",
                        }}
                      >
                        {phase.name}
                      </Typography>
                      <Typography
                        variant="h5"
                        color="primary"
                        style={{
                          display: "inline",
                          fontWeight: "800",
                          fontSize: "40px",
                        }}
                      >
                        ${phase.cost}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        style={{ display: "inline" }}
                      >
                        per month
                      </Typography>
                    </Box>
                  ))}
                  <Typography variant="caption" style={{ color: "#8C90AA" }}>
                    Per user one time charge
                  </Typography>
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
                <Button
                  style={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "18px",
                  }}
                  variant="contained"
                  color="primary"
                  onClick={() => handleClickOpen(plan)}
                >
                  Update Plan
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
        {plans.length === 0 && <LinearProgress />}
      </Container>
      <Dialog
        open={open}
        onClose={handleClose}
        color="primary"
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Update Plan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change things you want to update
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Plan Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={plan?.name}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="features"
            name="features"
            label="Features"
            type="text"
            fullWidth
            variant="standard"
            multiline
            defaultValue={plan?.features?.join("\n")}
          />

          {plan?.phases?.map((phase, index) => (
            <Box
              key={index}
              sx={{
                border: "black solid 2px",
                padding: "12px",
                margin: "12px",
                borderRadius: "12px",
              }}
            >
              <TextField
                autoFocus
                required
                margin="dense"
                id={`phaseName${index}`}
                name={`phaseName${index}`}
                label={`Phase ${index + 1} Name`}
                type="text"
                fullWidth
                variant="standard"
                defaultValue={phase.name}
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id={`phaseDuration${index}`}
                name={`phaseDuration${index}`}
                label={`Phase ${index + 1} Duration`}
                type="text"
                fullWidth
                variant="standard"
                defaultValue={phase.duration}
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id={`phaseCost${index}`}
                name={`phaseCost${index}`}
                label={`Phase ${index + 1} Cost`}
                type="number"
                fullWidth
                variant="standard"
                defaultValue={phase.cost}
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlanManagement;
