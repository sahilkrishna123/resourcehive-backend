import { catchAsync } from "../utils/catchAsync.js";
import * as factory from "./handlerFactory.js";
import * as userController from "./userController.js";
import AdminApprovals from "../models/adminApprovals.js";
import User from "../models/userModel.js";
import Equipment from "../models/equipmentModel.js";
import MaintenanceHistory from "../models/maintenanceHistoryModel.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";
// export const createEquipment = factory.createOne(Equipment);

// POST
export const createMaintenance = catchAsync(async (req, res, next) => {
  const { hospitalId, equipmentId } = req.params;

  console.log(req.params);
  console.log(req.url);

  const { maintenanceType, timestamp } = req.body;

  // First, check if both hospitalId and equipmentId are provided
  if (!hospitalId || !equipmentId) {
    return next(new AppError("Hospital ID and Equipment ID are required", 400));
  }

  // Verify if the equipment exists under the provided hospitalId
  const equipment = await Equipment.findOne({ hospitalId, equipmentId });

  if (!equipment) {
    return next(
      new AppError(
        "No equipment found for this hospital with the provided ID",
        404
      )
    );
  }

  const newMaintenance = await MaintenanceHistory.create({
    equipmentId,
    maintenanceType,
    timestamp,
  });

  res.status(201).json({
    status: "success",
    data: {
      maintenance: newMaintenance,
    },
  });
});
// GET All
export const getAllMaintenance = catchAsync(async (req, res, next) => {
  const { hospitalId, equipmentId } = req.params;

  // Validate that both hospitalId and equipmentId are provided
  if (!hospitalId || !equipmentId) {
    return next(new AppError("Hospital ID and Equipment ID are required", 400));
  }

  // Verify that the equipment exists under the given hospital
  const equipment = await Equipment.findOne({ hospitalId, equipmentId });

  if (!equipment) {
    return next(
      new AppError(
        "No equipment found for this hospital with the provided ID",
        404
      )
    );
  }

  const maintenanceHistory = await MaintenanceHistory.find({ equipmentId });

  res.status(200).json({
    status: "success",
    results: maintenanceHistory.length,
    data: {
      maintenanceHistory,
    },
  });
});

// GET One
export const getOneMaintenance = catchAsync(async (req, res, next) => {
  const { hospitalId, equipmentId, maintenanceId } = req.params;

  // Validate that both hospitalId and equipmentId are provided
  if (!hospitalId || !equipmentId) {
    return next(new AppError("Hospital ID and Equipment ID are required", 400));
  }

  // Verify that the equipment exists under the given hospital
  const equipment = await Equipment.findOne({ hospitalId, equipmentId });

  if (!equipment) {
    return next(
      new AppError(
        "No equipment found for this hospital with the provided ID",
        404
      )
    );
  }

  const maintenanceHistory = await MaintenanceHistory.findOne({
    maintenanceId: maintenanceId,
  });

  if (!maintenanceHistory) {
    return next(new AppError("No maintenance record found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      maintenanceHistory,
    },
  });
});

// PATCH
export const updateMaintenance = catchAsync(async (req, res, next) => {
  const { hospitalId, equipmentId, maintenanceId } = req.params;

  // Validate if all necessary parameters are provided
  if (!hospitalId || !equipmentId || !maintenanceId) {
    return next(
      new AppError(
        "Hospital ID, Equipment ID, and Maintenance ID are required",
        400
      )
    );
  }

  // Verify if the equipment exists under the hospital
  const equipment = await Equipment.findOne({ hospitalId, equipmentId });

  if (!equipment) {
    return next(
      new AppError(
        "No equipment found for this hospital with the provided ID",
        404
      )
    );
  }

  // Update the maintenance record
  const updatedMaintenance = await MaintenanceHistory.findOneAndUpdate(
    { maintenanceId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedMaintenance) {
    return next(new AppError("No maintenance record found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      maintenance: updatedMaintenance,
    },
  });
});
// DELETE
export const deleteMaintenance = catchAsync(async (req, res, next) => {
  const { hospitalId, equipmentId, maintenanceId } = req.params;

  // Validate if all necessary parameters are provided
  if (!hospitalId || !equipmentId || !maintenanceId) {
    return next(
      new AppError(
        "Hospital ID, Equipment ID, and Maintenance ID are required",
        400
      )
    );
  }

  // Verify if the equipment exists under the hospital
  const equipment = await Equipment.findOne({ hospitalId, equipmentId });

  if (!equipment) {
    return next(
      new AppError(
        "No equipment found for this hospital with the provided ID",
        404
      )
    );
  }

  // Delete the maintenance record
  const deletedMaintenance = await MaintenanceHistory.findOneAndDelete({
    maintenanceId,
  });

  if (!deletedMaintenance) {
    return next(new AppError("No maintenance record found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
