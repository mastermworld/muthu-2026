import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, ArrowRight, Phone, Mail, Info } from 'lucide-react';
import { useLanguage } from '../components/layout/Navbar';

interface FAQItem {
  id: string;
  question: string;
  questionEnglish: string;
  answer: string;
  answerEnglish: string;
  priority: number;
}

const FAQPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'முத்தரையர் கிளப் என்றால் என்ன?',
      questionEnglish: 'What is Mutharaiyar Club?',
      answer: 'முத்தரையர் கிளப் என்பது ஒரு தனியார் மற்றும் முற்றிலும் நம் சமுதாய வளர்ச்சிக்கு சேவை செய்யும் ஒரு அமைப்பு ஆகும் இந்த முத்திரையர் கிளப் அனைத்து முத்தரையர் சங்கங்களுக்கும் பொதுவானதாகும் மற்றும் அனைத்து சங்கங்களோடும் ஒருங்கிணைந்து செயல்படுகிறோம்.',
      answerEnglish: 'Mutharaiyar Club is a private organization dedicated entirely to the development of our community. This club serves as a common platform for all Mutharaiyar associations and works in coordination with all organizations.',
      priority: 1,
    },
    {
      id: '2',
      question: 'முத்தரையர் மக்கள் தொகை கணக்கெடுப்பினால் ஏற்படும் நன்மைகள்?',
      questionEnglish: 'What are the benefits of Mutharaiyar population survey?',
      answer: 'மிகப் பெரும்பான்மை சமுதாயமாக மாறும். அரசியலில் பல மாற்றங்கள் நிகழும். நம்மினத்தில் ஒருங்கிணைப்பு வேகமாக நடைபெறும். பல நன்மைகள் கிடைக்கும்.',
      answerEnglish: 'We will become a major community. Many changes will occur in politics. Unity in our community will happen rapidly. Many benefits will be gained.',
      priority: 1,
    },
    {
      id: '3',
      question: 'யார் யார் பதிவு செய்ய வேண்டும்?',
      questionEnglish: 'Who should register?',
      answer: 'முத்தரையர் இனத்தில் பிறந்த குழந்தைகள் முதல் பெரியவர்கள் வரை அனைவரும் கட்டாயம் பதிவு செய்ய வேண்டும்.',
      answerEnglish: 'Everyone born in the Mutharaiyar community, from children to elders, must register.',
      priority: 1,
    },
    {
      id: '4',
      question: 'இந்த தகவல்கள் பாதுகாப்பாக வைக்கப்படுமா?',
      questionEnglish: 'Will this information be kept secure?',
      answer: 'இந்த தகவல்கள் அனைத்தும் பாதுகாக்கப்படும். இந்த தகவல்களை கண்டிப்பாக யாரிடமும் கொடுக்க மாட்டோம். இது முழுக்க முழுக்க நம்மின முன்னேற்றத்திற்க்கு மட்டும்தான்.',
      answerEnglish: "All this information will be protected. We will never share this information with anyone. This is solely for our community's development.",
      priority: 1,
    },
    {
      id: '5',
      question: 'அரசியலில் மாற்றங்கள் நிகழுமா?',
      questionEnglish: 'Will there be changes in politics?',
      answer: 'அனைத்து தேர்தல்களிலும் அந்தந்த ஊர்களில் பெரும்பான்மையான உள்ள மக்களுக்கு ஆட்சியிலும் அதிகாரத்திலும் அனைத்து துறைகளிலும் மறைமுகமாக வாய்ப்பு கொடுக்கப்படுகிறது.',
      answerEnglish: 'In all elections, people who are in majority in their respective areas are given opportunities in governance, power, and all sectors.',
      priority: 2,
    },
    {
      id: '6',
      question: 'நம் சமுதாயத்தில் ஒற்றுமைகள் நடக்குமா?',
      questionEnglish: 'Will unity happen in our community?',
      answer: 'இது ஒரு ஆரம்ப புள்ளி தான் இந்த புள்ளி விபரம் முழுவதுமாக முடிந்து விட்டால் படிப்படியாக நம் சமுதாயம் தானாகவே ஒன்றிணையும்.',
      answerEnglish: 'This is just a starting point. Once this survey is completely finished, our community will gradually unite automatically.',
      priority: 2,
    },
    {
      id: '7',
      question: 'வேலை வாய்ப்புகள் கிடைக்குமா?',
      questionEnglish: 'Will employment opportunities be available?',
      answer: 'அனைத்து மக்களுக்கும் வேலை வாய்ப்பு கிடைப்பதற்கு நாங்கள் முயற்சிகளை தற்போது எடுத்துக் கொண்டு உள்ளோம். தங்களுடைய ஆதரவுகள் இருந்தால், மிகவும் சிறப்பாக எங்களால் செயல்பட முடியும்.',
      answerEnglish: 'We are currently taking efforts to provide employment opportunities for all people. With your support, we can perform much better.',
      priority: 2,
    },
    {
      id: '8',
      question: 'தொழிலில் மாற்றங்கள் நிகழுமா?',
      questionEnglish: 'Will there be changes in business opportunities?',
      answer: 'அனைத்து மக்களுக்கும் தொழிலில் மாற்றங்கள் கிடைப்பதற்கு நாங்கள் முயற்சிகளை தற்போது எடுத்துக் கொண்டு உள்ளோம். தங்களுடைய ஆதரவுகள் இருந்தால், மிகவும் சிறப்பாக எங்களால் செயல்பட முடியும்.',
      answerEnglish: 'We are currently taking efforts to provide business opportunities for all people. With your support, we can perform much better.',
      priority: 2,
    },
    {
      id: '9',
      question: 'நமது சமுதாயத்திற்கு தேவையான அங்கீகாரம் கிடைக்குமா?',
      questionEnglish: 'Will our community get the necessary recognition?',
      answer: 'முதலில் நமது சமுதாயத்தின் மக்கள் தொகையை சரியான அளவை உருவாக்க வேண்டும் பிறகு நம் சமுதாயத்தினரின் திறமை வாய்ந்தவர்கள் தானாகவே வெளிவர ஆரம்பிப்பார்கள் பிறகு தானாகவே அனைத்தும் நடக்கும்',
      answerEnglish: 'First, we need to create the correct count of our community population. Then talented people from our community will automatically emerge, and everything will happen naturally.',
      priority: 2,
    },
    {
      id: '10',
      question: 'நமது சமுதாயத்தில் 29 பிரிவுகள் உள்ளன ஒருங்கிணைப்பு நடக்குமா?',
      questionEnglish: 'There are 29 divisions in our community. Will unity happen?',
      answer: 'நம்ம சமுதாயத்தினர் அனைவரும் இதில் பதிவு செய்தால் நாம் எதிர்பார்த்தபடி விரைவில் ஒருங்கிணைப்பு நிகழும்.',
      answerEnglish: 'If all people from our community register in this, unity will happen quickly as we expect.',
      priority: 3,
    },
    {
      id: '11',
      question: 'நமது சமுதாயத்தை, முத்தரையர் ஒரே பெயரில் உருவாக்கி எம் பி சி நமக்கு கிடைக்குமா?',
      questionEnglish: 'Can we get MBC status by creating our community under one name - Mutharaiyar?',
      answer: 'நம்ம சமுதாயத்தினர் அனைவரும் இதில் பதிவு செய்தால் நாம் எதிர்பார்த்தபடி விரைவில் ஒருங்கிணைப்பு நிகழும்.',
      answerEnglish: 'If all people from our community register in this, unity will happen quickly as we expect.',
      priority: 3,
    },
    {
      id: '12',
      question: 'முத்தரையர்கள் தமிழ்நாட்டில் அதிக அளவு எங்கு வசிக்கின்றனர்?',
      questionEnglish: 'Where do Mutharaiyar people mostly live in Tamil Nadu?',
      answer: 'இந்த சர்வேயில் பதிவு செய்தால் மட்டுமே, நமக்கு ஒவ்வொரு கிராமங்கள் தோறும் நமது எண்ணிக்கையை தெரிந்து கொள்ள முடியும்.',
      answerEnglish: 'Only by registering in this survey can we know our numbers in each village.',
      priority: 3,
    },
  ];

  const filteredFAQs = useMemo(() => {
    if (!searchTerm.trim()) return [...faqData].sort((a, b) => a.priority - b.priority);
    const term = searchTerm.toLowerCase();
    return faqData
      .filter((item) => {
        const question = language === 'tamil' ? item.question : item.questionEnglish;
        const answer = language === 'tamil' ? item.answer : item.answerEnglish;
        return question.toLowerCase().includes(term) || answer.toLowerCase().includes(term);
      })
      .sort((a, b) => a.priority - b.priority);
  }, [searchTerm, language]);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-2 sm:py-5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-5">
          
          <h1 className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-red-600 bg-clip-text text-transparent mb-3">
            {language === 'tamil' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            {language === 'tamil'
              ? 'முத்தரையர் சமுதாயம் பற்றிய முக்கியமான கேள்விகளுக்கான பதில்கள்'
              : 'Find answers to important questions about the Mutharaiyar community'}
          </p>
        </div>

        
        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-8">
              
              <p className="text-gray-500 text-lg">
                {language === 'tamil' ? 'கேள்விகள் கிடைக்கவில்லை' : 'No questions found'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {language === 'tamil' ? 'வேறு வார்த்தைகளில் தேடவும்' : 'Try different search terms'}
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => {
              const isExpanded = expandedItems.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 hover:bg-orange-50/50 transition-colors focus:outline-none"
                  >
                    <h3 className="text-base font-semibold text-gray-800 leading-snug flex-1">
                      {language === 'tamil' ? faq.question : faq.questionEnglish}
                    </h3>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors mt-0.5 ${
                        isExpanded
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-5 border-t border-gray-100 bg-orange-50/30">
                      <div className="flex items-start gap-3 pt-4">
                        <div className="flex-shrink-0 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                          <ArrowRight className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          {language === 'tamil' ? faq.answer : faq.answerEnglish}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-4 bg-white rounded-3xl p-5 shadow-xl text-center text-white">
        <img src="footer_logo.png" alt={language === 'tamil' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'FAQ'} className="w-auto h-60 mx-auto mb-2" />
          <h3 className="text-2xl font-bold mb-2 text-gray-800">
            {language === 'tamil' ? 'மேலும் உதவி தேவையா?' : 'Need More Help?'}
          </h3>
          <p className="text-gray-800 mb-6 text-sm sm:text-base">
            {language === 'tamil'
              ? 'உங்கள் கேள்விக்கு பதில் கிடைக்கவில்லையா? எங்களை தொடர்பு கொள்ளுங்கள்.'
              : "Can't find the answer? Get in touch with us."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+919087099000"
              className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors shadow"
            >
              <Phone className="w-4 h-4" />
              +91 90870 99000
            </a>
            <a
              href="mailto:Ramesh@muthuraja.com"
              className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors shadow"
            >
              <Mail className="w-4 h-4" />
              Ramesh@muthuraja.com
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQPage;
