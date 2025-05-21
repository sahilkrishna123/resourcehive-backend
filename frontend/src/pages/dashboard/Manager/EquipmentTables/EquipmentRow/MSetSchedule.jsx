import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  Stack,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

const MSetSchedule = ({
  openDialog,
  setOpenDialog,
  hospitalId,
  equipment,
  setEquipments,
  onScheduleChange, // Added this prop
}) => {
  const [formData, setFormData] = useState({
    maintenanceType: "Scheduled", // Default to "Scheduled"
    timestamp: equipment?.maintenanceDate || "", // Default to equipment's maintenanceDate
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Fetch token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage. Please log in.");
        toast.error("Authentication required. Please log in.");
        return;
      }

      // Construct the data to be sent to the API
      const maintenanceData = {
        ...formData,
      };

      const response = await axios.post(
        `https://resourcehive-backend.vercel.app/api/v1/${hospitalId}/${equipment.equipmentId}/maintenance`,
        maintenanceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Trigger refetch to show Skeleton and update dynamically
      if (onScheduleChange) {
        onScheduleChange();
      }

      toast.success("Maintenance schedule set successfully!");
      setOpenDialog(false);
    } catch (error) {
      console.error("Error setting maintenance schedule:", error);
      toast.error(
        error.response?.data?.message || "Failed to set maintenance schedule."
      );
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#051221 !important",
          color: "white !important",
          width: "500px",
        },
      }}
    >
      <DialogTitle>Set Maintenance Schedule</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <FormLabel sx={{ color: "white" }}>Maintenance Type</FormLabel>
            <Select
              name="maintenanceType"
              value={formData.maintenanceType}
              onChange={handleChange}
              required
              sx={{ color: "white" }}
            >
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Unscheduled">Unscheduled</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ color: "white" }}>Maintenance Date</FormLabel>
            <TextField
              name="timestamp"
              type="date"
              value={formData.timestamp}
              onChange={handleChange}
              required
              sx={{ input: { color: "white" } }}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setOpenDialog(false)}
          sx={{
            backgroundColor: "#f44336",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#d32f2f" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#388e3c",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#2c6e31" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MSetSchedule;
