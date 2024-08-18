import {
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import {
  Box,
  Divider,
  InputAdornment,
  OutlinedInput,
  TextField,
  colors,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { useResponsiveness } from "../hooks/useResponsiveness";

export default function ActivityForm({
  type,
  label,
  options,
  onDelete,
  onEdit,
  index,
  isEditable,
  onCancel,
  onSave,
  isDrillInput,
}) {
  const [formData, setFormData] = useState({
    type,
    label,
    options,
  });
  const { theme } = useResponsiveness();
  // key: label.replace(/\s/g, ""),
  const isOptionsVisible =
    formData.type === "multipleChoice" || formData.type === "checkBox";
  const isEditableOn = isEditable !== index;

  useEffect(() => {
    setFormData({ type, label, options: options?.length ? options : [""] });
  }, [type, label, options]);

  return (
    <Box
      style={{
        backgroundColor: "white",
        display: "grid",
        gridTemplateColumns: "1fr 0.5fr",
      }}
    >
      {/* question */}
      {/* <Grid style={{display:"flex", alignItems:"center", justifyContent:"start", gridColumnStart:1, gridColumnEnd:4}}>
        <Typography variant='h6' style={{ fontSize:"1rem"}} >{`Q${index + 1}`}</Typography>
      </Grid> */}
      <Grid>
        <FormControl required fullWidth>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{`${
                  !isDrillInput ? "Q" : ""
                } ${index + 1}`}</InputAdornment>
              ),
              disableUnderline: true,
            }}
            style={{
              borderRadius: "0.5rem",
              backgroundColor: colors.grey[100],
              padding: "1rem",
              marginRight: "3%",
            }}
            disabled={isEditableOn}
            variant="standard"
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
            placeholder={isDrillInput ? "Enter Input " : "Enter Question"}
          />
        </FormControl>
      </Grid>
      {/* select question type */}
      <Grid>
        <FormControl required fullWidth>
          <Select
            labelId="demo-simple-select-filled-label"
            label="Select-Question-Type"
            id="demo-simple-select-filled"
            placeholder="Select Question Type"
            variant="standard"
            disableUnderline
            disabled={isEditableOn}
            style={{
              borderRadius: "0.5rem",
              backgroundColor: colors.grey[100],
              padding: "1rem",
              color: theme.palette.primary.main,
            }}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value={"multipleChoice"}>Multiple Choice</MenuItem>
            <MenuItem value={"checkBox"}>Check Box (Single Choice)</MenuItem>
            <MenuItem value={"text"}>Text Input</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid
        style={{
          backgroundColor: colors.grey[100],
          borderRadius: "0.5rem",
          padding: "1rem",
          display: "flex",
          gap: "0.5rem",
          flexDirection: "column",
          marginBlock: "2%",
          gridColumnStart: "1",
          gridColumnEnd: "4",
        }}
      >
        {formData.options &&
          isOptionsVisible &&
          formData.options?.map((opt, i) => (
            <OutlinedInput
              key={i}
              disabled={isEditableOn}
              id="outlined-adornment-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    disabled={isEditableOn}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        options: prev.options?.filter(
                          (_, index) => index !== i
                        ),
                      }));
                    }}
                    style={{ padding: 0 }}
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              }
              startAdornment={
                <InputAdornment position="start">
                  <IconButton disabled={isEditableOn} style={{ padding: 0 }}>
                    {formData.type === "multipleChoice" ? (
                      <CheckBoxIcon color="primary" />
                    ) : (
                      <RadioButtonCheckedIcon color="primary" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              value={opt}
              fullWidth
              style={{ backgroundColor: "white" }}
              sx={{
                border: "none",
                "& fieldset": { border: "none" },
              }}
              placeholder="New Option"
              onChange={(e) => {
                const newVal = e.target.value;
                setFormData((prev) => {
                  const updatedOptions = [...prev.options];
                  updatedOptions[i] = newVal;
                  return { ...prev, options: updatedOptions };
                });
              }}
            />
          ))}
        {isOptionsVisible && (
          <>
            <Button
              style={{
                width: "fit-content",
                textTransform: "none",
              }}
              color="primary"
              disableRipple
              disabled={isEditableOn}
              onClick={() =>
                setFormData((prev) => {
                  return {
                    ...prev,
                    options:
                      prev.options && prev.options.length
                        ? [...prev.options, ""]
                        : [""],
                  };
                })
              }
            >
              Add another option
            </Button>
            <Divider sx={{ marginBlock: "1%" }} />
          </>
        )}

        {!isEditableOn ? (
          <div style={{ display: "flex", justifyContent: "end", gap: "2%" }}>
            <IconButton
              style={{
                backgroundColor: colors.blue[50],
                borderRadius: "0.5rem",
              }}
              onClick={() => {
                if (formData.type === "text") {
                  const { options, ...data } = formData;
                  onSave(index, data);
                } else {
                  onSave(index, formData);
                }
              }}
            >
              <CheckIcon color="primary" />
            </IconButton>
            <IconButton
              style={{
                backgroundColor: colors.orange[50],
                borderRadius: "0.5rem",
              }}
              onClick={() => {
                onCancel();
                setFormData({ type, label, options });
              }}
            >
              <CloseIcon color="warning" />
            </IconButton>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "end", gap: "2%" }}>
            <IconButton
              style={{
                backgroundColor: colors.blue[50],
                borderRadius: "0.5rem",
              }}
              onClick={() => onEdit(index)}
            >
              <EditIcon color="primary" />
            </IconButton>
            <IconButton
              style={{
                backgroundColor: colors.red[50],
                borderRadius: "0.5rem",
              }}
              onClick={() => onDelete(index)}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </div>
        )}
      </Grid>
    </Box>
  );
}
