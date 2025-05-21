import React from "react";
import MiniDrawer from "../drawer/AdminDrawer";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const LayoutContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  position: "relative",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...(theme.palette.mode === "dark" && {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <MiniDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Centers table
          justifyContent: "flex-start",
          width: "calc(100% - drawerWidth)", // Adjusts width
          paddingTop: "20px",
          marginTop: "55px",
          marginRight:"50px"
        }}
      >
        {children}
      </Box>
    </LayoutContainer>
  );
};

export default Layout;
