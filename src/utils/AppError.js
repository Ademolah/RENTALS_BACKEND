
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // If status code starts with 4 (e.g., 400, 404), it's a client 'fail'. 500 is a server 'error'.
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // Flagging this as true allows our central handler to know it is a safe, predicted operational error
    this.isOperational = true;

    // Captures the exact file path and line number where this error occurred, without polluting the output
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;