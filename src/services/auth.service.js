import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import AppError from '../utils/AppError.js';

// Helper utility to sign secure JSON Web Tokens
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

export const registerUserAccount = async (userData) => {
  // Destructure the two direct fields
  const { email, dialCode, phoneNumber, password, firstName, lastName } = userData;

  // 1. Cross-reference database using the unified concatenated phoneNumber string
  const identityExists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (identityExists) {
    throw new AppError('An account with this email address or phone number already exists.', 400);
  }

  // 2. Cryptographically hash the user's password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // 3. Save directly to your MongoDB document collection
  const newUser = await User.create({
    email,
    dialCode,    // 👈 Preserved cleanly for future filter metrics
    phoneNumber, // 👈 Stored directly as the full international string "+226988736335"
    passwordHash,
    firstName,
    lastName,
    role: 'USER',
  });

  const token = generateToken(newUser._id);
  return { user: newUser, token };
};

export const loginUserAccount = async (credentials) => {
  const { email, password } = credentials;

  // 1. Locate the user by email AND populate their saved collections natively 🚀
  const user = await User.findOne({ email }).populate('savedCollections');
  
  if (!user) {
    throw new AppError('Invalid authentication credentials.', 401);
  }

  // 2. Cryptographically compare the provided password against the stored hash
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid authentication credentials.', 401);
  }

  // 3. Issue a fresh JWT session token
  const token = generateToken(user._id);

  return { user, token };
};