import {catchAsync} from '../utils/catchAsync.js';
import * as agencyService from '../services/agency.service.js';
import AppError from '../utils/AppError.js';
import {Agency } from '../models/Agency.js'
import { processAgencyApplication } from '../services/agency.service.js';
import { User } from '../models/User.js';

// Inside your admin controller file:

export const reviewCorporateAgency = catchAsync(async (req, res, next) => {
  const agencyId = req.params.id;
  const { decision } = req.body; // e.g., 'APPROVED' or 'REJECTED'

  // 1. Fetch the Agency document
  const agency = await Agency.findById(agencyId);

  if (!agency) {
    return next(new AppError('No agency found with that ID', 404));
  }

  const currentStatus = agency.verifiedStatus || 'PENDING';

  if (currentStatus !== 'PENDING') {
    return next(new AppError(`This agency registration has already been processed as ${currentStatus}.`, 400));
  }

  // 2. ACTION ONE: Update and save the Agency status
  agency.verifiedStatus = decision;
  await agency.save();

  // 3. ACTION TWO: If approved, elevate the user's role and activate them
  if (decision === 'APPROVED') {
    await User.updateMany(
      { agencyId: agencyId }, 
      { 
        $set: { 
          role: 'ADMIN_AGENCY', // 💡 Note: If your system uses 'AGENCY_ADMIN', change this string to match your enum!
          status: 'ACTIVE'      // Unlocks the account from 'PENDING' so they can log in
        } 
      }
    );
  } else if (decision === 'REJECTED') {
    // Optional: handle what happens to the user if the agency is rejected
    await User.updateMany(
      { agencyId: agencyId },
      { $set: { status: 'REJECTED' } }
    );
  }

  // 4. Return clean success response
  return res.status(200).json({
    status: 'success',
    message: `Agency successfully verified, and associated creator elevated to agency administrator status.`,
    data: {
      agency
    }
  });
});




export const getPendingAgencies = catchAsync(async (req, res, next) => {
  const status = req.query.status || 'PENDING';

  // ⚡️ WORLD-CLASS SOLUTION: Use Aggregation to join User data onto the Agency payload
  const agencies = await Agency.aggregate([
    // 1. Filter by verifiedStatus (PENDING)
    { 
      $match: { verifiedStatus: status } 
    },
    
    // 2. Sort by newest applications first
    { 
      $sort: { createdAt: -1 } 
    },
    
    // 3. Look up the user matching this agency's _id
    {
      $lookup: {
        from: 'users',          // The name of your MongoDB users collection (usually lowercase plural)
        localField: '_id',       // The agency ID
        foreignField: 'agencyId', // The field inside the User document linking them
        as: 'associatedUser'    // Temporary array name for matched users
      }
    },
    
    // 4. Extract the email from the array and assign it directly to 'agencyEmail'
    {
      $addFields: {
        agencyEmail: { $arrayElemAt: ['$associatedUser.email', 0] }
      }
    },
    
    // 5. Clean up the payload by dropping the temporary user array (keeps data lightweight)
    {
      $project: {
        associatedUser: 0
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: agencies.length,
    data: {
      agencies
    }
  });
});