import * as React from "react";
import Box from "@mui/material/Box";

import axios from "axios";
import { toast } from "react-hot-toast";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./components/ForgotPassword";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
} from "./components/CustomIcons";
import { useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function ManagerForm(props) {
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    governmentIdNumber: "",
    phoneNumber: "",
    requestedRole: "",
    residentialAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    hospitalDetails: {
      hospitalName: "",
      employeeId: "",
      position: "",
      idCardNumber: "",
      idCardIssueDate: "",
      idCardExpiryDate: "",
      hospitalContact: {
        phone: "",
        email: "",
      },
    },
    idCardImage: null,
    governmentIdImage: null,
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle nested input change (e.g., residentialAddress)
  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value,
      },
    }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  // Form validation
  const validateForm = () => {
    const requiredFields = [
      "name",
      "email",
      "governmentIdNumber",
      "phoneNumber",
      "requestedRole",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`${field} is required`);
        return false;
      }
    }

    if (
      !formData.residentialAddress.street ||
      !formData.residentialAddress.city
    ) {
      toast.error("Residential address fields are required");
      return false;
    }

    if (
      !formData.hospitalDetails.hospitalName ||
      !formData.hospitalDetails.position
    ) {
      toast.error("Hospital details are required");
      return false;
    }

    return true;
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (
        typeof formData[key] === "object" &&
        key !== "idCardImage" &&
        key !== "governmentIdImage"
      ) {
        data.append(key, JSON.stringify(formData[key])); // Convert nested objects to JSON
      } else {
        data.append(key, formData[key]); // Append normal fields
      }
    });

    try {
      const token = localStorage.getItem("token"); // Retrieve the token

      if (!token) {
        toast.error("Unauthorized! Please login again.");
        navigate("/signin");
        return;
      }
      const response = await axios.post(
        "https://resourcehive-backend.vercel.app/api/v1/users/complete-profile",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile completed successfully!");
        navigate("/hospitals/manager"); // Navigate to home page
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };
  return (
    <>
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <SignInContainer direction="column" justifyContent="space-between">
          {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
          <Card
            variant="outlined"
            sx={{
              width: "110%",
              minWidth: "fit-content",
              maxWidth: "none",
              display: "flex",
              flexDirection: "column",
              p: 5,
              maxHeight: "90vh", // Restrict height
              overflow: "auto", // Enable scrolling
            }}
          >
            {/* <SitemarkIcon /> */}
            <Typography
              component="h1"
              variant="h4"
              sx={{
                width: "100%",
                fontSize: "clamp(2rem, 10vw, 2.15rem)",
                textAlign: "center", // Added this line to center the text
              }}
            >
              Manager Form
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* Name */}
              <Typography variant="h6">Personal Details</Typography>
              <Stack direction="row" gap={5}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <TextField
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </FormControl>

                {/* Email */}
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <TextField
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </FormControl>

                {/* Government ID Number */}
                <FormControl>
                  <FormLabel>Government ID Number</FormLabel>
                  <TextField
                    name="governmentIdNumber"
                    placeholder="Enter government ID"
                    value={formData.governmentIdNumber}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </FormControl>
              </Stack>

              <Stack direction="row" gap={5}>
                {/* Phone Number */}
                <FormControl fullWidth>
                  <FormLabel>Phone Number</FormLabel>
                  <TextField
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </FormControl>

                {/* Role */}
                <FormControl fullWidth>
                  <FormLabel>Requested Role</FormLabel>
                  <TextField
                    name="requestedRole"
                    placeholder="Enter requested role"
                    value={formData.requestedRole}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </FormControl>
              </Stack>

              {/* Residential Address */}
              <Typography variant="h6">Residential Address</Typography>

              <Stack direction="row" gap={5}>
                <FormControl fullWidth>
                  <FormLabel>Street</FormLabel>
                  <TextField
                    name="street"
                    placeholder="Enter street address"
                    onChange={(e) =>
                      handleNestedChange(e, "residentialAddress")
                    }
                    required
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel>City</FormLabel>
                  <TextField
                    name="city"
                    placeholder="Enter city name"
                    onChange={(e) =>
                      handleNestedChange(e, "residentialAddress")
                    }
                    required
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel>State</FormLabel>
                  <TextField
                    name="state"
                    placeholder="Enter state name"
                    onChange={(e) =>
                      handleNestedChange(e, "residentialAddress")
                    }
                    required
                    fullWidth
                  />
                </FormControl>
              </Stack>

              <Stack direction="row" gap={5}>
                <FormControl fullWidth>
                  <FormLabel>Zip Code</FormLabel>
                  <TextField
                    name="zipCode"
                    placeholder="Enter zip code"
                    onChange={(e) =>
                      handleNestedChange(e, "residentialAddress")
                    }
                    required
                    fullWidth
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel>Country</FormLabel>
                  <TextField
                    name="country"
                    placeholder="Enter country name"
                    onChange={(e) =>
                      handleNestedChange(e, "residentialAddress")
                    }
                    required
                    fullWidth
                  />
                </FormControl>
              </Stack>

              {/* Hospital Details */}
              <Typography variant="h6">Hospital Details</Typography>

              <Stack direction="row" gap={5}>
                <FormControl fullWidth>
                  <FormLabel>Hospital Name</FormLabel>
                  <TextField
                    name="hospitalName"
                    placeholder="Enter hospital name"
                    value={formData.hospitalDetails.hospitalName} // Assuming you're binding the value
                    onChange={(e) => handleNestedChange(e, "hospitalDetails")}
                    required
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel>Employee ID</FormLabel>
                  <TextField
                    name="employeeId"
                    placeholder="Enter employee ID"
                    value={formData.hospitalDetails.employeeId} // Assuming you're binding the value
                    onChange={(e) => handleNestedChange(e, "hospitalDetails")}
                    required
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel>Position</FormLabel>
                  <TextField
                    name="position"
                    placeholder="Enter your position"
                    value={formData.hospitalDetails.position} // Assuming you're binding the value
                    onChange={(e) => handleNestedChange(e, "hospitalDetails")}
                    required
                    fullWidth
                  />
                </FormControl>
              </Stack>

              <Stack direction="row" gap={5}>
                <FormControl fullWidth>
                  <FormLabel>ID Card Number</FormLabel>
                  <TextField
                    name="idCardNumber"
                    placeholder="Enter ID card number"
                    value={formData.hospitalDetails.idCardNumber} // Assuming you're binding the value
                    onChange={(e) => handleNestedChange(e, "hospitalDetails")}
                    required
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel>ID Card Issue Date</FormLabel>
                  <TextField
                    type="date"
                    name="idCardIssueDate"
                    placeholder="Enter issue date"
                    value={formData.hospitalDetails.idCardIssueDate} // Assuming you're binding the value
                    onChange={(e) => handleNestedChange(e, "hospitalDetails")}
                    required
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel>ID Card Expiry Date</FormLabel>
                  <TextField
                    type="date"
                    name="idCardExpiryDate"
                    placeholder="Enter expiry date"
                    value={formData.hospitalDetails.idCardExpiryDate} // Assuming you're binding the value
                    onChange={(e) => handleNestedChange(e, "hospitalDetails")}
                    required
                    fullWidth
                  />
                </FormControl>
              </Stack>

              <Stack direction="row" gap={5}>
                <FormControl fullWidth>
                  <FormLabel>Hospital Contact Phone</FormLabel>
                  <TextField
                    name="hospitalContactPhone"
                    placeholder="Enter hospital phone"
                    value={formData.hospitalContactPhone} // Binding value for phone
                    onChange={(e) => handleNestedChange(e, "hospitalDetails")}
                    required
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel>Hospital Contact Email</FormLabel>
                  <TextField
                    name="hospitalContactEmail"
                    placeholder="Enter hospital email"
                    value={formData.hospitalContactEmail} // Binding value for email
                    onChange={(e) => handleNestedChange(e, "hospitalDetails")}
                    required
                    fullWidth
                  />
                </FormControl>
              </Stack>

              {/* Submit Button */}
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Box>
          </Card>
        </SignInContainer>
      </AppTheme>
    </>
  );
}
