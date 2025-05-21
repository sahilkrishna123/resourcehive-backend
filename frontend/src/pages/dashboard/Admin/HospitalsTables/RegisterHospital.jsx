import React, { useState } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import { toast } from "react-hot-toast";

import {
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Button,
} from "@mui/material";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  marginBottom: "20px !important", // Ensures the card takes full width
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

const Register = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    department1Name: "",
    department1Head: "",
    department1Contact: "",
    department2Name: "",
    department2Head: "",
    department2Contact: "",
    registrationNumber: "",
    establishedDate: "",
    active: true,
    approvalStatus: "pending",
  });

  // Handle form field change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fetch token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage. Please log in.");
        toast.error("Authentication required. Please log in.");
        return;
      }
      const response = await axios.post(
        "https://resourcehive-backend.vercel.app/api/v1/hospitals/register-hospital",
        {
          name: formData.name,
          location: {
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
            },
          },
          contactDetails: {
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
          },
          departments: [
            {
              name: formData.department1Name,
              head: formData.department1Head,
              contactNumber: formData.department1Contact,
            },
            {
              name: formData.department2Name,
              head: formData.department2Head,
              contactNumber: formData.department2Contact,
            },
          ],
          registrationNumber: formData.registrationNumber,
          establishedDate: formData.establishedDate,
          active: formData.active,
          approvalStatus: formData.approvalStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Hospital registered successfully!");
      setFormData({
        name: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
        email: "",
        website: "",
        department1Name: "",
        department1Head: "",
        department1Contact: "",
        department2Name: "",
        department2Head: "",
        department2Contact: "",
        registrationNumber: "",
        establishedDate: "",
        active: true,
        approvalStatus: "pending",
      });
      console.log(response.data); // Handle the success response
    } catch (error) {
      console.error("Error registering hospital:", error);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Row 1: Name, Street, City */}
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel>Name</FormLabel>
              <TextField
                name="name"
                placeholder="Enter Hospital Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Street</FormLabel>
              <TextField
                name="street"
                placeholder="Street Address"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>City</FormLabel>
              <TextField
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </FormControl>
          </Stack>

          {/* Row 2: State, ZipCode, Country */}
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel>State</FormLabel>
              <TextField
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Zip Code</FormLabel>
              <TextField
                name="zipCode"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Country</FormLabel>
              <TextField
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </FormControl>
          </Stack>

          {/* Row 3: Phone, Email, Website */}
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel>Phone</FormLabel>
              <TextField
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Email</FormLabel>
              <TextField
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Website</FormLabel>
              <TextField
                name="website"
                placeholder="Website URL"
                value={formData.website}
                onChange={handleChange}
                required
              />
            </FormControl>
          </Stack>

          {/* Row 4: Department 1 Name, Head, Contact */}
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel>Department 1 Name</FormLabel>
              <TextField
                name="department1Name"
                placeholder="Department Name"
                value={formData.department1Name}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Department 1 Head</FormLabel>
              <TextField
                name="department1Head"
                placeholder="Head of Department"
                value={formData.department1Head}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Department 1 Contact</FormLabel>
              <TextField
                name="department1Contact"
                placeholder="Contact Number"
                value={formData.department1Contact}
                onChange={handleChange}
                required
              />
            </FormControl>
          </Stack>

          {/* Row 5: Department 2 Name, Head, Contact */}
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel>Department 2 Name</FormLabel>
              <TextField
                name="department2Name"
                placeholder="Department Name"
                value={formData.department2Name}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Department 2 Head</FormLabel>
              <TextField
                name="department2Head"
                placeholder="Head of Department"
                value={formData.department2Head}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Department 2 Contact</FormLabel>
              <TextField
                name="department2Contact"
                placeholder="Contact Number"
                value={formData.department2Contact}
                onChange={handleChange}
                required
              />
            </FormControl>
          </Stack>

          {/* Row 6: Registration Number, Established Date */}
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl fullWidth>
              <FormLabel>Registration Number</FormLabel>
              <TextField
                name="registrationNumber"
                placeholder="Registration Number"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>Established Date</FormLabel>
              <TextField
                name="establishedDate"
                type="date"
                value={formData.establishedDate}
                onChange={handleChange}
                required
              />
            </FormControl>

            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                width: "150px !important",
                height: "56px !important",
                padding: "10px !important", // Adjust padding for better fit
                marginTop: "25px !important", // Align vertically
              }}
            >
              Register
            </Button>
          </Stack>
        </Stack>
      </form>
    </Card>
  );
};

export default Register;
