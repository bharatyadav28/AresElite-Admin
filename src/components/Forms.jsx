import React, { useState, Fragment } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Divider,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import ActivityForm from "../components/ActivityForm";
import { useResponsiveness } from "../hooks/useResponsiveness";

const Forms = ({
  isLoading,
  title,
  onSubmit,
  isSubmiting,
  getData,
  formElements,
  setFormElements,
  isDrillInput,
}) => {
  const [isEditableIndex, setIsEditableIndex] = useState(null);
  const { sm, md, xs, lg, theme } = useResponsiveness();

  return (
    <Box
      color="red"
      sx={{ margin: "2%", marginTop: isDrillInput ? "0" : "2%" }}
    >
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
        >
          {!isDrillInput && title}
        </Typography>

        {/* {isDrillInput && (
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
                  // onChange={handleChangeDone}
                  // value={selectedOption}
                >
                  {["sdsd", "dsdsd"]?.map((doc, i) => (
                    <MenuItem key={i} value={doc}>
                      {doc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        )} */}

        <Box
          sx={{ bgcolor: "white", borderRadius: "1rem" }}
          style={{ paddingBlock: "2%" }}
        >
          {/* Questions */}
          <Box>
            <Typography
              variant="h5"
              sx={{ display: "flex" }}
              style={{
                marginInline: "2%",
                marginBottom: "2%",
                fontWeight: "500",
              }}
            >
              {isDrillInput ? "Drill Inputs" : "Questions"}
            </Typography>

            <Box
              sx={{
                // display: "grid",
                // gridTemplateColumns: md ? "1fr" : "1fr 1fr",
                display: "flex",
                justifyContent: "center",
              }}
              style={{
                paddingInline: xs
                  ? "1%"
                  : sm
                  ? "2%"
                  : md
                  ? "4%"
                  : lg
                  ? "6%"
                  : 0,
              }}
            >
              <Box style={{ width: "75%" }}>
                {formElements?.map((el, i) => {
                  return (
                    <Fragment key={i}>
                      <ActivityForm
                        label={el.label}
                        type={el.type}
                        options={el.options}
                        unit={el?.unit || ""}
                        isEditable={isEditableIndex}
                        index={i}
                        onDelete={(index) => {
                          setFormElements((prevEl) => {
                            let updatedElements = [...prevEl];
                            updatedElements = updatedElements.filter(
                              (_, i) => i !== index
                            );
                            return updatedElements;
                          });
                        }}
                        onEdit={(index) => {
                          setIsEditableIndex(index);
                        }}
                        onCancel={() => setIsEditableIndex(null)}
                        onSave={(index, data) => {
                          data = {
                            ...data,
                            key: data.label.replace(/\s/g, ""),
                          };
                          const updatedFormElements = [...formElements];
                          updatedFormElements[index] = data;
                          setFormElements(updatedFormElements);
                          setIsEditableIndex(null);
                        }}
                        isDrillInput={isDrillInput ? isDrillInput : false}
                      />
                      <Divider
                        sx={{ marginBlock: "0.8rem", borderWidth: "0.1rem" }}
                      />
                    </Fragment>
                  );
                })}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "5%",
                  }}
                >
                  <Button
                    disableElevation
                    variant="contained"
                    color="primary"
                    style={{
                      paddingInline: "5%",
                      paddingBlock: "1%",

                      textTransform: "none",
                      fontSize: lg ? "0.9rem" : "1.1rem",
                      borderRadius: "0.5rem",
                      width: "80%",
                      maxWidth: "25rem",
                    }}
                    onClick={() => {
                      const newObj = {
                        type: "",
                        label: "",
                        options: [""],
                        key: "",
                      };
                      setFormElements([...formElements, newObj]);
                    }}
                    disabled={isLoading}
                  >
                    {isDrillInput ? "Add new Input" : "Add new Question"}
                  </Button>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "white",
                    display: "flex",
                    gap: "0.5rem",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "4%",
                  }}
                >
                  <Button
                    disableElevation
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    style={{
                      paddingInline: "5%",
                      paddingBlock: "1%",
                      textTransform: "none",
                      fontSize: lg ? "0.9rem" : "1.1rem",
                      width: lg ? "40%" : "50%",
                      borderRadius: "0.5rem",
                      maxWidth: "15rem",
                    }}
                    onClick={onSubmit}
                  >
                    {isSubmiting ? (
                      <CircularProgress size={sm ? 24 : 30} />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <Button
                    disableElevation
                    variant="contained"
                    color="primary"
                    disabled={isLoading || isSubmiting}
                    style={{
                      // color: theme.palette.primary.main,
                      paddingInline: "5%",
                      paddingBlock: "1%",
                      textTransform: "none",
                      fontSize: lg ? "0.9rem" : "1.1rem",

                      width: lg ? "40%" : "50%",
                      borderRadius: "0.5rem",
                      maxWidth: "15rem",
                    }}
                    onClick={getData}
                  >
                    {isLoading ? (
                      <CircularProgress size={sm ? 24 : 30} />
                    ) : (
                      "Cancel"
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Forms;
