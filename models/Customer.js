const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: {
      type: String, // Change to String to handle leading zeros and non-numeric characters
      required: true,
      unique: [true, "Phone number already exists"],
      validate: {
        validator: function (value) {
          // Ensure the phone number contains only numeric characters
          return /^\d+$/.test(value);
        },
        message: "Phone number should contain only numeric characters",
      },
    },
    email: {
      type: String,
      unique: [true, "Email address already exists"],
    },
    notes: { type: String },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Pre-save hook to sanitize phone number
CustomerSchema.pre("save", function (next) {
  if (this.phone) {
    this.phone = this.phone.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  }
  next();
});

// Virtual for services history
CustomerSchema.virtual("servicesHistory", {
  ref: "Service",
  localField: "_id",
  foreignField: "customer",
});

module.exports = mongoose.model("Customer", CustomerSchema);
