import { catchAsync } from '../utils/catchAsync.js';
import * as agencyService from '../services/agency.service.js';
import { User } from '../models/User.js'; // We need the User model for the upgrade
import { logger } from '../config/logger.js';

export const registerAgency = catchAsync(async (req, res, next) => {
  // 1. Pass the validated Zod payload to our corporate service engine
  const newAgency = await agencyService.registerCorporateAgency(req.validated.body);

  // 2. THE UPGRADE: Automatically promote the creator to an ADMIN and link the agency
  const upgradedUser = await User.findByIdAndUpdate(
    req.user._id, // The ID from our protectRoute middleware
    {
      role: 'AGENCY_ADMIN', // The creator is the boss of the agency
      agencyId: newAgency._id,
    },
    { new: true, runValidators: true }
  );

  // 3. Return the premium success response
  res.status(201).json({
    status: 'success',
    message: 'Corporate agency registered successfully. Your account has been upgraded to ADMIN.',
    data: {
      agency: newAgency,
      user: {
        id: upgradedUser._id,
        role: upgradedUser.role,
        agencyId: upgradedUser.agencyId,
      }
    },
  });
});


export const inviteAgent = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // 1. Security Check: Only ADMINs can invite agents to their firm
  if (req.user.role !== 'AGENCY_ADMIN') {
    return next(new AppError('Unauthorized: Only Agency Administrators can invite staff.', 403));
  }

  if (!email) {
    return next(new AppError('Please provide the email address of the agent you wish to invite.', 400));
  }

  // 2. Generate the Cryptographic Token
  const inviteToken = await agencyService.generateAgentInviteToken(req.user.agencyId, email);

  // 3. Construct the Magic Link (Assuming your frontend runs on localhost:3000 for now)
  const magicLink = `http://localhost:3000/join-agency?token=${inviteToken}`;

  // 4. Simulate sending the email (We will replace this with real email logic later)
  logger.info(`\n📧 SIMULATED EMAIL TO: ${email}`);
  logger.debug(`Subject: You've been invited to join the Agency`);
  logger.debug(`Click here to accept: ${magicLink}\n`);

  res.status(200).json({
    status: 'success',
    message: `Invitation successfully sent to ${email}`,
  });
});