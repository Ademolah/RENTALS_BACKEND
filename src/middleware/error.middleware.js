// Helper to format clean operational responses during production
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Trusted operational error: send message securely to client
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  
  // Programming or unknown infrastructure errors: Do NOT leak details to the public
  console.error('💥 SYSTEM ERROR LOG:', err);
  return res.status(500).json({
    status: 'error',
    message: 'An internal optimization event occurred. Please try again later.',
  });
};

// Helper to format verbose responses during development
const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack, // Shows exactly where the error broke in your terminal
  });
};

// Main Express global error middleware (Identified by its 4 parameter signatures)
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Advanced Optimization: Handle explicit MongoDB anomalies smoothly
    if (err.name === 'CastError') error = handleMongooseCastError(error);
    if (err.code === 11000) error = handleMongooseDuplicateFields(error);

    sendErrorProd(error, res);
  }
};

// Cleaners for common Mongoose database exceptions
const handleMongooseCastError = (err) => {
  const message = `Invalid format for field: ${err.path}. Provided value: ${err.value}.`;
  return new AppError(message, 400);
};

const handleMongooseDuplicateFields = (err) => {
  // Extracts the duplicated value using regex lookups
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'Input value';
  const message = `Duplicate entry error: ${value} already exists within our systems.`;
  return new AppError(message, 400);
};