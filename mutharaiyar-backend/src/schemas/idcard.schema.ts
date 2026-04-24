import { z } from 'zod';

export const idCardTemplateSchema = z.object({
  // Template Info
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  
  // Organization Info
  organizationTitle: z.string().min(1, 'Organization title is required'),
  organizationLogo: z.string().optional(),
  
  // Design Settings
  style: z.enum(['modern', 'classic', 'minimalist', 'corporate', 'creative']).default('modern'),
  layout: z.enum(['horizontal', 'vertical']).default('horizontal'),
  
  // Colors
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').default('#1e40af'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').default('#3b82f6'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').default('#60a5fa'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').default('#ffffff'),
  
  // Typography
  fontFamily: z.string().default('Inter'),
  
  // Background
  bgPattern: z.string().optional(),
  
  // QR Code Settings
  showQR: z.boolean().default(true),
  qrPosition: z.enum(['right', 'left', 'bottom', 'back']).default('right'),
  
  // Member Info Fields (what to show on card)
  showFields: z.object({
    photo: z.boolean().default(true),
    name: z.boolean().default(true),
    memberId: z.boolean().default(true),
    jobTitle: z.boolean().default(true),
    department: z.boolean().default(false),
    email: z.boolean().default(true),
    phone: z.boolean().default(true),
    address: z.boolean().default(true),
    bloodGroup: z.boolean().default(false),
    emergencyContact: z.boolean().default(false),
    validFrom: z.boolean().default(true),
    validUntil: z.boolean().default(false),
    signature: z.boolean().default(false),
  }).default({}),
  
  // Template Settings
  isActive: z.boolean().default(false),
  isDefault: z.boolean().default(false),
});

export type IDCardTemplateType = z.infer<typeof idCardTemplateSchema>; 