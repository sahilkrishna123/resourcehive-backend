import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Session Not Found",
        text: "No active session exists. You will be redirected to the dashboard.",
        confirmButtonText: "Confirm", // Replaced "OK" with "Confirm"
        confirmButtonColor: "#388e3c",
        customClass: {
          popup: "custom-swal-popup", // Custom class for styling
        },
        didOpen: () => {
          // Apply styles with null checks
          const popup = document.querySelector(".custom-swal-popup");
          if (popup) popup.style.backgroundColor = "#051221";
          const title = document.querySelector(".swal2-title");
          if (title) title.style.color = "#ffffff"; // White text
          const content = document.querySelector(".swal2-content");
          if (content) content.style.color = "#ffffff"; // White text
          const icon = document.querySelector(".swal2-icon svg");
          if (icon) icon.style.fill = "#1a1a1a"; // Dark icon color
        },
      }).then(() => {
        navigate("/AdminDashboard"); // Stay on AdminDashboard
      });
      return; // Prevent further code execution if there's no token
    }

    // Show confirmation dialog
    Swal.fire({
      icon: "question",
      title: "Confirm Logout",
      text: "Are you sure you wish to log out? This will terminate your current session.",
      showCancelButton: true,
      confirmButtonText: "Yes, Log Out",
      cancelButtonText: "No, Cancel",
      confirmButtonColor: "#388e3c",
      cancelButtonColor: "#f44336",
      customClass: {
        popup: "custom-swal-popup", // Custom class for styling
      },
      didOpen: () => {
        // Apply styles with null checks
        const popup = document.querySelector(".custom-swal-popup");
        if (popup) popup.style.backgroundColor = "#051221";
        const title = document.querySelector(".swal2-title");
        if (title) title.style.color = "#ffffff"; // White text
        const content = document.querySelector(".swal2-content");
        if (content) content.style.color = "#ffffff"; // White text
        const icon = document.querySelector(".swal2-icon svg");
        if (icon) icon.style.fill = "#1a1a1a"; // Dark icon color
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token"); // Remove token

        Swal.fire({
          title: "Logout Successful",
          text: "You have been successfully logged out.",
          confirmButtonText: "Confirm", // Replaced "OK" with "Confirm"
          confirmButtonColor: "#388e3c",
          customClass: {
            popup: "custom-swal-popup", // Custom class for styling
          },
          didOpen: () => {
            const popup = document.querySelector(".custom-swal-popup");
            if (popup) popup.style.backgroundColor = "#051221";
            const title = document.querySelector(".swal2-title");
            if (title) title.style.color = "#ffffff"; // White text
            const content = document.querySelector(".swal2-content");
            if (content) content.style.color = "#ffffff"; // White text
            const icon = document.querySelector(".swal2-icon svg");
            if (icon) icon.style.fill = "#1a1a1a"; // Dark icon color
          },
        }).then(() => {
          navigate("/"); // Redirect to home
        });
      } else {
        navigate("/AdminDashboard"); // Navigate back to AdminDashboard on cancel
      }
    });
  }, [navigate]);

  return (
    <div
      style={{ backgroundColor: "#051221", height: "100vh", width: "100vw" }}
    />
  );
};

export default Logout;
