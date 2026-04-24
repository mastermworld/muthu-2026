import React, { useState } from 'react';
import { Heart, Shield, CheckCircle, Phone, Mail, User, QrCode, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../components/layout/Navbar';

interface DonationFormData {
  fullName: string;
  email: string;
  phone: string;
}

const DonationPage: React.FC = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<DonationFormData>({
    fullName: '',
    email: '',
    phone: ''
  });
  const [showQR, setShowQR] = useState(false);
  const [errors, setErrors] = useState<Partial<DonationFormData>>({});

  const upiId = "mastermworld-4@oksbi";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof DonationFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DonationFormData> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = language === 'tamil' ? 'முழு பெயர் தேவை' : 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = language === 'tamil' ? 'மின்னஞ்சல் தேவை' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'tamil' ? 'செல்லுபடியான மின்னஞ்சல் முகவரி தேவை' : 'Valid email address required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = language === 'tamil' ? 'மொபைல் எண் தேவை' : 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = language === 'tamil' ? 'செல்லுபடியான 10 இலக்க மொபைல் எண் தேவை' : 'Valid 10-digit phone number required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowQR(true);
    }
  };

  const handleBackToForm = () => {
    setShowQR(false);
  };

  if (showQR) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-display font-bold text-white mb-4">
                  {language === 'tamil' ? 'நன்றி!' : 'Thank You!'}
                </h1>
                <p className="text-xl text-orange-100">
                  {language === 'tamil' 
                    ? 'உங்கள் விவரங்கள் பெறப்பட்டன. கீழே உள்ள QR குறியீட்டை ஸ்கேன் செய்து நன்கொடை அளிக்கவும்.'
                    : 'Your details have been received. Please scan the QR code below to make your donation.'
                  }
                </p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-block bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <img
                    src="/Donation_QR.jpg"
                    alt="UPI QR Code - D Ramesh Kumar"
                    className="w-64 sm:w-72 h-auto"
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {language === 'tamil' ? 'நன்கொடை QR குறியீடு' : 'Donation QR Code'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {language === 'tamil' 
                      ? 'உங்கள் UPI ஆப் மூலம் ஸ்கேன் செய்யவும்'
                      : 'Scan with your UPI app to donate'
                    }
                  </p>
                  <div className="bg-orange-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-orange-800">
                      <strong>{language === 'tamil' ? 'UPI ஐடி:' : 'UPI ID:'}</strong> {upiId}<br/>
                      <strong>{language === 'tamil' ? 'பெயர்:' : 'Name:'}</strong> D Ramesh Kumar
                    </p>
                  </div>
                </div>
              </div>

              {/* Donor Details */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-orange-600" />
                  {language === 'tamil' ? 'நன்கொடையாளர் விவரங்கள்' : 'Donor Details'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">{language === 'tamil' ? 'பெயர்:' : 'Name:'}</span>
                    <p className="text-gray-800 font-semibold">{formData.fullName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">{language === 'tamil' ? 'மின்னஞ்சல்:' : 'Email:'}</span>
                    <p className="text-gray-800 font-semibold">{formData.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">{language === 'tamil' ? 'மொபைல்:' : 'Phone:'}</span>
                    <p className="text-gray-800 font-semibold">{formData.phone}</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-4">
                  {language === 'tamil' ? 'நன்கொடை செய்வது எப்படி:' : 'How to Donate:'}
                </h4>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                    {language === 'tamil' 
                      ? 'உங்கள் UPI பயன்பாட்டைத் திறக்கவும் (PhonePe, Paytm, GPay, போன்றவை)'
                      : 'Open your UPI app (PhonePe, Paytm, GPay, etc.)'
                    }
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                    {language === 'tamil' 
                      ? 'மேலே உள்ள QR குறியீட்டை ஸ்கேன் செய்யவும்'
                      : 'Scan the QR code above'
                    }
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                    {language === 'tamil' 
                      ? 'தொகையை உறுதிப்படுத்தி பணம் அனுப்பவும்'
                      : 'Confirm the amount and send payment'
                    }
                  </li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleBackToForm}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>
                    {language === 'tamil' ? 'படிவத்திற்கு திரும்பவும்' : 'Back to Form'}
                  </span>
                </button>
                <a
                  href="/"
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Heart className="w-5 h-5" />
                  <span>
                    {language === 'tamil' ? 'சர்வேயில் பங்கேற்க' : 'Take Survey'}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-red-600 bg-clip-text text-transparent mb-4">
            {language === 'tamil' ? 'நமது சமுதாயத்திற்கு உதவுங்கள்' : 'Support Our Community'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'tamil' 
              ? 'உங்கள் நன்கொடை முத்தரையர் சமுதாயத்தின் வளர்ச்சிக்கும் நலனுக்கும் பயன்படுத்தப்படும்.'
              : 'Your generous contribution helps us empower and uplift the Mutharaiyar community through various initiatives.'
            }
          </p>
        </div>

        {/* Donation Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 p-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">
                  {language === 'tamil' ? 'நன்கொடை படிவம்' : 'Donation Form'}
                </h2>
                <p className="text-orange-100">
                  {language === 'tamil' 
                    ? 'கீழே உள்ள விவரங்களை நிரப்பி நன்கொடை QR குறியீட்டைப் பெறவும்'
                    : 'Fill in the details below to get your donation QR code'
                  }
                </p>
              </div>
            </div>
               </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                {language === 'tamil' ? 'முழு பெயர்' : 'Full Name'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 ${
                  errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder={language === 'tamil' ? 'உங்கள் முழு பெயரை உள்ளிடவும்' : 'Enter your full name'}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                {language === 'tamil' ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder={language === 'tamil' ? 'உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்' : 'Enter your email address'}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-2" />
                {language === 'tamil' ? 'மொபைல் எண்' : 'Phone Number'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 ${
                  errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder={language === 'tamil' ? 'உங்கள் 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்' : 'Enter your 10-digit phone number'}
                maxLength={10}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Security Note */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">
                    {language === 'tamil' ? 'பாதுகாப்பு குறிப்பு' : 'Security Note'}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {language === 'tamil' 
                      ? 'உங்கள் தனிப்பட்ட தகவல்கள் பாதுகாப்பாக வைக்கப்படும். நாங்கள் உங்கள் விவரங்களை மூன்றாம் தரப்பினருடன் பகிர்ந்து கொள்ள மாட்டோம்.'
                      : 'Your personal information is kept secure. We do not share your details with third parties.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="w-full max-w-md py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {language === 'tamil' ? 'நன்கொடை QR குறியீட்டைப் பெறவும்' : 'Get Donation QR Code'}
              </button>
          </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default DonationPage; 