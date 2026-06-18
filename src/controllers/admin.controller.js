import {catchAsync} from '../utils/catchAsync.js';
import * as agencyService from '../services/agency.service.js';
import AppError from '../utils/AppError.js';
import {Agency } from '../models/Agency.js'
import { processAgencyApplication } from '../services/agency.service.js';
import { User } from '../models/User.js';
import { HotelApplication } from '../models/HotelApplication.js';
import {sendUpgradeToAgencyEmail} from '../utils/sendUpgradeToAgencyEmail.js'

// Inside your admin controller file:

export const reviewApplication = catchAsync(async (req, res, next) => {
  const applicationId = req.params.id;
  const { decision, type } = req.body; // type can be explicitly 'agency' or 'hotel'

  // Safe normalization of decision to protect against minor casing discrepancies
  if (!decision || !['APPROVED', 'REJECTED'].includes(decision.toUpperCase())) {
    return next(new AppError('Invalid evaluation choice. Decision must be APPROVED or REJECTED.', 400));
  }
  
  const normalizedDecision = decision.toUpperCase();
  let targetDocument = null;
  let determinedType = type?.toLowerCase();

  // 🧠 INTELLIGENT AUTO-DEDUCTION: Detect type if frontend didn't provide one
  if (determinedType === 'agency' || !determinedType) {
    targetDocument = await Agency.findById(applicationId);
    if (targetDocument) determinedType = 'agency';
  }

  if (!targetDocument && (determinedType === 'hotel' || !determinedType)) {
    targetDocument = await HotelApplication.findById(applicationId);
    if (targetDocument) determinedType = 'hotel';
  }

  // Fallback check if identification key fails on both registration tables
  if (!targetDocument) {
    return next(new AppError('No application or corporate asset found with the provided identifier token.', 404));
  }

  // ==========================================
  // BRANCH A: CORPORATE AGENCY CONTEXT
  // ==========================================
  if (determinedType === 'agency') {
    const currentStatus = targetDocument.verifiedStatus || 'PENDING';

    if (currentStatus !== 'PENDING') {
      return next(new AppError(`This agency submission has already been processed as ${currentStatus}.`, 400));
    }

    // 1. Commit status alteration
    targetDocument.verifiedStatus = normalizedDecision;
    await targetDocument.save();

    // 2. Synchronize user profile structures across database links
    if (normalizedDecision === 'APPROVED') {
      await User.updateMany(
        { agencyId: applicationId }, 
        { $set: { role: 'AGENCY_ADMIN', status: 'ACTIVE' } }
      );

      const upgradedUsers = await User.find({ agencyId: applicationId });
      const officialAgencyName = targetDocument.corporateName || 'Verified Partner';

      upgradedUsers.forEach(user => {
        sendUpgradeToAgencyEmail(officialAgencyName, user.email);
      });

    } else {
      await User.updateMany(
        { agencyId: applicationId },
        { $set: { status: 'REJECTED' } }
      );
    }
  }

  // ==========================================
  // BRANCH B: HOTEL VENDOR CONTEXT
  // ==========================================
  if (determinedType === 'hotel') {
    const currentStatus = targetDocument.status?.toLowerCase() || 'pending';

    if (currentStatus !== 'pending') {
      return next(new AppError(`This hotel application registration has already been resolved as ${targetDocument.status}.`, 400));
    }

    // 1. Commit status using system case mapping style ('Approved' or 'Rejected')
    const hotelCaseDecision = normalizedDecision === 'APPROVED' ? 'Approved' : 'Rejected';
    targetDocument.status = hotelCaseDecision;
    await targetDocument.save();

    // 2. Escalate user account associated with this specific workspace application
    if (!targetDocument.userId) {
      return next(new AppError('Verification processed, but no reference userId is linked to this hotel document.', 422));
    }

    if (normalizedDecision === 'APPROVED') {
      await User.findByIdAndUpdate(
        targetDocument.userId,
        { $set: { role: 'HOTEL_ADMIN', status: 'ACTIVE' } }
      );
    } else {
      await User.findByIdAndUpdate(
        targetDocument.userId,
        { $set: { status: 'REJECTED' } }
      );
    }
  }

  // 3. Dispatch World-Class Unified Server Response Envelope
  return res.status(200).json({
    status: 'success',
    message: `Application submission successfully resolved as ${normalizedDecision} for classification: [${determinedType.toUpperCase()}].`,
    data: {
      type: determinedType,
      application: targetDocument
    }
  });
});




export const getPendingApplications = catchAsync(async (req, res, next) => {
  // Support flexible status querying, defaulting to PENDING
  const agencyStatus = req.query.status || 'PENDING';
  
  // Handle case variance for hotel status ('Approved' / 'pending') safely
  const hotelStatus = req.query.status ? req.query.status.toLowerCase() : 'pending';

  // ⚡️ WORLD-CLASS PERFORMANCE: Execute aggregations concurrently in a parallel pool
  const [agencies, hotels] = await Promise.all([
    
    // --- PIPELINE A: PENDING AGENCIES ---
    Agency.aggregate([
      { 
        $match: { verifiedStatus: agencyStatus } 
      },
      { 
        $sort: { createdAt: -1 } 
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'agencyId',
          as: 'associatedUser'
        }
      },
      {
        $addFields: {
          agencyEmail: { $arrayElemAt: ['$associatedUser.email', 0] }
        }
      },
      {
        $project: { associatedUser: 0 }
      }
    ]),

    // --- PIPELINE B: PENDING HOTEL APPLICATIONS ---
    HotelApplication.aggregate([
      { 
        // Matches status case insensitively or matching your precise model string ('pending')
        $match: { 
          status: { $regex: new RegExp(`^${hotelStatus}$`, 'i') } 
        } 
      },
      { 
        $sort: { createdAt: -1 } 
      },
      {
        // 🔍 Adjust localField/foreignField if your schema references users differently
        $lookup: {
          from: 'users',         // The target MongoDB users collection
          localField: 'userId',   // Field on the HotelApplication document
          foreignField: '_id',   // Field on the User document
          as: 'associatedUser'
        }
      },
      {
        $addFields: {
          applicantEmail: { $arrayElemAt: ['$associatedUser.email', 0] },
          applicantName: { $arrayElemAt: ['$associatedUser.name', 0] }
        }
      },
      {
        $project: { associatedUser: 0 }
      }
    ])
  ]);

  res.status(200).json({
    status: 'success',
    results: agencies.length + hotels.length,
    data: {
      agencies,
      hotels
    }
  });
});