import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // Fetch parameters from request
    const { hospitalId, equipmentId, id } = req.params;

    let query;

    // Build query based on available parameters
    if (hospitalId && equipmentId) {
      // Query by both hospitalId and equipmentId
      query = Model.findOne({ hospitalId, equipmentId });
    } else if (id) {
      // If an ID is provided, query by ID
      query = Model.findById(id);
    } else {
      return next(new AppError("No valid ID or parameters provided", 400));
    }

    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

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

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    // let filter = { approvalStatus: "approved" };
    // if (req.params.tourId) filter = { tour: req.params.tourId };

    // const features = new APIFeatures(Model.find(filter), req.query)
    //   .filter()
    //   .sort()
    //   .limitFields()
    //   .paginate();
    // // const doc = await features.query.explain();
    // const doc = await features.query;

    // const doc = await Model.find(filter);

    const { hospitalId } = req.params;

    if (!hospitalId) {
      return next(new AppError("Hospital ID is required", 400));
    }

    const doc = await Model.find({ hospitalId });

    // If no documents found, handle error
    if (!doc || doc.length === 0) {
      return next(new AppError("No document found with that ID", 404));
    }

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newData = req.params.hospitalId
      ? { ...req.body, hospitalId: req.params.hospitalId }
      : req.body;
    const doc = await Model.create(newData);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { hospitalId, equipmentId, id } = req.params;

    let query;

    if (hospitalId && equipmentId) {
      query = { hospitalId, equipmentId };
    } else if (id) {
      query = { _id: id };
    } else {
      return next(new AppError("No valid ID or parameters provided", 400));
    }

    const doc = await Model.findOneAndDelete(query);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
