import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  LinearProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

import Forms from "../components/Forms";
import { GetAllDynamicDrills, UpdateDynamicDrill } from "../Redux/ApiCalls";

function DrillInputs() {
  const [formElements, setFormElements] = useState([]);
  const [selectedDrill, setSelectedDrill] = useState("");

  const { isFetching, dynamicDrills } = useSelector(
    (state) => state.dynamicDrills
  );

  const dispatch = useDispatch();

  const getOptionLabel = (option) => {
    return option.drillName;
  };

  const getOptionValue = (option) => {
    return option._id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...selectedDrill, inputs: formElements };
    UpdateDynamicDrill(dispatch, data, data._id);
  };

  const fetchData = useCallback(async () => {
    GetAllDynamicDrills(dispatch);
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (selectedDrill) {
      const drill = dynamicDrills.find((drill) => {
        return drill.drillName === selectedDrill.drillName;
      });

      setFormElements(drill.inputs);
    }
  }, [selectedDrill, dynamicDrills]);

  console.log("formElements", formElements);

  return (
    <div>
      <Box
        color="red"
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "2%",
          marginBottom: "1%",
        }}
      >
        {isFetching && <LinearProgress />}
        <Typography
          variant="h4"
          sx={{ display: "flex" }}
          style={{ marginBlock: "1.5%", fontWeight: "500" }}
          color={"primary"}
        >
          Drill Input Form
        </Typography>

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
            color={"primary"}
          >
            Drill Name
          </Typography>

          <Box style={{ textAlign: "center", marginBottom: "2rem" }}>
            <FormControl
              fullWidth
              variant="outlined"
              margin="normal"
              style={{ maxWidth: "30rem" }}
            >
              <InputLabel>Drill Name</InputLabel>
              <Select
                label="Drill Name"
                name="drillName"
                onChange={(event) => {
                  const value = event.target.value;
                  const selectedDrill = dynamicDrills.find(
                    (drill) => drill._id === value
                  );
                  setSelectedDrill(selectedDrill);
                }}
                value={getOptionValue(selectedDrill) || ""}
              >
                {dynamicDrills?.map((drill, i) => (
                  <MenuItem key={i} value={getOptionValue(drill)}>
                    {getOptionLabel(drill)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
      {selectedDrill && (
        <Forms
          isLoading={isFetching}
          isSubmiting={isFetching}
          formElements={formElements}
          setFormElements={setFormElements}
          onSubmit={handleSubmit}
          title={"Drill Input Form"}
          getData={fetchData}
          isDrillInput={true}
        />
      )}
    </div>
  );
}

export default DrillInputs;
