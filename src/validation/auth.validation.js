import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email address is mandatory' }).email('Provide a valid email address'),
    phoneNumber: z
      .string({ required_error: 'Phone number is mandatory' })
      .min(11, 'Nigerian phone numbers must be at least 11 digits')
      .max(14, 'Phone number format is too long'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be a minimum of 8 characters long'),
    firstName: z.string({ required_error: 'First name is required' }).trim().min(2, 'First name is too short'),
    lastName: z.string({ required_error: 'Last name is required' }).trim().min(2, 'Last name is too short'),
  }),
});


export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required for login' })
      .email('Please provide a valid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password cannot be empty'),
  }),
});