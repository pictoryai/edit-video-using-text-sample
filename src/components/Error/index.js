import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Error = ({ open, handleClose, message, autoHideDuration = null }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <MuiAlert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Error;
