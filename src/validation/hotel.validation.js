import { z } from 'zod';

export const createHotelSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Hotel name is required' }).min(3),
    description: z.string({ required_error: 'Description is required' }).min(25),
    starRating: z.preprocess((val) => Number(val), z.number().min(1).max(5)),
    state: z.string({ required_error: 'State is required' }),
    locality: z.string({ required_error: 'Locality is required' }),
    streetAddress: z.string({ required_error: 'Street address is required' }),
    
    // Parsed from JSON strings sent via FormData
    amenities: z.preprocess((val) => typeof val === 'string' ? JSON.parse(val) : val, z.array(z.string())),
    roomTypes: z.preprocess((val) => typeof val === 'string' ? JSON.parse(val) : val, z.array(
      z.object({
        name: z.string(),
        pricePerNight: z.number().positive(),
        capacity: z.number().int().positive()
      })
    )),
    
    isAvailable: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(true),
  }),
});

export const updateHotelSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(25).optional(),
    starRating: z.preprocess((val) => Number(val), z.number().min(1).max(5)).optional(),
    state: z.string().optional(),
    locality: z.string().optional(),
    streetAddress: z.string().optional(),
    amenities: z.preprocess((val) => typeof val === 'string' ? JSON.parse(val) : val, z.array(z.string())).optional(),
    roomTypes: z.preprocess((val) => typeof val === 'string' ? JSON.parse(val) : val, z.array(
      z.object({
        name: z.string(),
        pricePerNight: z.number().positive(),
        capacity: z.number().int().positive()
      })
    )).optional(),
    isAvailable: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  }),
});