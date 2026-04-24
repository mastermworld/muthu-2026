import React, { useState, useEffect } from 'react';
import { 
  Palette, Layout, Image, Eye, 
  Save, Check, X, Settings,
  Sparkles, Briefcase, Heart, Download,
  Upload, Copy, List, ChevronDown,
  Building, User, Hash, Phone, Mail, MapPin, Calendar, Edit3
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import templates, { TemplateKey } from './IDCardTemplates';

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
  bloodGroup?: string;
  createdAt: string;
  updatedAt: string;
}

interface IDCardTemplateSettingsProps {
  template: IDCardTemplate;
  onTemplateChange: (template: IDCardTemplate) => void;
  onSave: (template: IDCardTemplate) => void;
  previewMember?: Member;
}

const defaultMember: Member = {
  id: 1,
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

const colorPresets = [
  { name: 'Ocean Blue', colors: { primary: '#0ea5e9', secondary: '#38bdf8', accent: '#7dd3fc' } },
  { name: 'Forest Green', colors: { primary: '#059669', secondary: '#10b981', accent: '#34d399' } },
  { name: 'Royal Purple', colors: { primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa' } },
  { name: 'Sunset Orange', colors: { primary: '#f97316', secondary: '#fb923c', accent: '#fdba74' } },
  { name: 'Rose Pink', colors: { primary: '#e11d48', secondary: '#f43f5e', accent: '#fb7185' } },
  { name: 'Midnight Dark', colors: { primary: '#0f172a', secondary: '#1e293b', accent: '#334155' } },
];

const fontOptions = [
  { value: 'Inter', label: 'Inter (Modern)', preview: 'Aa' },
  { value: 'Arial', label: 'Arial (Clean)', preview: 'Aa' },
  { value: 'Georgia', label: 'Georgia (Classic)', preview: 'Aa' },
  { value: 'Poppins', label: 'Poppins (Friendly)', preview: 'Aa' },
  { value: 'Roboto', label: 'Roboto (Professional)', preview: 'Aa' },
  { value: 'Montserrat', label: 'Montserrat (Bold)', preview: 'Aa' },
];

const IDCardTemplateSettings: React.FC<IDCardTemplateSettingsProps> = ({
  template,
  onTemplateChange,
  onSave,
  previewMember = defaultMember
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'design' | 'fields' | 'preview'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('modernMinimalist');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [localTemplate, setLocalTemplate] = useState(template);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    setLocalTemplate(template);
  }, [template]);

  const handleTemplateChange = (key: keyof IDCardTemplate, value: any) => {
    const newTemplate = { ...localTemplate, [key]: value };
    setLocalTemplate(newTemplate);
    onTemplateChange(newTemplate);
    setUnsavedChanges(true);
  };

  const handleFieldToggle = (field: keyof IDCardTemplate['showFields']) => {
    const newShowFields = { ...localTemplate.showFields, [field]: !localTemplate.showFields[field] };
    handleTemplateChange('showFields', newShowFields);
  };

  const handleColorChange = (colorType: 'primaryColor' | 'secondaryColor' | 'accentColor' | 'textColor', color: string) => {
    handleTemplateChange(colorType, color);
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    handleTemplateChange('primaryColor', preset.colors.primary);
    handleTemplateChange('secondaryColor', preset.colors.secondary);
    handleTemplateChange('accentColor', preset.colors.accent);
  };

  const handleSave = () => {
    onSave(localTemplate);
    setUnsavedChanges(false);
  };

  const resetChanges = () => {
    setLocalTemplate(template);
    setUnsavedChanges(false);
  };

  const applyTemplate = (templateKey: TemplateKey) => {
    const newTemplate = { ...localTemplate, ...templates[templateKey].config };
    setLocalTemplate(newTemplate);
    onTemplateChange(newTemplate);
    setUnsavedChanges(true);
    setSelectedTemplate(templateKey);
  };

  // Get the selected template component
  const SelectedTemplateComponent = templates[selectedTemplate]?.component || templates.modernMinimalist.component;

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">ID Card Template Settings</h2>
              <p className="text-blue-100">Customize your organization's ID card design</p>
            </div>
          </div>
          
          {unsavedChanges && (
            <div className="flex items-center space-x-3">
              <button
                onClick={resetChanges}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2 font-semibold shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex space-x-1 p-2">
          {[
            { id: 'templates', label: 'Templates', icon: Layout },
            { id: 'design', label: 'Design', icon: Palette },
            { id: 'fields', label: 'Fields', icon: List },
            { id: 'preview', label: 'Preview', icon: Eye }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(templates).map(([key, { config, component: TemplateComponent }]) => (
                  <div
                    key={key}
                    onClick={() => applyTemplate(key as TemplateKey)}
                    className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                      selectedTemplate === key
                        ? 'ring-4 ring-blue-500 shadow-xl transform scale-105'
                        : 'hover:shadow-lg hover:transform hover:scale-105'
                    }`}
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
                      <div className="transform scale-75">
                        <TemplateComponent
                          member={previewMember}
                          template={{ ...localTemplate, ...config }}
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h4 className="font-bold text-lg">{config.name}</h4>
                      <p className="text-sm text-white/80">Click to apply this template</p>
                    </div>
                    {selectedTemplate === key && (
                      <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Design Tab */}
        {activeTab === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Settings */}
            <div className="space-y-8">
              {/* Organization Details */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={localTemplate.organizationTitle}
                      onChange={(e) => handleTemplateChange('organizationTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={localTemplate.organizationLogo || ''}
                        onChange={(e) => handleTemplateChange('organizationLogo', e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Upload className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Scheme */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Scheme</h3>
                
                {/* Color Presets */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Quick Presets</p>
                  <div className="grid grid-cols-3 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyColorPreset(preset)}
                        className="group relative rounded-lg overflow-hidden h-12 transition-transform hover:scale-105"
                      >
                        <div className="absolute inset-0 flex">
                          <div className="flex-1" style={{ backgroundColor: preset.colors.primary }}></div>
                          <div className="flex-1" style={{ backgroundColor: preset.colors.secondary }}></div>
                          <div className="flex-1" style={{ backgroundColor: preset.colors.accent }}></div>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {preset.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div className="space-y-4">
                  {[
                    { key: 'primaryColor', label: 'Primary Color' },
                    { key: 'secondaryColor', label: 'Secondary Color' },
                    { key: 'accentColor', label: 'Accent Color' },
                    { key: 'textColor', label: 'Text Color' }
                  ].map(({ key, label }) => (
                    <div key={key} className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setShowColorPicker(showColorPicker === key ? null : key)}
                          className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                        >
                          <span className="text-sm font-mono">{localTemplate[key as keyof IDCardTemplate]}</span>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{ backgroundColor: localTemplate[key as keyof IDCardTemplate] as string }}
                            ></div>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          </div>
                        </button>
                      </div>
                      
                      {showColorPicker === key && (
                        <div className="absolute z-10 mt-2">
                          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
                            <HexColorPicker
                              color={localTemplate[key as keyof IDCardTemplate] as string}
                              onChange={(color) => handleColorChange(key as any, color)}
                            />
                            <input
                              type="text"
                              value={localTemplate[key as keyof IDCardTemplate] as string}
                              onChange={(e) => handleColorChange(key as any, e.target.value)}
                              className="mt-3 w-full px-3 py-1 text-sm border border-gray-300 rounded-lg font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {fontOptions.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => handleTemplateChange('fontFamily', font.value)}
                        className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                          localTemplate.fontFamily === font.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ fontFamily: font.value }}
                      >
                        <span className="text-2xl">{font.preview}</span>
                        <p className="text-xs mt-1">{font.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Layout Options */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Layout Options</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Orientation
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleTemplateChange('layout', 'horizontal')}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          localTemplate.layout === 'horizontal'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="w-16 h-10 bg-gray-300 rounded mx-auto mb-2"></div>
                        <p className="text-sm font-medium">Horizontal</p>
                      </button>
                      <button
                        onClick={() => handleTemplateChange('layout', 'vertical')}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          localTemplate.layout === 'vertical'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="w-10 h-16 bg-gray-300 rounded mx-auto mb-2"></div>
                        <p className="text-sm font-medium">Vertical</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      QR Code Settings
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show QR Code</span>
                        <button
                          onClick={() => handleTemplateChange('showQR', !localTemplate.showQR)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            localTemplate.showQR ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              localTemplate.showQR ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      {localTemplate.showQR && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">QR Code Position</p>
                          <div className="grid grid-cols-2 gap-2">
                            {['right', 'left', 'bottom', 'back'].map((position) => (
                              <button
                                key={position}
                                onClick={() => handleTemplateChange('qrPosition', position as any)}
                                className={`px-3 py-2 rounded-lg text-sm capitalize transition-all duration-200 ${
                                  localTemplate.qrPosition === position
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {position}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Live Preview */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Live Preview</h3>
                <div className="flex items-center justify-center">
                  <div className="transform scale-110">
                    <SelectedTemplateComponent
                      member={previewMember}
                      template={localTemplate}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-center space-x-3">
                  <button className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export Template</span>
                  </button>
                  <button className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-2">
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Duplicate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fields Tab */}
        {activeTab === 'fields' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visible Fields</h3>
              <p className="text-sm text-gray-600 mb-6">
                Choose which information to display on the ID card. Some fields may not be visible in certain templates.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'photo', label: 'Profile Photo', icon: Image, required: true },
                  { key: 'name', label: 'Full Name', icon: User, required: true },
                  { key: 'memberId', label: 'Member ID', icon: Hash, required: true },
                  { key: 'jobTitle', label: 'Job Title', icon: Briefcase },
                  { key: 'department', label: 'Department', icon: Building },
                  { key: 'email', label: 'Email Address', icon: Mail },
                  { key: 'phone', label: 'Phone Number', icon: Phone },
                  { key: 'address', label: 'Address', icon: MapPin },
                  { key: 'bloodGroup', label: 'Blood Group', icon: Heart },
                  { key: 'emergencyContact', label: 'Emergency Contact', icon: Shield },
                  { key: 'validFrom', label: 'Valid From Date', icon: Calendar },
                  { key: 'validUntil', label: 'Valid Until Date', icon: Calendar },
                  { key: 'signature', label: 'Digital Signature', icon: Edit3 }
                ].map(({ key, label, icon: Icon, required }) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-4 bg-white rounded-lg border transition-all duration-200 ${
                      localTemplate.showFields[key as keyof typeof localTemplate.showFields]
                        ? 'border-blue-500 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          localTemplate.showFields[key as keyof typeof localTemplate.showFields]
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{label}</p>
                        {required && (
                          <p className="text-xs text-gray-500">Required field</p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => !required && handleFieldToggle(key as any)}
                      disabled={required}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        localTemplate.showFields[key as keyof typeof localTemplate.showFields]
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      } ${required ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          localTemplate.showFields[key as keyof typeof localTemplate.showFields]
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Preview</h3>
              <p className="text-sm text-gray-600">
                This is how your ID card will look with the current settings
              </p>
            </div>

            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12">
                <div className="transform scale-125">
                  <SelectedTemplateComponent
                    member={previewMember}
                    template={localTemplate}
                  />
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-blue-50 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Pro Tips</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Use high contrast colors for better readability</li>
                      <li>• Keep the design clean and professional</li>
                      <li>• Ensure the QR code has enough white space around it</li>
                      <li>• Test print a sample before finalizing the design</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IDCardTemplateSettings; 