import React, { useState, useRef } from 'react';
import { API_URL } from '../config/api';
import { useMutation } from '@tanstack/react-query';
import { 
  Search, User, Mail, Phone, Download,
  AlertCircle, CheckCircle, Loader,
  ArrowRight, RefreshCw, Shield, 
  Calendar, Briefcase, Hash
} from 'lucide-react';
import GoldenTemplate from './GoldenTemplate';
import templates from './IDCardTemplates';
import html2canvas from 'html2canvas';
import { useLanguage } from './layout/Navbar';

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
  createdAt: string;
  updatedAt: string;
}

const UserIDCardForm: React.FC = () => {
  const { language } = useLanguage();
  const t = (en: string, ta: string) => language === 'tamil' ? ta : en;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'auto' | 'id' | 'email' | 'phone'>('auto');
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Set the template to the new "Golden" template
  const template = templates.mutharaiyar;

  // Search member mutation
  const searchMemberMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await fetch(`${API_URL}/api/survey/search/${encodeURIComponent(query)}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Member not found. Please check your User ID, email, or phone number.');
        }
        throw new Error('Failed to search member. Please try again.');
      }
      const result = await response.json();
      return result.data as Member;
    },
    onSuccess: (member) => {
      setFoundMember(member);
      setSearchError(null);
      setShowPreview(true);
    },
    onError: (error: Error) => {
      setFoundMember(null);
      setSearchError(error.message);
      setShowPreview(false);
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError(t('Please enter your User ID, email, or phone number', 'உங்கள் பயனர் ஐடி, மின்னஞ்சல், அல்லது தொலைபேசி எண்ணை உள்ளிடவும்'));
      return;
    }
    searchMemberMutation.mutate(searchQuery.trim());
  };

  const validateSearchQuery = (query: string): string | null => {
    if (!query.trim()) return t('Search query is required', 'தேடல் வினவல் தேவை');
    if (query.length < 2) return t('Search query must be at least 2 characters', 'தேடல் வினவல் குறைந்தது 2 எழுத்துகள் இருக்க வேண்டும்');
    
    // Auto-detect search type
    if (query.includes('@')) {
      setSearchType('email');
    } else if (/^\d+$/.test(query)) {
      setSearchType('phone');
    } else {
      setSearchType('id');
    }
    
    return null;
  };

  const downloadIDCard = async () => {
    const cardElement = cardRef.current;
    if (!cardElement) {
      console.error("Card element not found for download.");
      setSearchError("Could not find the card element to download.");
      return;
    }

    try {
      setIsGenerating(true);
      const canvas = await html2canvas(cardElement, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        backgroundColor: null, // Use the actual background
      });

      const link = document.createElement('a');
      link.download = `ID-Card-${foundMember?.fullName.replace(/\s/g, '-') || 'member'}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error generating ID card:', error);
      setSearchError('Could not generate ID card. Please check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setSearchQuery('');
    setFoundMember(null);
    setShowPreview(false);
    setSearchError(null);
    setSearchType('auto');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 ">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-6">
            <CreditCard className="w-10 h-10 text-white" />
          </div> */}
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-red-600 bg-clip-text text-transparent mb-4">
            {t('Download Your ID Card', 'உங்கள் அடையாள அட்டையை பதிவிறக்கவும்')}
          </h1>
          
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Search Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{t('Find Your Profile', 'உங்கள் சுயவிவரத்தை கண்டறியவும்')}</h2>
                
              </div>

              <div className="p-8">
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSearchError(null);
                        const validation = validateSearchQuery(e.target.value);
                        if (validation) setSearchError(validation);
                      }}
                      placeholder={t('Enter User ID, email, or phone number...', 'பயனர் ஐடி, மின்னஞ்சல், அல்லது தொலைபேசி எண்...')}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-medium bg-gray-50 hover:bg-white"
                      disabled={searchMemberMutation.isPending}
                    />
                  </div>

                  {/* Search Type Indicator */}
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{t('Search Type:', 'தேடல் வகை:')}</span>
                    <div className="flex items-center space-x-2">
                      {searchType === 'email' && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          <Mail className="w-4 h-4 mr-1" />
                          {t('Email', 'மின்னஞ்சல்')}
                        </div>
                      )}
                      {searchType === 'phone' && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700">
                          <Phone className="w-4 h-4 mr-1" />
                          {t('Phone', 'தொலைபேசி')}
                        </div>
                      )}
                      {searchType === 'id' && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                          <Hash className="w-4 h-4 mr-1" />
                          {t('User ID', 'பயனர் ஐடி')}
                        </div>
                      )}
                      {searchType === 'auto' && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                          <Search className="w-4 h-4 mr-1" />
                          {t('Auto-detect', 'தானியங்கி')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error Message */}
                  {searchError && (
                    <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-red-700 font-medium">{searchError}</span>
                    </div>
                  )}

                  {/* Search Button */}
                  <button
                    type="submit"
                    disabled={searchMemberMutation.isPending || !searchQuery.trim()}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    {searchMemberMutation.isPending ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>{t('Searching...', 'தேடுகிறது...')}</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>{t('Find My Profile', 'என் சுயவிவரத்தை கண்டறி')}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Found Member Info */}
                {foundMember && (
                  <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-bold text-green-900">{t('Profile Found!', 'சுயவிவரம் கண்டறியப்பட்டது!')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-900">{foundMember.fullName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{foundMember.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{foundMember.mobile}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700 font-mono">MC-{String(foundMember.id).padStart(6, '0')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{foundMember.jobType}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{t('Member since', 'உறுப்பினர் ஆண்டு')} {new Date(foundMember.createdAt).getFullYear()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={downloadIDCard}
                        disabled={isGenerating}
                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-bold transition-all duration-200 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                      >
                        {isGenerating ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>{t('Generating...', 'உருவாக்குகிறது...')}</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            <span>{t('Download ID Card', 'அடையாள அட்டை பதிவிறக்கம்')}</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span>{t('Reset', 'மீட்டமை')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ID Card Preview */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{t('Mutharaiyar ID Card Preview', 'முத்தரையர் அடையாள அட்டை முன்னோட்டம்')}</h2>
                <p className="text-purple-100">{t('Your digital membership card', 'உங்கள் டிஜிட்டல் உறுப்பினர் அட்டை')}</p>
              </div>

              <div className="p-8">
                {foundMember && showPreview ? (
                  <div className="space-y-6">
                    <div ref={cardRef} className="flex justify-center">
                       <GoldenTemplate 
                         member={foundMember}
                         template={template}
                       />
                    </div>
                    <div className="text-center space-y-4">
                      <button
                        onClick={downloadIDCard}
                        disabled={isGenerating}
                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-bold transition-all duration-200 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                      >
                        {isGenerating ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>{t('Generating...', 'உருவாக்குகிறது...')}</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            <span>{t('Download ID Card', 'அடையாள அட்டை பதிவிறக்கம்')}</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span>{t('Reset', 'மீட்டமை')}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 px-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6">
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('Your ID Card is Waiting', 'உங்கள் அடையாள அட்டை காத்திருக்கிறது')}</h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      {t('Once you find your profile, your personalized ID card will appear here, ready for you to preview and download.', 'உங்கள் சுயவிவரத்தை கண்டறிந்தவுடன், உங்கள் தனிப்பயன் அடையாள அட்டை இங்கே தோன்றும்.')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default UserIDCardForm; 