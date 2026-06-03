import { Hotel } from '../models/Hotel.js';
import * as hotelService from '../services/hotel.service.js';
import { catchAsync } from '../utils/catchAsync.js'
import { Reservation } from '../models/Reservation.js';

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