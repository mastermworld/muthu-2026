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
}

interface GoldenTemplateProps {
  member: Member;
  template?: any;
  className?: string;
}

const GoldenTemplate: React.FC<GoldenTemplateProps> = ({ member, className = '' }) => {
  // Fallback values for demonstration if member data is not fully available
  const resolveProfilePic = (pic?: string) => {
    if (!pic) return 'https://i.ibb.co/6wmN2S1/profile-pic.jpg';
    if (pic.startsWith('http')) return pic;
    return `${API_URL}/${pic}`;
  };

  const memberData = {
    id: member.id || 1,
    profilePicture: resolveProfilePic(member.profilePicture),
    fullName: member.fullName || 'D.Rameshkumar',
    jobDescription: member.jobDescription || 'Software Manager',
    mobile: member.mobile || '908870 99000',
    bloodGroup: member.bloodGroup || 'O+ve',
    address: member.address || 'Chennai',
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
        <div className="relative p-6 flex flex-col h-full">
            {/* <h1 className="text-red-600 text-4xl font-bold text-center mb-4">MUTHARAIYAR</h1> */}

            <div className="absolute top-12 right-11 -translate-x-1/2">
                <div className="w-36 h-36 rounded-full bg-white shadow-md p-1">
                    <img src={memberData.profilePicture} alt="Profile Picture" className="w-full h-full rounded-full object-cover" />
                </div>
            </div>

            <div className="mt-40 text-center">
                {/* <p className="text-black text-3xl font-mono tracking-widest">{memberData.id.slice(-3)}</p> */}
            </div>

            <div className="mt-20 text-black text-lg font-sans space-y-1">
                <p className="font-bold">{memberData.fullName}</p>
                <p>{memberData.jobDescription}</p>
                <p>{memberData.mobile}</p>
                <p>{memberData.bloodGroup}</p>
                <p>{memberData.address}</p>
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