import { catchAsync } from '../utils/catchAsync.js';
import * as authService from '../services/auth.service.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

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


export const inviteAgent = catchAsync(async (req, res, next) => {
  const { email, agencyId } = req.body;

  // 1. Validate Input
  if (!email || !agencyId) {
    return next(new AppError('Target email and Agency ID are strictly required', 400));
  }

  // 2. Security Check: Ensure the logged-in CEO actually owns this agency
  if (req.user.role !== 'AGENCY_ADMIN' || String(req.user.agencyId) !== String(agencyId)) {
    return next(new AppError('Cryptographic failure: Unauthorized to issue invitations for this agency shell', 403));
  }

  // 3. Generate the Magic Link Token (Valid for 24 hours)
  const inviteToken = jwt.sign(
    { email, agencyId, role: 'AGENT' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // 4. Construct the Frontend Gateway URL
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const magicLink = `${frontendUrl}/agent/accept-invite?token=${inviteToken}`;

  // 5. SURGICAL LOGGING: Output directly to backend terminal
  // console.log('\n===================================================================');
  // console.log(`🚀 [MAGIC LINK GENERATED FOR]: ${email}`);
  // console.log(`🔗 [URL]: ${magicLink}`);
  // console.log('===================================================================\n');

  // 6. Return Payload directly to Frontend
  res.status(200).json({
    status: 'success',
    message: 'Onboarding access token generated successfully.',
    magicLink,
  });
});


export const acceptInvite = catchAsync(async (req, res, next) => {
  const { token, firstName, lastName, phoneNumber, password } = req.body;

  // 1. Initial Validation
  if (!token) {
    return next(new AppError('No invitation token provided. Access denied.', 400));
  }
  if (!firstName || !lastName || !phoneNumber || !password) {
    return next(new AppError('Please provide all required profile details to activate your account.', 400));
  }

  // 2. Cryptographically verify and decode the token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your invitation link has expired. Please request a new one.', 401));
    }
    return next(new AppError('Invalid or corrupted invitation link.', 401));
  }
  
  // 3. Extract the immutable data embedded by the CEO
  const { email, agencyId } = decoded;

  // 4. Verify the email isn't already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('An account with this email is already registered.', 400));
  }

  // 🚨 THE FIX: Cryptographically hash the password before saving
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 5. Create the new Agent profile with the correct schema key
  const newAgent = await User.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    passwordHash: hashedPassword, 
    role: 'AGENT',
    agencyId 
  });

  // 6. Generate a standard session token for immediate login
  const sessionToken = jwt.sign(
    { id: newAgent._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // 7. Dispatch the success response
  res.status(201).json({
    status: 'success',
    token: sessionToken,
    user: {
      _id: newAgent._id,
      firstName: newAgent.firstName,
      lastName: newAgent.lastName,
      email: newAgent.email,
      role: newAgent.role,
      agencyId: newAgent.agencyId
    }
  });
});