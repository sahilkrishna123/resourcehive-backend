import mongoose from "mongoose";
const Schema = mongoose.Schema;

const maintenanceHistorySchema = new Schema({
  maintenanceId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  equipmentId: {
    type: Schema.Types.ObjectId,
    ref: "Equipment",
    required: true,
  },
  maintenanceType: {
    type: String,
    enum: ["Urgent", "Scheduled"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const MaintenanceHistory = mongoose.model(
  "MaintenanceHistory",
  maintenanceHistorySchema
);
export default MaintenanceHistory;
