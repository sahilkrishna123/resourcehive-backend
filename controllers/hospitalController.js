import { catchAsync } from "../utils/catchAsync.js";
// import School from "../models/schoolModel.js";
import * as factory from "./handlerFactory.js";
import * as userController from "./userController.js";
import AdminApprovals from "../models/adminApprovals.js";
import User from "../models/userModel.js";

// export const registerSchool = catchAsync(async (req, res, next) => {
//   //schoolApprovalRequest function called
//   userController.schoolApprovalRequest(req, res, next);
//   // factory.createOne(School);
// });
// export const getRegisteredSchools = catchAsync(async (req, res, next) => {
//   const user = req.user;
//   const doc = await user.populate("registeredSchool");

//   res.status(200).json({
//     data: user,
//   });
// });

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

// export const getSchool = factory.getOne(School);
// export const getAllSchool = factory.getAll(School);

// export const updateSchool = factory.updateOne(School);
// export const deleteSchool = factory.deleteOne(School);
