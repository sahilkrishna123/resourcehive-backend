// DeleteEquipment.jsx
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

// const AUTH_TOKEN =
//   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzcyM2UxY2ZjZmFlODg2NWY2YmE0NyIsImlhdCI6MTc0MTEwNTI2NywiZXhwIjoxNzQxOTY5MjY3fQ.so24278sLpGglaVnHVt03l-ghfUs9gbPykwgQSU3W0w";

const DeleteEquipment = ({
  openDialog,
  setOpenDialog,
  hospitalId,
  equipmentId,
  setEquipments,
  onEquipmentChange,
}) => {
  console.log("Received equipmentId in DeleteEquipment:", equipmentId); // Log on component mount

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
        "Equipment ID before delete request:",
        equipmentId,
        "for hospital",
        hospitalId
      );

      await axios.delete(
        `https://resourcehive-backend.vercel.app/api/v1/equipments/${hospitalId}/${equipmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use token from localStorage
          },
        }
      );

      console.log(
        "Equipment ID after delete request:",
        equipmentId,
        "for hospital",
        hospitalId
      );

      // Trigger refetch to show Skeleton and update dynamically
      if (onEquipmentChange) {
        onEquipmentChange();
      }

      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting equipment:", error);
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
          Are you sure you want to delete this equipment? This action cannot be
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

export default DeleteEquipment;