import React from 'react';
import { Share2, Users, Phone, Mail, Facebook, Twitter, Instagram, MessageCircle, Send, UserPlus } from 'lucide-react';
import { useLanguage } from '../components/layout/Navbar';

const ForwardSurveyPage: React.FC = () => {
  const { language } = useLanguage();
  const t = (en: string, ta: string) => language === 'tamil' ? ta : en;
  const surveyLink = "https://mutharaiyar.org/";

  const socialShareLinks = [
    {
      name: 'Mobile',
      icon: Phone,
      action: () => window.open(`sms:?body=நம் முத்தரையர் சமுதாய கணக்கெடுப்பில் பங்கேற்க: ${surveyLink}`, '_self'),
      color: 'from-green-500 to-green-600',
      description: t('Share via SMS', 'SMS மூலம் பகிரவும்')
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => window.open(`mailto:?subject=முத்தரையர் சமுதாய கணக்கெடுப்பு&body=நம் முத்தரையர் சமுதாய கணக்கெடுப்பில் பங்கேற்க: ${surveyLink}`, '_self'),
      color: 'from-blue-500 to-blue-600',
      description: t('Share via Email', 'Email மூலம் பகிரவும்')
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(surveyLink)}`, '_blank'),
      color: 'from-blue-600 to-blue-700',
      description: t('Share on Facebook', 'Facebook இல் பகிரவும்')
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => window.open(`https://twitter.com/intent/tweet?text=நம் முத்தரையர் சமுதாய கணக்கெடுப்பில் பங்கேற்க&url=${encodeURIComponent(surveyLink)}`, '_blank'),
      color: 'from-sky-400 to-sky-500',
      description: t('Share on Twitter', 'Twitter இல் பகிரவும்')
    },
    {
      name: 'Instagram',
      icon: Instagram,
      action: () => alert('Instagram story அல்லது post இல் இந்த link ஐ பகிரவும்: ' + surveyLink),
      color: 'from-pink-500 to-purple-600',
      description: t('Share on Instagram', 'Instagram இல் பகிரவும்')
    },
    {
      name: 'Telegram',
      icon: Send,
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(surveyLink)}&text=நம் முத்தரையர் சமுதாய கணக்கெடுப்பில் பங்கேற்க`, '_blank'),
      color: 'from-blue-400 to-blue-500',
      description: t('Share on Telegram', 'Telegram இல் பகிரவும்')
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => window.open(`https://wa.me/?text=நம் முத்தரையர் சமுதாய கணக்கெடுப்பில் பங்கேற்க: ${encodeURIComponent(surveyLink)}`, '_blank'),
      color: 'from-green-400 to-green-500',
      description: t('Share on WhatsApp', 'WhatsApp இல் பகிரவும்')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 y-3 sm:py-5">
      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">

        {/* Header */}
        <div className="text-center">
    
          <h1 className="text-2xl sm:text-4xl font-display font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-red-600 bg-clip-text text-transparent mb-4">
            {t('Forward - Survey Form', 'கணக்கெடுப்பு படிவத்தை பகிரவும்')}
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            {t('Share this survey with your relatives for the betterment of our community', 'நம் சமுதாயத்தின் முன்னேற்றத்திற்காக உங்கள் உறவினர்களுக்கு இந்த survey ஐ பகிரவும்')}
          </p>
        </div>

        {/* Main Message */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-7 h-7 text-orange-600 flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('Important Message', 'முக்கிய செய்தி')}</h2>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-5 border-l-4 border-orange-500 mb-6">
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
              {language === 'tamil'
                ? 'நீங்கள் மட்டும் இதில் பதிவு செய்தால் முழுமையடையாது. நம் உறவினர்கள் அனைவரும் இதில் பதிவு செய்ய வேண்டும். உங்களுடைய சொந்தங்களுக்கு கீழ்கண்டவற்றில் Mobile, Email, Facebook, Twitter, Instagram, Telegram, WhatsApp Group லிங்கை ஷேர் செய்யவும்.'
                : 'Your registration alone is not enough. All our relatives must register. Please share the link below via Mobile, Email, Facebook, Twitter, Instagram, Telegram, or WhatsApp groups.'}
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5">
            <h3 className="text-base font-bold text-blue-900 mb-3">{t('Survey Link:', 'கணக்கெடுப்பு இணைப்பு:')}</h3>
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-blue-200">
              <code className="flex-1 text-blue-700 font-mono text-sm break-all">{surveyLink}</code>
              <button
                onClick={() => navigator.clipboard.writeText(surveyLink)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
              >
                {t('Copy', 'நகலெடு')}
              </button>
            </div>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Share2 className="w-7 h-7 text-orange-600 flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('Ways to Share', 'பகிரும் வழிகள்')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialShareLinks.map((platform) => (
              <button
                key={platform.name}
                onClick={platform.action}
                className={`flex items-center gap-4 p-4 bg-gradient-to-r ${platform.color} text-white rounded-2xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-100`}
              >
                <platform.icon className="w-6 h-6 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-bold">{platform.name}</div>
                  <div className="text-sm opacity-90">{platform.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl shadow-xl p-6 sm:p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('Growth of Our Community', 'நம் சமுதாயத்தின் வளர்ச்சி')}</h2>
            <p className="text-orange-100 mb-8 text-base sm:text-lg">
              {t('Let every Mutharaiyar participate in this survey and let the world know our true numbers.', 'ஒவ்வொரு முத்தரையரும் இந்த survey இல் பங்கேற்று நம் சமுதாயத்தின் உண்மையான எண்ணிக்கையை உலகுக்கு தெரியப்படுத்துவோம்.')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/20 rounded-2xl p-5">
                <Users className="w-10 h-10 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-1">{t('Unity', 'ஒருங்கிணைப்பு')}</h3>
                <p className="text-orange-100 text-sm">{t('All our 29 sub-castes united together', 'நம் 29 பிரிவுகளும் ஒன்றிணைந்து')}</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-5">
                <Share2 className="w-10 h-10 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-1">{t('Share', 'பகிர்வு')}</h3>
                <p className="text-orange-100 text-sm">{t('Let us share this information with everyone', 'அனைவருக்கும் இந்த தகவலை பகிர்வோம்')}</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-5">
                <UserPlus className="w-10 h-10 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-1">{t('Progress', 'முன்னேற்றம்')}</h3>
                <p className="text-orange-100 text-sm">{t('Let us achieve individual progress', 'தனி மனித முன்னேற்றம் அடைவோம்')}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForwardSurveyPage;
