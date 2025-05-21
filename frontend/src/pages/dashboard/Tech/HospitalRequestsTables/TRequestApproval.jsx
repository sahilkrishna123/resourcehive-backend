import axios from "axios";
import toast from "react-hot-toast";

// Token constant to ensure consistency
// const AUTH_TOKEN =
//   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzcyM2UxY2ZjZmFlODg2NWY2YmE0NyIsImlhdCI6MTc0MTEwNTI2NywiZXhwIjoxNzQxOTY5MjY3fQ.so24278sLpGglaVnHVt03l-ghfUs9gbPykwgQSU3W0w";

// Approve action: Set role to "manager" if not already approved
const RequestApproval = async (hospitalId, userId, setRequests) => {
  try {
    // Fetch token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage. Please log in.");
      toast.error("Authentication required. Please log in.");
      return;
    }
    // Check if the user is already approved (role matches requestedRole)
    setRequests((prevRequests) => {
      const request = prevRequests.find((req) => req.userId._id === userId);
      if (request && request.userId.role === request.userId.requestedRole) {
        toast.success("This user is already approved by admin"); // Show toast notification
        return prevRequests; // No state change, just return current state
      }

      // If not approved, proceed with the API call
      axios
        .patch(
          `https://resourcehive-backend.vercel.app/api/v1/hospitals/hospital-request-approval/${hospitalId}/${userId}`,
          { role: "manager" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          // Update local state to reflect approval
          return setRequests((prev) =>
            prev.map((req) =>
              req.userId._id === userId
                ? {
                    ...req,
                    userId: {
                      ...req.userId,
                      approvalStatus: "approved",
                      role: "manager",
                    },
                  }
                : req
            )
          );
        })
        .catch((error) => {
          console.error("Error approving request:", error);
          return prevRequests; // Return unchanged state on error
        });

      // Return current state immediately (async handling is within the promise)
      return prevRequests;
    });
  } catch (error) {
    console.error("Error in RequestApproval:", error);
  }
};

export default RequestApproval;