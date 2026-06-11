import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    dialCode: {
      type: String,
      required: [true, 'International dial code is required'],
      trim: true,
      match: [/^\+\d{1,4}$/, 'Provide a valid international dial code (e.g., +234)'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Nigerian phone number is required'],
      unique: true,
      trim: true, // Strips away accidental whitespaces
    },
    passwordHash: {
      type: String,
      required: [true, 'Password signature is required'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['USER', 'AGENCY_ADMIN', 'AGENT','HOTEL_ADMIN', 'SUPERADMIN'],
      default: 'USER',
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'APPROVED', // Agents must be vetted by their agency admins or system admins before gaining access
    },
    // The link to the agency
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      default: null, // Remains null if the account is a standard retail renter/buyer
    },
    savedCollections: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Property', // 👈 Make sure this matches the exact string name of your Property model
      }
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        // SECURITY FILTER: Never allow password hashes to leak out across API networks
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);


UserSchema.virtual('fullPhoneNumber').get(function () {
  // Gracefully fuses the pieces together if they both exist
  if (this.dialCode && this.phoneNumber) {
    return `${this.dialCode}${this.phoneNumber}`;
  }
  return this.phoneNumber || '';
});

// CRITICAL: Ensure virtuals are included when transforming documents to JSON or Objects
UserSchema.set('toJSON', { 
  virtuals: true,
  transform(doc, ret) {
    delete ret.passwordHash; // Keep your security gate intact
    return ret;
  }
});

UserSchema.set('toObject', { virtuals: true });

export const User = model('User', UserSchema);