import React, { useState } from 'react';
import { API_URL } from '../config/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Settings, Plus, Trash2, Copy, Check, X, 
  Loader, AlertCircle, Palette
} from 'lucide-react';
import IDCardTemplateSettings from '../components/IDCardTemplateSettings';
import templates, { TemplateKey } from '../components/IDCardTemplates';

interface IDCardTemplate {
  id: number;
  name: string;
  description?: string;
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
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const defaultMember = {
  id: 1,
  profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  fullName: 'John Doe',
  gender: 'Male',
  mobile: '+91 98765 43210',
  email: 'john.doe@example.com',
  birthdate: '1990-01-01',
  maritalStatus: 'Single',
  country: 'India',
  state: 'Tamil Nadu',
  address: '123 Main Street',
  district: 'Chennai',
  taluk: 'Central',
  village: 'Downtown',
  education: 'Bachelor of Technology',
  jobType: 'Software Engineer',
  jobDescription: 'Full Stack Developer',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const IDCardTemplateManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<IDCardTemplate | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Fetch templates
  const { data: templatesData, isLoading, error } = useQuery({
    queryKey: ['idCardTemplates'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/idcard/templates`);
      if (!response.ok) throw new Error('Failed to fetch templates');
      const result = await response.json();
      return result.data as IDCardTemplate[];
    }
  });

  // Save template mutation
  const saveTemplateMutation = useMutation({
    mutationFn: async (template: IDCardTemplate) => {
      const response = await fetch(`${API_URL}/api/idcard/template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      });
      if (!response.ok) throw new Error('Failed to save template');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idCardTemplates'] });
      setShowSettings(false);
      setIsCreatingNew(false);
    }
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_URL}/api/idcard/template/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete template');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idCardTemplates'] });
      setSelectedTemplate(null);
    }
  });

  // Activate template mutation
  const activateTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_URL}/api/idcard/template/${id}/activate`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Failed to activate template');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idCardTemplates'] });
    }
  });

  // Duplicate template mutation
  const duplicateTemplateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const response = await fetch(`${API_URL}/api/idcard/template/${id}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!response.ok) throw new Error('Failed to duplicate template');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idCardTemplates'] });
    }
  });

  const handleCreateNew = () => {
    const newTemplate: IDCardTemplate = {
      id: 0,
      name: 'New Template',
      organizationTitle: 'Mutharaiyar Community',
      organizationLogo: '',
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      accentColor: '#60a5fa',
      textColor: '#ffffff',
      fontFamily: 'Inter',
      style: 'modern',
      layout: 'horizontal',
      showQR: true,
      qrPosition: 'right',
      showFields: {
        photo: true,
        name: true,
        memberId: true,
        jobTitle: true,
        department: false,
        email: true,
        phone: true,
        address: true,
        bloodGroup: false,
        emergencyContact: false,
        validFrom: true,
        validUntil: false,
        signature: false
      },
      isActive: false,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSelectedTemplate(newTemplate);
    setIsCreatingNew(true);
    setShowSettings(true);
  };

  const handleTemplateChange = (template: IDCardTemplate) => {
    setSelectedTemplate(template);
  };

  const handleSaveTemplate = (template: IDCardTemplate) => {
    saveTemplateMutation.mutate(template);
  };

  const handleDeleteTemplate = (id: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplateMutation.mutate(id);
    }
  };

  const handleDuplicateTemplate = (template: IDCardTemplate) => {
    const newName = prompt('Enter name for duplicated template:', `${template.name} (Copy)`);
    if (newName) {
      duplicateTemplateMutation.mutate({ id: template.id, name: newName });
    }
  };

  const handleActivateTemplate = (id: number) => {
    activateTemplateMutation.mutate(id);
  };

  // Get template component based on style
  const getTemplateComponent = (template: IDCardTemplate) => {
    const templateMap: Record<string, TemplateKey> = {
      'modern-minimalist': 'modernMinimalist',
      'corporate-professional': 'corporateProfessional',
      'creative-gradient': 'creativeGradient',
      'classic-elegant': 'classicElegant',
      'vertical-modern': 'verticalModern'
    };
    
    const key = `${template.style}-${template.layout}` as string;
    const templateKey = templateMap[key] || 'modernMinimalist';
    const TemplateComponent = templates[templateKey as TemplateKey]?.component || templates.modernMinimalist.component;
    
    return <TemplateComponent member={defaultMember} template={template} />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20">
          <Loader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Templates</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Templates</h2>
          <p className="text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  const allTemplates = templatesData || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ID Card Templates</h1>
                <p className="text-gray-600">Design and manage your organization's ID card templates</p>
              </div>
            </div>
            
            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Create New Template</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {showSettings && selectedTemplate ? (
          <div className="animate-fade-in">
            <button
              onClick={() => {
                setShowSettings(false);
                setIsCreatingNew(false);
              }}
              className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Back to Templates</span>
            </button>
            
            <IDCardTemplateSettings
              template={selectedTemplate}
              onTemplateChange={handleTemplateChange}
              onSave={handleSaveTemplate}
              previewMember={defaultMember}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Template Preview */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center min-h-[300px]">
                  <div className="transform scale-75">
                    {getTemplateComponent(template)}
                  </div>
                  
                  {template.isActive && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Check className="w-4 h-4" />
                      <span>Active</span>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                  {template.description && (
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {template.style}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {template.layout}
                    </span>
                    {template.showQR && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        QR Code
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowSettings(true);
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </button>

                    {!template.isActive && (
                      <button
                        onClick={() => handleActivateTemplate(template.id)}
                        disabled={activateTemplateMutation.isPending}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">Activate</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDuplicateTemplate(template)}
                      disabled={duplicateTemplateMutation.isPending}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm font-medium">Duplicate</span>
                    </button>

                    {!template.isActive && !template.isDefault && (
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        disabled={deleteTemplateMutation.isPending}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IDCardTemplateManager; 