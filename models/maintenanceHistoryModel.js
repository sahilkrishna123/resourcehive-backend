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
  // Resolve Maintenance by technician
  resolveMaintenance: {
    type: String,
    enum: ["resolved", "not-resolved", "pending"],
    default: "pending"
  },
  resolveMaintenanceTimestamp : {
    type: Date,
    default: Date.now,
  },
  resolverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  resolveDescription: {
    type: String,
    default: "", 
  }
});

const MaintenanceHistory = mongoose.model(
  "MaintenanceHistory",
  maintenanceHistorySchema
);
export default MaintenanceHistory;
