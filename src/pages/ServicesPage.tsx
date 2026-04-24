import React from 'react';
import { Briefcase, Newspaper, Heart, ShoppingCart, Users } from 'lucide-react';
import { useLanguage } from '../components/layout/Navbar';

const services = [
  { titleEn: 'Matrimonial Info', titleTa: 'திருமணத் தகவல்', descriptionEn: 'Mutharaiyar Matrimonial', descriptionTa: 'முத்தரையர் திருமணத் தகவல்', icon: Heart, color: 'red' },
  { titleEn: 'Business Directory', titleTa: 'தொழில் செய்வோர் விபரங்கள்', descriptionEn: 'Mutharaiyar Business Directory', descriptionTa: 'முத்தரையர் தொழில் அடைவு', icon: Briefcase, color: 'blue' },
  { titleEn: 'Online Newspaper', titleTa: 'செய்தித் தாள்', descriptionEn: 'Mutharaiyar Online Newspaper', descriptionTa: 'முத்தரையர் ஆன்லைன் செய்தித்தாள்', icon: Newspaper, color: 'green' },
  { titleEn: 'Buy & Sell', titleTa: 'விற்க வாங்க', descriptionEn: 'Mutharaiyar Online Buy & Sell (Under Construction)', descriptionTa: 'முத்தரையர் ஆன்லைன் விற்க வாங்க (கட்டுமானத்தில்)', icon: ShoppingCart, color: 'yellow' },
  { titleEn: 'Community Club', titleTa: 'முத்தரையர் கிளப்', descriptionEn: 'Mutharaiyar Club', descriptionTa: 'முத்தரையர் கிளப்', icon: Users, color: 'purple' }
];

const ServicesPage: React.FC = () => {
  const { language } = useLanguage();
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red': return 'from-red-500 to-orange-500';
      case 'blue': return 'from-orange-500 to-yellow-500';
      case 'green': return 'from-yellow-500 to-orange-500';
      case 'yellow': return 'from-yellow-500 to-red-500';
      case 'purple': return 'from-red-500 to-yellow-500';
      default: return 'from-orange-500 to-red-500';
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 min-h-screen py-3 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-6">
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-red-600 bg-clip-text text-transparent mb-2">
            {language === 'tamil' ? 'எங்கள் சேவைகள்' : 'Our Services'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'tamil' ? 'முத்தரையர் சமுதாயத்திற்கு நாங்கள் வழங்கும் பல்வேறு சேவைகள்.' : 'Explore the wide range of services we offer to the Mutharaiyar community.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/40 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group"
            >
              <div className={`p-8 bg-gradient-to-br ${getColorClasses(service.color)}`}>
                <div className="flex justify-center">
                  <service.icon className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold font-tamil text-gray-800 mb-2">{language === 'tamil' ? service.titleTa : service.titleEn}</h3>
                <p className="text-gray-600">{language === 'tamil' ? service.descriptionTa : service.descriptionEn}</p>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default ServicesPage; 