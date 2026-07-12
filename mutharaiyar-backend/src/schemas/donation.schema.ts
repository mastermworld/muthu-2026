import { z } from 'zod';

// ── Shared validation helpers ──────────────────────────────────────────────────
// Allow English letters, spaces, dots, and hyphens only.
const NAME_CHARS = /^[a-zA-Z\s.\-]+$/;

const SQL_INJECTION =
  /(--|\/\*|\*\/|\bUNION\s+(ALL\s+)?SELECT\b|'\s*(OR|AND)\s*[\w'"(]|\bOR\b\s+\d+\s*=\s*\d+|\bAND\b\s+\d+\s*=\s*\d+|'\s*(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC(?:UTE)?|TRUNCATE)\b)/i;
const noSql = (v: string) => !SQL_INJECTION.test(v);
const SQL_MSG = 'Input contains invalid characters.';

// ── Schema ────────────────────────────────────────────────────────────────────
export const donationSchema = z.object({
  body: z.object({
    // Name: letters (English + Tamil) only
    donorName: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .regex(NAME_CHARS, 'Name may only contain letters, spaces, dots and hyphens')
      .refine(noSql, SQL_MSG),

    // Email: format + max length + injection check
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .max(254, 'Email must be at most 254 characters')
      .refine(noSql, SQL_MSG),

    // Phone: digits only — Indian mobile format (starts with 6-9, 10 digits)
    phone: z
      .string({ required_error: 'Phone is required' })
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number (digits only)'),
  }),
});
