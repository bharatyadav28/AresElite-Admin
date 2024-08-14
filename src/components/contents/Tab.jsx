import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useResponsiveness } from "../../hooks/useResponsiveness";
import { useMemo, useRef } from "react";
import JoditEditor from "jodit-react";

const Update = ({
  text,
  onCancel,
  onSave,
  content,
  onContentChange,
  isSaving,
  isLoading,
}) => {
  const editor = useRef();
  const config = useMemo(
    () => ({
      readOnly: false,
      placeholder: "Write your content here...",
    }),
    []
  );
  return (
    <Box sx={{ height: "100vh", margin: "0.5rem" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" sx={{ paddingBlock: "1rem" }}>
          {text}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { sm: "row", xs: "column" },
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              onSave();
            }}
            sx={{ textTransform: "none", marginRight: { xs: 0, sm: "0.5rem" } }}
            startIcon={isSaving && <CircularProgress size={20} />}
            disabled={isSaving || isLoading}
          >
            Save Changes
          </Button>
          <Button
            variant="contained"
            onClick={onCancel}
            sx={{ textTransform: "none" }}
            color="warning"
            disabled={isLoading || isSaving}
          >
            Cancel
          </Button>
        </Box>
      </Box>
      <JoditEditor
        ref={editor}
        value={content?.text || ""}
        config={config}
        tabIndex={1}
        onChange={(newContent) => {
          onContentChange(newContent);
        }}
      />
    </Box>
  );
};

const ContentCard = ({
  role,
  onRoleChange,
  content,
  text,
  onEdit,
  onDelete,
  isLoading,
}) => {
  const { theme } = useResponsiveness();
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Typography variant="h4">{text}</Typography>
            <Box>
              <Select
                sx={{ minWidth: "10rem", borderRadius: "0.3rem" }}
                variant="outlined"
                disableUnderline
                value={role}
                onChange={(e) => onRoleChange(e.target.value)}
              >
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="athleteOnline">Athlete Online</MenuItem>
                <MenuItem value="athleteOffline">Athlete Offline</MenuItem>
              </Select>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2%",
            }}
          >
            <IconButton
              onClick={onEdit}
              sx={{ color: theme.palette.primary.main }}
              disabled={isLoading}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={onDelete}
              sx={{ color: theme.palette.error.main }}
              disabled={isLoading}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <CardContent>
          {content ? (
            <div
              style={{ maxHeight: "50vh", overflowY: "auto" }}
              dangerouslySetInnerHTML={{ __html: content?.text }}
            />
          ) : (
            <Typography variant="body1" sx={{ color: "grey", opacity: 0.5 }}>
              No Contents Added
            </Typography>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default function Tab({
  text,
  content,
  onContentChange,
  onDelete,
  onSave,
  onCancel,
  isEditing,
  onEdit,
  isSaving,
  isLoading,
  role,
  onRoleChange,
}) {
  return (
    <Paper sx={{ m: "0.5rem", borderRadius: "1rem" }} elevation={3}>
      {isEditing ? (
        <Update
          text={text}
          onCancel={onCancel}
          onSave={onSave}
          content={content}
          onContentChange={onContentChange}
          isSaving={isSaving}
          isLoading={isLoading}
        />
      ) : (
        <ContentCard
          content={content}
          text={text}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
          role={role}
          onRoleChange={onRoleChange}
        />
      )}
    </Paper>
  );
}
