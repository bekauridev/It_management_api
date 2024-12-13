/**
 * Accepts only specific fields from objects; ignores others
 * @param {Object} objInput - Input object to filter
 * @param {...string} fields - Fields to include in the output
 * @returns {Object} - New object with only selected fields
 */
exports.filterFieldsObj = (objInput, ...fields) => {
  const newObj = {};
  Object.keys(objInput).forEach((el) => {
    if (fields.includes(el)) newObj[el] = objInput[el];
  });
  return newObj;
};

/**
 * Retrieves token from request headers (Bearer) or cookies
 * @param {http.IncomingMessage} req - Express request object
 * @returns {string} token
 */
exports.getTokenFromRequest = (req) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.toLowerCase().startsWith("bearer ")
  ) {
    const tokenParts = req.headers.authorization.split(" ");
    if (tokenParts.length === 2) token = tokenParts[1];
  }

  if (req.cookies.jwt && !token) token = req.cookies.jwt;

  return token;
};
