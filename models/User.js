const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const zxcvbn = require("zxcvbn");
const hashToken = require("../utils/hashToken");
const ErrorResponse = require("../utils/ErrorResponse");

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please add a password confirmation"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords do not match",
      },
    },

    createdAt: {
      type: Date,
      default: Date.now,
      select: false, // Hide createdAt in response
    },

    // isVerified: {
    //   type: Boolean,
    //   default: false,
    // },
    // verificationCode: {
    //   type: String,
    //   select: false,
    // },
    // verificationCodeExpires: {
    //   type: Date,
    // },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware to Hash password before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  const passwordStrength = zxcvbn(this.password);
  if (passwordStrength.score < 2) {
    const { warning, suggestions } = passwordStrength.feedback;
    // Build error message
    let errorMsg = "Weak password!";
    if (warning) errorMsg += ` ${warning}`;
    if (suggestions) errorMsg += `  ${suggestions.join(" ")}`;

    return next(new ErrorResponse(errorMsg, 400));
  }

  // Hash pass
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  // move on ^-
  next();
});

// Hash verification code before saving
userSchema.pre("save", async function (next) {
  // Only hash the verification code if it exists and is being modified
  if (this.isModified("verificationCode") && this.verificationCode) {
    const salt = await bcrypt.genSalt(12);
    this.verificationCode = await bcrypt.hash(this.verificationCode, salt);
  }

  next();
});

// Reset verification status when the email changes
// userSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();

//   if (update.email) update.isVerified = false;

//   next();
// });

// Update the passwordChangedAt field before saving the user document (crucial for changedPasswordAfter with is used in (protect))
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Sing jwt token
userSchema.methods.getSignedJwt = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Compares a candidate value with a stored hashed value to check for a match.
userSchema.methods.matchHashedField = async function (candidateValue, storedHashedValue) {
  return await bcrypt.compare(candidateValue, storedHashedValue);
};

// Check if user changed password after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp; // True if password was changed after token was issued
  }

  return false;
};

// Password reset token
userSchema.methods.getPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = hashToken(resetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};
// Export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
