import crypto from "crypto";
import mongoose from "mongoose";
// const validator = require("validator");
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    hospitalId: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Hospital",
      },
    ],
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      required: [true, "Please tell us your email!"],
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "technician", "computer-operator"],
      default: "user",
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    password: {
      type: String,
      required: [true, "Please write your password!"],
      select: false,
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "passwords are not the same!",
      },
    },
    approvalStatus: {
      type: String,
      enum: ["verified", "rejected", "pending"],
      default: "pending",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
