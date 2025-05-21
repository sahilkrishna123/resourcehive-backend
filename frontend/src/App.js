// src/App.jsx
import React, { useEffect } from "react";
import RouteComponent from "./routes/Routes";
import { Toaster } from "react-hot-toast";

// Disable console logs in production
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
  console.trace = () => {};
}

//  CHANGE THIS TO false WHEN YOU WANT TO SHOW THE PROJECT
const BLOCK_PUBLIC_ACCESS = false;

const App = () => {
  const isBlockedDomain = window.location.hostname === "fydp-resourcehive.vercel.app";

  useEffect(() => {
    localStorage.setItem("mui-color-scheme-dark", "dark");
    localStorage.setItem("mui-color-scheme-light", "light");
    localStorage.setItem("mui-mode", "system");
  }, []);

  if (BLOCK_PUBLIC_ACCESS && isBlockedDomain) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          color: "#fff",
          flexDirection: "column",
          fontFamily: "monospace",
          textAlign: "center",
        }}
      >
        <h1>404 | Project Not Found</h1>
        <p>This deployment is no longer available.</p>
      </div>
    );
  }

  return (
    <div>
      <RouteComponent />
      <Toaster />
    </div>
  );
};

export default App;
