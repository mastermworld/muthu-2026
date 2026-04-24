import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '../components/layout/Navbar';

const MutharaiyarPage: React.FC = () => {
  const { language } = useLanguage();
  const tamilNaduCastes = [
    "முத்துராஜா. (முத்துராசா, முத்தரசர், முத்துராஜா ஜெமீன்)",
    "முத்திரியர். (முனையதிரியர், முத்திரி, பெரிய நாட்டார், சோழ முத்திரி, வீர முத்திரி, செந்தலை கவுண்டர், முத்தரையர் மிராசுதார், பட்டக்காரர், கம்மாளர், பட்டையத்தார்)",
    "அம்பலக்காரர். (அம்பு நாடு அம்பலம், தாணம நாட்டார், நாட்டான், அம்பலம், காரியக்காரர், மஞ்சாடி முத்திரியர், சோழிங்க தேவ அம்பலக்காரர், மஞ்சாடியார்)",
    "சேர்வை. (அம்பலத்தார், சேர்வார், தானமர், சேந்தாங்குடி ஜெமீன், நாட்டார், வந்திகாரர்)",
    "சேர்வைக்காரர். ( தானவதரையர், கரைக்காரர்)",
    "தலையாரி. (தலையாரி அம்பலம், தலையாரி கவுண்டர்)",
    "பூசாரி. ( பூசாரியார் )",
    "வழுவாடிதேவர் (வழுவடியார், வழுவதியார், வழுவாடி ஜெமீன், வலைய ஜெமீன், சேந்தாங்குடி பாளையக்காரர்)",
    "முத்திரிய மூப்பர். (மூப்பர், வீர மூப்பர், சோழ மூப்பர், வளையமார், மூப்பராயர், மூப்பமார், வேடுவர்குல மூப்பனார்)",
    "முத்திரிய மூப்பனார்.  (பார்க்கவகுல மூப்பனார், பரிதிமார், பாரி வலையர் (பரிதி வலையர்)",
    "முதிராஜ். ( முத்துராஜ் )",
    "பாளையக்காரர்.",
    "வலையர். (வலையமார், வளையார், வலயர், பெரியநாட்டு வலையர், காடகர், காடவராயர், வலைஞர், வளரியர், செட்டிநாடு வலையர், வளையக்காரர், கரு வலையர், கள்வ வலையர், வன்னி வலையர், தாலிக்கட்டி வலையர், பாரி வலையர், பரம்பு வலையர், கருப்பாசி வலையர், கோல்கொண்ட வலையர், குருகுல வலையர், சட்டம்பர வலையர், வலையமான், வல்லும்பர், சிதம்பர வலையர், செம்பட வளையர்)",
    "கண்ணப்பகுல வலையர் -(கண்ணப்ப நாயக்கர், கண்ணப்பர் குல முத்துராஜா, வால்மிகி, போயர், அம்பல வலையர், ராஜ வளையர் )",
    "பரதவ வலையர் ( பரதவர், பரதவராயர், பரதவ (பர்வத) ராஜகுலம் )",
    "வன்னியகுல முத்துராஜா ( வன்னி முத்தரசர், வன்னிய  முத்துராயர், முத்துராஜகுல வன்னிய தனக்காரர்)",
    "பாளையக்கார நாயக்கர்.",
    "முத்திரிய நாயுடு (கவரா, கவரா நாயுடு, வடுகர் )",
    "முத்திரிய நாயக்கர்.",
    "காவல்காரர் - ( காவல்கார், நிலக்காரர், காவல் மிராசு, நிலக்கிழார், நாடாள்வார், ஏவலர், எஜமானியார்,  கிள்ளிராயர், புலிராயர்)",
    "முத்துராஜ நாயுடு.",
    "பாளையக்கார நாயுடு.",
    "முத்திரிய ராவ்.",
    "ஊராளி கவுண்டர். (ஊராளியார், ஊராளி, கள்வெளிகவுண்டர், முத்துராசா கவுண்டர்)",
    "வேட்டுவ கவுண்டர். (வேட்டுவ நாயக்கர், வேட்டுவர், பெரிய கவுண்டர், சின்ன கவுண்டர், மழவர், காமிண்டன், பாளைய வேட்டுவர், பூவிலியர், வில்லவர், வில்லாளர், குரு குலர், வேட்டுவ வலையர், பூளுவர், மண்றாடியார், பூளுவ கவுண்டர்)",
    "குருவிக்கார வலையர். (காடையார், காடையர், காடயராயர், காடவர், சருகு வலையர்)",
    "அம்பலம். ( அம்பலகாரன், சிங்கராசா, அம்பலத்தேவர், அம்பலவன், அம்பலத்தரசு, அம்பலவானர், வல்லம்பலம், வல்லம்பர்)",
    "அரையர் - ( பழுவேட்டரையர், தனஞ்சயராயர் (தனஞ்சயரையர்), தஞ்சைராயர், தஞ்சிராயர், மழவரையர் (மழவராயர்), சிங்கராயர், களப்பிரார், களப்பிரையர், களதிரையர், மாட்ராயர், சோழ நாட்டார், முத்துராயர், புல்லரையர், சோழராயர், சோழ முத்தரையர், வல்லத்தரையர், செம்பியரையர், வல்லவரையர், இளவரையர், வளவராயர், கரிகாலராயர், செந்தலைராயர், எட்டரையர், காடகராயர், அதிராயர், வாணதிராயர், கொங்குராயர், காஞ்சிராயர், கீர்த்திராயர், நாட்டரையர், தாணமராயர், சத்ரூராயர், சிம்மராயர், கங்கரையர், கள்வராயர், உறையூராயர், மகாராயர், சென்னிராயர், பட்டயத்தார், கடம்பராயர், முனையரையர், சோழகராயர், தொண்டைராயர், ராயர் இன்னும் சில முத்தரைய உட்பட்டங்கள்)",
    "முத்திரிய பிள்ளை."
  ];

  const otherStatesCastes = [
    { stateEn: 'Kerala', stateTa: 'கேரளா', castes: 'அரையர், வேட்டுவ அரையர்.' },
    { stateEn: 'Karnataka', stateTa: 'கர்நாடகா', castes: 'முதிராஜ், முதிராஜூ, முத்துராஜூ, நாயக், கோலி முடிராஜ், வால்மீகி, கங்கமாய் கலுக்காள்.' },
    { stateEn: 'Telangana', stateTa: 'தெலுங்கானா', castes: 'முதிராஜ், முடிராஜ், நாயக்.' },
    { stateEn: 'Andhra Pradesh', stateTa: 'ஆந்திரா', castes: 'முதிராஜ், முடிராஜூ, நாயக்கர், நாயக்.' },
    { stateEn: 'Central & Northern States', stateTa: 'மத்திய மற்றும் வட மாநிலங்கள்', castes: 'கோலி, சத்ரி, வால்மீகி, மகாதேவ் கோலி, கோலி முடிராஜ், நாயக், ராஜ் புத்ரி, சிங்கா, கோலி படேல்.' }
  ];

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-gradient-to-r from-yellow-500 to-red-500 rounded-2xl shadow-lg mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
            {language === 'tamil' ? 'முத்தரையர் உட்பிரிவுகள்' : 'Mutharaiyar Sub-Castes'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'tamil' ? 'தமிழ்நாடு மற்றும் பிற மாநிலங்களில் உள்ள முத்தரையர் சமுதாயத்தின் 29 உட்பிரிவுகளின் விரிவான பட்டியல்.' : 'A comprehensive list of the 29 sub-castes of the Mutharaiyar community in Tamil Nadu and other states.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 pb-4 border-yellow-400">
            {language === 'tamil' ? 'தமிழ்நாடு முத்தரையர் மக்களின் சாதிய பட்டியல்' : 'Tamil Nadu Mutharaiyar Community Caste List'}
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-lg text-gray-700 font-tamil">
              {tamilNaduCastes.map((caste, index) => (
                <li key={index} className="leading-relaxed">{caste}</li>
              ))}
            </ol>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 pb-4 border-red-400">
              {language === 'tamil' ? 'பிறமாநிலம் முத்தரையர்கள்' : 'Mutharaiyar in Other States'}
              </h2>
              <div className="space-y-4">
                {otherStatesCastes.map((item, index) => (
                  <div key={index} className="font-tamil">
                    <h3 className="font-bold text-xl text-red-700">{language === 'tamil' ? item.stateTa : item.stateEn}</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">{item.castes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MutharaiyarPage; 