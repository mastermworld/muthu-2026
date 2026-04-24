// src/types/index.ts

export interface Member {
  id: string;                 // UUID
  memberId: string;           // human-friendly
  name: string;
  fatherName: string;
  photoUrl: string;
  gender: 'Male' | 'Female' | 'Transgender';
  mobile: string;
  whatsapp: string;
  email: string;
  address: {
    country: string;
    state: string;
    city: string;
    area: string;
    text: string;             // full address
  };
  birthDate: string;          // ISO date
  qualification: string;
  bloodGroup: string;
  jobType: string;
  jobDescription: string;
  companyDetails: string;
  idProofType: string;
  idProofNumber: string;
  physicalStatus: string;
  married: boolean;
  stamperId: string;
}

export interface Donation {
  id: string;
  memberId?: string;       // optional donor
  donorName: string;       // for non-members
  amount: number;
  currency: string;
  type: 'OneTime' | 'Recurring';
  channel: 'PhonePe' | 'GPay' | 'Paytm' | 'Other';
  fund: string;            // campaign name
  date: string;            // ISO
}

export interface Stamper {
  id: string;
  name: string;
  mobile: string;
  description: string;
  salaryConfig: { base: number; benefits: number; deductions: number };
}

export interface Population {
  country: string;
  state: string;
  city: string;
  village: string;
  count: number;
} 