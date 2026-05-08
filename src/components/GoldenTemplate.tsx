import React from 'react';
import { API_URL } from '../config/api';

interface Member {
  id: number;
  profilePicture?: string;
  fullName: string;
  jobDescription: string;
  mobile: string;
  bloodGroup?: string;
  address: string;
  country?: string;
  state?: string;
  district?: string | null;
  taluk?: string | null;
  village?: string | null;
}

interface GoldenTemplateProps {
  member: Member;
  template?: any;
  className?: string;
}

// Capitalize the first letter of a string
function cap(s?: string | null): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Returns address lines for the card
function getLocationLines(member: Member): string[] {
  const isIndia = (member.country || '').toLowerCase() === 'india';
  if (isIndia) {
    const line1 = cap(member.village);                              // Village
    const line2 = [cap(member.taluk), cap(member.district)]        // Taluk, District
      .filter(Boolean).join(', ');
    const line3 = cap(member.state);                                // State
    return [line1, line2, line3].filter(Boolean);
  }
  // Non-India: Country then State/Province
  return [cap(member.country), cap(member.state)].filter(Boolean);
}

const GoldenTemplate: React.FC<GoldenTemplateProps> = ({ member, className = '' }) => {
  // Fallback values for demonstration if member data is not fully available
  const resolveProfilePic = (pic?: string) => {
    if (!pic) return 'https://i.ibb.co/6wmN2S1/profile-pic.jpg';
    if (pic.startsWith('http')) return pic;
    return `${API_URL}/${pic}`;
  };

  const locationLines = getLocationLines(member);
  // Fallback to raw address if no structured location available
  const fallbackAddress = locationLines.length === 0 ? (member.address || '') : null;

  const memberData = {
    id: member.id || 1,
    profilePicture: resolveProfilePic(member.profilePicture),
    fullName: member.fullName || 'D.Rameshkumar',
    jobDescription: member.jobDescription || 'Software Manager',
    mobile: member.mobile || '908870 99000',
    bloodGroup: member.bloodGroup || 'O+ve',
    locationLines,
    fallbackAddress,
  };
  
  const qrData = JSON.stringify({
    id: member.id,
    name: member.fullName,
    mobile: member.mobile,
  });

  return (
    <div 
      className={`w-[350px] h-[600px] rounded-lg shadow-lg overflow-hidden relative bg-cover bg-center ${className}`}
      style={{ backgroundImage: "url('/new_ID_card_bg.jpg')" }}
    >
        {/* <div className="absolute -top-16 -left-20 w-80 h-80 bg-white/30 rounded-full"></div> */}
        <div className="relative p-10 flex flex-col h-full right-5">
            {/* <h1 className="text-red-600 text-4xl font-bold text-center mb-4">MUTHARAIYAR</h1> */}

            <div className="absolute top-16 right-8 -translate-x-1/2">
                <div className="w-32 h-32 rounded-full ">
                    <img src={memberData.profilePicture} alt="Profile Picture" className="w-full h-full rounded-full object-cover" />
                </div>
            </div>

         
            <div className="mt-44 text-black text-lg font-sans space-y-0.5 left-5 text-align-left">
                <p className="font-bold text-left">
                  {memberData.fullName}
                  {memberData.bloodGroup && (
                    <span className="font-normal text-base ml-2">({memberData.bloodGroup})</span>
                  )}
                </p>
                <p className="text-left">{memberData.jobDescription}</p>
                <p className="text-left">{memberData.mobile}</p>
                {/* Address lines */}
                {memberData.locationLines.length > 0 ? (
                  memberData.locationLines.map((line, i) => (
                    <p key={i} className="text-left">{line}</p>
                  ))
                ) : (
                  memberData.fallbackAddress && (
                    <p className="text-left">{memberData.fallbackAddress}</p>
                  )
                )}
            </div>
            
            <div className="flex items-end justify-between mt-auto">
                <div className="w-24 h-24">
                     <img src={`https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(qrData)}&qzone=1&bgcolor=FBBF24`} alt="QR Code" className="w-full h-full" />
                </div>

                {/* <div className="w-48">
                    <img 
                        src="/mutharaiyar-logo.png" 
                        alt="Mutharaiyar Organization Logo" 
                        className="w-full h-auto" 
                        onError={(e) => {
                            // Fallback to the original statue image if logo is not available
                            (e.target as HTMLImageElement).src = "https://i.ibb.co/3Y7j1b9/statue.png";
                        }}
                    />
                </div> */}
            </div>
        </div>
    </div>
  );
};

export default GoldenTemplate;