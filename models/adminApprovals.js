import mongoose from "mongoose";

const adminApprovalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    hospitalId: {
      type: mongoose.Schema.ObjectId,
      ref: "Hospital",
    },
  },
  {
    versionKey: false,
  }
);

const AdminApprovals = new mongoose.model("AdminApproval", adminApprovalSchema);

export default AdminApprovals;
