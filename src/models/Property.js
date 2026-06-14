import { Schema, model } from 'mongoose';
import { required } from 'zod/mini';

const PropertySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Property listing title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Property descriptive criteria is required'],
    },
    pricePerAnnum: {
      type: Number,
      required: [true, 'Annual rental or buyout pricing cost is required'],
    },
    serviceCharge: {
      type: Number,
      default: 0, // Common across luxury high-end real estate layouts in Nigeria
    },
    cautionFee: {
      type: Number,
      default: 0,
    },
    beds: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
    },
    baths: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
    },
    state: {
      type: String,
      required: [true, 'State location parameter is mandatory (e.g., Lagos)'],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, 'Specific neighborhood division location is required (e.g., Ikoyi)'],
      trim: true,
    },
    streetAddress: {
      type: String,
      required: [true, 'Street positioning address details are required'],
    },
    mediaUrls: {
      type: [String], // Array storing secure asset optimization tracking paths from Cloudinary[cite: 2]
      default: [],
    },
    virtualTourUrl: {
      type: String,
      default: null, // Stores raw embedding tokens for responsive 3D immersive views[cite: 2]
    },
    // The Categorization Engine
  propertyType: {
    type: String,
    required: [true, 'An asset must be categorized by its structural or transaction type'],
    enum: {
      values: [
        'house', 
        'penthouse', 
        'apartment', 
        'shortlet', 
        'land', 
        'commercial', 
        'terraced',
        'bungalow',
        'house_sale' // 👈 ADDED FOR OUTRIGHT SALE VALIDATION
      ],
      message: 'Property type must be one of: house, penthouse, apartment, shortlet, land, commercial, terraced, or house_sale'
    },
    default: 'house',
    index: true // Crucial for optimizing performance when filtering the horizontal UI feeds
  },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      required: [true, 'A listing must be tied to a verified corporate entity'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// =========================================================================
// PERFORMANCE OPTIMIZATION & INDEXES (The Speed Secret)
// =========================================================================


// 2. Compound indexing for ultra-fast filtering:
// When users filter by locality (e.g., Lekki), availability, and price concurrently, 
// this compound index resolves the query instantly inside RAM, avoiding expensive table scans.
PropertySchema.index({ locality: 1, isAvailable: 1, pricePerAnnum: 1 });

export const Property = model('Property', PropertySchema);