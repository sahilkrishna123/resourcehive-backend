import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";

const EditHospital = ({
  openEditDialog,
  setOpenEditDialog,
  selectedHospital,
  setSelectedHospital,
  setHospitals,
}) => {
  const handleEditSubmit = async () => {
    try {
      // Fetch token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage. Please log in.");
        alert("Authentication required. Please log in.");
        return;
      }
      const url = `https://resourcehive-backend.vercel.app/api/v1/hospitals/${selectedHospital._id}`;
      console.log("Request URL:", url);
      console.log("Hospital ID:", selectedHospital._id);
      console.log("Data being sent to API:", selectedHospital);

      const response = await axios.patch(url, selectedHospital, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API Response:", response.data);

      setHospitals((prevHospitals) =>
        prevHospitals.map((hospital) =>
          hospital._id === selectedHospital._id ? selectedHospital : hospital
        )
      );

      setOpenEditDialog(false);
      setSelectedHospital(null);
    } catch (error) {
      console.error("Error updating hospital:", error);
      if (error.response) {
        console.log("Response Status:", error.response.status);
        console.log("Response Data:", error.response.data);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedHospital((prev) => {
      const deptMatch = name.match(/department(\d+)(Name|Head|Contact)/);
      if (deptMatch) {
        const deptIndex = parseInt(deptMatch[1]) - 1;
        const field = deptMatch[2].toLowerCase();
        const updatedDepartments = [...prev.departments];
        updatedDepartments[deptIndex] = {
          ...updatedDepartments[deptIndex],
          [field]: value,
        };
        return { ...prev, departments: updatedDepartments };
      }

      return {
        ...prev,
        ...(name === "name" && { name: value }),
        ...(name === "registrationNumber" && { registrationNumber: value }),
        ...(name === "establishedDate" && { establishedDate: value }),
        location: {
          ...prev.location,
          address: {
            ...prev.location.address,
            ...(name === "street" && { street: value }),
            ...(name === "city" && { city: value }),
            ...(name === "state" && { state: value }),
            ...(name === "zipCode" && { zipCode: value }),
            ...(name === "country" && { country: value }),
          },
        },
        contactDetails: {
          ...prev.contactDetails,
          ...(name === "phone" && { phone: value }),
          ...(name === "email" && { email: value }),
          ...(name === "website" && { website: value }),
        },
      };
    });
  };

  return (
    <Dialog
      open={openEditDialog}
      onClose={() => setOpenEditDialog(false)}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#051221",
          color: "#FFFFFF",
        },
      }}
    >
      <DialogTitle sx={{ color: "#FFFFFF" }}>Edit Hospital</DialogTitle>
      <DialogContent>
        {selectedHospital && (
          <>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="name"
                  label="Hospital Name"
                  type="text"
                  value={selectedHospital.name || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="street"
                  label="Street Address"
                  type="text"
                  value={selectedHospital.location.address.street || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="city"
                  label="City"
                  type="text"
                  value={selectedHospital.location.address.city || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="state"
                  label="State"
                  type="text"
                  value={selectedHospital.location.address.state || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="zipCode"
                  label="Zip Code"
                  type="text"
                  value={selectedHospital.location.address.zipCode || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="country"
                  label="Country"
                  type="text"
                  value={selectedHospital.location.address.country || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="phone"
                  label="Phone Number"
                  type="text"
                  value={selectedHospital.contactDetails.phone || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  value={selectedHospital.contactDetails.email || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="website"
                  label="Website URL"
                  type="text"
                  value={selectedHospital.contactDetails.website || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
            </Stack>

            <Typography variant="subtitle1" sx={{ mt: 2, color: "#FFFFFF" }}>
              Department 1
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="department1Name"
                  label="Department Name"
                  type="text"
                  value={selectedHospital.departments[0]?.name || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="department1Head"
                  label="Head of Department"
                  type="text"
                  value={selectedHospital.departments[0]?.head || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="department1Contact"
                  label="Contact Number"
                  type="text"
                  value={selectedHospital.departments[0]?.contactNumber || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
            </Stack>

            <Typography variant="subtitle1" sx={{ mt: 2, color: "#FFFFFF" }}>
              Department 2
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="department2Name"
                  label="Department Name"
                  type="text"
                  value={selectedHospital.departments[1]?.name || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="department2Head"
                  label="Head of Department"
                  type="text"
                  value={selectedHospital.departments[1]?.head || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="department2Contact"
                  label="Contact Number"
                  type="text"
                  value={selectedHospital.departments[1]?.contactNumber || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="registrationNumber"
                  label="Registration Number"
                  type="text"
                  value={selectedHospital.registrationNumber || ""}
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <TextField
                  name="establishedDate"
                  label="Established Date"
                  type="date"
                  value={
                    selectedHospital.establishedDate
                      ? new Date(selectedHospital.establishedDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  sx={{ padding: "7px" }}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
              <Box sx={{ flex: 1 }} />
            </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenEditDialog(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleEditSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditHospital;
