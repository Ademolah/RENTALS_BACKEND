import mongoose from 'mongoose';

const hotelApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'An application must be tied to an applicant user profile.'],
    unique: true 
  },
  businessName: {
    type: String,
    required: [true, 'Please provide the official hotel or business name.'],
    trim: true
  },
  cacNumber: {
    type: String,
    required: [true, 'CAC Registration Number is required.'],
    trim: true,
    uppercase: true
  },
  contactEmail: {
    type: String,
    required: [true, 'Please provide an official business email address.'],
    lowercase: true,
    trim: true
  },
  contactPhone: {
    type: String,
    required: [true, 'Please provide an official business contact phone number.']
  },
  registeredAddress: {
    type: String,
    required: [true, 'Registered office address is required.'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State location is required.'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'Approved', 'Rejected'],
    default: 'pending'
  }
}, { timestamps: true });

export const HotelApplication = mongoose.model('HotelApplication', hotelApplicationSchema);