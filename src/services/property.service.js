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