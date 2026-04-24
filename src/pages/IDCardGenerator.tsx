import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  Download, Search, Grid, List, 
  Eye, FileDown,
  ChevronLeft, ChevronRight, RefreshCw, AlertCircle, User
} from 'lucide-react';
import IDCardPreview from '../components/IDCardPreview';
import { API_URL } from '../config/api';
import templates from '../components/IDCardTemplates';
import { useLanguage } from '../components/layout/Navbar';

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

const IDCardGenerator: React.FC = () => {
  const { language } = useLanguage();
  const t = (en: string, ta: string) => language === 'tamil' ? ta : en;
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterJobType, setFilterJobType] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch members
  const { data: membersData, isLoading: membersLoading, error: membersError } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/survey`);
      if (!response.ok) throw new Error('Failed to fetch members');
      const result = await response.json();
      return result.data as Member[];
    }
  });

  // Set the template to the new "Golden" template
  const template = {
    ...templates.golden.defaultSettings,
    id: 'golden',
    name: 'Golden',
          organizationTitle: 'Mutharaiyar Community',
    organizationLogo: '/images/logo.png', // Example logo
    showQR: true,
    qrPosition: 'bottom',
    showFields: {
      photo: true,
      name: true,
      memberId: true,
      jobTitle: true,
      department: false,
      email: true,
      phone: true,
      address: true,
      bloodGroup: true,
      emergencyContact: false,
      validFrom: false,
      validUntil: false,
      signature: false
    }
  };

  const members = membersData || [];

  // Filter and search logic
  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = member.fullName.toLowerCase().includes(searchLower) ||
                         member.mobile.includes(searchTerm) ||
                         member.email.toLowerCase().includes(searchLower) ||
                         String(member.id).includes(searchTerm);
    const matchesDistrict = !filterDistrict || member.district === filterDistrict;
    const matchesJobType = !filterJobType || member.jobType === filterJobType;
    
    return matchesSearch && matchesDistrict && matchesJobType;
  });

  // Get unique districts and job types for filters
  const districts = [...new Set(members.map(m => m.district).filter(Boolean))].sort() as string[];
  const jobTypes = [...new Set(members.map(m => m.jobType))].sort();

  // Pagination
  const itemsPerPage = viewMode === 'grid' ? 12 : 10;
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDistrict, filterJobType]);

  // Selection handlers
  const toggleMember = (memberId: number) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const selectAll = () => {
    setSelectedMembers(new Set(filteredMembers.map(m => m.id)));
  };

  const clearSelection = () => {
    setSelectedMembers(new Set());
  };

  // Download functionality
  const downloadCardAsImage = async (member: Member, filename?: string) => {
    try {
      setIsGenerating(true);

      const cardContainer = document.createElement('div');
      cardContainer.style.position = 'fixed';
      cardContainer.style.left = '-9999px';
      cardContainer.style.top = '-9999px';
      cardContainer.style.width = '350px'; // Match template width
      document.body.appendChild(cardContainer);

      const root = (await import('react-dom/client')).createRoot(cardContainer);
      root.render(
        <IDCardPreview 
          member={member}
          template={template as any}
        />
      );

      await new Promise(res => setTimeout(res, 500)); // Wait for render

      const canvas = await html2canvas(cardContainer, {
        scale: 4,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        imageTimeout: 0,
        logging: false,
      });

      document.body.removeChild(cardContainer);

          const link = document.createElement('a');
      link.download = filename || `${member.fullName.replace(/\s/g, '_')}_ID_Card.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
          link.click();

    } catch (error) {
      console.error('Error generating card image:', error);
      alert('Failed to generate ID card. See console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadMultipleCardsAsPDF = async (membersList: Member[]) => {
    try {
    setIsGenerating(true);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const cardWidth = 85.6;
      const cardHeight = 53.98;
      const marginX = 10;
      const marginY = 10;
      let x = marginX;
      let y = marginY;

      for (let i = 0; i < membersList.length; i++) {
        const member = membersList[i];
        
        // Use a temporary div to render the card for canvas conversion
        const cardContainer = document.createElement('div');
        cardContainer.style.position = 'fixed';
        cardContainer.style.left = '-9999px';
        cardContainer.style.top = '-9999px';
        cardContainer.style.width = '400px';
        document.body.appendChild(cardContainer);

        // Render card preview into the div
        const root = (await import('react-dom/client')).createRoot(cardContainer);
        root.render(
          <IDCardPreview 
            member={member}
            template={template as any}
          />
        );
        
        // Wait for render
        await new Promise(res => setTimeout(res, 500));

        const canvas = await html2canvas(cardContainer, {
          scale: 4,
          useCORS: true,
          allowTaint: false,
          backgroundColor: null,
          imageTimeout: 0,
          logging: false,
        });
        
        const imgData = canvas.toDataURL('image/png');

        if (i > 0 && i % 8 === 0) {
          pdf.addPage();
          x = marginX;
          y = marginY;
        }

        pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight);
        
        x += cardWidth + 5;
        if (x + cardWidth > pdf.internal.pageSize.getWidth() - marginX) {
          x = marginX;
          y += cardHeight + 5;
        }
        if (y + cardHeight > pdf.internal.pageSize.getHeight() - marginY) {
          if (i < membersList.length - 1) {
            pdf.addPage();
            x = marginX;
            y = marginY;
          }
        }

        document.body.removeChild(cardContainer);
      }

      pdf.save('Mutharaiyar_ID_Cards.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. See console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSingle = (member: Member) => {
    downloadCardAsImage(member);
  };

  const downloadSelected = () => {
    const selected = members.filter(m => selectedMembers.has(m.id));
    if (selected.length === 0) return;
    if (selected.length === 1) {
      downloadCardAsImage(selected[0]);
    } else {
      downloadMultipleCardsAsPDF(selected);
    }
  };

  const downloadAll = () => {
    if (filteredMembers.length === 0) return;
    downloadMultipleCardsAsPDF(filteredMembers);
  };

  if (membersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
          <p className="text-lg font-semibold text-gray-700">{t('Loading Members...', 'உறுப்பினர்களை ஏற்றுகிறது...')}</p>
        </div>
      </div>
    );
  }

  if (membersError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('Error Fetching Data', 'தரவு பெறுவதில் பிழை')}</h2>
          <p className="text-gray-600">{t('Could not load member information. Please try again later.', 'உறுப்பினர் தகவலை ஏற்ற முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t('ID Card Generator', 'அடையாள அட்டை உருவாக்கி')}</h1>
              <p className="mt-1 text-sm text-gray-600">
                {t('Select members and generate their ID cards.', 'உறுப்பினர்களைத் தேர்ந்தெடுத்து அவர்களின் அடையாள அட்டைகளை உருவாக்கவும்.')}
                {' '}{t('Currently using', 'தற்போது பயன்படுத்தப்படுகிறது')} <span className="font-semibold text-amber-700">{template.name}</span> {t('template.', 'வார்ப்புரு.')}
              </p>
              </div>
            <div className="flex items-center space-x-4">
              {selectedMembers.size > 0 && (
                <span className="text-sm font-medium text-gray-700">
                  {selectedMembers.size} {t('selected', 'தேர்ந்தெடுக்கப்பட்டது')}
                </span>
              )}
              <button
                onClick={downloadSelected}
                disabled={selectedMembers.size === 0 || isGenerating}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <Download className="-ml-1 mr-2 h-5 w-5" />
                {t('Download Selected', 'தேர்ந்தவற்றை பதிவிறக்கம்')}
              </button>
              <button
                onClick={downloadAll}
                disabled={isGenerating}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <FileDown className="-ml-1 mr-2 h-5 w-5" />
                {t('Download All', 'அனைத்தையும் பதிவிறக்கம்')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('Search by name, phone, email, or ID', 'பெயர், தொலைபேசி, மின்னஞ்சல், அல்லது ஐடி மூலம் தேடவும்')}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="filter-district" className="sr-only">Filter by District</label>
              <select
                id="filter-district"
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">{t('All Districts', 'அனைத்து மாவட்டங்கள்')}</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="filter-job" className="sr-only">Filter by Job Type</label>
              <select
                id="filter-job"
                value={filterJobType}
                onChange={(e) => setFilterJobType(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">{t('All Job Types', 'அனைத்து வேலை வகைகள்')}</option>
                {jobTypes.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={selectAll} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">{t('Select All', 'அனைத்தையும் தேர்ந்தெடு')}</button>
              <span className="mx-2 text-gray-300">|</span>
              <button onClick={clearSelection} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">{t('Clear Selection', 'தேர்வை நீக்கு')}</button>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">{t('View as:', 'காட்சி:')}</span>
              <button onClick={() => setViewMode('grid')} className={`p-1 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:bg-gray-100'}`}>
                <Grid className="h-5 w-5" />
                </button>
              <button onClick={() => setViewMode('list')} className={`ml-1 p-1 rounded-md ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:bg-gray-100'}`}>
                <List className="h-5 w-5" />
                </button>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div>
          {filteredMembers.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentMembers.map(member => (
                  <div key={member.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={selectedMembers.has(member.id)}
                        onChange={() => toggleMember(member.id)}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 truncate">{member.fullName}</p>
                        <p className="text-sm text-gray-500">{member.jobType}</p>
                    </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <div className="transform scale-75 origin-center">
                        <IDCardPreview 
                          member={member}
                          template={template as any}
                        />
                      </div>
                      </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <button onClick={() => downloadSingle(member)} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                        <Download className="inline -mt-1 mr-1 h-4 w-4" />
                        {t('Download', 'பதிவிறக்கம்')}
                      </button>
                      <button className="text-sm font-medium text-gray-500 hover:text-gray-800">
                        <Eye className="inline -mt-1 mr-1 h-4 w-4" />
                        {t('Preview', 'முன்னோட்டம்')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            onChange={(e) => e.target.checked ? selectAll() : clearSelection()}
                            checked={selectedMembers.size > 0 && selectedMembers.size === filteredMembers.length}
                          />
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Name', 'பெயர்')}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Card Preview', 'அட்டை முன்னோட்டம்')}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Actions', 'செயல்கள்')}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentMembers.map(member => (
                        <tr key={member.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              checked={selectedMembers.has(member.id)}
                              onChange={() => toggleMember(member.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {member.profilePicture ? (
                                  <img className="h-10 w-10 rounded-full object-cover" src={member.profilePicture.startsWith('http') ? member.profilePicture : `${API_URL}/${member.profilePicture}`} alt="" />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{member.fullName}</div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-64">
                               <IDCardPreview 
                                 member={member} 
                                 template={template as any}
                               />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button onClick={() => downloadSingle(member)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                              <Download className="inline -mt-1 mr-1 h-4 w-4" />
                              {t('Download', 'பதிவிறக்கம்')}
                            </button>
                            <button className="text-gray-500 hover:text-gray-800">
                              <Eye className="inline -mt-1 mr-1 h-4 w-4" />
                              {t('Preview', 'முன்னோட்டம்')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
            )}

              {/* Pagination controls */}
              <div className="mt-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    {t('Showing', 'காட்டுகிறது')} <span className="font-medium">{startIndex + 1}</span> {t('to', 'முதல்')} <span className="font-medium">{Math.min(endIndex, filteredMembers.length)}</span> {t('of', '/')} <span className="font-medium">{filteredMembers.length}</span> {t('results', 'முடிவுகள்')}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm text-gray-700">
                    {t('Page', 'பக்கம்')} {currentPage} {t('of', '/')} {totalPages}
                  </span>
                        <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
          </>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600">{t('No members found matching your criteria.', 'உங்கள் தேடல் அளவுகோல்களுக்கு பொருந்தும் உறுப்பினர்கள் இல்லை.')}</p>
            </div>
        )}
      </div>
      </main>
    </div>
  );
};

export default IDCardGenerator; 