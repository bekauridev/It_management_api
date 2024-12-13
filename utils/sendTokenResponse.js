const sanitizeUserData = require("../resources/sanitizeUserData");

// Send jwt token and cookie to user
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwt();

  const cookieOptions = {
    maxAge: +process.env.JWT_COOKIE_EXPIRESIN_IN * 24 * 60 * 60 * 1000, // Expiry time in milliseconds
    httpOnly: true, // Prevent cookie access via JavaScript
    secure: process.env.NODE_ENV === "production", // Secure only in production (HTTPS)
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Cross-origin in production, Lax for local
  };

  res.cookie("jwt", token, cookieOptions);

  // user.role = undefined;
  // user.password = undefined;
  // user.__v = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user: sanitizeUserData(user) },
  });
};

module.exports = sendTokenResponse;
