import { Schema, model } from 'mongoose';

const AgencySchema = new Schema(
  {
    corporateName: {
      type: String,
      required: [true, 'Corporate business name is required'],
      unique: true,
      trim: true,
      index: true, 
    },
    cacNumber: {
      type: String,
      required: [true, 'Corporate Affairs Commission (CAC) registration number is required'],
      unique: true,
      trim: true,
      uppercase: true, 
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
      default: 'PENDING', 
      index: true, 
    },
    // =====================================================================
    // PREMIUM BRAND IDENTITY & DOCUMENTATION ENGINE
    // =====================================================================
    brandAssets: {
      logoUrl: {
        type: String,
        default: null,
      },
      primaryColor: {
        type: String,
        default: '#000000', // Used to chromatically engineer dynamic email templates
      },
    },
    // The layout engine choice for client-facing documentation
    selectedTemplate: { 
      type: String, 
      enum: ['minimalist', 'zenith', 'institutional', 'modern'], 
      default: 'modern' 
    },
  },
  {
    timestamps: true, 
  }
);

export const Agency = model('Agency', AgencySchema);