import { Schema, model } from 'mongoose';

const AgencySchema = new Schema(
  {
    corporateName: {
      type: String,
      required: [true, 'Corporate business name is required'],
      unique: true,
      trim: true,
      index: true, // Speeds up search queries when filtering properties by agency
    },
    cacNumber: {
      type: String,
      required: [true, 'Corporate Affairs Commission (CAC) registration number is required'],
      unique: true,
      trim: true,
      uppercase: true, // Standardizes inputs for clean matching
    },
    hqAddress: {
      type: String,
      required: [true, 'Headquarters office address is required'],
      trim: true,
    },
    verifiedStatus: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED'],
        message: 'Status must be either PENDING, APPROVED, or REJECTED',
      },
      default: 'PENDING', // Every new agency application begins here until verified by an admin
      index: true, // Crucial index: allows our systems to quickly isolate verified entities
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt values
  }
);

export const Agency = model('Agency', AgencySchema);