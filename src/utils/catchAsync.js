/**
 * Wraps an asynchronous Express function to automatically catch errors and pass them to next()
 * @param {Function} fn - The asynchronous controller function
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};