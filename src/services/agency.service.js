import { Agency } from '../models/Agency.js';
import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken'; // We need this to generate the invite tokens

/**
 * REGISTRATION: Creates a new corporate entity in the database.
 */
export const registerCorporateAgency = async (agencyData) => {
  // 1. Check if the Corporate Name or CAC Number already exists to prevent duplicates
  const existingAgency = await Agency.findOne({
    $or: [
      { corporateName: agencyData.corporateName },
      { cacNumber: agencyData.cacNumber }
    ]
  });

  if (existingAgency) {
    throw new AppError('An agency with this Corporate Name or CAC Number already exists.', 400);
  }

  // 2. Commit the new agency to the database
  const newAgency = await Agency.create(agencyData);

  return newAgency;
};

export const generateAgentInviteToken = (agencyId, targetEmail) => {
  // We package the data we want to smuggle through the email link
  const payload = {
    agencyId,
    email: targetEmail,
  };

  // Sign it cryptographically using your existing JWT secret
  const inviteToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h', // The link dies after 24 hours for security
  });

  return inviteToken;
};

export const processAgencyApplication = async (agencyId, decision, adminNotes, superAdminId) => {
  const agency = await Agency.findById(agencyId);
  if (!agency) {
    throw new AppError('Agency application not found.', 404);
  }

  // 🚨 FIXED: Changed verificationStatus to status
  if (agency.status !== 'PENDING') {
    throw new AppError(`This agency has already been ${agency.status}.`, 400);
  }

  // 🚨 FIXED: Changed verificationStatus to status
  agency.status = decision;
  agency.reviewedBy = superAdminId;
  agency.reviewNotes = adminNotes;
  agency.reviewedAt = Date.now();

  await agency.save();

  if (decision === 'APPROVED') {
    await User.findOneAndUpdate(
      { agencyId: agency._id }, 
      { role: 'AGENCY_ADMIN' },
      { new: true, runValidators: true }
    );
  }

  return agency;
};