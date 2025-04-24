import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Alert,
} from "@mui/material";

export default function DeleteDialog({
  open,
  onClose,
  title,
  warning,
  body,
  onClickToDelete,
  onClickToCancel,
}) {
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onClose}
      aria-describedby="delete-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" fontWeight={600}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {warning}
        </Alert>
        <DialogContentText id="delete-dialog-description">
          <Typography component="span">{body}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClickToCancel}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onClickToDelete}
          variant="contained"
          className="Bty-button"
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
