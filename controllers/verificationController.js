// const asyncMiddleware = require("../middlewares/asyncMiddleware");
// const User = require("../models/User");
// const ErrorResponse = require("../utils/ErrorResponse");
// const sendEmail = require("../services/emailService.js");

// sendVerificationCode = async (user) => {
//   const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
//   user.verificationCode = verificationCode;
//   user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

//   await user.save({ validateBeforeSave: false });

//   const message = `
//   Hi ${user.name || ""}👋

//   Your verification code is: ${verificationCode}.

//   This code will expire in **10 minutes**. Please enter it on the verification screen to confirm your account.

//   If you didn't request this, no further action is needed, You can safely ignore this email.

//   Need help? Contact our support team at beqauri.forwork@gmail.com

//   Thank you,
//   BekauriDev Team.
// `;

//   await sendEmail({
//     email: user.email,
//     subject: "Confirm Your Account - Verification Code",
//     message,
//   });
// };

// // @desc   Send verification code to the user
// // @route  POST /api/v1/auth/send-verification-code
// // @access Private
// exports.sendVerificationCodeHandler = asyncMiddleware(async (req, res, next) => {
//   const user = req.user;

//   if (!user) {
//     return next(new ErrorResponse("Please log in first.", 401));
//   }

//   if (user.isVerified) {
//     return next(new ErrorResponse("User is already verified.", 400));
//   }

//   try {
//     // Send the verification code
//     await sendVerificationCode(user);
//     res.status(200).json({
//       status: "success",
//       message: "Verification code sent.",
//     });
//   } catch (error) {
//     // next(new ErrorResponse("Error sending verification code.", 500));
//     next(new ErrorResponse(error, 500));
//   }
// });

// // @desc   Verify user based on verification code
// // @route  POST /api/v1/auth/verification
// // @access Private
// exports.verification = asyncMiddleware(async (req, res, next) => {
//   const { verificationCode } = req.body;
//   const user = req.user;

//   // Ensure the user is not null
//   if (!user) {
//     return next(new ErrorResponse("User not found.", 404));
//   }
//   if (!verificationCode) {
//     return next(new ErrorResponse("Please provide a verification code.", 400));
//   }

//   // Check if verification code has expired
//   if (user.verificationCodeExpires < Date.now()) {
//     return next(new ErrorResponse("Invalid or expired verification code", 401));
//   }

//   // Fetch the user from the database again to include verificationCode
//   const fetchedUser = await User.findById(user._id).select("+verificationCode");

//   if (!fetchedUser.verificationCode) {
//     return next(
//       new ErrorResponse(
//         "No verification code found. Please run verification process again.",
//         400
//       )
//     );
//   }

//   // Compare the provided code with the hashed one in the database
//   const isMatch = await fetchedUser.matchHashedField(
//     verificationCode,
//     fetchedUser.verificationCode
//   );

//   if (!isMatch) {
//     return next(new ErrorResponse("Invalid verification code.", 401));
//   }

//   // Mark user as verified and remove the code fields
//   fetchedUser.isVerified = true;
//   fetchedUser.verificationCode = undefined;
//   fetchedUser.verificationCodeExpires = undefined;
//   // Used for avoid schema validations

//   // Used for avoid schemavalidations
//   await fetchedUser.save({ validateBeforeSave: false });

//   // Generate Token
//   res.status(200).json({
//     status: "success",
//     message: "Verification successful! Welcome.",
//   });
// });