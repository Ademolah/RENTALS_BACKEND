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
  const { email, phoneNumber, password, firstName, lastName } = userData;

  // 1. Cross-reference database to check if the identity footprint already exists
  const identityExists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (identityExists) {
    throw new AppError('An account with this email address or phone number already exists.', 400);
  }

  // 2. Cryptographically hash the user's password (Salt rounds = 12 for strong security)
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // 3. Commit the new user profile records to MongoDB Atlas
  const newUser = await User.create({
    email,
    phoneNumber,
    passwordHash,
    firstName,
    lastName,
    role: 'USER', // Standard access token level by default
  });

  // 4. Generate an active JWT session token for automatic onboarding login
  const token = generateToken(newUser._id);

  return { user: newUser, token };
};

export const loginUserAccount = async (credentials) => {
  const { email, password } = credentials;

  // 1. Locate the user by email
  const user = await User.findOne({ email });
  
  // Security Best Practice: Use a generic error message so attackers don't know if the email exists
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