import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import axios from "axios";

const DeleteHospital = ({
  openDialog,
  setOpenDialog,
  selectedHospitalId,
  setHospitals,
  setSelectedHospitalId,
}) => {
  const confirmDelete = async () => {
    try {
      // Fetch token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage. Please log in.");
        alert("Authentication required. Please log in.");
        return;
      }
      console.log(
        selectedHospitalId,
        "this is the hospital ID that wants to delete"
      );
      console.log(selectedHospitalId,"hospital id")
      await axios.delete(
        `https://resourcehive-backend.vercel.app/api/v1/hospitals/${selectedHospitalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHospitals((prevHospitals) =>
        prevHospitals.filter((hospital) => hospital._id !== selectedHospitalId)
      );

      setOpenDialog(false);
      setSelectedHospitalId(null);
    } catch (error) {
      console.error("Error deleting hospital:", error);
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      aria-describedby="alert-dialog-slide-description"
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#051221 !important",
          color: "white !important",
        },
      }}
    >
      <DialogTitle>{"Confirm Deletion"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this hospital? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpenDialog(false)}
          color="primary"
          sx={{
            backgroundColor: "#f44336",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#d32f2f" },
          }}
        >
          Disagree
        </Button>
        <Button
          onClick={confirmDelete}
          color="secondary"
          sx={{
            backgroundColor: "#388e3c",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#2c6e31" },
          }}
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteHospital;
