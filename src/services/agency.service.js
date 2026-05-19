import { Agency } from '../models/Agency.js';
import AppError from '../utils/AppError.js';

/**
 * REGISTRATION: Creates a new corporate entity in the database.
 */
export const registerCorporateAgency = async (agencyData) => {
  // 1. Check if the Corporate Name or CAC Number already exists to prevent duplicates
  const existingAgency = await Agency.findOne({
    $or: [
      { corporateName: agencyData.corporateName },
      { cacNumber: agencyData.cacNumber }
    ]
  });

  if (existingAgency) {
    throw new AppError('An agency with this Corporate Name or CAC Number already exists.', 400);
  }

  // 2. Commit the new agency to the database
  const newAgency = await Agency.create(agencyData);

  return newAgency;
};