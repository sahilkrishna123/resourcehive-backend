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
router.use(authController.protect, authController.restrictTo('admin', 'manager'));
router.route("/:hospitalId")
  .get(equipmentController.getAllEquipments)
  .post(equipmentController.createEquipment);

router
  .route("/:hospitalId/:equipmentId")
  .patch(equipmentController.updateEquipment)
  .get(equipmentController.getOneEquipment)
  .delete(equipmentController.deleteEquipment);

export default router;

// const express = require('express');
// const tourController = require('./../controllers/tourController');
// const authController = require('./../controllers/authController');
// const reviewRouter = require('./../routes/reviewRoutes');

// const router = express.Router();

// // router.param('id', tourController.checkID);

// // POST /tour/234fad4/reviews
// // GET /tour/234fad4/reviews

// router.use('/:tourId/reviews', reviewRouter);

// router
//   .route('/top-5-cheap')
//   .get(tourController.aliasTopTours, tourController.getAllTours);

// router.route('/tour-stats').get(tourController.getTourStats);
// router
//   .route('/monthly-plan/:year')
//   .get(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide', 'guide'),
//     tourController.getMonthlyPlan
//   );

// router
//   .route('/tours-within/:distance/center/:latlng/unit/:unit')
//   .get(tourController.getToursWithin);
// // /tours-within?distance=233&center=-40,45&unit=mi
// // /tours-within/233/center/-40,45/unit/mi

// router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

// router
//   .route('/')
//   .get(tourController.getAllTours)
//   .post(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide'),
//     tourController.createTour
//   );

// router
//   .route('/:id')
//   .get(tourController.getTour)
//   .patch(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide'),
//     tourController.uploadTourImages,
//     tourController.resizeTourImages,
//     tourController.updateTour
//   )
//   .delete(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide'),
//     tourController.deleteTour
//   );

// module.exports = router;
