import React, { useEffect, useState } from "react";
import axios from "axios";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PropTypes from "prop-types";
import TDeleteHospital from "../../Tech/HospitalsTables/TDeleteHospital"; // Import the new DeleteHospital component
import TEditHospital from "../../Tech/HospitalsTables/TDeleteHospital"; // Import the new EditHospital component

// Row Component to show hospital details
function Row({ row, onDelete, onEdit }) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete(row._id);
  };

  const handleEdit = () => {
    onEdit(row);
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
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default function CollapsibleTable() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        // Fetch token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage. Please log in.");
          setHospitals([]); // Set empty array if no token
          return;
        }
        const response = await axios.get(
          "https://resourcehive-backend.vercel.app/api/v1/hospitals/registered-hospitals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
    const intervalId = setInterval(fetchHospitals, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = (hospitalId) => {
    setSelectedHospitalId(hospitalId);
    setOpenDialog(true);
  };

  const handleEdit = (rowData) => {
    setSelectedHospital(rowData);
    setOpenEditDialog(true);
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
                  </TableCell>
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
      </TableContainer>

      {/* Use the extracted DeleteHospital component */}
      <TDeleteHospital
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedHospitalId={selectedHospitalId}
        setHospitals={setHospitals}
        setSelectedHospitalId={setSelectedHospitalId}
      />

      {/* Use the extracted EditHospital component */}
      <TEditHospital
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        selectedHospital={selectedHospital}
        setSelectedHospital={setSelectedHospital}
        setHospitals={setHospitals}
      />
    </>
  );
}
