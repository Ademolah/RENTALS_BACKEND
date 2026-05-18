import AppError from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // ATTACH TO A NEW PROPERTY: Avoids the "only a getter" error
    req.validated = parsed;
    
    return next();
  } catch (error) {
    if (error.issues) {
      const errorMessages = error.issues
        .map((err) => `${err.path.join('.')} : ${err.message}`)
        .join(', ');
      return next(new AppError(errorMessages, 400));
    }
    return next(new AppError(error.message, 400));
  }
};