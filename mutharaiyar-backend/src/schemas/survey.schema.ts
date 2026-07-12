import { z } from 'zod';

// ── Shared validation helpers ──────────────────────────────────────────────────
// Allow English letters, spaces, dots, and hyphens only.
const NAME_CHARS = /^[a-zA-Z\s.\-]+$/;

// Detect classic SQL-injection signatures without false-positives on normal text:
//   --           SQL line comment
//   /* */        SQL block comment
//   UNION SELECT  union-based injection
//   ' OR … / ' AND …  boolean-based injection
//   OR 1=1 / AND 1=1   tautology
//   ' followed by a SQL DML/DDL keyword
const SQL_INJECTION =
  /(--|\/\*|\*\/|\bUNION\s+(ALL\s+)?SELECT\b|'\s*(OR|AND)\s*[\w'"(]|\bOR\b\s+\d+\s*=\s*\d+|\bAND\b\s+\d+\s*=\s*\d+|'\s*(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC(?:UTE)?|TRUNCATE)\b)/i;
const noSql = (v: string) => !SQL_INJECTION.test(v);
const SQL_MSG = 'Input contains invalid characters.';

// ── Schema ────────────────────────────────────────────────────────────────────
export const surveySchema = z.object({
  body: z.object({
    // ── Name fields: letters (English + Tamil) only ──────────────────────────
    fullName: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be at most 100 characters')
      .regex(NAME_CHARS, 'Full name may only contain letters, spaces, dots and hyphens')
      .refine(noSql, SQL_MSG),

    fatherName: z
      .string()
      .max(100, "Father's name must be at most 100 characters")
      .refine((v) => v === '' || NAME_CHARS.test(v), "Father's name may only contain letters, spaces, dots and hyphens")
      .refine((v) => v === '' || noSql(v), SQL_MSG)
      .optional(),

    motherName: z
      .string()
      .max(100, "Mother's name must be at most 100 characters")
      .refine((v) => v === '' || NAME_CHARS.test(v), "Mother's name may only contain letters, spaces, dots and hyphens")
      .refine((v) => v === '' || noSql(v), SQL_MSG)
      .optional(),

    // ── Select fields ────────────────────────────────────────────────────────
    gender: z.string({ required_error: 'Gender is required' }),
    maritalStatus: z.string({ required_error: 'Marital status is required' }),
    country: z.string({ required_error: 'Country is required' }),
    state: z.string({ required_error: 'State is required' }),
    education: z.string({ required_error: 'Education is required' }),
    jobType: z.string({ required_error: 'Job type is required' }),

    // ── Phone fields: digits only ────────────────────────────────────────────
    mobile: z
      .string({ required_error: 'Mobile number is required' })
      .regex(/^\d{6,15}$/, 'Phone number must contain digits only (6–15 digits)'),

    altMobile: z
      .string()
      .refine((v) => !v || /^\d{6,15}$/.test(v), 'Phone number must contain digits only (6–15 digits)')
      .optional(),

    altMobileAreaCode: z.string().optional(),
    mobileAreaCode: z.string().optional(),

    // ── Email ────────────────────────────────────────────────────────────────
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .max(254, 'Email must be at most 254 characters')
      .refine(noSql, SQL_MSG),

    // ── Date ─────────────────────────────────────────────────────────────────
    // The frontend sends YYYY-MM-DD; the controller converts to a full ISO string.
    birthdate: z
      .string({ required_error: 'Birthdate is required' })
      .min(1, 'Birthdate is required'),

    // ── Postal code: digits only ─────────────────────────────────────────────
    postalCode: z
      .string()
      .refine((v) => !v || /^\d{4,10}$/.test(v), 'Postal code must contain digits only (4–10 digits)')
      .optional(),

    // ── Location sub-fields ──────────────────────────────────────────────────
    district: z.string().optional(),
    taluk: z.string().optional(),
    village: z.string().optional(),

    // ── Free-text fields: length-limited + SQL injection check ───────────────
    address: z
      .string({ required_error: 'Address is required' })
      .min(10, 'Address must be at least 10 characters')
      .max(500, 'Address must be at most 500 characters')
      .refine(noSql, SQL_MSG),

    jobDescription: z
      .string({ required_error: 'Job description is required' })
      .min(5, 'Job description must be at least 5 characters')
      .max(300, 'Job description must be at most 300 characters')
      .refine(noSql, SQL_MSG),

    // ── Optional enum/boolean fields ────────────────────────────────────────
    bloodGroup: z.string().optional(),
    economicStatus: z.string().optional(),
    physicallyChallenged: z.string().optional(),
    orphan: z.string().optional(),
    volunteering: z.string().optional(),

    // interests is JSON-serialised array sent as a string from the frontend
    interests: z
      .string()
      .refine((v) => !v || noSql(v), SQL_MSG)
      .optional(),

    referrer: z
      .string()
      .max(200, 'Referrer must be at most 200 characters')
      .refine((v) => v === '' || noSql(v), SQL_MSG)
      .optional(),
  }),
});

// File presence is handled by Multer; MIME/size checks can be added there if needed.
