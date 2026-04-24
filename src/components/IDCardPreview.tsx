import React from 'react';
import templates, { TemplateKey } from './IDCardTemplates';

interface Member {
  id: number;
  profilePicture?: string;
  fullName: string;
  gender: string;
  mobile: string;
  email: string;
  birthdate: string;
  maritalStatus: string;
  country: string;
  state: string;
  address: string;
  district?: string | null;
  taluk?: string | null;
  village?: string | null;
  education: string;
  jobType: string;
  jobDescription: string;
  bloodGroup?: string;
  createdAt: string;
  updatedAt: string;
}

interface IDCardTemplate {
  id?: number;
  name?: string;
  organizationTitle: string;
  organizationLogo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  textColor?: string;
  cardColor?: string; // For backward compatibility
  bgPattern?: string;
  fontFamily?: string;
  style?: 'modern' | 'classic' | 'minimalist' | 'corporate' | 'creative';
  layout?: 'horizontal' | 'vertical';
  showQR?: boolean;
  qrPosition?: 'right' | 'left' | 'bottom' | 'back';
  showFields?: {
    photo: boolean;
    name: boolean;
    memberId: boolean;
    jobTitle: boolean;
    department: boolean;
    email: boolean;
    phone: boolean;
    address: boolean;
    bloodGroup: boolean;
    emergencyContact: boolean;
    validFrom: boolean;
    validUntil: boolean;
    signature: boolean;
  };
}

interface IDCardPreviewProps {
  member: Member;
  template: IDCardTemplate;
  className?: string;
}

const IDCardPreview: React.FC<IDCardPreviewProps> = ({ member, template, className = '' }) => {
  // Convert old template format to new format for backward compatibility
  const normalizedTemplate = {
    ...template,
    primaryColor: template.primaryColor || template.cardColor || '#1e40af',
    secondaryColor: template.secondaryColor || '#3b82f6',
    accentColor: template.accentColor || '#60a5fa',
    textColor: template.textColor || '#ffffff',
    fontFamily: template.fontFamily || 'Inter',
    style: template.style || 'modern',
    layout: template.layout || 'horizontal',
    showQR: template.showQR !== undefined ? template.showQR : true,
    qrPosition: template.qrPosition || 'right',
    showFields: template.showFields || {
      photo: true,
      name: true,
      memberId: true,
      jobTitle: true,
      department: false,
      email: true,
      phone: true,
      address: true,
      bloodGroup: false,
      emergencyContact: false,
      validFrom: true,
      validUntil: false,
      signature: false
    }
  };

  // Determine which template component to use based on style and layout
  const getTemplateKey = (): TemplateKey => {
    const styleMap: Record<string, TemplateKey> = {
      'minimalist-horizontal': 'modernMinimalist',
      'corporate-horizontal': 'corporateProfessional',
      'creative-horizontal': 'creativeGradient',
      'classic-horizontal': 'classicElegant',
      'modern-vertical': 'verticalModern',
      'modern-horizontal': 'modernMinimalist',
      'creative-vertical': 'golden'
    };
    
    const key = `${normalizedTemplate.style}-${normalizedTemplate.layout}`;
    return styleMap[key] || 'mutharaiyar'; // Fallback to mutharaiyar
  };

  const templateKey = getTemplateKey();
  const TemplateComponent = templates[templateKey]?.component || templates.mutharaiyar.component;

  return (
    <TemplateComponent 
      member={member} 
      template={normalizedTemplate as any} 
      className={className} 
    />
  );
};

export default IDCardPreview; 