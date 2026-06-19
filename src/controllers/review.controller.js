import { Review } from '../models/Review.js';
import {catchAsync} from '../utils/catchAsync.js';

export const createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes: If hotel isn't in body, pull it from the URL parameter
  if (!req.body.hotel) req.body.hotel = req.params.hotelId;
  
  // Tie the review to the currently logged-in user (from your protect middleware)
  if (!req.body.user) req.body.user = req.user._id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Review successfully submitted and verified.',
    data: {
      review: newReview
    }
  });
});

export const getHotelReviews = catchAsync(async (req, res, next) => {
  // 1. Determine the filter. If a hotelId is in the URL, only fetch reviews for that hotel.
  let filter = {};
  if (req.params.hotelId) filter = { hotel: req.params.hotelId };

  // 2. Query the database, populate the user details, and sort by newest
  const reviews = await Review.find(filter)
    .populate({
      path: 'user',
      select: 'firstName lastName profileImage' // Fetch exactly what the UI needs
    })
    .sort({ createdAt: -1 });

  // 3. Return the payload
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});