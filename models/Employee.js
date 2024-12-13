const mongoose = require("mongoose");
const validator = require("validator");

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    phone: {
      type: String, // Use String to handle leading zeros or non-standard formats
      required: true,
      unique: [true, "Phone number already exists"],
      validate: {
        validator: function (value) {
          // Ensure the phone number contains only digits
          return /^\d+$/.test(value);
        },
        message: "Phone number should contain only numeric characters",
      },
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating must be above 0 "],
      max: [5, "Rating must be below 5.0 "],
      set: (val) => Math.round(val * 10) / 10,
    },

    servicesQuantity: {
      type: Number,
      default: 0,
    },
    latestService: {
      type: Date,
      default: null,
    },
    notes: { type: String },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Pre-save hook to sanitize phone number
EmployeeSchema.pre("save", function (next) {
  if (this.phone) {
    this.phone = this.phone.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  }
  next();
});

// Virtual for work history
EmployeeSchema.virtual("workHistory", {
  ref: "Service", // the model to use
  localField: "_id", // the field in Employee that contains the ObjectId
  foreignField: "employee", // the field in Service that matches the Employee
});

module.exports = mongoose.model("Employee", EmployeeSchema);
