import React, { useState, forwardRef, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import toast from "react-hot-toast";
import {
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  marginBottom: "25px !important",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...(theme.palette.mode === "dark" && {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const RegisterEquipment = forwardRef(({ hospital }, ref) => {
  const [formData, setFormData] = useState({
    type: "",
    model: "",
    serialNumber: "",
    status: "active",
    lastMaintainedDate: "",
    manufacturer: "",
    udiNumber: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  // Reset form when hospital changes
  useEffect(() => {
    setFormData({
      type: "",
      model: "",
      serialNumber: "",
      status: "active",
      lastMaintainedDate: "",
      manufacturer: "",
      udiNumber: "",
      location: "",
    });
  }, [hospital]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hospital || !hospital.id) {
      toast.error("Hospital ID is missing!");
      return;
    }

    // Client-side validation
    const {
      type,
      model,
      serialNumber,
      status,
      lastMaintainedDate,
      manufacturer,
      udiNumber,
      location,
    } = formData;
    if (
      !type ||
      !model ||
      !serialNumber ||
      !status ||
      !lastMaintainedDate ||
      !manufacturer ||
      !udiNumber ||
      !location
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate lastMaintainedDate
    const today = new Date();
    const maintainedDate = new Date(lastMaintainedDate);
    if (maintainedDate > today) {
      toast.error("Last maintained date cannot be in the future.");
      return;
    }

    setLoading(true);
    try {
      // Fetch token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage. Please log in.");
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await axios.post(
        `https://resourcehive-backend.vercel.app/api/v1/equipments/${hospital.id}`,
        {
          type,
          model,
          serialNumber,
          status,
          lastMaintainedDate,
          manufacturer,
          udiNumber,
          location,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Use token from localStorage
        }
      );
      console.log(
        hospital.id,
        "this is the id of hospital having equipment registering "
      );
      toast.success("Equipment registered successfully! Form has been reset.");
      setFormData({
        type: "",
        model: "",
        serialNumber: "",
        status: "active",
        lastMaintainedDate: "",
        manufacturer: "",
        udiNumber: "",
        location: "",
      });
      console.log("API response:", response.data); // Debugging
    } catch (error) {
      console.error("Error registering equipment:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to register equipment.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  console.log("RegisterEquipment rendered with hospital:", hospital); // Debugging

  return (
    <Card ref={ref}>
      <Typography variant="h6" gutterBottom>
        Register Equipment for{" "}
        {hospital ? hospital.name : "No Hospital Selected"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel>Type</FormLabel>
              <TextField
                name="type"
                placeholder="e.g., CT Scanner"
                value={formData.type}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Model</FormLabel>
              <TextField
                name="model"
                placeholder="e.g., Aquilion Prime SP"
                value={formData.model}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Serial Number</FormLabel>
              <TextField
                name="serialNumber"
                placeholder="e.g., SN78CT902"
                value={formData.serialNumber}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="under maintenance">Under Maintenance</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Last Maintained Date</FormLabel>
              <TextField
                name="lastMaintainedDate"
                type="date"
                value={formData.lastMaintainedDate}
                onChange={handleChange}
                required
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Manufacturer</FormLabel>
              <TextField
                name="manufacturer"
                placeholder="e.g., Toshiba"
                value={formData.manufacturer}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl fullWidth>
              <FormLabel>UDI Number</FormLabel>
              <TextField
                name="udiNumber"
                placeholder="e.g., UDI-009876543210"
                value={formData.udiNumber}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Location</FormLabel>
              <TextField
                name="location"
                placeholder="e.g., Diagnostic Imaging Center"
                value={formData.location}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{
                width: "150px !important",
                height: "56px !important",
                padding: "10px !important",
                marginTop: "25px !important",
              }}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Card>
  );
});

export default RegisterEquipment;