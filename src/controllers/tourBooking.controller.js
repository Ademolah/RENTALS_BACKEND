import { TourBooking } from '../models/TourBooking.js';
import { Property } from '../models/Property.js';
import AppError  from '../utils/AppError.js'
import {catchAsync} from '../utils/catchAsync.js'

// ============================================================================
// PUBLIC INGESTION: Handle incoming tour requests from the Modal
// ============================================================================
export const requestTour = catchAsync(async (req, res, next) => {
  const { propertyId, fullName, email, phone, date, timeSlot, clientNotes } = req.body;

  // 1. Verify the property exists and extract its parent Agency ID
  const property = await Property.findById(propertyId);
  
  if (!property) {
    return next(new AppError('Target property could not be located in the global registry.', 404));
  }

  // 2. Generate the booking record
  const booking = await TourBooking.create({
    propertyId: property._id,
    agencyId: property.agencyId, // 🎯 Automatically routes it to the correct dashboard
    explorer: {
      fullName,
      email,
      phone,
    },
    schedule: {
      date,
      timeSlot,
    },
    clientNotes,
  });

  // 3. Return clean confirmation
  return res.status(201).json({
    status: 'success',
    message: 'Tour request has been successfully transmitted to the concierge desk.',
    data: {
      booking,
    },
  });
});

// ============================================================================
// DASHBOARD PIPELINE: Fetch bookings specifically for the logged-in agent/agency
// ============================================================================
export const getAgencyBookings = catchAsync(async (req, res, next) => {
  // Extract the agency ID from the securely decoded user token
  const agencyId = req.user.agencyId; 

  if (!agencyId) {
    return next(new AppError('Authentication mismatch. Agency workspace not found.', 403));
  }

  // Fetch all bookings routed to this agency, populated with the property details
  const bookings = await TourBooking.find({ agencyId })
    .populate({
      path: 'propertyId',
      select: 'title location price images', // Only pull necessary asset metadata
    })
    .sort({ 'schedule.date': 1, createdAt: -1 }); // Sort chronologically

  return res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

export const updateBookingStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  // 1. Validate the incoming status parameter
  const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid state transition requested.', 400));
  }

  // 2. Locate the target booking
  const booking = await TourBooking.findById(id);

  if (!booking) {
    return next(new AppError('Target booking could not be located in the registry.', 404));
  }

  // 3. 🚨 SECURITY VAULT CHECK: Ensure the agent's agency matches the booking's agency
  // This prevents agents from modifying bookings belonging to competing agencies
  if (booking.agencyId.toString() !== req.user.agencyId.toString()) {
    return next(new AppError('Cryptographic mismatch: You are not authorized to modify this itinerary.', 403));
  }

  // 4. Execute the transition
  booking.status = status;
  await booking.save();

  // 5. Return success payload
  return res.status(200).json({
    status: 'success',
    message: `Booking successfully updated to ${status}`,
    data: {
      booking,
    },
  });
});