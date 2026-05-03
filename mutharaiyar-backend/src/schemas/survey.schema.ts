import { z } from 'zod';

// This schema validates the body of the survey submission request
export const surveySchema = z.object({
  body: z.object({
    fullName: z.string({ required_error: 'Full name is required' }).min(2, 'Full name must be at least 2 characters'),
    gender: z.string({ required_error: 'Gender is required' }),
    mobile: z.string({ required_error: 'Mobile number is required' }).regex(/^\d{6,15}$/, 'Invalid mobile number format'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    // The frontend sends a date string like 'YYYY-MM-DD'. We validate that it's a non-empty string.
    // The controller will be responsible for converting it to a full ISO date string.
    birthdate: z.string({ required_error: 'Birthdate is required' }).min(1, 'Birthdate is required'),
    maritalStatus: z.string({ required_error: 'Marital status is required' }),
    country: z.string({ required_error: 'Country is required' }),
    state: z.string({ required_error: 'State is required' }),
    address: z.string({ required_error: 'Address is required' }).min(10, 'Address must be at least 10 characters'),
    education: z.string({ required_error: 'Education is required' }),
    jobType: z.string({ required_error: 'Job type is required' }),
    jobDescription: z.string({ required_error: 'Job description is required' }).min(5, 'Job description must be at least 5 characters'),
    // Parent names
    fatherName: z.string().optional(),
    motherName: z.string().optional(),

    // Alternative contact
    altMobile: z.string().regex(/^\d{6,15}$/, 'Invalid alternative mobile format').optional(),
    altMobileAreaCode: z.string().optional(),

    // Optional fields for Tamil Nadu
    district: z.string().optional(),
    taluk: z.string().optional(),
    village: z.string().optional(),
    postalCode: z.string().optional(),

    // Medical information
    bloodGroup: z.string().optional(),

    // Additional socio-economic & personal fields
    economicStatus: z.string().optional(),
    physicallyChallenged: z.string().optional(),
    orphan: z.string().optional(),
    volunteering: z.string().optional(),
    interests: z.string().optional(),
    mobileAreaCode: z.string().optional(),
  }),
});

// We don't validate the file upload here as multer handles the presence check
// and file type validation can be added to multer's config if needed. 