import { Hotel } from '../models/Hotel.js';
import * as hotelService from '../services/hotel.service.js';
import { catchAsync } from '../utils/catchAsync.js'

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