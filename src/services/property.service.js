import { Property } from '../models/Property.js';
import AppError from '../utils/AppError.js';

/**
 * CREATION: Commits a new luxury property listing to the database.
 */
export const createListing = async (propertyData, agencyId) => {
  // Inject the authenticated agent's agency ID into the payload
  const newProperty = await Property.create({
    ...propertyData,
    agencyId,
  });

  return newProperty;
};

/**
 * SEARCH: Utilizes the 2dsphere index to find properties within a specific radius.
 */
export const findPropertiesNearMe = async (longitude, latitude, maxDistanceInMeters = 5000) => {
  const properties = await Property.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistanceInMeters, // e.g., 5000 meters = 5km radius
      },
    },
    isAvailable: true, // Only show properties currently on the market
  });

  return properties;
};


export const getAllProperties = async (queryString) => {
  // 1. SHALLOW COPY & CLEANUP: Remove pagination/sorting from the raw filter
  const queryObj = { ...queryString };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  // 2. ADVANCED FILTERING: Convert URL operators (gte, gt, lte, lt) to MongoDB operators ($gte, etc.)
  // Example: pricePerAnnum[lte]=20000000 becomes { pricePerAnnum: { $lte: 20000000 } }
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const filter = JSON.parse(queryStr);

  
  const textSearchFields = ['locality', 'state', 'title'];
  
  textSearchFields.forEach((field) => {
    if (filter[field]) {
      // Convert the plain string into a case-insensitive regex
      filter[field] = { $regex: new RegExp(filter[field], 'i') };
    }
  });
  // =======================================================================

  // Default constraint: Only show properties currently available on the market
  if (filter.isAvailable === undefined) {
    filter.isAvailable = true;
  }

  // Initialize the Mongoose Query
  let query = Property.find(filter);

  // 3. SORTING: Allow users to sort by price or date
  if (queryString.sort) {
    const sortBy = queryString.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); // Default to newest listings first
  }

  // 4. PAGINATION: Prevent database overload by limiting results per page
  const page = parseInt(queryString.page, 10) || 1;
  const limit = parseInt(queryString.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  query = query.skip(skip).limit(limit);

  // Execute the query and get the total count for frontend pagination UI
  const properties = await query;
  const total = await Property.countDocuments(filter);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    properties,
  };
};