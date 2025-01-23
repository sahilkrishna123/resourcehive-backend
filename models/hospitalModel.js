import mongoose from "mongoose";
const Schema = mongoose.Schema;

const hospitalSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: {
    type: String,
    required: [true, "Please provide the hospital name!"],
  },
  location: {
    address: {
      street: { type: String, required: [true, "Please provide the street address!"] },
      city: { type: String, required: [true, "Please provide the city!"] },
      state: { type: String, required: [true, "Please provide the state!"] },
      zipCode: { type: String, required: [true, "Please provide the zip code!"] },
      country: { type: String, required: [true, "Please provide the country!"] },
    }
  },
  contactDetails: {
    phone: {
      type: String,
      required: [true, "Please provide the hospital contact number!"],
    },
    email: {
      type: String,
      required: [true, "Please provide the hospital contact email!"],
    },
    website: {
      type: String,
    },
  },
  departments: [
    {
      name: { type: String, required: true },
      head: { type: String }, // Name of the department head
      contactNumber: { type: String },
    },
  ],
  registrationNumber: {
    type: String,
    required: [true, "Please provide the hospital registration number!"],
    unique: true,
  },
  establishedDate: {
    type: Date,
    required: [true, "Please provide the hospital's established date!"],
  },
  active: {
    type: Boolean,
    default: true,
  },
  approvalStatus: {
    type: String,
    enum: ["verified", "rejected", "pending"],
    default: "pending",
  },
  // adminUsers: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "User", // Links to the User model
  //   },
  // ],
  // userId: [{ type: Schema.Types.ObjectId, ref: 'User' }]  // Many users per hospital
});

const Hospital = mongoose.model("Hospital", hospitalSchema);
export default Hospital;
