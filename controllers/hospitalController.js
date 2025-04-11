import { catchAsync } from "../utils/catchAsync.js";
// import School from "../models/schoolModel.js";
import * as factory from "./handlerFactory.js";
import * as userController from "./userController.js";
import AdminApprovals from "../models/adminApprovals.js";
import User from "../models/userModel.js";
import Hospital from "../models/hospitalModel.js";
import AppError from "../utils/appError.js";

export const registerHospital = catchAsync(async (req, res, next) => {
  const newData = await Hospital.create(req.body);
  // console.log(newData._id);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, { hospitalId: newData._id }, {
    new: true,
    runValidators: true,
  })
  // console.log(updatedUser);
  res.status(201).json({
    status: 'success',
    data: newData
  })
});
export const getAllHospitals = catchAsync(async (req, res, next) => {
  const allHospitals = await Hospital.find();
  res.status(200).json({
    status: 'success',
    results: allHospitals.length,
    data: allHospitals,
  });
});

export const updateHospital = catchAsync(async (req, res, next) => {
  // 1) Filter out unwanted fields that are not allowed to be updated
  const filteredBody = { ...req.body };
  delete filteredBody.hospitalId; // Unique identifier - not updatable
  delete filteredBody.registrationNumber; // Not updatable
  delete filteredBody.establishedDate; // Historical info - not updatable
  delete filteredBody.approvalStatus;
  delete filteredBody.active;

  // 2) Update hospital document
  const updatedHospital = await Hospital.findByIdAndUpdate(req.params.hospitalId, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedHospital) {
    return next(new AppError("No hospital found with that ID", 404));
  }

  // 3) Send success response
  res.status(200).json({
    status: "success",
    data: {
      hospital: updatedHospital,
    },
  });
});

export const deleteHospital = catchAsync(async (req, res, next) => {
  const doc = await Hospital.findOneAndDelete(req.params.hospitalId);
  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
export const hospitalJoiningRequest = catchAsync(async (req, res, next) => {
  // Joining request submission by verified Users
  const request = await AdminApprovals.create({
    userId: req.user.id,
    hospitalId: req.params.id,
  });

  res.status(201).json({
    status: "success",
    message: "School joining request submitted",
    data: {
      request,
    },
  });
});

export const joiningRequestApproval = catchAsync(async (req, res, next) => {
  const approval = await User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: {
        hospitalId: req.params.hospitalId,
        role: req.body.role,
        approvalStatus: 'approved'
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      approval,
    },
  });
});

export const joiningRequestRejection = catchAsync(async (req, res, next) => {
  const approval = await User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: {
        hospitalId: req.params.hospitalId,
        role: "user",
        approvalStatus: 'notapproved'
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      approval,
    },
  });
});

export const joiningTechnicianRequestApproval = catchAsync(async (req, res, next) => {
  const approval = await User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: {
        hospitalId: req.params.hospitalId,
        role: req.body.role,
        approvalStatus: 'approved'
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      approval,
    },
  });
});

export const technicianRequestRejection = catchAsync(async (req, res, next) => {
  const approval = await User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: {
        hospitalId: req.params.hospitalId,
        role: "user",
        approvalStatus: 'notapproved'
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      approval,
    },
  });
});

export const getAllRequests = catchAsync(async (req, res, next) => {
  const data = await AdminApprovals
    .find({ hospitalId: req.params.hospitalId })
    .populate('userId');

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: data
  })
});
export const getAllTechniciansRequests = catchAsync(async (req, res, next) => {
  // Fetch data and populate the userId field
  const data = await AdminApprovals.find({ hospitalId: req.params.hospitalId })
    .populate('userId');  // Populate userId with the full user details

  // Filter data to only include requests where requestedRole is 'technician'
  const techniciansData = data.filter(item => item.userId.requestedRole === 'technician');

  res.status(200).json({
    status: 'success',
    results: techniciansData.length,
    data: techniciansData
  });
});

// export const getSchool = factory.getOne(School);
// export const getAllSchool = factory.getAll(School);

// export const updateSchool = factory.updateOne(School);
// export const deleteSchool = factory.deleteOne(School);
