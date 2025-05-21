import React, { useState, useRef, useCallback } from "react";
import Layout from "../components/Layout/Layout";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../../../form/admin/shared-theme/AppTheme";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import { Stack, Typography } from "@mui/material";
import RegisteredEquipment from "../EquipmentTables/RegisteredEquipment";
import RegisterEquipment from "../EquipmentTables/RegisterEquipment";

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
  ...(theme.palette.mode === "dark" && {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)({
  flex: 1,
  minHeight: "100vh",
  padding: "160px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const Equipment = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const registerEquipmentRef = useRef(null);

  const handleHospitalSelect = useCallback((hospitalData) => {
    console.log("Received hospital data in Equipment:", hospitalData);
    setSelectedHospital(hospitalData);

    // Add a slight delay to ensure DOM updates are complete
    setTimeout(() => {
      if (registerEquipmentRef.current) {
        console.log("Scrolling to RegisterEquipment");
        registerEquipmentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.warn("registerEquipmentRef is not set");
      }
    }, 100);
  }, []);

  console.log("Equipment component rendered! Selected Hospital:", selectedHospital);

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Layout>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            textAlign: "left",
            width: "100%",
            padding: "20px",
          }}
        >
          Registered Equipment
        </Typography>
        <RegisteredEquipment onHospitalSelect={handleHospitalSelect} />
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            textAlign: "left",
            width: "100%",
            padding: "20px",
          }}
        >
          Register Equipment
        </Typography>
        <RegisterEquipment
          ref={registerEquipmentRef}
          hospital={selectedHospital}
        />
      </Layout>
    </AppTheme>
  );
};

export default Equipment;