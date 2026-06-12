import { Property } from '../models/Property.js';
import AppError from '../utils/AppError.js';
import {User} from '../models/User.js'

/**
 * CREATION: Commits a new luxury property listing to the database.
 */
export const createListing = async (propertyData, agencyId) => {
  // Defensive normalization for outright asset acquisitions
  if (['land', 'house_sale'].includes(propertyData.propertyType)) {
    propertyData.serviceCharge = 0;
    propertyData.cautionFee = 0;
  }

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
  // 1. SHALLOW COPY & CLEANUP
  const queryObj = { ...queryString };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  // 2. ADVANCED FILTERING
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const filter = JSON.parse(queryStr);

  const textSearchFields = ['locality', 'state', 'title'];
  textSearchFields.forEach((field) => {
    if (filter[field]) {
      filter[field] = { $regex: new RegExp(filter[field], 'i') };
    }
  });

  // Default constraint
  if (filter.isAvailable === undefined) {
    filter.isAvailable = true;
  } else if (filter.isAvailable === 'all') {
    delete filter.isAvailable; // Allow fetching both true and false listings
  }

  // Initialize the Mongoose Query (🚨 SURGICAL FIX: Added .lean() for easy object manipulation)
  let query = Property.find(filter).lean();

  // 3. SORTING
  if (queryString.sort) {
    const sortBy = queryString.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // 4. PAGINATION
  const page = parseInt(queryString.page, 10) || 1;
  const limit = parseInt(queryString.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  query = query.skip(skip).limit(limit);

  // Execute the query
  const properties = await query;
  const total = await Property.countDocuments(filter);

  // =======================================================================
  // 5. PREMIUM CONCIERGE MAPPING (The Surgical Injection)
  // =======================================================================
  // Extract unique agency IDs from the current page of properties
  const agencyIds = [...new Set(properties.map((p) => p.agencyId?.toString()).filter(Boolean))];

  // 🎯 SURGICAL ADJUSTMENT: Query both AGENT and AGENCY_ADMIN roles to cover CEO-listed properties
  const corporateContacts = await User.find({
    agencyId: { $in: agencyIds },
    role: { $in: ['AGENT', 'AGENCY_ADMIN'] }
  }).select('firstName lastName email phoneNumber agencyId role').lean();

  // Create an O(1) dictionary lookup table
  const contactDictionary = corporateContacts.reduce((acc, user) => {
    const key = user.agencyId.toString();
    
    // Prioritization Logic: If an AGENT is already mapped, don't let an AGENCY_ADMIN overwrite them.
    // If empty or if replacing an admin entry with a dedicated agent, proceed with assignment.
    if (!acc[key] || (user.role === 'AGENT' && acc[key].role === 'AGENCY_ADMIN')) {
      acc[key] = user;
    }
    
    return acc;
  }, {});

  // Attach the calculated corporate credentials to the property payloads
  const enrichedProperties = properties.map((property) => {
    const contactRecord = property.agencyId ? contactDictionary[property.agencyId.toString()] : null;
    
    return {
      ...property,
      agent: contactRecord ? {
        name: `${contactRecord.firstName} ${contactRecord.lastName}`,
        phone: contactRecord.phoneNumber,
        email: contactRecord.email
      } : null
    };
  });
  // =======================================================================

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    properties: enrichedProperties, // 🚨 Pass the enriched array back to the controller
  };
};


export const updateProperty = async (propertyId, agencyId, updateData) => {
  // Scoping with agencyId prevents cross-agent tampering
  const updatedProperty = await Property.findOneAndUpdate(
    { _id: propertyId, agencyId }, 
    updateData, 
    { 
      new: true,          // Return the freshly modified document
      runValidators: true // Enforce schema type safety on update
    }
  ).lean();

  return updatedProperty;
};

/**
 * Deletes a property listing ensuring it belongs strictly to the requesting agency
 */
export const deleteProperty = async (propertyId, agencyId) => {
  // Scoping with agencyId guarantees agents can only purge their own inventory
  const deletedProperty = await Property.findOneAndDelete({ 
    _id: propertyId, 
    agencyId 
  });
  
  return deletedProperty;
};