// EditEquipment.jsx
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

// const AUTH_TOKEN =
//   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzcyM2UxY2ZjZmFlODg2NWY2YmE0NyIsImlhdCI6MTc0MTEwNTI2NywiZXhwIjoxNzQxOTY5MjY3fQ.so24278sLpGglaVnHVt03l-ghfUs9gbPykwgQSU3W0w";

const EditEquipment = ({
  openDialog,
  setOpenDialog,
  hospitalId,
  equipment,
  setEquipments,
  onEquipmentChange, // Added this prop
}) => {
  const [formData, setFormData] = useState({
    type: equipment?.type || "",
    model: equipment?.model || "",
    serialNumber: equipment?.serialNumber || "",
    status: equipment?.status || "active",
    lastMaintainedDate: equipment?.lastMaintainedDate || "",
    manufacturer: equipment?.manufacturer || "",
    udiNumber: equipment?.udiNumber || "",
    location: equipment?.location || "",
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
      const response = await axios.patch(
        `https://resourcehive-backend.vercel.app/api/v1/equipments/${hospitalId}/${equipment.equipmentId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(hospitalId, equipment._id, "mmooiinnmmooiinn");

      // Trigger refetch to show Skeleton and update dynamically
      if (onEquipmentChange) {
        onEquipmentChange();
      }

      toast.success("Equipment updated successfully!");
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating equipment:", error);
      toast.error(
        error.response?.data?.message || "Failed to update equipment."
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
      <DialogTitle>Edit Equipment</DialogTitle>
      <DialogContent>
        <Stack spacing={2} direction="row">
          <FormControl fullWidth>
            <FormLabel sx={{ color: "white" }}>Type</FormLabel>
            <TextField
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              sx={{ input: { color: "white" } }}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ color: "white" }}>Model</FormLabel>
            <TextField
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              sx={{ input: { color: "white" } }}
            />
          </FormControl>
        </Stack>
        <Stack spacing={2} direction="row">
          <FormControl fullWidth>
            <FormLabel sx={{ color: "white" }}>Serial Number</FormLabel>
            <TextField
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              required
              sx={{ input: { color: "white" } }}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ color: "white" }}>Status</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              sx={{ color: "white" }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="under maintenance">Under Maintenance</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack spacing={2} direction="row">
          <FormControl fullWidth>
            <FormLabel sx={{ color: "white" }}>Last Maintained Date</FormLabel>
            <TextField
              name="lastMaintainedDate"
              type="date"
              value={formData.lastMaintainedDate}
              onChange={handleChange}
              required
              sx={{ input: { color: "white" } }}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ color: "white" }}>Manufacturer</FormLabel>
            <TextField
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              required
              sx={{ input: { color: "white" } }}
            />
          </FormControl>
        </Stack>
        <Stack spacing={2} direction="row">
          <FormControl fullWidth>
            <FormLabel sx={{ color: "white" }}>UDI Number</FormLabel>
            <TextField
              name="udiNumber"
              value={formData.udiNumber}
              onChange={handleChange}
              required
              sx={{ input: { color: "white" } }}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ color: "white" }}>Location</FormLabel>
            <TextField
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              sx={{ input: { color: "white" } }}
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

export default EditEquipment;