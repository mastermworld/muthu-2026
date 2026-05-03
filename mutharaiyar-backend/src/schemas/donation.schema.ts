import { z } from 'zod';

export const donationSchema = z.object({
  body: z.object({
    donorName: z.string({ required_error: 'Full name is required' }).min(2, 'Name must be at least 2 characters'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    phone: z.string({ required_error: 'Phone is required' }).regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number'),
  }),
});
