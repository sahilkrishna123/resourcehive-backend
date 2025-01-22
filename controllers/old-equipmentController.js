import { catchAsync } from "../utils/catchAsync.js";
import * as factory from "./handlerFactory.js";
import * as userController from "./userController.js";
import AdminApprovals from "../models/adminApprovals.js";
import User from "../models/userModel.js";
import Equipment from "../models/equipmentModel.js";
import AppError from "../utils/appError.js";

// import * as tf from "@tensorflow/tfjs-node";
import * as cron from "node-cron";
import axios from "axios";
export const createEquipment = factory.createOne(Equipment);

export const getOneEquipment = factory.getOne(Equipment);
export const getAllEquipments = factory.getAll(Equipment);
export const deleteEquipment = factory.deleteOne(Equipment);
export const updateEquipment = catchAsync(async (req, res, next) => {
  const { hospitalId, equipmentId } = req.params;

  const criteria = { hospitalId, equipmentId };

  // Update the document
  const doc = await Equipment.findOneAndUpdate(criteria, req.body, {
    new: true,
    runValidators: true,
  });

  // If no document is found, return an error
  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

// model = await tf.loadLayersModel("D:/FYDP NED/resourcehive/backend/AI-models\ventilator_lstm_model.h5");

// Load the .h5 model file
// let model;
// (async () => {
// model = await tf.loadLayersModel("../AI-models/ventilator_lstm_model.h5");
//   console.log("Model loaded successfully");
// })();

// In-memory storage for recent data
const inMemoryData = new Map();

// Function to process data
async function processPrediction(equipmentId, operationalData) {
  // Run prediction
  const inputTensor = tf.tensor2d(
    [operationalData],
    [1, operationalData.length]
  );
  const prediction = model.predict(inputTensor);
  const [normalOutput, malfunctionOutput] = prediction.dataSync();

  // Check if the prediction indicates a malfunction
  if (malfunctionOutput > normalOutput) {
    // Save to MongoDB if malfunction detected
    console.log("Malfunctions Saved to MongoDB");

    const alert = new MaintenanceHistory({
      equipmentId,
      maintenanceType: "Urgent",
      timestamp: new Date(),
    });
    await alert.save();

    const malfunctionPrediction = new Prediction({
      equipmentId,
      predictedFailureDate: new Date(),
      predictionAccuracy: malfunctionOutput,
      predictedIssue: "Malfunction",
    });
    await malfunctionPrediction.save();
  } else {
    // Store non-critical predictions in memory
    inMemoryData.set(equipmentId, {
      normalOutput,
      malfunctionOutput,
      timestamp: new Date(),
    });
  }
}

// IoT Data Route
export const processIotData = catchAsync(async (req, res, next) => {
  const { equipmentId, operationalData } = req.body;

  // Process and predict
  await processPrediction(equipmentId, operationalData);

  res.status(200).json({ message: "Data processed successfully." });

  // console.error(error);
  // res.status(500).json({ message: 'Error processing IoT data.' });
});

// Cron job to clear old in-memory data every hour
cron.schedule("0 * * * *", () => {
  const currentTime = new Date().getTime();
  const oneHour = 3600 * 1000; // 1 hour in milliseconds

  // Remove entries older than one hour
  for (const [equipmentId, data] of inMemoryData) {
    if (currentTime - data.timestamp.getTime() > oneHour) {
      inMemoryData.delete(equipmentId);
    }
  }
  console.log("Cleared old in-memory data");
});
