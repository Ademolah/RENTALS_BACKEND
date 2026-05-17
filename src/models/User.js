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
      enum: ['USER', 'AGENCY_ADMIN', 'AGENT', 'SUPERADMIN'],
      default: 'USER',
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING', // Agents must be vetted by their agency admins or system admins before gaining access
    },
    // The link to the agency
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      default: null, // Remains null if the account is a standard retail renter/buyer
    },
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

// Performance Optimization: Indexing email and phone numbers for rapid login validation loops
UserSchema.index({ email: 1 });
UserSchema.index({ phoneNumber: 1 });

export const User = model('User', UserSchema);