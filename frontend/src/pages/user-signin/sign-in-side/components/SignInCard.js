import * as React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { toast } from "react-hot-toast";
import ForgotPassword from "./ForgotPassword";
import axios from "axios";
// import ColorModeSelect from "../../shared-theme/ColorModeSelect";
import { CssBaseline, Stack } from "@mui/material";
import AppTheme from "../../shared-theme/AppTheme";
// import { jwtDecode } from "jwt-decode";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react"; // Make sure useState is imported

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function SignInCard() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const [selected, setSelected] = useState({
    admin: false,
    manager: false,
    technician: false,
  });

  // Function to handle checkbox change
  const handleCheckboxChange = (event) => {
    const { name } = event.target;
    // Allow only one checkbox to be selected
    setSelected((prevSelected) => {
      const newSelected = {
        admin: false,
        manager: false,
        technician: false,
      };
      newSelected[name] = true; // Set the selected checkbox to true
      return newSelected; // Update state with only one checkbox selected
    });
  };

  // Function to extract which checkboxes are selected
  const getSelectedCheckboxes = () => {
    const selectedLabels = Object.keys(selected)
      .filter((key) => selected[key]) // Filter selected checkboxes
      .map((key) => key.charAt(0).toUpperCase() + key.slice(1)); // Capitalize the label

    console.log("Selected checkboxes:", selectedLabels);

    // Delay the navigation by 4 seconds
    // setTimeout(() => {
    //   if (selectedLabels.includes("Admin")) {
    //     // Navigate to the admin form if "Admin" is selected
    //     navigate("/adminform");
    //   } else if (selectedLabels.includes("Manager")) {
    //     // Navigate to the manager form if "Manager" is selected
    //     navigate("/manager");
    //   } else {
    //     // Handle case when no specific checkboxes are selected
    //     navigate("/technician");
    //   }
    // }, 3000); // 4000 milliseconds = 4 seconds
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get input values
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    // Reset errors
    setEmailError(false);
    setPasswordError(false);
    setEmailErrorMessage("");
    setPasswordErrorMessage("");

    toast.dismiss();

    // Validate inputs
    if (!email || !password) {
      toast.error("All fields are required", { duration: 1500 });
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      return;
    }


    if (!Object.values(selected).includes(true)) {
      toast.error("Please select a role", { duration: 1500 });
      return;
    }

    // Call function to log selected checkboxes
    getSelectedCheckboxes(); // Now the selected checkboxes will be logged

    // Make the API request using Axios
    try {
      const response = await axios.post(
        "https://resourcehive-backend.vercel.app/api/v1/users/login",
        {
          email,
          password,
        }
      );

      // Check if login is successful
      if (response.data && response.data.token) {
        const userId = response.data.data.user._id;
        localStorage.setItem("userId", userId); 
        localStorage.setItem("token", response.data.token); // Store token in localStorage
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        console.log("this is local token", token);
        console.log("Full response:", JSON.stringify(response.data));
        // Check if role is nested inside another object
        const role = response.data?.data?.user?.role;

        // role checking main code start

        const handleRoleRedirect = (role) => {
          // Define role routes for easy navigation
          const roleRoutes = {
            admin: "/adminDashboard",
            manager: "/managerDashboard",
            technician: "/technicianDashboard",
          };

          // Check if the role is one of the predefined roles (Admin, Manager, Technician)
          if (roleRoutes[role]) {
            navigate(roleRoutes[role]); // Navigate to the respective route
          } else if (role === "user") {
            // If the role is 'user', check which checkbox is selected
            const selectedLabels = Object.keys(selected)
              .filter((key) => selected[key]) // Filter selected checkboxes
              .map((key) => key.charAt(0).toUpperCase() + key.slice(1)); // Capitalize the label
              console.log("this is selected label",selectedLabels)

            if (selectedLabels.includes("Admin")) {
              navigate("/adminform");
            } else if (selectedLabels.includes("Manager")) {
              navigate("/managerform");
            } else if (selectedLabels.includes("Technician")) {
              navigate("/technicianform");
            } else {
              // If no role is selected, show an error and redirect to home
              toast.error("Please select a roleeeeeeeeeeeeee", { duration: 1500 });
              navigate("/"); // Redirect to home page if no role is selected
            }
          } else {
            // If the role is not recognized or doesn't match, navigate to home
            navigate("/"); // Redirect to home page if role is not found
          }
        };

        // Check if role is available and valid
        if (role) {
          // Now call the function with the role
          handleRoleRedirect(role);
        } else {
          // If role is undefined, log the error or handle the issue
          console.log("role is undefined or invalid");
          navigate("/"); // Redirect to home if role is undefined
        }

        //role checking main role end

        toast.success("Login successful", { duration: 1500 });

        // Reset form after successful login
        setSelected({ admin: false, manager: false, technician: false }); // Reset checkboxes
        setEmailError(false); // Reset email error
        setPasswordError(false); // Reset password error
        setEmailErrorMessage(""); // Reset email error message
        setPasswordErrorMessage(""); // Reset password error message

        // Reset the input fields for email and password
        document.getElementById("email").value = ""; // Reset email field
        document.getElementById("password").value = ""; // Reset password field
      } else {
        toast.error("Invalid email or password", { duration: 1500 });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        duration: 1500,
      });
    }
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          <ForgotPassword open={open} handleClose={handleClose} />

          <FormGroup>
            <span style={{ marginLeft: "4px", color: "white", opacity: 0.6 }}>
              Roles
            </span>

            <Stack
              direction="row"
              gap={2}
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="admin"
                    checked={selected.admin}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Admin"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="manager"
                    checked={selected.manager}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Manager"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="technician"
                    checked={selected.technician}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Technician"
              />
            </Stack>
          </FormGroup>

          <Button type="submit" fullWidth variant="contained">
            Sign in
          </Button>
          <Typography sx={{ textAlign: "center", display: "inline" }}>
            Don&apos;t have an account?{" "}
            <Button
              onClick={() => navigate("/signup")}
              variant="body2"
              sx={{ padding: 0, textTransform: "none" }}
            >
              Sign up
            </Button>
          </Typography>
        </Box>
      </Card>
    </AppTheme>
  );
}
