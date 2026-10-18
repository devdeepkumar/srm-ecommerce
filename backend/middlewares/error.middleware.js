
export const globalErrorHandler = (err, req, res, next) => {

  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose CastError (invalid ID format)
  if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle duplicate key error
  if (err.code === 11000) {
    status = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value (${field}): ${err.keyValue[field]}. Please use another value!`;
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    status = 400;
    const errors = Object.values(err.errors).map((el) => el.message);
    message = `Invalid input data: ${errors.join(". ")}`;
  }

  // Handle JsonWebTokenError
  if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token. Please log in again!";
  }

  // Handle TokenExpiredError
  if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Your token has expired! Please log in again.";
  }

  // Development vs Production error responses
  if (process.env.NODE_ENV === "development") {
    res.status(status).json({
      status,
      message,
      error: err,
      stack: err.stack,
    });
  } else {
    // Production - don't leak error details
    res.status(status).json({
      status,
      message,
    
    });
  }
};
