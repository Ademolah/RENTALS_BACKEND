import { catchAsync } from '../utils/catchAsync.js';
import * as authService from '../services/auth.service.js';

export const register = catchAsync(async (req, res, next) => {
  // Pull from our new validated object
  const { user, token } = await authService.registerUserAccount(req.validated.body);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

// Add this below your register controller
export const login = catchAsync(async (req, res, next) => {
  const { user, token } = await authService.loginUserAccount(req.validated.body);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});