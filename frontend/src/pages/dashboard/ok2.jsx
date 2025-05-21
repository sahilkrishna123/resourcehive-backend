import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Skeleton,
  Collapse,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  TextField,
  Stack,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Import Material UI Delete Icon
import EditIcon from "@mui/icons-material/Edit"; // Import Material UI Edit Icon
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PropTypes from "prop-types";
// edit start

// edit end

// Row Component to show hospital details
function Row({ row, onDelete, onEdit }) {
  const [open, setOpen] = useState(false);

  // delete hospital

  const handleDelete = () => {
    onDelete(row._id); // Trigger the delete callback with the row's ID
  };

  // edit hospital

  const handleEdit = () => {
    onEdit(row); // Pass the entire row object instead of just row._id
    console.log(row);
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">
          {row.location.address.city}, {row.location.address.state}
        </TableCell>
        <TableCell align="right">{row.contactDetails.phone}</TableCell>
        <TableCell align="right">
          <a
            href={row.contactDetails.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.contactDetails.website}
          </a>
        </TableCell>
        {/* Action Column with Delete and Edit Icons */}
        <TableCell align="right">
          <IconButton
            onClick={handleEdit}
            color="primary"
            sx={{ marginRight: 1 }}
          >
            <EditIcon onClick={() => handleEdit(row)} />
          </IconButton>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Additional Details
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell>Registration Number</TableCell>
                    <TableCell>Departments</TableCell>
                    <TableCell align="right">Established Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{row.registrationNumber || "N/A"}</TableCell>
                    <TableCell>
                      {row.departments.map((dept) => dept.name).join(", ") ||
                        "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      {new Date(row.establishedDate).toLocaleDateString() ||
                        "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.shape({
      address: PropTypes.shape({
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    contactDetails: PropTypes.shape({
      phone: PropTypes.string.isRequired,
      website: PropTypes.string.isRequired,
    }).isRequired,
    departments: PropTypes.array.isRequired,
    registrationNumber: PropTypes.string,
    establishedDate: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired, // Pass delete function as prop
  onEdit: PropTypes.func.isRequired, // Pass edit function as prop
};

// CollapsibleTable Component to display the table
export default function CollapsibleTable() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  // state for the dialog box start
  const [openDialog, setOpenDialog] = useState(false); // For Dialog
  const [selectedHospitalId, setSelectedHospitalId] = useState(null); // For selected hospital ID
  // for modal edit
  // Add these new states
  const [openEditDialog, setOpenEditDialog] = useState(false); // For edit modal
  const [selectedHospital, setSelectedHospital] = useState(null);

  // state for dialog box end

  // Fetch hospitals data from the API
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(
          "https://resourcehive-backend.vercel.app/api/v1/hospitals/registered-hospitals",
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzcyM2UxY2ZjZmFlODg2NWY2YmE0NyIsImlhdCI6MTc0MTEwNTI2NywiZXhwIjoxNzQxOTY5MjY3fQ.so24278sLpGglaVnHVt03l-ghfUs9gbPykwgQSU3W0w`, // Replace with your actual token
            },
          }
        );
        setHospitals(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        setLoading(false);
      }
    };

    fetchHospitals();

    // Polling the server every 30 seconds for new data (you can adjust the interval)
    const intervalId = setInterval(fetchHospitals, 30000);

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  // Handle hospital deletion
  const handleDelete = (hospitalId) => {
    setSelectedHospitalId(hospitalId); // Set the hospital ID to be deleted
    setOpenDialog(true); // Open the confirmation dialog
  };
  const confirmDelete = async () => {
    try {
      console.log(
        selectedHospitalId,
        "this is the hospital ID that wants to delete"
      );

      // Call the API to delete the hospital
      await axios.delete(
        `https://resourcehive-backend.vercel.app/api/v1/hospitals/${selectedHospitalId}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzcyM2UxY2ZjZmFlODg2NWY2YmE0NyIsImlhdCI6MTc0MTEwNTI2NywiZXhwIjoxNzQxOTY5MjY3fQ.so24278sLpGglaVnHVt03l-ghfUs9gbPykwgQSU3W0w`, // Replace with your actual token
          },
        }
      );

      // Remove the deleted hospital from the state
      setHospitals((prevHospitals) =>
        prevHospitals.filter((hospital) => hospital._id !== selectedHospitalId)
      );

      setOpenDialog(false); // Close the dialog after successful deletion
      setSelectedHospitalId(null); // Reset the selected hospital ID
    } catch (error) {
      console.error("Error deleting hospital:", error);
    }
  };

  const handleEdit = (rowData) => {
    setSelectedHospital(rowData); // Store the entire row data
    setOpenEditDialog(true); // Open the edit dialog
  };
  const handleEditSubmit = async () => {
    try {
      const url = `https://resourcehive-backend.vercel.app/api/v1/hospitals/${selectedHospital._id}`;
      console.log("Request URL:", url);
      console.log("Hospital ID:", selectedHospital._id);
      console.log("Data being sent to API:", selectedHospital);

      const response = await axios.patch(url, selectedHospital, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzcyM2UxY2ZjZmFlODg2NWY2YmE0NyIsImlhdCI6MTc0MTEwNTI2NywiZXhwIjoxNzQxOTY5MjY3fQ.so24278sLpGglaVnHVt03l-ghfUs9gbPykwgQSU3W0w`,
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
      // Handle department fields dynamically
      const deptMatch = name.match(/department(\d+)(Name|Head|Contact)/);
      if (deptMatch) {
        const deptIndex = parseInt(deptMatch[1]) - 1; // Convert to 0-based index
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
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Hospital Name</TableCell>
              <TableCell align="right">Location</TableCell>
              <TableCell align="right">Contact</TableCell>
              <TableCell align="right">Website</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Show skeleton loaders while data is loading
              Array.from(new Array(3)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="circle" width={40} height={40} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="text" width="40%" />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="text" width="80%" />
                  </TableCell>{" "}
                </TableRow>
              ))
            ) : hospitals.length > 0 ? (
              hospitals.map((hospital) => (
                <Row
                  key={hospital._id}
                  row={hospital}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hospitals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)} // Close the dialog when user clicks outside or presses Escape
          aria-describedby="alert-dialog-slide-description"
          sx={{
            "& .MuiDialog-paper": {
              backgroundColor: "#051221 !important", // Replace with your preferred color
              color: "white !important", // Change text color inside the dialog
            },
          }}
        >
          <DialogTitle>{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to delete this hospital? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              color="primary"
              sx={{
                backgroundColor: "#f44336", // Slightly darker red background
                color: "#ffffff", // Brighter white text color
                "&:hover": { backgroundColor: "#d32f2f" }, // A bit darker on hover
              }}
            >
              Disagree
            </Button>
            <Button
              onClick={confirmDelete}
              color="secondary"
              sx={{
                backgroundColor: "#388e3c", // Darker green background
                color: "#ffffff", // Brighter white text color
                "&:hover": { backgroundColor: "#2c6e31" }, // Even darker on hover
              }}
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        {/* Edit Dialog */}
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
                {/* Row 1: Hospital Name, Street, City */}
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

                {/* Row 2: State, Zip Code, Country */}
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

                {/* Row 3: Phone, Email, Website */}
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

                {/* Department 1 */}
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, color: "#FFFFFF" }}
                >
                  Department 1
                </Typography>
                {/* Row 4: Department 1 Name, Head, Contact */}
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
                      value={
                        selectedHospital.departments[0]?.contactNumber || ""
                      }
                      onChange={handleInputChange}
                      sx={{ padding: "7px" }}
                    />
                  </FormControl>
                </Stack>

                {/* Department 2 */}
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, color: "#FFFFFF" }}
                >
                  Department 2
                </Typography>
                {/* Row 5: Department 2 Name, Head, Contact */}
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
                      value={
                        selectedHospital.departments[1]?.contactNumber || ""
                      }
                      onChange={handleInputChange}
                      sx={{ padding: "7px" }}
                    />
                  </FormControl>
                </Stack>

                {/* Row 6: Registration Number, Established Date, Placeholder */}
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
      </TableContainer>
    </>
  );
}
