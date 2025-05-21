import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";

const DeleteMaintenance = ({
  openDeleteDialog,
  setOpenDeleteDialog,
  selectedMaintenance,
  hospitalId,
  equipmentId,
  setMaintenances,
}) => {
  const handleDelete = async () => {
    try {
      // Fetch token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage. Please log in.");
        alert("Authentication required. Please log in.");
        return;
      }
      console.log("=== Deleting Maintenance ===");
      console.log("Hospital ID:", hospitalId);
      console.log("Equipment ID:", equipmentId);
      console.log("Maintenance ID:", selectedMaintenance.maintenanceId);

      const url = `https://resourcehive-backend.vercel.app/api/v1/${hospitalId}/${equipmentId}/maintenance/${selectedMaintenance.maintenanceId}`;
      console.log("Request URL:", url);
      console.log("Maintenance ID:", selectedMaintenance.maintenanceId);

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API Response:", response.data);

      setMaintenances((prevMaintenances) =>
        prevMaintenances.filter(
          (maintenance) => maintenance.maintenanceId !== selectedMaintenance.maintenanceId
        )
      );

      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      if (error.response) {
        console.log("Response Status:", error.response.status);
        console.log("Response Data:", error.response.data);
      }
    }
  };

  return (
    <Dialog
      open={openDeleteDialog}
      onClose={() => setOpenDeleteDialog(false)}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#051221",
          color: "#ffffff",
          width: "400px",
          maxWidth: "100%",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <DialogTitle
          style={{
            color: "#ffffff",
            fontSize: "1.5rem",
            fontWeight: "bold",
            padding: "10px 0",
            textAlign: "center",
          }}
        >
          Delete Maintenance
        </DialogTitle>
        <DialogContent
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <Typography style={{ color: "#ffffff", fontSize: "1rem" }}>
            Are you sure you want to delete this maintenance record?
          </Typography>
          {selectedMaintenance && (
            <Typography style={{ color: "#ffffff", fontSize: "1rem", marginTop: "10px" }}>
              Timestamp: {new Date(selectedMaintenance.timestamp).toLocaleString()}
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          style={{
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            style={{
              backgroundColor: "#f44336",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "4px",
              textTransform: "none",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#d32f2f")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f44336")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            style={{
              backgroundColor: "#388e3c",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "4px",
              textTransform: "none",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2c6e31")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#388e3c")}
          >
            Delete
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default DeleteMaintenance;