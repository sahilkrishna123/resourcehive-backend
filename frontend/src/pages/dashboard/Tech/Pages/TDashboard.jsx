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
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormLabel,
  CssBaseline,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Layout from "../components/Layout/Layout";
import AppTheme from "../../../form/admin/shared-theme/AppTheme";
import toast from "react-hot-toast";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "800px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...(theme.palette.mode === "dark" && {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)({
  flex: 1,
  minHeight: "100vh",
  padding: "60px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// Resolve Maintenance Modal Component
const ResolveMaintenanceModal = ({
  open,
  onClose,
  hospitalId,
  equipmentId,
  maintenanceId,
  onResolve,
}) => {
  const [formData, setFormData] = useState({
    resolveMaintenance: "resolved",
    resolveMaintenanceTimestamp: new Date().toISOString().slice(0, 16),
    resolverId: localStorage.getItem("userId") || "", // Auto-set to logged-in user's _id
    resolveDescription: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    console.log(
      "Submitting maintenanceId:",
      maintenanceId,
      "resolverId:",
      formData.resolverId
    ); // Debug log
    if (!formData.resolverId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage. Please log in.");
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await axios.patch(
        `https://resourcehive-backend.vercel.app/api/v1/${hospitalId}/${equipmentId}/maintenance/${maintenanceId}/resolveMaintenance`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Maintenance resolved successfully!");
      onResolve(maintenanceId);
      onClose();
    } catch (error) {
      console.error("Error resolving maintenance:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(
        error.response?.data?.message || "Failed to resolve maintenance."
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#051221 !important",
          color: "white !important",
          width: "500px",
        },
      }}
    >
      <DialogTitle>Resolve Maintenance</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <FormLabel sx={{ color: "white" }}>Status</FormLabel>
            <TextField
              name="resolveMaintenance"
              value={formData.resolveMaintenance}
              onChange={handleChange}
              disabled
              sx={{ input: { color: "white" } }}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ color: "white" }}>Resolution Timestamp</FormLabel>
            <TextField
              name="resolveMaintenanceTimestamp"
              type="datetime-local"
              value={formData.resolveMaintenanceTimestamp}
              onChange={handleChange}
              required
              sx={{ input: { color: "white" } }}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ color: "white" }}>Resolve Description</FormLabel>
            <TextField
              name="resolveDescription"
              value={formData.resolveDescription}
              onChange={handleChange}
              multiline
              // rows={4}
              required
              sx={{ textarea: { color: "white" } }}
              placeholder="Describe the resolution actions taken"
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: "#f44336",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#d32f2f" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#388e3c",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#2c6e31" },
          }}
        >
          Resolve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Row Component to show maintenance details
function Row({ row, hospitalId, equipmentId, onResolve }) {
  const [open, setOpen] = useState(false);
  const [openResolveModal, setOpenResolveModal] = useState(false);

  console.log("Row maintenanceId:", row.maintenanceId, "_id:", row._id); // Debug log

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {new Date(row.timestamp).toLocaleString()}
        </TableCell>
        <TableCell align="right">
          {/* <IconButton color="primary" sx={{ marginRight: 1 }}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" sx={{ marginRight: 1 }}>
            <DeleteIcon />
          </IconButton> */}
          <IconButton
            color="success"
            onClick={() => setOpenResolveModal(true)}
            disabled={row.resolveMaintenance === "resolved"}
          >
            <CheckCircleIcon />
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
                    <TableCell>Status</TableCell>
                    <TableCell>Resolve Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{row.maintenanceId}</TableCell>
                    <TableCell>{row.timestamp}</TableCell>
                    <TableCell>{row.resolveMaintenance || "Pending"}</TableCell>
                    <TableCell>{row.resolveDescription || "N/A"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <ResolveMaintenanceModal
        open={openResolveModal}
        onClose={() => setOpenResolveModal(false)}
        hospitalId={hospitalId}
        equipmentId={equipmentId}
        maintenanceId={row.maintenanceId}
        onResolve={onResolve}
      />
    </>
  );
}

const Dashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [maintenances, setMaintenances] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [loadingEquipment, setLoadingEquipment] = useState(false);
  const [loadingMaintenances, setLoadingMaintenances] = useState(false);

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

  // Handle maintenance resolution
  const handleMaintenanceResolved = (maintenanceId) => {
    console.log(
      "Received maintenanceId in handleMaintenanceResolved:",
      maintenanceId
    ); // Debug log
    // Refresh maintenances list
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
        const maintenanceData =
          response.data.data?.maintenanceHistory || response.data.data || [];
        setMaintenances(Array.isArray(maintenanceData) ? maintenanceData : []);
      } catch (error) {
        console.error("Error refreshing maintenances:", error);
        setMaintenances([]);
      } finally {
        setLoadingMaintenances(false);
      }
    };
    fetchMaintenances();
  };

  if (loadingHospitals) {
    return (
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Layout>
          <SignInContainer>
            <CircularProgress />
          </SignInContainer>
        </Layout>
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Layout>
        <SignInContainer>
          <Card>
            <Typography variant="h4" className="mb-6 text-gray-800 font-bold">
              Maintenance Records
            </Typography>

            {/* Hospital Dropdown */}
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="hospital-select-label">
                Select Hospital
              </InputLabel>
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
              <InputLabel id="equipment-select-label">
                Select Equipment
              </InputLabel>
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
                        key={maintenance.maintenanceId}
                        row={maintenance}
                        hospitalId={selectedHospital}
                        equipmentId={selectedEquipment}
                        onResolve={handleMaintenanceResolved}
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
          </Card>
        </SignInContainer>
      </Layout>
    </AppTheme>
  );
};

export default Dashboard;
