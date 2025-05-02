import express from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";
import * as hospitalController from "../controllers/hospitalController.js";

const router = express.Router();

// Get One Hospital
router.get("/getOne/:hospitalId",authController.protect, hospitalController.getOneHospital);

// Hospital joining request by users
router.post(
  "/hospital-joining-request/:id",
  authController.protect,
  hospitalController.hospitalJoiningRequest
);

// ADMIN Area!!!!!
// Hospital request's Approval by ADMIN only
router.patch(
  "/hospital-request-approval/:hospitalId/:userId",
  authController.protect,
  authController.restrictTo("admin"),
  hospitalController.joiningRequestApproval
);

// Manager's Request Rejected by Admin only
router.patch(
  "/hospital-manager-request-rejected-by-admin/:hospitalId/:userId",
  authController.protect,
  authController.restrictTo("admin"),
  hospitalController.joiningRequestRejection
);

// Get All Approval Requests by ADMIN only
router.get("/:hospitalId/get-approval-requests",
  authController.protect,
  authController.restrictTo("admin"),
  hospitalController.getAllRequests);

// Manager & Admin Restricted Area !!!!!!
// Hospital request's approval by ADMIN & Manager only
router.patch(
  "/hospital-technician-request-approval/:hospitalId/:userId",
  authController.protect,
  authController.restrictTo('admin', 'manager'),
  hospitalController.joiningTechnicianRequestApproval
);

// Technician's Request Rejected by Admin & Manager only
router.patch(
  "/hospital-technician-request-rejection/:hospitalId/:userId",
  authController.protect,
  authController.restrictTo('admin', 'manager'),
  hospitalController.technicianRequestRejection
);

// Get All Approval Requests by ADMIN & Manager only
router.get("/:hospitalId/get-approval-technicians-requests",
  authController.protect,
  authController.restrictTo("admin", "manager"),
  hospitalController.getAllTechniciansRequests);

router.get("/registered-hospitals", authController.protect, hospitalController.getAllHospitals);

// Admin Restricted Area !!!!!
router.use(authController.protect, authController.restrictTo("admin"));
router.post("/register-hospital", hospitalController.registerHospital);
router
  .route("/:hospitalId")
  .patch(hospitalController.updateHospital)
  .delete(hospitalController.deleteHospital);

export default router;
