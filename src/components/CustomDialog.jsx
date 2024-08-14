import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function CustomDialog({
  onClose,
  open,
  title,
  captain,
  onAgree,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {captain}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={onAgree} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
