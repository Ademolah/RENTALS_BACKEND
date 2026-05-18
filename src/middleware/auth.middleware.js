import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { User } from '../models/User.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const protectRoute = catchAsync(async (req, res, next) => {
  let token;

  // 1. Extract the token from the Authorization header (Bearer format)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please provide a valid session token.', 401));
  }

  // 2. Verify the cryptographic signature of the token using our secret key
  // We use promisify to turn the old callback-based jwt.verify into modern async/await
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Ensure the user still exists in our database (e.g., they weren't deleted after the token was issued)
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The account belonging to this token no longer exists.', 401));
  }

  // 4. Attach the verified user object directly to the request
  // This is critical: downstream controllers can now access req.user safely!
  req.user = currentUser;
  
  // Grant access to the protected route
  next();
});

// Optional Role-Based Access Control (RBAC) Expansion
// Use this to restrict specific routes to AGENTS or ADMINS only
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};