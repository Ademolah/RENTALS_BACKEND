import { Schema, model } from 'mongoose';

const TourBookingSchema = new Schema(
  {
    // The asset being viewed
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'A valid property reference is required'],
      index: true,
    },
    // The agency managing the asset (auto-extracted during creation)
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      required: [true, 'Agency routing reference is required'],
      index: true,
    },
    // The Explorer's Identity Protocol
    explorer: {
      fullName: {
        type: String,
        required: [true, 'Explorer full name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Explorer email is required'],
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Contact number is required for concierge coordination'],
        trim: true,
      },
    },
    // Chronological Structuring
    schedule: {
      date: {
        type: Date,
        required: [true, 'Tour date must be specified'],
        index: true,
      },
      timeSlot: {
        type: String,
        enum: {
          values: ['morning', 'afternoon', 'evening'],
          message: 'Invalid time slot selected',
        },
        required: [true, 'Time slot must be specified'],
      },
    },
    // Pipeline Lifecycle
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    clientNotes: {
      type: String,
      trim: true,
      maxLength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly fetch an agency's upcoming bookings
TourBookingSchema.index({ agencyId: 1, 'schedule.date': 1, status: 1 });

export const TourBooking = model('TourBooking', TourBookingSchema);