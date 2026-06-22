import mongoose from 'mongoose';
import {Property} from './Property.js'; // Ensure the path matches your app structure

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review text content is required.']
    },
    rating: {
      type: Number,
      required: [true, 'A rating integer between 1 and 5 is required.'],
      min: 1,
      max: 5
    },
    propertyId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Property',
      required: [true, 'Review must belong to a specific property tracking asset.']
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be bound to a verified corporate or consumer user account.']
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Prevent a single user from spamming multiple reviews on the exact same property listing
reviewSchema.index({ propertyId: 1, userId: 1 }, { unique: true });

// 🎯 HIGH-PERFORMANCE STATIC CALCULATION MATRIX
reviewSchema.statics.calcAverageRatings = async function (propertyId) {
  const stats = await this.aggregate([
    { $match: { propertyId } },
    {
      $group: {
        _id: '$propertyId',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Property.findByIdAndUpdate(propertyId, {
      numberOfReviews: stats[0].nRating,
      averageRating: stats[0].avgRating
    });
  } else {
    // Graceful fallback if all reviews are deleted
    await Property.findByIdAndUpdate(propertyId, {
      numberOfReviews: 0,
      averageRating: 0
    });
  }
};

// Hook to trigger aggregation calculations when a new review is saved
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.propertyId);
});

// Hook to handle rating recalibrations on modifications or deletions
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.propertyId);
  }
});

export const Review = mongoose.model('PropertyReview', reviewSchema);