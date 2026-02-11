// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  // Default status code and message
  let statusCode = 500;
  let message = "Internal Server Error";

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongo duplicate key error (unique fields like email)
  if (err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue);
    message = `Duplicate value for field: ${field}`;
  }

  // CastError: invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export default errorHandler;
