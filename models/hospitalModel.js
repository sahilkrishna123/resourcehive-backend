import mongoose from "mongoose";
const Schema = mongoose.Schema;

const hospitalSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  approvalStatus: {
    type: String,
    enum: ["verified", "rejected", "pending"],
    default: "pending",
  },
  // userId: [{ type: Schema.Types.ObjectId, ref: 'User' }]  // Many users per hospital
});

const Hospital = mongoose.model("Hospital", hospitalSchema);
export default Hospital;
