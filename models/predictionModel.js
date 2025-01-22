import mongoose from "mongoose";
const Schema = mongoose.Schema;

const predictionSchema = new mongoose.Schema({
  // predictionId: { type: String, required: true, unique: true },
  equipmentId: {
    type: Schema.Types.ObjectId,
    ref: "Equipment",
    required: true,
  },
  predictedFailureDate: {
    type: Date,
    required: true,
  },
  // predictionAccuracy: { type: Number, required: true },
  predictedIssue: {
    type: String,
    enum: ["Malfunction"],
    required: true,
  },
});

const Prediction = mongoose.model("Prediction", predictionSchema);
export default Prediction;
