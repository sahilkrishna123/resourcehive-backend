import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Box,
} from "@mui/material";
import axios from "axios";

const EditMaintenance = ({
  openEditDialog,
  setOpenEditDialog,
  selectedMaintenance,
  setSelectedMaintenance,
  hospitalId,
  equipmentId,
  setMaintenances,
}) => {
  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage.");
        alert("Authentication required. Please log in.");
        return;
      }

      console.log("=== Editing Maintenance ===");
      console.log("Hospital ID:", hospitalId);
      console.log("Equipment ID:", equipmentId);
      console.log("Maintenance ID:", selectedMaintenance.maintenanceId);
      console.log("Local Timestamp:", selectedMaintenance.timestamp);

      const url = `https://resourcehive-backend.vercel.app/api/v1/${hospitalId}/${equipmentId}/maintenance/${selectedMaintenance.maintenanceId}`;
      const utcTimestamp = new Date(selectedMaintenance.timestamp).toISOString();

      const response = await axios.patch(
        url,
        { timestamp: utcTimestamp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);

      setMaintenances((prev) =>
        prev.map((maintenance) =>
          maintenance.maintenanceId === selectedMaintenance.maintenanceId
            ? { ...maintenance, timestamp: utcTimestamp }
            : maintenance
        )
      );

      setOpenEditDialog(false);
      setSelectedMaintenance(null);
    } catch (error) {
      console.error("Error updating maintenance:", error);
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedMaintenance((prev) => ({
      ...prev,
      [name]: value, // Keep value in local time format (e.g. 2025-11-01T08:00)
    }));
  };

  return (
    <Dialog
      open={openEditDialog}
      onClose={() => setOpenEditDialog(false)}
      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div
        style={{
          backgroundColor: "#051221",
          color: "#ffffff",
          width: "400px",
          maxWidth: "100%",
          borderRadius: "8px",
          padding: "60px",
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
          Edit Maintenance
        </DialogTitle>
        <DialogContent
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {selectedMaintenance && (
            <Box>
              <FormControl style={{ width: "100%" }}>
                <label
                  style={{
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Maintenance Timestamp
                </label>
                <TextField
                  name="timestamp"
                  type="datetime-local"
                  value={
                    selectedMaintenance.timestamp
                      ? selectedMaintenance.timestamp.slice(0, 16)
                      : ""
                  }
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  style={{
                    width: "100%",
                    backgroundColor: "#051221",
                    border: "1px solid #ffffff",
                    borderRadius: "4px",
                  }}
                  inputProps={{
                    style: {
                      color: "#ffffff",
                      fontSize: "1rem",
                      padding: "10px",
                    },
                  }}
                />
              </FormControl>
            </Box>
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
            onClick={() => setOpenEditDialog(false)}
            style={{
              backgroundColor: "#f44336",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "4px",
              textTransform: "none",
              fontSize: "1rem",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#d32f2f")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f44336")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            style={{
              backgroundColor: "#388e3c",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "4px",
              textTransform: "none",
              fontSize: "1rem",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2c6e31")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#388e3c")}
          >
            Save
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default EditMaintenance;
