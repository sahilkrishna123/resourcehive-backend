import express from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";
import * as hospitalController from "../controllers/hospitalController.js";
import * as equipmentController from "../controllers/equipmentController.js";
import * as maintenanceController from "../controllers/maintenanceHistoryController.js";

const router = express.Router({ mergeParams: true }); // Use mergeParams to get access to parent route params

// Protected routes
router.use(authController.protect);

router
  .route("/")
  .get(maintenanceController.getAllMaintenance)
  .post(maintenanceController.createMaintenance);
router
  .route("/:maintenanceId")
  .get(maintenanceController.getOneMaintenance)
  .patch(maintenanceController.updateMaintenance)
  .delete(maintenanceController.deleteMaintenance);
export default router;
