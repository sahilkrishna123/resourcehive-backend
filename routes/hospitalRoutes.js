import express from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";
import * as hospitalController from "../controllers/hospitalController.js";

const router = express.Router();

// router.route("/get-schools").get(authController.protect,schoolController.getAllSchool);
// router.get("/", authController.protect, schoolController.getAllSchool);

// Hospital joining request by users
router.post(
  "/hospital-joining-request/:id",
  authController.protect,
  hospitalController.hospitalJoiningRequest
);
// Hospital request's approval by ADMIN only
router.patch(
  "/hospital-request-approval/:userId/:hospitalId",
  authController.protect,
  authController.restrictTo("admin"),
  hospitalController.joiningRequestApproval
);

router.use(authController.protect, authController.restrictTo("admin"));
// router.post("/register", schoolController.registerSchool);

// router.get("/registered-schools", schoolController.getRegisteredSchools);

// router
//   .route("/:id")
//   .get(schoolController.getSchool)
//   .patch(schoolController.updateSchool)
//   .delete(schoolController.deleteSchool);
export default router;
