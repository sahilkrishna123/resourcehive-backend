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
  Skeleton,
  IconButton,
  Collapse,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditMaintenance from "./EditMaintenance"; // Adjust path as needed
import DeleteMaintenance from "./DeleteMaintenance"; // Adjust path as needed

// Row Component to show maintenance details
function Row({
  row,
  setOpenEditDialog,
  setOpenDeleteDialog,
  setSelectedMaintenance,
}) {
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    setSelectedMaintenance(row);
    setOpenEditDialog(true);
  };

  const handleDelete = () => {
    setSelectedMaintenance(row);
    setOpenDeleteDialog(true);
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          {/* <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton> */}
        </TableCell>
        <TableCell component="th" scope="row">
          {new Date(row.timestamp).toLocaleString()}
        </TableCell>
        <TableCell align="right">
          <IconButton
            color="primary"
            sx={{ marginRight: 1 }}
            onClick={handleEdit}
          >
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Additional Details
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell>Maintenance ID</TableCell>
                    <TableCell>Timestamp (ISO)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{row.maintenanceId}</TableCell>
                    <TableCell>{row.timestamp}</TableCell>
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

export default function MaintenanceTable() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [maintenances, setMaintenances] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [loadingEquipment, setLoadingEquipment] = useState(false);
  const [loadingMaintenances, setLoadingMaintenances] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);

  // Fetch hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      setLoadingHospitals(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage. Please log in.");
          setHospitals([]);
          return;
        }
        const response = await axios.get(
          "https://resourcehive-backend.vercel.app/api/v1/hospitals/registered-hospitals",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Hospitals API response:", response.data);
        setHospitals(response.data.data || []);
      } catch (error) {
        console.error("Error fetching hospitals:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      } finally {
        setLoadingHospitals(false);
      }
    };
    fetchHospitals();
  }, []);

  // Fetch equipment for selected hospital
  useEffect(() => {
    if (!selectedHospital) {
      setEquipment([]);
      setSelectedEquipment("");
      setMaintenances([]);
      return;
    }
    const fetchEquipment = async () => {
      setLoadingEquipment(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage. Please log in.");
          setEquipment([]);
          return;
        }
        console.log("Fetching equipment for hospital ID:", selectedHospital);
        const response = await axios.get(
          `https://resourcehive-backend.vercel.app/api/v1/equipments/${selectedHospital}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Full equipment API response:", response);
        console.log("Raw response.data:", response.data);
        console.log("Equipment data (response.data.data):", response.data.data);
        console.log(
          "Is response.data.data an array?",
          Array.isArray(response.data.data)
        );
        const equipmentData = response.data.data || response.data;
        console.log("equipmentData before processing:", equipmentData);
        const equipmentsArray = Array.isArray(equipmentData)
          ? equipmentData
          : equipmentData.data || [equipmentData];
        console.log(
          "equipmentsArray after processing:",
          equipmentsArray,
          "IDs:",
          equipmentsArray.map((eq) => eq.equipmentId)
        );
        setEquipment(equipmentsArray);
      } catch (error) {
        console.error("Error fetching equipment:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setEquipment([]);
      } finally {
        setLoadingEquipment(false);
      }
    };
    fetchEquipment();
  }, [selectedHospital]);

  // Fetch maintenances for selected equipment
  useEffect(() => {
    if (!selectedHospital || !selectedEquipment) {
      setMaintenances([]);
      return;
    }
    console.log("Fetching maintenances for equipment ID:", selectedEquipment);
    const fetchMaintenances = async () => {
      setLoadingMaintenances(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage. Please log in.");
          setMaintenances([]);
          return;
        }
        const response = await axios.get(
          `https://resourcehive-backend.vercel.app/api/v1/${selectedHospital}/${selectedEquipment}/maintenance`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Maintenance API full response:", response);
        console.log("Maintenance API response.data:", response.data);
        console.log(
          "Maintenance data (response.data.data):",
          response.data.data
        );
        console.log(
          "Maintenance history (response.data.data.maintenanceHistory):",
          response.data.data?.maintenanceHistory
        );
        console.log(
          "Is response.data.data.maintenanceHistory an array?",
          Array.isArray(response.data.data?.maintenanceHistory)
        );
        const maintenanceData =
          response.data.data?.maintenanceHistory || response.data.data || [];
        console.log("maintenanceData after processing:", maintenanceData);

        // Log _id and maintenanceId for each record
        maintenanceData.forEach((record) => {
          console.log(
            `Record: _id=${record._id}, maintenanceId=${record.maintenanceId}`
          );
        });

        setMaintenances(Array.isArray(maintenanceData) ? maintenanceData : []);
      } catch (error) {
        console.error("Error fetching maintenances:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setMaintenances([]);
      } finally {
        setLoadingMaintenances(false);
      }
    };
    fetchMaintenances();
    const intervalId = setInterval(fetchMaintenances, 300000);
    return () => clearInterval(intervalId);
  }, [selectedHospital, selectedEquipment]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <Typography variant="h4" className="mb-6 text-gray-800 font-bold" style={{marginBottom:"20px"}}>
          Maintenance Records
        </Typography>

        {/* Hospital Dropdown */}
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="hospital-select-label">Select Hospital</InputLabel>
          <Select
            labelId="hospital-select-label"
            value={selectedHospital}
            label="Select Hospital"
            onChange={(e) => setSelectedHospital(e.target.value)}
            disabled={loadingHospitals}
          >
            {loadingHospitals ? (
              <MenuItem value="" disabled>
                <Skeleton variant="text" width="100%" />
              </MenuItem>
            ) : hospitals.length > 0 ? (
              hospitals.map((hospital) => (
                <MenuItem key={hospital._id} value={hospital._id}>
                  {hospital.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                No hospitals found
              </MenuItem>
            )}
          </Select>
        </FormControl>

        {/* Equipment Dropdown */}
        <FormControl fullWidth sx={{ mb: 6 }} disabled={!selectedHospital}>
          <InputLabel id="equipment-select-label">Select Equipment</InputLabel>
          <Select
            labelId="equipment-select-label"
            value={selectedEquipment}
            label="Select Equipment"
            onChange={(e) => setSelectedEquipment(e.target.value)}
            disabled={loadingEquipment || !selectedHospital}
          >
            {loadingEquipment ? (
              <MenuItem value="" disabled>
                <Skeleton variant="text" width="100%" />
              </MenuItem>
            ) : equipment.length > 0 ? (
              equipment.map((equip) => (
                <MenuItem key={equip.equipmentId} value={equip.equipmentId}>
                  {equip.name || equip.type || "Unnamed Equipment"}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                No equipment found
              </MenuItem>
            )}
          </Select>
        </FormControl>

        {/* Maintenance Table */}
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Timestamp</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingMaintenances ? (
                Array.from(new Array(3)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="circular" width={40} height={40} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width="40%" />
                    </TableCell>
                  </TableRow>
                ))
              ) : maintenances.length > 0 ? (
                maintenances.map((maintenance) => (
                  <Row
                    key={maintenance._id}
                    row={maintenance}
                    setOpenEditDialog={setOpenEditDialog}
                    setOpenDeleteDialog={setOpenDeleteDialog}
                    setSelectedMaintenance={setSelectedMaintenance}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No maintenance records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Maintenance Dialog */}
        <EditMaintenance
          openEditDialog={openEditDialog}
          setOpenEditDialog={setOpenEditDialog}
          selectedMaintenance={selectedMaintenance}
          setSelectedMaintenance={setSelectedMaintenance}
          hospitalId={selectedHospital}
          equipmentId={selectedEquipment}
          setMaintenances={setMaintenances}
        />

        {/* Delete Maintenance Dialog */}
        <DeleteMaintenance
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          selectedMaintenance={selectedMaintenance}
          hospitalId={selectedHospital}
          equipmentId={selectedEquipment}
          setMaintenances={setMaintenances}
        />
      </div>
    </div>
  );
}