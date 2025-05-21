import * as React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

// Row Component to show hospital details
function Row({ row }) {
  const navigate = useNavigate();

  const handleJoinRequest = async (hospitalId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized! Please login again.");
        navigate("/signin");
        return;
      }

      const response = await axios.post(
        `https://resourcehive-backend.vercel.app/api/v1/hospitals/hospital-joining-request/${hospitalId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Join request sent successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to send join request!");
    }
  };

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {row.name || "N/A"}
      </TableCell>
      <TableCell align="right">
        {row.location?.address?.city && row.location?.address?.state
          ? `${row.location.address.city}, ${row.location.address.state}`
          : "N/A"}
      </TableCell>
      <TableCell align="right">{row.contactDetails?.phone || "N/A"}</TableCell>
      <TableCell align="right">
        {row.contactDetails?.website ? (
          <a
            href={row.contactDetails.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.contactDetails.website}
          </a>
        ) : (
          "N/A"
        )}
      </TableCell>
      <TableCell align="right">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleJoinRequest(row._id)}
        >
          Join
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function ManagerHospitalSelection(props) {
  const [hospitals, setHospitals] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const token = localStorage.getItem("token"); // or however you store your token

        const response = await axios.get(
          "https://resourcehive-backend.vercel.app/api/v1/hospitals/registered-hospitals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response.data.data);
        setHospitals(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        toast.error("Failed to fetch hospitals");
        setLoading(false);
      }
    };

    fetchHospitals();
    const intervalId = setInterval(fetchHospitals, 30000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <TableContainer component={Paper}>
          <Table aria-label="hospital table">
            <TableHead>
              <TableRow>
                <TableCell>Hospital Name</TableCell>
                <TableCell align="right">Location</TableCell>
                <TableCell align="right">Contact</TableCell>
                <TableCell align="right">Website</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from(new Array(3)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width="60%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width="40%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  </TableRow>
                ))
              ) : hospitals.length > 0 ? (
                hospitals.map((hospital) => (
                  <Row key={hospital._id} row={hospital} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hospitals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </SignInContainer>
    </AppTheme>
  );
}
