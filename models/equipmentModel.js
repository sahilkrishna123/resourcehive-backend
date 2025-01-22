import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema({
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    // required: true,
  },
  type: {
    type: String,
    // required: true,
  },
  // "type": "MRI",
  manufacturer: {
    type: String,
    required: true,
    // "Siemens",
  },
  model: {
    type: String,
    // required: true,
    // "model": "Magnetom Sola",
  },
  serialNumber: {
    type: String,
    // required: true,
    // unique: true,
  },
  // UniqueDeviceIdentifiers (UDI)
  udiNumber: {
    type: String,
    unique: true,
  },
  // "location": "Radiology Department",
  location: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    // "status": "active", under-maintenance,
  },
  lastMaintainedDate: {
    type: Date,
    // required: true,
  },
  // operationalData: {
  //   type: Array,
  //   default: [],
  // }, // Store relevant operational data
});

const Equipment = mongoose.model("Equipments", equipmentSchema);
export default Equipment;
