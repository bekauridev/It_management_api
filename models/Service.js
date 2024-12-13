const mongoose = require("mongoose");
const Employee = require("./Employee");
const ServiceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  serviceDetails: { type: String },
  date: { type: Date, default: Date.now },
  rating: { type: Number, min: 1, max: 5 }, // Optional if employees request ratings
  feedback: { type: String }, // Optional customer feedback
});

ServiceSchema.statics.calcAverageRatings = async function (employeeId) {
  const stats = await this.aggregate([
    {
      $match: { employee: employeeId }, // Match services for the given employee
    },
    {
      $group: {
        _id: "$employee",
        nRatings: { $sum: 1 }, // Corrected alias
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    // Update Employee model with the new ratings stats
    await Employee.findByIdAndUpdate(employeeId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    // Reset ratings if no services found
    await Employee.findByIdAndUpdate(employeeId, {
      ratingsQuantity: 0,
      ratingsAverage: 0, // Default to 0 when no ratings exist
    });
  }
};

ServiceSchema.pre(/^find/, function (next) {
  this.populate({
    path: "employee",
    select: "name",
  }).populate({
    path: "customer",
    select: "name",
  });
  next();
});

// Post-save hook to trigger average ratings calculation
ServiceSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.employee); // Use 'this.employee' to access the employee ID
});

// Post-save hook to update latestService in Employee
ServiceSchema.post("save", async function () {
  // Fetch the most recent service for the employee
  const latestService = await this.constructor
    .find({ employee: this.employee })
    .sort({ date: -1 }) // Sort by descending date
    .limit(1) // Get only the most recent one
    .exec();

  // Count all services related to the employee
  const servicesCount = await this.constructor
    .countDocuments({ employee: this.employee })
    .exec();

  if (latestService.length > 0) {
    // Update the employee's latestService and servicesQuantity
    await Employee.findByIdAndUpdate(this.employee, {
      latestService: latestService[0].date,
      servicesQuantity: servicesCount,
    });
  }
});

// Export the Service model
module.exports = mongoose.model("Service", ServiceSchema);
