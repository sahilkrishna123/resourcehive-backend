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
      enum: ["user", "admin", "manager", "technician"],
      default: "user",
    },
    requestedRole: {
      type: String,
      enum: ["user", "admin", "manager", "technician"],
      default: "user"
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
      enum: ["approved", "notapproved", "pending"],
      default: "pending",
    },

    governmentIdNumber: {
      type: String,
    },
    idDocumentUpload: {
      type: String, // URL or path to the uploaded ID document (Image or PDF)
      default: "default_id_doc.jpg",
    },
    phoneNumber: {
      type: String,
    },

    residentialAddress: {
      street: { type: String },
      city: { type: String, },
      state: { type: String, },
      zipCode: { type: String, },
      country: { type: String, },
    },
    hospitalDetails: {
      hospitalName: {
        type: String,
      },
      employeeId: {
        type: String,
      },
      position: {
        type: String,
      },
      idCardNumber: {
        type: String,
      },
      idCardIssueDate: {
        type: Date,
      },
      idCardExpiryDate: {
        type: Date,
      },
      idCardPhoto: {
        type: String,
      },
      hospitalContact: {
        phone: {
          type: String,
        },
        email: {
          type: String,
        },
      },
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
