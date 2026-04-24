import React from 'react';
import { User, Phone, Mail, MapPin, Briefcase, Calendar, Globe, Building, Shield, Hash } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import GoldenTemplate from './GoldenTemplate';
import { API_URL } from '../config/api';

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
  id: number;
  name: string;
  organizationTitle: string;
  organizationLogo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  bgPattern?: string;
  fontFamily: string;
  style: 'modern' | 'classic' | 'minimalist' | 'corporate' | 'creative';
  layout: 'horizontal' | 'vertical';
  showQR: boolean;
  qrPosition: 'right' | 'left' | 'bottom' | 'back';
  showFields: {
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

interface IDCardTemplateProps {
  member: Member;
  template: IDCardTemplate;
  className?: string;
}

// Mutharaiyar Golden Template
export const MutharaiyarTemplate: React.FC<IDCardTemplateProps> = ({ member, template, className = '' }) => {
  const memberIdDisplay = `MUTHU-${String(member.id).padStart(6, '0')}`;
  const qrData = JSON.stringify({
    id: member.id,
    name: member.fullName,
    mobile: member.mobile,
  });

  return (
    <div className={`${className}`}>
      <div 
        className="relative rounded-2xl overflow-hidden shadow-2xl bg-cover bg-center"
        style={{ 
          width: '450px', 
          height: '280px',
          backgroundImage: 'url(/mutharaiyar-id-card-template.png)', // Using the new template background
          fontFamily: `'Roboto', 'Inter', sans-serif`,
          color: '#333'
        }}
      >
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div>
            {/* Profile Picture */}
            <div className="absolute top-16 left-8 w-28 h-36 rounded-lg overflow-hidden border-4 border-white shadow-lg bg-gray-200">
              {member.profilePicture ? (
                <img 
                  src={member.profilePicture.startsWith('http') ? member.profilePicture : `${API_URL}/${member.profilePicture}`}
                  alt={member.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* QR Code */}
            <div className="absolute bottom-6 right-8 p-1 bg-white rounded-md shadow-md">
              <QRCodeCanvas value={qrData} size={80} bgColor="#ffffff" fgColor="#000000" />
            </div>
          </div>

          <div className="relative z-10 text-right pr-4">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-black" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>{member.fullName}</h1>
              <p className="text-lg font-medium text-gray-800">{member.jobType}</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-end">
                <span className="font-semibold">{memberIdDisplay}</span>
                <Hash className="w-4 h-4 ml-2" />
              </div>
              <div className="flex items-center justify-end">
                <span>{member.mobile}</span>
                <Phone className="w-4 h-4 ml-2" />
              </div>
              <div className="flex items-center justify-end">
                <span className="truncate max-w-xs">{member.email}</span>
                <Mail className="w-4 h-4 ml-2" />
              </div>
              <div className="flex items-center justify-end">
                <span>{member.district}, {member.state}</span>
                <MapPin className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Minimalist Template
export const ModernMinimalistTemplate: React.FC<IDCardTemplateProps> = ({ member, template, className = '' }) => {
  const memberIdDisplay = String(member.id).padStart(6, '0');
  const location = [member.district, member.state].filter(Boolean).join(', ');
  
  const qrData = JSON.stringify({
    id: member.id,
    name: member.fullName,
    mobile: member.mobile,
    email: member.email,
    org: template.organizationTitle
  });

  return (
    <div className={`${className}`}>
      <div 
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl"
        style={{ 
          width: '400px', 
          height: '250px',
          fontFamily: `'${template.fontFamily}', 'Inter', sans-serif`
        }}
      >
        {/* Minimalist Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
        
        {/* Accent Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: template.primaryColor }}
        ></div>

        {/* Content */}
        <div className="relative z-10 p-6 h-full flex">
          <div className="flex-1 flex flex-col justify-between">
            {/* Header */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
                {template.organizationTitle}
              </h3>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{member.fullName}</h1>
              <p className="text-sm text-gray-600">{member.jobType}</p>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center text-xs text-gray-600">
                <Mail className="w-3 h-3 mr-2" style={{ color: template.primaryColor }} />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <Phone className="w-3 h-3 mr-2" style={{ color: template.primaryColor }} />
                <span>{member.mobile}</span>
              </div>
              {location && (
                <div className="flex items-center text-xs text-gray-600">
                  <MapPin className="w-3 h-3 mr-2" style={{ color: template.primaryColor }} />
                  <span>{location}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div 
                className="text-xs font-mono font-bold"
                style={{ color: template.primaryColor }}
              >
                ID: {memberIdDisplay}
              </div>
              <div className="text-xs text-gray-500">
                Member since {new Date(member.createdAt).getFullYear()}
              </div>
            </div>
          </div>

          {/* Right Section with Photo and QR */}
          <div className="ml-6 flex flex-col items-center justify-between">
            {/* Profile Photo */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 ring-4 ring-white shadow-lg">
              {member.profilePicture ? (
                <img 
                  src={member.profilePicture.startsWith('http') ? member.profilePicture : `${API_URL}/${member.profilePicture}`}
                  alt={member.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load profile picture:', member.profilePicture);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>

            {/* QR Code */}
            {template.showQR && (
              <div className="mt-4 p-2 bg-white rounded-lg shadow-md">
                <QRCodeCanvas
                  value={qrData}
                  size={60}
                  level="M"
                  includeMargin={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Corporate Professional Template
export const CorporateProfessionalTemplate: React.FC<IDCardTemplateProps> = ({ member, template, className = '' }) => {
  const memberIdDisplay = `EMP-${String(member.id).padStart(6, '0')}`;
  const location = [member.district, member.state].filter(Boolean).join(', ');
  
  const qrData = JSON.stringify({
    id: member.id,
    name: member.fullName,
    mobile: member.mobile,
    email: member.email,
    dept: member.jobType,
    org: template.organizationTitle
  });

  return (
    <div className={`${className}`}>
      <div 
        className="relative bg-white rounded-xl overflow-hidden shadow-2xl"
        style={{ 
          width: '400px', 
          height: '250px',
          fontFamily: `'${template.fontFamily}', 'Arial', sans-serif`
        }}
      >
        {/* Corporate Header */}
        <div 
          className="h-20 relative overflow-hidden"
          style={{ backgroundColor: template.primaryColor }}
        >
          {/* Geometric Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-8 border-white"></div>
            <div className="absolute -bottom-20 -left-10 w-60 h-60 rounded-full border-8 border-white"></div>
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-between px-6">
            <div>
              {template.organizationLogo ? (
                <img 
                  src={template.organizationLogo}
                  alt="Logo"
                  className="h-10 w-auto filter brightness-0 invert"
                />
              ) : (
                <Building className="w-10 h-10 text-white" />
              )}
            </div>
            <div className="text-right">
              <h2 className="text-white font-bold text-lg">{template.organizationTitle}</h2>
              <p className="text-white/80 text-xs">Professional Member</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 flex">
          {/* Left Section */}
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900">{member.fullName}</h1>
              <p 
                className="text-sm font-semibold"
                style={{ color: template.primaryColor }}
              >
                {member.jobType}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {member.education}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center text-gray-700">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <Mail className="w-3 h-3 text-gray-500" />
                </div>
                <span>{member.email}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <Phone className="w-3 h-3 text-gray-500" />
                </div>
                <span>{member.mobile}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                  <MapPin className="w-3 h-3 text-gray-500" />
                </div>
                <span>{location || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-32 flex flex-col items-center justify-between">
            {/* Photo */}
            <div 
              className="w-24 h-24 rounded-lg overflow-hidden shadow-md border-2"
              style={{ borderColor: template.primaryColor }}
            >
              {member.profilePicture ? (
                <img 
                  src={member.profilePicture.startsWith('http') ? member.profilePicture : `${API_URL}/${member.profilePicture}`}
                  alt={member.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Employee ID */}
            <div 
              className="mt-3 px-3 py-1 rounded text-xs font-bold text-white text-center"
              style={{ backgroundColor: template.secondaryColor }}
            >
              {memberIdDisplay}
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-between px-6"
          style={{ backgroundColor: template.secondaryColor }}
        >
          <div className="text-xs text-white/90">
            Valid from: {new Date(member.createdAt).toLocaleDateString()}
          </div>
          {template.showQR && (
            <div className="bg-white p-1 rounded">
              <QRCodeCanvas
                value={qrData}
                size={24}
                level="L"
                includeMargin={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Creative Gradient Template
export const CreativeGradientTemplate: React.FC<IDCardTemplateProps> = ({ member, template, className = '' }) => {
  const memberIdDisplay = String(member.id).padStart(8, '0');
  const initials = member.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  
  const qrData = JSON.stringify({
    id: member.id,
    name: member.fullName,
    contact: member.mobile,
    email: member.email,
    role: member.jobType
  });

  return (
    <div className={`${className}`}>
      <div 
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{ 
          width: '400px', 
          height: '250px',
          fontFamily: `'${template.fontFamily}', 'Poppins', sans-serif`,
          background: `linear-gradient(135deg, ${template.primaryColor} 0%, ${template.secondaryColor} 50%, ${template.accentColor} 100%)`
        }}
      >
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        
        {/* Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10"></div>

        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                {template.organizationTitle}
              </h3>
              <h1 className="text-2xl font-bold text-white mb-1">{member.fullName}</h1>
              <p className="text-white/90 text-sm">{member.jobType}</p>
            </div>
            
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-md shadow-lg">
              {member.profilePicture ? (
                <img 
                  src={member.profilePicture.startsWith('http') ? member.profilePicture : `${API_URL}/${member.profilePicture}`}
                  alt={member.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center text-white/90 text-xs">
                <Phone className="w-3 h-3 mr-2" />
                <span>{member.mobile}</span>
              </div>
              <div className="flex items-center text-white/90 text-xs">
                <Mail className="w-3 h-3 mr-2" />
                <span className="truncate">{member.email}</span>
              </div>
            </div>
            
            {/* QR Code */}
            {template.showQR && (
              <div className="bg-white p-2 rounded-xl shadow-lg">
                <QRCodeCanvas
                  value={qrData}
                  size={50}
                  level="M"
                  includeMargin={false}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              <p className="text-white text-xs font-bold">ID: {memberIdDisplay}</p>
            </div>
            <div className="text-white/70 text-xs">
              Since {new Date(member.createdAt).getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Classic Elegant Template
export const ClassicElegantTemplate: React.FC<IDCardTemplateProps> = ({ member, template, className = '' }) => {
  const memberIdDisplay = `M${String(member.id).padStart(6, '0')}`;
  const location = [member.village, member.taluk, member.district, member.state]
    .filter(Boolean)
    .join(', ');
  
  const qrData = JSON.stringify({
    id: member.id,
    name: member.fullName,
    mobile: member.mobile,
    email: member.email,
    location: location
  });

  return (
    <div className={`${className}`}>
      <div 
        className="relative bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-200"
        style={{ 
          width: '400px', 
          height: '250px',
          fontFamily: `'${template.fontFamily}', 'Georgia', serif`
        }}
      >
        {/* Classic Border */}
        <div className="absolute inset-2 border-2 border-gray-300 rounded"></div>
        
        {/* Header with Logo */}
        <div className="relative z-10 px-6 pt-6 pb-4 text-center border-b border-gray-300 mx-6">
          <div className="flex items-center justify-center mb-2">
            {template.organizationLogo ? (
              <img 
                src={template.organizationLogo}
                alt="Logo"
                className="h-8 w-auto"
              />
            ) : (
              <Shield 
                className="w-8 h-8"
                style={{ color: template.primaryColor }}
              />
            )}
          </div>
          <h2 
            className="text-lg font-bold uppercase tracking-wider"
            style={{ color: template.primaryColor }}
          >
            {template.organizationTitle}
          </h2>
          <p className="text-xs text-gray-600 mt-1">Membership Card</p>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 py-4 flex">
          {/* Photo Section */}
          <div className="mr-4">
            <div className="w-20 h-24 rounded overflow-hidden border-2 border-gray-300 shadow-md">
              {member.profilePicture ? (
                <img 
                  src={member.profilePicture.startsWith('http') ? member.profilePicture : `${API_URL}/${member.profilePicture}`}
                  alt={member.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{member.fullName}</h1>
              <p className="text-sm text-gray-700">{member.jobType}</p>
              <p className="text-xs text-gray-600 mt-1">Member ID: {memberIdDisplay}</p>
            </div>

            <div className="text-xs text-gray-600 space-y-1">
              <div>📞 {member.mobile}</div>
              <div>✉️ {member.email}</div>
              <div>📍 {location || 'N/A'}</div>
            </div>
          </div>

          {/* QR Section */}
          {template.showQR && (
            <div className="ml-4">
              <div className="border-2 border-gray-300 p-1 rounded">
                <QRCodeCanvas
                  value={qrData}
                  size={60}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-center text-gray-500 mt-1">Scan</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-center text-xs text-white"
          style={{ backgroundColor: template.primaryColor }}
        >
          www.mutharaiyar.org
        </div>
      </div>
    </div>
  );
};

// Vertical Modern Template
export const VerticalModernTemplate: React.FC<IDCardTemplateProps> = ({ member, template, className = '' }) => {
  const memberIdDisplay = String(member.id).padStart(6, '0');
  const location = [member.district, member.state].filter(Boolean).join(', ');
  
  const qrData = JSON.stringify({
    id: member.id,
    name: member.fullName,
    mobile: member.mobile,
    email: member.email,
    org: template.organizationTitle
  });

  return (
    <div className={`${className}`}>
      <div 
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl"
        style={{ 
          width: '250px', 
          height: '400px',
          fontFamily: `'${template.fontFamily}', 'Inter', sans-serif`
        }}
      >
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(template.primaryColor)}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Header */}
        <div 
          className="relative h-32 flex items-center justify-center"
          style={{ backgroundColor: template.primaryColor }}
        >
          <div className="text-center">
            {template.organizationLogo ? (
              <img 
                src={template.organizationLogo}
                alt="Logo"
                className="h-12 w-auto mx-auto mb-2 filter brightness-0 invert"
              />
            ) : (
              <Building className="w-12 h-12 text-white mx-auto mb-2" />
            )}
            <h2 className="text-white font-bold text-sm px-4">{template.organizationTitle}</h2>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="relative -mt-12 flex justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white ring-4 ring-white shadow-xl">
            {member.profilePicture ? (
              <img 
                src={member.profilePicture.startsWith('http') ? member.profilePicture : `${API_URL}/${member.profilePicture}`}
                alt={member.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 text-center">
          <h1 className="text-lg font-bold text-gray-900 mb-1">{member.fullName}</h1>
          <p 
            className="text-sm font-semibold mb-4"
            style={{ color: template.primaryColor }}
          >
            {member.jobType}
          </p>

          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center justify-center">
              <Phone className="w-3 h-3 mr-2" style={{ color: template.primaryColor }} />
              <span>{member.mobile}</span>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="w-3 h-3 mr-2" style={{ color: template.primaryColor }} />
              <span className="truncate max-w-[180px]">{member.email}</span>
            </div>
            {location && (
              <div className="flex items-center justify-center">
                <MapPin className="w-3 h-3 mr-2" style={{ color: template.primaryColor }} />
                <span>{location}</span>
              </div>
            )}
          </div>

          {/* Member ID */}
          <div 
            className="mt-4 inline-block px-4 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: template.secondaryColor }}
          >
            ID: {memberIdDisplay}
          </div>
        </div>

        {/* QR Code */}
        {template.showQR && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <QRCodeCanvas
                value={qrData}
                size={60}
                level="M"
                includeMargin={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Template Registry
const templates = {
  modernMinimalist: {
    name: 'Modern Minimalist',
    component: ModernMinimalistTemplate,
    defaultSettings: {
      primaryColor: '#4A5568',
      secondaryColor: '#E2E8F0',
      accentColor: '#4A5568',
      textColor: '#1A202C',
      fontFamily: 'Inter',
      style: 'modern',
      layout: 'horizontal',
    },
  },
  corporateProfessional: {
    name: 'Corporate Professional',
    component: CorporateProfessionalTemplate,
    defaultSettings: {
      primaryColor: '#2C5282',
      secondaryColor: '#EBF8FF',
      accentColor: '#3182CE',
      textColor: '#FFFFFF',
      fontFamily: 'Arial',
      style: 'corporate',
      layout: 'horizontal',
    },
  },
  creativeGradient: {
    name: 'Creative Gradient',
    component: CreativeGradientTemplate,
    defaultSettings: {
      primaryColor: '#8E2DE2',
      secondaryColor: '#4A00E0',
      accentColor: '#FF0080',
      textColor: '#FFFFFF',
      fontFamily: 'Montserrat',
      style: 'creative',
      layout: 'horizontal',
    },
  },
  classicElegant: {
    name: 'Classic Elegant',
    component: ClassicElegantTemplate,
    defaultSettings: {
      primaryColor: '#000000',
      secondaryColor: '#F7FAFC',
      accentColor: '#D4AF37',
      textColor: '#000000',
      fontFamily: 'Georgia',
      style: 'classic',
      layout: 'horizontal',
    },
  },
  verticalModern: {
    name: 'Vertical Modern',
    component: VerticalModernTemplate,
    defaultSettings: {
      primaryColor: '#06B6D4',
      secondaryColor: '#F0FDFA',
      accentColor: '#0891B2',
      textColor: '#0F172A',
      fontFamily: 'Roboto',
      style: 'modern',
      layout: 'vertical',
    },
  },
  golden: {
    name: 'Golden',
    component: GoldenTemplate,
    defaultSettings: {
      primaryColor: '#F59E0B',
      secondaryColor: '#FBBF24',
      accentColor: '#D97706',
      textColor: '#78350F',
      fontFamily: 'serif',
      style: 'creative',
      layout: 'vertical'
    }
  },
  mutharaiyar: {
    name: 'Mutharaiyar Golden',
    component: MutharaiyarTemplate,
    defaultSettings: {
      primaryColor: '#F59E0B',
      secondaryColor: '#FBBF24',
      accentColor: '#D97706',
      textColor: '#78350F',
      fontFamily: 'serif',
      style: 'creative',
      layout: 'vertical'
    }
  }
};

export type TemplateKey = keyof typeof templates;

export default templates;