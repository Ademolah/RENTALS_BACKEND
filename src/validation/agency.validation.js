import { z } from 'zod';

export const registerAgencySchema = z.object({
  body: z.object({
    corporateName: z
      .string({ required_error: 'Corporate name is required' })
      .min(3, 'Corporate name is too short'),
    cacNumber: z
      .string({ required_error: 'CAC number is required' })
      .regex(/^RC-\d{6,}$|^BN-\d{6,}$/, 'Invalid CAC Number format (e.g., RC-123456)'),
    hqAddress: z
      .string({ required_error: 'HQ Address is required' })
      .min(10, 'Please provide a full, detailed address'),
    brandAssets: z
      .object({
        logoUrl: z.string().url('Must be a valid secure URL').optional(),
        primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid Hex color').optional(),
      })
      .optional(),
    selectedTemplate: z
      .enum(['minimalist', 'zenith', 'institutional', 'modern'])
      .optional(),
  }),
});

export const reviewAgencySchema = z.object({
  body: z.object({
    decision: z.enum(['APPROVED', 'REJECTED'], {
      required_error: 'A valid decision (APPROVED or REJECTED) is required.',
    }),
    adminNotes: z.string().optional(),
  }).superRefine((data, ctx) => {
    // Premium Logic: If a Super Admin rejects an agency, they MUST provide a reason
    if (data.decision === 'REJECTED' && (!data.adminNotes || data.adminNotes.length < 10)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A detailed reason must be provided when rejecting an agency application.',
        path: ['adminNotes'],
      });
    }
  }),
});