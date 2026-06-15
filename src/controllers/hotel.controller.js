import { Hotel } from '../models/Hotel.js';
import * as hotelService from '../services/hotel.service.js';
import { catchAsync } from '../utils/catchAsync.js'
import { Reservation } from '../models/Reservation.js';
import { HotelApplication } from '../models/HotelApplication.js';
import { User } from '../models/User.js';
import AppError from '../utils/AppError.js';

export const listHotel = catchAsync(async (req, res, next) => {
  // Extract file tracking optimization paths from Cloudinary middleware upload
  const mediaUrls = req.files ? req.files.map(file => file.path) : [];
  
  const hotelPayload = {
    ...req.body,
    mediaUrls,
    agencyId: req.user.agencyId, // Authenticated corporate session extraction
  };

  const newHotel = await Hotel.create(hotelPayload);

  res.status(201).json({
    status: 'success',
    data: { hotel: newHotel }
  });
});

export const searchHotels = catchAsync(async (req, res, next) => {
  const searchResults = await hotelService.getAllHotels(req.query);

  res.status(200).json({
    status: 'success',
    results: searchResults.hotels.length,
    pagination: searchResults.pagination,
    data: { hotels: searchResults.hotels }
  });
});


export const getHotelReservations = catchAsync(async (req, res, next) => {
  const { hotelId } = req.params;

  // 1. Pull reservations tied to this hotel, sorted descending by creation date (Newest first)
  const reservations = await Reservation.find({ hotel: hotelId })
    .sort({ createdAt: -1 })
    // If you need baseline hotel meta details later, uncomment the line below:
    // .populate('hotel', 'title state locality') 

  // 2. Safely return data payload pipeline back to the dashboard UI
  res.status(200).json({
    status: 'success',
    results: reservations.length,
    data: {
      reservations
    }
  });
});


export const confirmReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    { status: 'confirmed' },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!reservation) {
    return res.status(404).json({
      status: 'fail',
      message: 'No reservation found with that ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      reservation,
    },
  });
});

/**
 * @desc    Reject / Cancel a reservation request
 * @route   PATCH /api/v1/reservations/:id/cancel
 * @access  Private (Admin Only)
 */
export const cancelReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled' },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!reservation) {
    return res.status(404).json({
      status: 'fail',
      message: 'No reservation found with that ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      reservation,
    },
  });
});

/**
 * @desc    Permanently delete/purge a terminated reservation record
 * @route   DELETE /api/v1/reservations/:id
 * @access  Private (Admin Only)
 */
export const deleteReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);

  if (!reservation) {
    return res.status(404).json({
      status: 'fail',
      message: 'No reservation found with that ID',
    });
  }

  // 204 status code denotes a successful deletion with zero content returned
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const submitApplication = catchAsync(async (req, res, next) => {
  const { businessName, cacNumber, contactEmail, contactPhone, registeredAddress, state } = req.body;

  // Prevent user from flooding multiple pending applications
  const existingApplication = await HotelApplication.findOne({ 
    userId: req.user._id, 
    status: 'pending' 
  });

  if (existingApplication) {
    return next(new AppError('You already have a pending registration application in review.', 400));
  }

  const newApplication = await HotelApplication.create({
    userId: req.user._id,
    businessName,
    cacNumber,
    contactEmail,
    contactPhone,
    registeredAddress,
    state
  });

  // 🟢 CLEAN: We handle the hydration dynamically inside loginUserAccount service now,
  // keeping this database collection beautifully decoupled.

  res.status(201).json({
    success: true,
    message: 'Hotel registration application submitted successfully to the verification ledger.',
    data: {
      application: newApplication
    }
  });
});

// =========================================================================
// 2. GET USER'S OWN APPLICATION STATUS (Authenticated User)
// =========================================================================
export const getMyApplication = catchAsync(async (req, res, next) => {
  const application = await HotelApplication.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      application
    }
  });
});

// =========================================================================
// 3. LIST ALL APPLICATIONS (Super Admin Only)
// =========================================================================
export const getAllApplications = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const applications = await HotelApplication.find(filter)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: applications.length,
    data: {
      applications
    }
  });
});

// =========================================================================
// 4. REVIEW APPLICATION: APPROVE / REJECT (Super Admin Only)
// =========================================================================
export const reviewApplication = catchAsync(async (req, res, next) => {
  const { applicationId } = req.params;
  const { action } = req.body; // Expects 'approve' or 'reject'

  if (!['approve', 'reject'].includes(action)) {
    return next(new AppError('Invalid review action directive. Use "approve" or "reject".', 400));
  }

  const application = await HotelApplication.findById(applicationId);
  if (!application) {
    return next(new AppError('Target hotel application record not found.', 404));
  }

  if (application.status !== 'pending') {
    return next(new AppError('This application status framework has already been finalized.', 400));
  }

  // Handle Rejection Path simply
  if (action === 'reject') {
    application.status = 'rejected';
    await application.save();

    return res.status(200).json({
      success: true,
      message: 'Hotel application registration rejected safely.',
      data: { application }
    });
  }

  // --- 🟢 EXECUTE MERCHANT ROLE UPGRADE ON APPROVAL ---
  application.status = 'approved';
  await application.save();

  // Elevate user's profile permission matrix to HOTEL_ADMIN
  const upgradedUser = await User.findByIdAndUpdate(
    application.userId,
    { role: 'HOTEL_ADMIN' },
    { new: true, runValidators: true }
  );

  if (!upgradedUser) {
    return next(new AppError('Critical Pipeline Failure: Target applicant user record missing.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Application approved successfully. User role elevated to HOTEL_ADMIN.',
    data: {
      application
    }
  });
});