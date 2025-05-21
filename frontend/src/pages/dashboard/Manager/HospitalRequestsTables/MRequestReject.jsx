import axios from "axios";
import toast from "react-hot-toast";

const RequestReject = async (hospitalId, userId, currentStatus, setRequests) => {
  console.log("Hospital ID:", hospitalId);
  console.log("User ID:", userId);
  console.log("Current status:", currentStatus);

  try {
    // Validate inputs
    if (!hospitalId || !userId || !currentStatus) {
      console.error("Missing required parameters:", { hospitalId, userId, currentStatus });
      toast.error("Invalid request parameters.");
      return;
    }

    // Fetch token from localStorage
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      console.error("No token found in localStorage. Please log in.");
      toast.error("Authentication required. Please log in.");
      return;
    }

    // API request logic for rejection
    if (currentStatus === "approved") {
      console.log("Sending PATCH request to reject request...");
      const response = await axios.patch(
        `https://resourcehive-backend.vercel.app/api/v1/hospitals/hospital-technician-request-rejection/${hospitalId}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Response:", response.data);

      // Update local state to reflect disapproval
      setRequests((prevRequests) =>
        Array.isArray(prevRequests)
          ? prevRequests.map((req) =>
              req.userId?._id === userId
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
          : prevRequests
      );
      toast.success("Request rejected successfully.");
    } else {
      // Initial rejection: Just mark as rejected without changing role
      setRequests((prevRequests) =>
        Array.isArray(prevRequests)
          ? prevRequests.map((req) =>
              req.userId?._id === userId
                ? {
                    ...req,
                    userId: { ...req.userId, approvalStatus: "rejected" },
                  }
                : req
            )
          : prevRequests
      );
      toast.success("Request marked as rejected.");
    }
  } catch (error) {
    console.error("Error rejecting request:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      toast.error("Unauthorized: Please log in again.");
      // Optional: Redirect to login page
      // window.location.href = "/login";
    } else {
      toast.error(error.response?.data?.message || "Failed to reject the request.");
    }
  }
};

export default RequestReject;