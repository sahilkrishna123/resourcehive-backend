import multer from "multer";
import sharp from "sharp";

// Import Utils
import { catchAsync } from "../utils/catchAsync.js";
import * as factory from "./handlerFactory.js";
import AppError from "../utils/appError.js";

// Import models
// import Student from "../models/studentModel.js";
import User from "../models/userModel.js";
// import SchoolApproval from "../models/schoolApprovals.js";
// import School from "../models/schoolModel.js";

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

export const getDashboard = catchAsync(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;
  // console.log(req.file.filename);
  console.log(filteredBody.photo);

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const completeProfile = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = { ...req.body };
  if (filteredBody.role) delete filteredBody.role;
  delete filteredBody.email;

  // const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;
  // console.log(req.file.filename);
  // console.log(filteredBody.photo);
  // console.log(filteredBody);

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });


});
export const getUser = factory.getOne(User);

// export const approveSchoolAccess = catchAsync(async (req, res, next) => {
//   const status = req.body.schoolApprovalStatus; // "approved" or "rejected"

//   const student = await Student.findByIdAndUpdate(
//     req.params.id,
//     {
//       schoolApprovalStatus: status,
//     },
//     { new: true }
//   );

//   if (!student) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Student not found",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     message: `School access ${status}`,
//     data: {
//       student,
//     },
//   });
// });

// export const schoolApprovalRequest = catchAsync(async (req, res, next) => {
//   // 1. Ensure the 'admins' field exists as an array and add the current user's ID
//   req.body.admins = req.body.admins || []; // If no admins are provided, create an empty array
//   req.body.admins.push(req.user._id); // Add the current user's ID to the admins array

//   // First, create the school using the School model
//   const school = await School.create(req.body);

//   //  Update the user with the new registered school ID
//   await User.findByIdAndUpdate(
//     req.user._id, // Get the authenticated user's ID
//     { registeredSchool: school._id }, // Add or update the registeredSchool field
//     { new: true, runValidators: true } // Return the updated document
//   );

//   // Then, create the schoolApprovalRequest using the newly created school's ID
//   const schoolApprovalRequest = await SchoolApproval.create({
//     schoolId: school._id,
//     name: school.name,
//   });
//   res.status(201).json({
//     status: "success",
//     message: "School approval request submitted",
//     data: {
//       school,
//       schoolApprovalRequest,
//     },
//   });
// });
