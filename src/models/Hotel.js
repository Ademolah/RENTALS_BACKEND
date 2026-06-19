import { Schema, model } from 'mongoose';

const RoomTypeSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Room type name is required (e.g., Presidential Suite)'],
    trim: true 
  },
  pricePerNight: { 
    type: Number, 
    required: [true, 'Nightly rate is required'] 
  },
  capacity: { 
    type: Number, 
    required: [true, 'Guest capacity is required'] 
  },
  isAvailable: { type: Boolean, default: true }
});



const HotelSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Hotel descriptive overview is required'],
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },
    amenities: {
      type: [String], // ['24/7 Power', 'Spa', 'Valet Parking', 'Infinity Pool']
      default: [],
    },
    roomTypes: [RoomTypeSchema], // Polymorphic nested room matrix
    state: {
      type: String,
      required: [true, 'State location is mandatory'],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, 'Locality neighborhood is required (e.g., Ikoyi)'],
      trim: true,
    },
    streetAddress: {
      type: String,
      required: [true, 'Street positioning address details are required'],
    },
    mediaUrls: {
      type: [String],
      default: [],
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      required: [true, 'A hotel listing must be tied to a verified partner corporate entity'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be above 0'],
      max: [5, 'Rating must be below 5.0'],
      // A setter function to round ratings to 1 decimal point (e.g., 4.6666 -> 4.7)
      set: val => Math.round(val * 10) / 10 
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true , 
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

HotelSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'hotel',
  localField: '_id'
});

// High-performance compound index for immediate filter feeds
HotelSchema.index({ locality: 1, isAvailable: 1 });

export const Hotel = model('Hotel', HotelSchema);