import mongoose, { model } from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Hotel reference is required']
  },
  roomTypeId: {
    type: String,
    required: [true, 'Target Room/Suite identifier is required']
  },
  roomTypeName: {
    type: String,
    required: true
  },
  guestName: {
    type: String,
    required: [true, 'Guest full name is required'],
    trim: true
  },
  guestEmail: {
    type: String,
    required: [true, 'Corporate email is required'],
    lowercase: true,
    trim: true
  },
  guestPhone: {
    type: String,
    required: [true, 'Contact phone number is required']
  },
  checkInDate: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Check-out date is required']
  },
  numberOfNights: {
    type: Number,
    required: true,
    min: [1, 'Reservation must span at least 1 night']
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    trim: true,
    default: ''
  },
  corporateId: {
    type: String,
    default: null
  }
}, {
  timestamps: true 
});

ReservationSchema.index({ hotel: 1, status: 1 });
ReservationSchema.index({ checkInDate: 1 });

// export default mongoose.model('Reservation', ReservationSchema);
export const Reservation = model('Reservation', ReservationSchema);