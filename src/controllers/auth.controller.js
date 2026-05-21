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


// export const inviteAgent = catchAsync(async (req, res, next) => {
//   const { email, agencyId } = req.body;

//   // 1. Validate Input
//   if (!email || !agencyId) {
//     return next(new AppError('Target email and Agency ID are strictly required', 400));
//   }

//   // 2. Security Check: Ensure the logged-in CEO actually owns this agency
//   if (req.user.role !== 'AGENCY_ADMIN' || String(req.user.agencyId) !== String(agencyId)) {
//     return next(new AppError('Cryptographic failure: Unauthorized to issue invitations for this agency shell', 403));
//   }

//   // 3. Generate the Magic Link Token (Valid for 24 hours)
//   const inviteToken = jwt.sign(
//     { email, agencyId, role: 'AGENT' },
//     process.env.JWT_SECRET,
//     { expiresIn: '24h' }
//   );

//   // 4. Construct the Frontend Gateway URL
//   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
//   const magicLink = `${frontendUrl}/agent/accept-invite?token=${inviteToken}`;

//   // 5. The Premium Transactional Email Layout
//   const emailTemplate = `
//     <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0F172A; padding: 40px 20px; color: #ffffff;">
//       <div style="max-w-width: 600px; margin: 0 auto; background-color: #1E293B; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
        
//         <!-- Header -->
//         <div style="background: linear-gradient(90deg, #1E293B 0%, #0F172A 100%); padding: 30px; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: center;">
//           <span style="background-color: rgba(245, 158, 11, 0.1); color: #F59E0B; padding: 6px 12px; border-radius: 4px; font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">Enterprise Invitation</span>
//           <h1 style="color: #ffffff; font-size: 24px; margin: 20px 0 0 0; font-weight: 900; tracking: -1px;">Join the Elite Broker Network</h1>
//         </div>

//         <!-- Body -->
//         <div style="padding: 40px 30px;">
//           <p style="color: #94A3B8; font-size: 15px; line-height: 1.6; margin-top: 0;">
//             You have been exclusively selected to join as a Verified Agent. By accepting this invitation, you will gain immediate access to our high-end administrative console and the ability to list luxury properties directly to the global market.
//           </p>
          
//           <div style="margin: 35px 0; text-align: center;">
//             <a href="${magicLink}" style="background-color: #F43F5E; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(244, 63, 94, 0.2);">
//               Activate Agent Profile
//             </a>
//           </div>

//           <p style="color: #64748B; font-size: 12px; line-height: 1.5; text-align: center; margin-bottom: 0;">
//             This magic link is cryptographically secured and will expire in exactly 24 hours. If you did not expect this invitation, you may safely ignore this email.
//           </p>
//         </div>
        
//         <!-- Footer -->
//         <div style="background-color: #0F172A; padding: 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
//           <p style="color: #475569; font-size: 11px; margin: 0; font-family: monospace;">SECURE TRANSACTIONAL PIPELINE</p>
//         </div>
//       </div>
//     </div>
//   `;

//   // 6. Dispatch the Payload
//   try {
//     await sendEmail({
//       email: email,
//       subject: 'Action Required: Activate Your Broker Profile',
//       html: emailTemplate 
//     });

//     res.status(200).json({
//       status: 'success',
//       message: `Magic link generated and dispatched to ${email}`,
//     });
//   } catch (error) {
//     console.error('Email Dispatch Failure:', error);
//     // Explicitly throwing an AppError so the global error handler catches it cleanly
//     return next(new AppError('Failed to dispatch the invitation email. Please check your SMTP configuration.', 500));
//   }
// });

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

  // 5. Bypass Email Dispatch & Log to Terminal
  console.log('\n======================================================');
  console.log('🚨 DEVELOPMENT MODE: EMAIL DISPATCH BYPASSED 🚨');
  console.log(`Target Email: ${email}`);
  console.log(`Magic Link: \n${magicLink}`);
  console.log('======================================================\n');

  // 6. Return the token directly in the API response for instant Postman testing
  res.status(200).json({
    status: 'success',
    message: `DEVELOPMENT MODE: Magic link generated for ${email} (Email skipped).`,
    data: {
      magicLink,
      rawToken: inviteToken // Copy this directly into your /accept-invite test body!
    }
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