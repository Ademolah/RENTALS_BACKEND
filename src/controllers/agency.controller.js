import { catchAsync } from '../utils/catchAsync.js';
import * as agencyService from '../services/agency.service.js';
import { User } from '../models/User.js'; // We need the User model for the upgrade
import { logger } from '../config/logger.js';
import {sendAdminAgencyAlert} from '../utils/sendAdminAgencyAlert.js'

export const registerAgency = catchAsync(async (req, res, next) => {
  // 1. Pass the validated Zod payload to our corporate service engine
  const newAgency = await agencyService.registerCorporateAgency(req.validated.body);

  // 2. Link the agency to the user profile, but DO NOT upgrade the role yet!
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id, 
    {
      agencyId: newAgency._id, 
    },
    { new: true, runValidators: true }
  );

  // 3. ADMIN NOTIFICATION PIPELINE
  const superAdmins = await User.find({ role: 'SUPERADMIN' }).select('email');
  
  // Fire off the internal operations email to every admin asynchronously
  superAdmins.forEach(admin => {
    // 🎯 THE FIX: Passing the full 'updatedUser' object instead of just the firstName string
    sendAdminAgencyAlert(admin.email, newAgency, updatedUser);
  });

  // 4. Return the premium success response
  res.status(201).json({
    status: 'success',
    message: 'Corporate agency registration submitted successfully. Your application is currently under review.',
    data: {
      agency: newAgency,
      user: {
        id: updatedUser._id,
        role: updatedUser.role, // Will cleanly remain 'USER'
        agencyId: updatedUser.agencyId,
      }
    },
  });
});

export const getAgencyAgents = catchAsync(async (req, res, next) => {
  // Extract the agencyId from the currently authenticated AGENCY_ADMIN
  const agencyId = req.user.agencyId;

  // 1. Fetch all users matching the agency ID and the 'AGENT' role
  // We use .select() to ensure we never accidentally leak passwords or reset tokens to the frontend
  const agents = await User.find({ 
    agencyId: agencyId, 
    role: 'AGENT' // Adjust to match your exact DB enum if different
  })
  .select('firstName lastName email phone avatar status createdAt')
  .sort({ createdAt: -1 }); // Newest agents first

  // 2. Dispatch the premium payload
  res.status(200).json({
    status: 'success',
    results: agents.length, // The frontend will use this for the metric card
    data: {
      agents
    }
  });
});


