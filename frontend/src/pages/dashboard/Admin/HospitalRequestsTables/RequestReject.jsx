import axios from "axios";
import toast from "react-hot-toast";

// Reject/Disapprove action: Set role to "user" if approved, otherwise just mark as rejected
const RequestReject = async (
  hospitalId,
  userId,
  currentStatus,
  setRequests
) => {
  console.log("Hospital ID:", hospitalId);
  console.log("User ID:", userId);
  console.log("current status", currentStatus);

  try {
    // Fetch token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage. Please log in.");
      toast.error("Authentication required. Please log in.");
      return;
    }

    // API request logic for rejection
    if (currentStatus === "approved") {
      console.log(hospitalId, userId, "Rejecting request");
      await axios.patch(
        `https://resourcehive-backend.vercel.app/api/v1/hospitals/hospital-manager-request-rejected-by-admin/${hospitalId}/${userId}`,
        { role: "user" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state to reflect disapproval
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.userId._id === userId
            ? {
                ...req,
                userId: {
                  ...req.userId,
                  approvalStatus: "rejected",
                  role: "user",
                },
              }
            : req
        )
      );
    } else {
      // Initial rejection: Just mark as rejected without changing role
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.userId._id === userId
            ? { ...req, userId: { ...req.userId, approvalStatus: "rejected" } }
            : req
        )
      );
    }
  } catch (error) {
    console.error("Error rejecting/disapproving request:", error);
    toast.error("Failed to reject the request. Please try again.");
  }
};

export default RequestReject;
