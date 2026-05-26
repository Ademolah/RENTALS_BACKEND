import { z } from 'zod';

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).min(5, 'Title is too short'),
    description: z.string({ required_error: 'Description is required' }).min(20, 'Provide a detailed description'),
    propertyType: z.enum([
      'house', 
      'penthouse', 
      'apartment', 
      'shortlet', 
      'land', 
      'commercial', 
      'terraced'
    ], { required_error: 'Property classification is required' }),
    pricePerAnnum: z.number({ required_error: 'Annual price is required' }).positive('Price must be positive'),
    serviceCharge: z.number().nonnegative().default(0),
    cautionFee: z.number().nonnegative().default(0),
    beds: z.number({ required_error: 'Number of beds is required' }).int().positive(),
    baths: z.number({ required_error: 'Number of baths is required' }).positive(),
    
    // Strict Geospatial Validation
    location: z.object({
      type: z.literal('Point'),
      coordinates: z.tuple([
        z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
        z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
      ]),
    }),
    
    state: z.string({ required_error: 'State is required' }),
    locality: z.string({ required_error: 'Locality is required' }),
    streetAddress: z.string({ required_error: 'Street address is required' }),

    isAvailable: z.preprocess(
      (val) => val === 'true' || val === true, 
      z.boolean()
    ).default(true),
    
    // Arrays of secure Cloudinary URLs
    mediaUrls: z.array(z.string().url()).optional().default([]),
    virtualTourUrl: z.string().url().nullable().optional(),
  }),
});