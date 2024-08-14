import { Box, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";

export default function CustomModal({ open, onClose, style,children }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{left:"50%", top:"50%", transform:"translate(-50%,-50%)", position:"absolute", ...style}}>
        {children}
      </Box>
    </Modal>
  );
}
