import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import * as propertyService from '../services/property.service.js';

export const createProperty = catchAsync(async (req, res, next) => {
  // 1. Security Check: Only users tied to a verified corporate Agency can list properties
  if (!req.user.agencyId) {
    return next(new AppError('Unauthorized: You must be registered under a verified Real Estate Agency to create listings.', 403));
  }

  // 2. Pass the validated payload and the user's agencyId to the service engine
  const newProperty = await propertyService.createListing(
    req.validated.body, 
    req.user.agencyId
  );

  // 3. Return the world-class successful response
  res.status(201).json({
    status: 'success',
    data: {
      property: newProperty,
    },
  });
});

// We will also wire up the search controller so it's ready!
export const getNearbyProperties = catchAsync(async (req, res, next) => {
  const { lng, lat, distance } = req.query;

  if (!lng || !lat) {
    return next(new AppError('Please provide both longitude (lng) and latitude (lat) query parameters.', 400));
  }

  const properties = await propertyService.findPropertiesNearMe(
    parseFloat(lng),
    parseFloat(lat),
    distance ? parseInt(distance) : 5000 // Default to 5km radius
  );

  res.status(200).json({
    status: 'success',
    results: properties.length,
    data: {
      properties,
    },
  });
});


export const getProperties = catchAsync(async (req, res, next) => {
  const result = await propertyService.getAllProperties(req.query);

  res.status(200).json({
    status: 'success',
    results: result.properties.length,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
    data: {
      properties: result.properties,
    },
  });
});