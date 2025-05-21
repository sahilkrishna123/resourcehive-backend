import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Skeleton, // Added Skeleton import
} from "@mui/material";
import EquipmentRow from "./EquipmentRow/MEquipmentRow"; // Import the new component

// const AUTH_TOKEN =
//   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzcyM2UxY2ZjZmFlODg2NWY2YmE0NyIsImlhdCI6MTc0MTEwNTI2NywiZXhwIjoxNzQxOTY5MjY3fQ.so24278sLpGglaVnHVt03l-ghfUs9gbPykwgQSU3W0w";

const RegisteredEquipment = ({ onHospitalSelect }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true); // Added loading state

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoadingHospitals(true); // Set loading to true before fetch
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
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched hospitals:", response.data.data);
        setHospitals(response.data.data || []);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setLoadingHospitals(false); // Set loading to false after fetch completes
      }
    };
    fetchHospitals();
  }, []);

  const handleAddEquipment = (hospitalData) => {
    console.log("Hospital data passed to onHospitalSelect:", hospitalData);
    if (onHospitalSelect) {
      onHospitalSelect(hospitalData);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Hospital Name</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loadingHospitals ? (
            // Show Skeleton rows while loading
            Array.from(new Array(3)).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="circular" width={24} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={60} />
                </TableCell>
              </TableRow>
            ))
          ) : hospitals.length > 0 ? (
            hospitals.map((hospital) => (
              <EquipmentRow
                key={hospital._id}
                hospital={hospital}
                onAddEquipment={handleAddEquipment}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No hospitals found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RegisteredEquipment;