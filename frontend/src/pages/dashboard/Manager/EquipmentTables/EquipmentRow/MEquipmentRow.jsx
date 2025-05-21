import React, { useState, useEffect } from "react";
import axios from "axios";
import EventIcon from "@mui/icons-material/Event";
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  Skeleton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import DeleteEquipment from "../MDeleteEquipment";
import EditEquipment from "../MEditEquipment";
import MSetSchedule from "frontend/src/pages/dashboard/Manager/EquipmentTables/EquipmentRow/MSetSchedule.jsx"; // Import MSetSchedule

function EquipmentRow({ hospital, onAddEquipment }) {
  const [open, setOpen] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [loadingEquipments, setLoadingEquipments] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false); // State for MSetSchedule dialog
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Fetch equipments when the row is expanded or after a manual refetch trigger
  useEffect(() => {
    console.log(
      "EquipmentRow useEffect triggered with open:",
      open,
      "refetchTrigger:",
      refetchTrigger
    );
    if (open) {
      const fetchEquipments = async () => {
        setLoadingEquipments(true); // Show Skeleton during fetch/refetch
        try {
          // Fetch token from localStorage
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("No token found in localStorage. Please log in.");
            setEquipments([]); // Set empty array if no token
            return;
          }
          const response = await axios.get(
            `https://resourcehive-backend.vercel.app/api/v1/equipments/${hospital._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Full API response:", response);
          console.log("Raw response.data:", response.data);
          console.log(
            "Equipment data (response.data.data):",
            response.data.data
          );
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
          setEquipments(equipmentsArray);
        } catch (error) {
          console.error("Error fetching equipments:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
          setEquipments([]);
        } finally {
          setLoadingEquipments(false); // Hide Skeleton after fetch completes
        }
      };
      fetchEquipments();
    }
  }, [open, hospital._id, refetchTrigger]);

  useEffect(() => {
    console.log(
      "equipments state updated:",
      equipments,
      "IDs:",
      equipments.map((eq) => eq.equipmentId)
    );
    if (equipments.length === 0 && !loadingEquipments) {
      console.log("equipments reset to empty array!");
    }
  }, [equipments, loadingEquipments]);

  const handleOpenDeleteDialog = (equipment) => {
    console.log("Equipment object in handleOpenDeleteDialog:", equipment);
    console.log("Using equipmentId for deletion:", equipment.equipmentId);
    setSelectedEquipmentId(equipment.equipmentId);
    setOpenDeleteDialog(true);
  };

  const handleOpenEditDialog = (equipment) => {
    console.log("Equipment object received:", equipment);

    if (!equipment || !equipment.equipmentId) {
      console.error("❌ equipmentId is missing or undefined!");
      return;
    }

    console.log(
      "✅ Equipment ID in handleOpenEditDialog:",
      equipment.equipmentId
    );

    setSelectedEquipment(equipment);
    setOpenEditDialog(true);
  };

  // Define handleOpenScheduleDialog to open MSetSchedule dialog
  const handleOpenScheduleDialog = (equipment) => {
    console.log("Opening schedule dialog for equipment:", equipment);
    setSelectedEquipment(equipment);
    setOpenScheduleDialog(true);
  };

  // Callback to trigger refetch after deletion or updation
  const handleEquipmentChange = () => {
    console.log("handleEquipmentChange called, triggering refetch...");
    setRefetchTrigger((prev) => prev + 1); // Increment to refetch equipments
  };

  return (
    <>
      <TableRow key={hospital._id} sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{hospital.name}</TableCell>
        <TableCell>{hospital.location.address.city}</TableCell>
        <TableCell>{hospital.contactDetails.phone}</TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={() =>
              onAddEquipment({ id: hospital._id, name: hospital.name })
            }
          >
            <AddIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow key={`${hospital._id}-details`}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Equipment List
              </Typography>
              <Table size="small" aria-label="equipments">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Serial Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingEquipments ? (
                    // Show Skeleton during initial load and refetch
                    Array.from(new Array(3)).map((_, index) => (
                      <TableRow key={index}>
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
                  ) : equipments.length > 0 ? (
                    equipments.map((equipment, index) => {
                      console.log(
                        "Rendering Equipment ID:",
                        equipment.equipmentId
                      );
                      console.log("Full Equipment object:", equipment);
                      console.log(
                        "All keys in equipment:",
                        Object.keys(equipment)
                      );
                      console.log("Attempting to render properties:", {
                        type: equipment.type,
                        model: equipment.model,
                        serialNumber: equipment.serialNumber,
                        status: equipment.status,
                        location: equipment.location,
                      });
                      return (
                        <TableRow key={equipment.equipmentId || index}>
                          <TableCell>
                            {equipment.type || "Type Missing"}
                          </TableCell>
                          <TableCell>
                            {equipment.model || "Model Missing"}
                          </TableCell>
                          <TableCell>
                            {equipment.serialNumber || "Serial Number Missing"}
                          </TableCell>
                          <TableCell>
                            {equipment.status || "Status Missing"}
                          </TableCell>
                          <TableCell>
                            {equipment.location || "Location Missing"}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEditDialog(equipment)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleOpenDeleteDialog(equipment)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleOpenScheduleDialog(equipment) // Pass equipment to dialog
                                }
                                title="Set Schedule"
                              >
                                <EventIcon />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7}>No equipment added yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      {openDeleteDialog && (
        <DeleteEquipment
          openDialog={openDeleteDialog}
          setOpenDialog={setOpenDeleteDialog}
          hospitalId={hospital._id}
          equipmentId={selectedEquipmentId}
          setEquipments={setEquipments}
          onEquipmentChange={handleEquipmentChange}
        />
      )}

      {openEditDialog && (
        <EditEquipment
          openDialog={openEditDialog}
          setOpenDialog={setOpenEditDialog}
          hospitalId={hospital._id}
          equipment={selectedEquipment}
          setEquipments={setEquipments}
          onEquipmentChange={handleEquipmentChange}
        />
      )}

      {openScheduleDialog && (
        <MSetSchedule
          openDialog={openScheduleDialog}
          setOpenDialog={setOpenScheduleDialog}
          hospitalId={hospital._id}
          equipment={selectedEquipment}
          setEquipments={setEquipments}
          onScheduleChange={handleEquipmentChange} // Pass refetch callback
        />
      )}
    </>
  );
}

export default EquipmentRow;