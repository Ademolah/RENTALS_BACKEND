import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email address is mandatory' }).email('Provide a valid email address'),
    
    dialCode: z
      .string({ required_error: 'Dial code is mandatory' })
      .trim()
      .regex(/^\+\d{1,4}$/, 'Invalid international dial code format'),
      
    // 🟢 SURGICAL UPDATE: Expects the concatenated layout containing the "+" prefix
    phoneNumber: z
      .string({ required_error: 'Phone number is mandatory' })
      .trim()
      .regex(/^\+\d{10,18}$/, 'Provide a valid full international phone number starting with +'),
      
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