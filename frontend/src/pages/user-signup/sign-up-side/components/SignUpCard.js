import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import axios from "axios";
import toast from "react-hot-toast";
import ColorModeSelect from "../../shared-theme/ColorModeSelect";
import AppTheme from "../../shared-theme/AppTheme";
import { CssBaseline } from "@mui/material";

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
}));

export default function SignUpCard() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Dismiss any previous error toast
    toast.dismiss(); // Dismisses all toasts (if you want to only dismiss the error toast, use a specific ID)

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.passwordConfirm
    ) {
      toast.error("All fields are required", { duration: 1500 }); // 3 seconds
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      toast.error("Passwords do not match", { duration: 1500 }); // 3 seconds
      return;
    }

    try {
      const response = await axios.post(
        "https://resourcehive-backend.vercel.app/api/v1/users/signup",
        formData
      );

      toast.success("Signup Successful", { duration: 1500 }); // 3 seconds

      // Clear form data after success
      setFormData({ name: "", email: "", password: "", passwordConfirm: "" });

      // Wait for 3 seconds before navigating
      setTimeout(() => {
        navigate("/signin");
      }, 2000); // 3000 milliseconds = 3 seconds
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed", {
        duration: 1000,
      }); // 3 seconds
    }
  };

  return (
    <>
      <AppTheme>
        <CssBaseline enableColorScheme />
        {/* <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} /> */}
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: "100%" ,fontSize: '2rem',}}>
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <TextField
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                placeholder="Enter your name"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                placeholder="your@email.com"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                placeholder="••••••"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="passwordConfirm">Confirm Password</FormLabel>
              <TextField
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                placeholder="••••••"
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Sign Up
            </Button>
          </Box>
        </Card>
      </AppTheme>
    </>
  );
}
