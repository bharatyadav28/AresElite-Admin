import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DrawIcon from "@mui/icons-material/Draw";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PaidIcon from "@mui/icons-material/Paid";
import SourceIcon from "@mui/icons-material/Source";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PolicyIcon from "@mui/icons-material/Policy";
import HandshakeIcon from "@mui/icons-material/Handshake";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TaskIcon from "@mui/icons-material/Task";
import SportsHockeyIcon from "@mui/icons-material/SportsHockey";

import { Link } from "react-router-dom";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import TrainingSessionManagement from "../Pages/TrainingSessionManagement";
import DrillNames from "../Pages/DrillNames";

export default function Sidebar({ open, toggleDrawer }) {
  const adminRoutes = [
    {
      name: "Dashboard",
      link: "/",
      icon: <DashboardIcon color="primary" />,
    },
    {
      name: "User Management",
      link: "/user_management",
      icon: <SupervisedUserCircleIcon color="primary" />,
    },
    {
      name: "Clinics Management",
      link: "/clinics",
      icon: <LocalHospitalIcon color="primary" />,
    },
    {
      name: "Slots Management",
      link: "/slots",
      icon: <WorkHistoryIcon color="primary" />,
    },
    {
      name: "Bookings Management",
      link: "/bookings",
      icon: <LibraryBooksIcon color="primary" />,
    },
    {
      name: "Transactions Management",
      link: "/transactions",
      icon: <PaidIcon color="primary" />,
    },
    {
      name: "Plans Management",
      link: "/plans",
      icon: <LibraryBooksIcon color="primary" />,
    },
    {
      name: "Contents",
      // link: "",
      icon: <SourceIcon color="primary" />,
      isExpandable: true,
      tabs: [
        {
          name: "Terms & Conditions",
          link: "/terms_conditions",
          icon: <HandshakeIcon color="primary" />,
        },
        {
          name: "Privacy Policy",
          link: "/privacy_policy",
          icon: <PolicyIcon color="primary" />,
        },
      ],
    },

    {
      name: "Service Management",
      link: "/service",
      icon: <DesignServicesIcon color="primary" />,
    },
    {
      name: "Training Session Management",
      link: "/training_session_management",
      icon: <MedicalInformationIcon color="primary" />,
    },
    {
      name: "Dynamic Drill",
      // link: "",
      icon: <AssignmentIcon color="primary" />,
      isExpandable: true,
      tabs: [
        {
          name: "Drill Names",
          link: "/drill-names",
          icon: <TaskIcon color="primary" />,
        },
        {
          name: "Drill Input Parameters",
          link: "/drill-inputs",
          icon: <DriveFileRenameOutlineIcon color="primary" />,
        },
        {
          name: "Fix Column/Value",
          link: "/drill-col-val",
          icon: <SportsHockeyIcon color="primary" />,
        },
      ],
    },
  ];

  const formRoutes = [
    {
      name: "Evaluation Form",
      link: "/eval-form",
      icon: <BorderColorIcon color="primary" />,
    },
    {
      name: "Prescription Form",
      link: "/pres-form",
      icon: <DrawIcon color="primary" />,
    },
    {
      name: "Diagnosis Form",
      link: "/diagnosis-form",
      icon: <DriveFileRenameOutlineIcon color="primary" />,
    },
    {
      name: "Drills Form",
      link: "/drills-form",
      icon: <DriveFileRenameOutlineIcon color="primary" />,
    },
  ];

  const ExpandableTab = ({ route }) => {
    return (
      <Accordion sx={{ width: "100%" }} elevation={0} disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="primary" />}
          sx={{ p: 0, m: 0 }}
          style={{ paddingRight: "1rem" }}
        >
          <ListItemButton>
            <ListItemIcon>{route.icon}</ListItemIcon>
            <ListItemText primary={route.name} />
          </ListItemButton>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0, m: 0 }}>
          <List sx={{ p: 0, m: 0 }}>
            {route.tabs.map((tab, i) => {
              return (
                <ListItemIcon key={i}>
                  <Link to={tab.link} onClick={toggleDrawer(false)}>
                    <ListItemButton>
                      <ListItemIcon>{tab.icon}</ListItemIcon>
                      <ListItemText primary={tab.name} />
                    </ListItemButton>
                  </Link>
                </ListItemIcon>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {adminRoutes.map((route, index) => (
          <ListItem key={index} disablePadding>
            {route.isExpandable ? (
              <ExpandableTab key={index} route={route} />
            ) : (
              <Link to={route.link} onClick={toggleDrawer(false)}>
                <ListItemButton>
                  <ListItemIcon>{route.icon}</ListItemIcon>
                  <ListItemText primary={route.name} />
                </ListItemButton>
              </Link>
            )}
          </ListItem>
        ))}
      </List>
      <Divider />
      <Typography
        variant="button"
        display="block"
        gutterBottom
        sx={{
          padding: "0 40px",
        }}
      >
        Forms Management
      </Typography>
      <List>
        {formRoutes.map((route, index) => (
          <ListItem key={index} disablePadding>
            <Link to={route.link} onClick={toggleDrawer(false)}>
              <ListItemButton>
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
