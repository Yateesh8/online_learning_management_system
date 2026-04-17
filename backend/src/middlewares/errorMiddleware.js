const errorMiddleware = (err, req, res, next) => {
  // If we have a string error, wrap it in an Error object
  if (typeof err === 'string') {
    err = new Error(err);
  }

  console.error('ERROR LOG:', err.message);
  if (err.stack) console.error(err.stack);

  // If the error has a 'status' or 'statusCode' property (common in many libraries), use it.
  // Otherwise, if the status is currently 200, default to 500.
  const statusCode = err.statusCode || err.status || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorMiddleware;