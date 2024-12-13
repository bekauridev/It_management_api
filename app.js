const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const globalErrorHandler = require("./controllers/errorController");

// Routes
const employees = require("./routes/employeesRouter");
const customers = require("./routes/customersRouter");
const services = require("./routes/servicesRouter");
const users = require("./routes/usersRouter");
const auth = require("./routes/authRouter");
const ErrorResponse = require("./utils/ErrorResponse");

// Initialize the Express app
const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Allow your frontend domain
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allow specific methods
    credentials: true, // Allow cookies
  })
);

// Use Helmet to set security-related HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// !!(TEMP CLOSED)
// // Rate limiter for general routes
// const generalRateLimiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000, // 1 hour
//   message: "Too many requests from this IP, please try again in an hour!",
// });

// // Rate limiter for auth routes
// const authRateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10, // Limit to 10 attempts
//   message: "Too many attempts, please try again later.",
// });

// // Apply rate limiters
// app.use("/api", generalRateLimiter);
// app.use("/api/v1/auth", authRateLimiter);

// Body parser middleware to read JSON data from requests
app.use(express.json({ limit: "100kb" }));

// Cookie parser to handle cookies
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS (cross-site scripting) attacks
app.use(xss());

// Define API routes
app.use("/api/v1/services", services);
app.use("/api/v1/employees", employees);
app.use("/api/v1/customers", customers);
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);

app.post("/test-email", async (req, res) => {
  try {
    await sendEmail({
      //the client email
      to: "beqaurigiorgi31@gmail.com",
      //sendGrid sender id
      from: "mgproject888@gmail.com",
      subject: "Does this work?",
      text: "Glad you are here .. yes you!",
      html: "<strong>It is working!!</strong>",
    });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
// Handle requests to undefined routes
app.all("*", (req, res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
