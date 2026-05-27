import { catchAsync } from '../utils/catchAsync.js';
import * as agencyService from '../services/agency.service.js';
import { User } from '../models/User.js'; // We need the User model for the upgrade
import { logger } from '../config/logger.js';

export const registerAgency = catchAsync(async (req, res, next) => {
  // 1. Pass the validated Zod payload to our corporate service engine
  const newAgency = await agencyService.registerCorporateAgency(req.validated.body);

  // 2. THE UPGRADE: Automatically promote the creator to an ADMIN and link the agency
  // const upgradedUser = await User.findByIdAndUpdate(
  //   req.user._id, // The ID from our protectRoute middleware
  //   {
  //     role: 'AGENCY_ADMIN', // The creator is the boss of the agency
  //     agencyId: newAgency._id,
  //   },
  //   { new: true, runValidators: true }
  // );

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


