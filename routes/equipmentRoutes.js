import express from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";
import * as hospitalController from "../controllers/hospitalController.js";
import * as equipmentController from "../controllers/equipmentController.js";

const router = express.Router();

// IOT API Sends data to this route, so it shouldn't be protect for user POV
// {{URL}}api/v1/equipments/iot-data/:udiNumber

// Dummy API send data to this location i.e iot-data
router
  .route("/iot-data/:udiNumber")
  .post(equipmentController.processIotData);

// Protected routes
router.get("/:hospitalId",authController.protect, equipmentController.getAllEquipments);

router.use(authController.protect, authController.restrictTo('admin', 'manager'));
router.route("/:hospitalId")
  .post(equipmentController.createEquipment);

router
  .route("/:hospitalId/:equipmentId")
  .patch(equipmentController.updateEquipment)
  .get(equipmentController.getOneEquipment)
  .delete(equipmentController.deleteEquipment);

export default router;
