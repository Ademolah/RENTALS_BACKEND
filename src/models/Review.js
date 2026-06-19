import { Schema, model } from 'mongoose';
import { Hotel } from './Hotel.js'; // Adjust path as needed

const ReviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Review text cannot be empty'],
      trim: true,
      maxlength: [500, 'Review cannot exceed 500 characters']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating cannot exceed 5.0'],
      required: [true, 'A numeric rating is required']
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'Review must belong to a verified Hotel entity.']
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a registered User.']
    }
  },
  { timestamps: true }
);

// 🛡️ DATA INTEGRITY: Prevent duplicate reviews. 
// One user can only leave one review per hotel.
ReviewSchema.index({ hotel: 1, user: 1 }, { unique: true });

// ⚙️ AGGREGATION ENGINE: Automatically calculate averages
ReviewSchema.statics.calcAverageRatings = async function (hotelId) {
  // 'this' points to the Review model
  const stats = await this.aggregate([
    {
      $match: { hotel: hotelId }
    },
    {
      $group: {
        _id: '$hotel',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  // Persist the calculated stats back to the parent Hotel document
  if (stats.length > 0) {
    await Hotel.findByIdAndUpdate(hotelId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    // Fallback if the last review is deleted
    await Hotel.findByIdAndUpdate(hotelId, {
      ratingsQuantity: 0,
      ratingsAverage: 0
    });
  }
};

// ⚡ MIDDLEWARE: Fire the calculation AFTER a new review is saved
ReviewSchema.post('save', function () {
  // 'this.constructor' points to the Review model
  this.constructor.calcAverageRatings(this.hotel);
});

// ⚡ MIDDLEWARE: Fire the calculation AFTER a review is updated or deleted
ReviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.hotel);
  }
});

export const Review = model('Review', ReviewSchema);