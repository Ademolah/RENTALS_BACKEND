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

export const registerInvitedAgent = catchAsync(async (req, res, next) => {
  const { token, firstName, lastName, password } = req.body;

  if (!token) {
    return next(new AppError('Invalid or missing invitation token.', 400));
  }

  try {
    // 1. Cryptographically verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Create the Agent in the database, automatically injecting the CEO's agencyId
    const newAgent = await User.create({
      firstName,
      lastName,
      email: decoded.email, // We trust the email from the token, preventing manipulation
      password,
      role: 'AGENT',
      agencyId: decoded.agencyId,
      status: 'APPROVED', // Assuming invited agents are auto-approved
    });

    // 3. Generate a standard login token for the new agent so they are immediately logged in
    const loginToken = jwt.sign({ id: newAgent._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      status: 'success',
      token: loginToken,
      data: {
        user: {
          id: newAgent._id,
          email: newAgent.email,
          role: newAgent.role,
          agencyId: newAgent.agencyId,
        },
      },
    });
  } catch (error) {
    // If the token is tampered with or expired, jwt.verify throws an error
    return next(new AppError('Invitation link is invalid or has expired. Please request a new one.', 401));
  }
});