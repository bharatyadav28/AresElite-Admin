import React, { useState, useEffect, useCallback } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import axiosInstance from "../utils/axiosUtil";
import Forms from "../components/Forms";
import Swal from "sweetalert2";

const DiagnosisformManagement = () => {
  const token = localStorage.getItem("token");
  const [formElements, setFormElements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [incomingData, setIncomingData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    await axiosInstance
      .post(
        "/api/admin/save_form",
        // { obj: formElements, name: "Diagnosis" },
        {
          name: "Diagnosis",
          serviceType: [{ service: selectedService, obj: formElements }],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (res) => {
        Swal.fire({
          icon: "success",
          title: "Done...",
          text: "Request successfully handled...",
        });
        const response = await axiosInstance.get("/api/admin/fetch_form", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            name: "Diagnosis",
          },
        });
        setIncomingData(response?.data.doc[0]?.serviceType);
      })
      .finally(() => setIsSubmiting(false));
  };

  console.log("....formaData", formElements);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/admin/fetch_form", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          name: "Diagnosis",
        },
      });
      const fetchedServices = response?.data.services.map((service) => {
        return {
          key: service.name,
          value: service._id,
        };
      });

      setIncomingData(response?.data.doc[0]?.serviceType);

      if (services.length === 0) {
        setServices(fetchedServices);
        setSelectedService(fetchedServices[0].value);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "oops...",
        text: "Request failed, try again some time...",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fEle = incomingData?.find((s) => s.service === selectedService);
    setFormElements(fEle?.obj || []);
  }, [selectedService, incomingData]);

  const menuTitle = (key) => {
    if (key === "Sports Vision Evaluation")
      return "Sports Vision Performance Evaluation";
    if (key === "Add Training Sessions") return "Training Sessions";

    return key;
  };

  const headContent = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div>Diagnosis Form</div>
      <div>
        <Box style={{ textAlign: "center" }}>
          <FormControl
            fullWidth
            variant="outlined"
            margin="normal"
            style={{ width: "22rem", backgroundColor: "white" }}
          >
            <InputLabel>Service Name</InputLabel>
            <Select
              label="Service Name"
              name="serviceName"
              onChange={(event) => {
                const value = event.target.value;
                setSelectedService(value);
                // const selectedDrill = dynamicDrills.find(
                //   (drill) => drill._id === value
                // );
                // setSelectedDrill(selectedDrill);
              }}
              value={selectedService || ""}
            >
              {services?.map((service, i) => (
                <MenuItem key={i} value={service.value}>
                  {/* {menuTitle(service.key)} */}
                  {service.key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
    </div>
  );

  return (
    <Forms
      isLoading={isLoading}
      isSubmiting={isSubmiting}
      formElements={formElements}
      setFormElements={setFormElements}
      onSubmit={handleSubmit}
      // title={"Diagnosis Form"}
      title={headContent}
      getData={fetchData}
    />
  );
};

export default DiagnosisformManagement;
