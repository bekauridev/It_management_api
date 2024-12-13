/**
 * Sanitizes user data, stripping out sensitive information.
 * @param {Object} user The user object to sanitize.
 * @returns {Object} The sanitized user object.
 */
const sanitizeUserData = (user) => {
  const sanitizedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  return sanitizedUser;
};

module.exports = sanitizeUserData;
