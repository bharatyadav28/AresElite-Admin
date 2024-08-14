import { Box, Grid, Paper, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axiosInstance from "../utils/axiosUtil";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PaidIcon from "@mui/icons-material/Paid";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
          console.log("data: ", res.data);
          const cardsContent = [
            {
              count: res.data.activeUsers || 0,
              title: "Active Users",
              link: "/user_management",
              icon: <GroupAddIcon sx={{ fontSize: "4rem" }} />,
            },
            {
              count: res.data.totalAthletes,
              title: "Atheletes",
              link: "/user_management",
              icon: <GroupAddIcon sx={{ fontSize: "4rem" }} />,
            },
            {
              count: res.data.totalDoctors || 0,
              title: "Doctors",
              link: "/user_management",
              icon: <LocalHospitalIcon sx={{ fontSize: "4rem" }} />,
            },
            {
              count: res.data.totalTodaysAppointments,
              title: "Today's Appointments",
              link: "/bookings",
              icon: <LibraryBooksIcon sx={{ fontSize: "4rem" }} />,
            },
            {
              count: res.data.totalRevenue,
              title: "Month Revenue",
              link: "/transactions",
              icon: <PaidIcon sx={{ fontSize: "4rem" }} />,
            },
          ];
          setData(cardsContent);
        }
      } catch (err) {
        console.log("..error", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token]);

  return (
    <Paper
      sx={{
        bgcolor: "white",
        height: "100vh",
        margin: "0.6rem",
        borderRadius: "0.5rem",
        paddingInline: "3%",
        paddingBlock: "2%",
      }}
      elevation={5}
    >
      <Typography variant="h3">Dashboard</Typography>
      <Grid
        container
        sx={{
          marginTop: "2%",
          display: "flex",
          gap: "1%",
          flexWrap: "wrap",
        }}
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                width={"20rem"}
                height={250}
                key={i}
                sx={{ margin: 0, padding: 0 }}
              />
            ))
          : data.map((card, i) => {
              return (
                <Card
                  count={card.count}
                  index={i}
                  icon={card.icon}
                  title={card.title}
                  link={card.link}
                />
              );
            })}
      </Grid>
    </Paper>
  );
};

export default Dashboard;
