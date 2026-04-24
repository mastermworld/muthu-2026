import React, { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiChevronDown, FiSearch, FiX } from 'react-icons/fi';
import { locationService, LocationOption } from '../../services/locationService';
import { useLanguage } from '../layout/Navbar';

interface LocationDropdownsProps {
  value: {
    country?: string;
    state?: string;
    district?: string;
    taluk?: string;
    village?: string;
  };
  onChange: (location: {
    country?: string;
    state?: string;
    district?: string;
    taluk?: string;
    village?: string;
  }) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

interface SearchableDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: LocationOption[];
  loading: boolean;
  disabled?: boolean;
  placeholder: string;
  required?: boolean;
  icon?: React.ReactNode;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  loading,
  disabled,
  placeholder,
  required,
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<LocationOption[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update filtered options when options or search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [options, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get display text for selected value
  const getDisplayText = () => {
    if (!value) return '';
    const selectedOption = options.find(option => option.value === value);
    return selectedOption ? selectedOption.label : value;
  };

  const handleSelect = (option: LocationOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  const handleToggle = () => {
    if (disabled || loading) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="mb-4" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {icon && <span className="inline-flex items-center mr-2">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {/* Main display/trigger */}
        <div
          onClick={handleToggle}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 
            transition-colors duration-200 cursor-pointer
            ${disabled || loading ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}
            ${isOpen ? 'ring-2 ring-orange-500 border-orange-500' : ''}
            ${loading ? 'animate-pulse' : ''}
            flex items-center justify-between
          `}
        >
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {loading ? 'Loading...' : (getDisplayText() || placeholder)}
          </span>
          <div className="flex items-center space-x-2">
            {value && !disabled && !loading && (
              <FiX
                className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={handleClear}
              />
            )}
            <FiChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </div>
        </div>

        {/* Dropdown panel */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search input */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`
                      px-4 py-3 cursor-pointer transition-colors duration-150
                      ${value === option.value 
                        ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-500' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="font-medium">{option.label}</div>
                    {option.label !== option.name && (
                      <div className="text-sm text-gray-500">{option.name}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  {searchQuery ? `No ${label.toLowerCase()} found matching "${searchQuery}"` : `No ${label.toLowerCase()} available`}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LocationDropdowns: React.FC<LocationDropdownsProps> = ({
  value,
  onChange,
  required = false,
  disabled = false,
  className = ''
}) => {
  // State for dropdown options
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [states, setStates] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [taluks, setTaluks] = useState<LocationOption[]>([]);
  const [villages, setVillages] = useState<LocationOption[]>([]);
  
  const [loading, setLoading] = useState({
    countries: false,
    states: false,
    districts: false,
    taluks: false,
    villages: false,
  });

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      setLoading(prev => ({ ...prev, countries: true }));
      try {
        const countryList = await locationService.getCountries();
        setCountries(countryList);
        
        // Auto-select India if it's the only country and not already selected
        if (countryList.length === 1 && !value.country) {
          handleCountryChange(countryList[0].value);
        }
      } catch (error) {
        console.error('Failed to load countries:', error);
      } finally {
        setLoading(prev => ({ ...prev, countries: false }));
      }
    };

    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (value.country) {
      const loadStates = async () => {
        setLoading(prev => ({ ...prev, states: true }));
        try {
          const stateList = await locationService.getStates(value.country!);
          setStates(stateList);
          
          // Auto-select Tamil Nadu if it's the only state and not already selected
          if (stateList.length === 1 && !value.state) {
            handleStateChange(stateList[0].value);
          }
        } catch (error) {
          console.error('Failed to load states:', error);
        } finally {
          setLoading(prev => ({ ...prev, states: false }));
        }
      };

      loadStates();
    } else {
      setStates([]);
      setDistricts([]);
      setTaluks([]);
      setVillages([]);
    }
  }, [value.country]);

  // Load districts when state changes
  useEffect(() => {
    if (value.state) {
      const loadDistricts = async () => {
        setLoading(prev => ({ ...prev, districts: true }));
        try {
          const districtList = await locationService.getDistricts(value.state!);
          setDistricts(districtList);
        } catch (error) {
          console.error('Failed to load districts:', error);
        } finally {
          setLoading(prev => ({ ...prev, districts: false }));
        }
      };

      loadDistricts();
    } else {
      setDistricts([]);
      setTaluks([]);
      setVillages([]);
    }
  }, [value.state]);

  // Load taluks when district changes
  useEffect(() => {
    if (value.district) {
      const loadTaluks = async () => {
        setLoading(prev => ({ ...prev, taluks: true }));
        try {
          const talukList = await locationService.getTaluks(value.district!);
          setTaluks(talukList);
        } catch (error) {
          console.error('Failed to load taluks:', error);
        } finally {
          setLoading(prev => ({ ...prev, taluks: false }));
        }
      };

      loadTaluks();
    } else {
      setTaluks([]);
      setVillages([]);
    }
  }, [value.district]);

  // Load villages when taluk changes
  useEffect(() => {
    if (value.taluk) {
      const loadVillages = async () => {
        setLoading(prev => ({ ...prev, villages: true }));
        try {
          const villageList = await locationService.getVillages(value.taluk!);
          setVillages(villageList);
        } catch (error) {
          console.error('Failed to load villages:', error);
        } finally {
          setLoading(prev => ({ ...prev, villages: false }));
        }
      };

      loadVillages();
    } else {
      setVillages([]);
    }
  }, [value.taluk]);

  const handleCountryChange = (country: string) => {
    onChange({
      country,
      state: '',
      district: '',
      taluk: '',
      village: ''
    });
  };

  const handleStateChange = (state: string) => {
    onChange({
      ...value,
      state,
      district: '',
      taluk: '',
      village: ''
    });
  };

  const handleDistrictChange = (district: string) => {
    onChange({
      ...value,
      district,
      taluk: '',
      village: ''
    });
  };

  const handleTalukChange = (taluk: string) => {
    onChange({
      ...value,
      taluk,
      village: ''
    });
  };

  const handleVillageChange = (village: string) => {
    onChange({
      ...value,
      village
    });
  };

  const { language } = useLanguage();
  const hasDistricts = districts.length > 0 || loading.districts;
  const hasTaluks    = taluks.length > 0 || loading.taluks;
  const hasVillages  = villages.length > 0 || loading.villages;

  return (
    <div className={`location-dropdowns ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchableDropdown
          label={language === 'tamil' ? 'நாடு' : 'Country'}
          value={value.country || ''}
          onChange={handleCountryChange}
          options={countries}
          loading={loading.countries}
          disabled={disabled}
          placeholder={language === 'tamil' ? 'நாடு தேர்ந்தெடுக்கவும்' : 'Select Country'}
          required={required}
          icon={<FiMapPin />}
        />

        <SearchableDropdown
          label={language === 'tamil' ? 'மாநிலம்' : 'State/Province'}
          value={value.state || ''}
          onChange={handleStateChange}
          options={states}
          loading={loading.states}
          disabled={disabled || !value.country}
          placeholder={language === 'tamil' ? 'மாநிலம் தேர்ந்தெடுக்கவும்' : 'Select State'}
          required={required}
        />

        {(hasDistricts || value.district) && (
          <SearchableDropdown
            label={language === 'tamil' ? 'மாவட்டம்' : 'District'}
            value={value.district || ''}
            onChange={handleDistrictChange}
            options={districts}
            loading={loading.districts}
            disabled={disabled || !value.state}
            placeholder={language === 'tamil' ? 'மாவட்டம் தேர்ந்தெடுக்கவும்' : 'Select District'}
          />
        )}

        {(hasTaluks || value.taluk) && (
          <SearchableDropdown
            label={language === 'tamil' ? 'தாலுகா' : 'Taluk'}
            value={value.taluk || ''}
            onChange={handleTalukChange}
            options={taluks}
            loading={loading.taluks}
            disabled={disabled || !value.district}
            placeholder={language === 'tamil' ? 'தாலுகா தேர்ந்தெடுக்கவும்' : 'Select Taluk'}
          />
        )}
      </div>

      {(hasVillages || value.village) && (
        <div className="mt-4">
          <SearchableDropdown
            label={language === 'tamil' ? 'கிராமம்' : 'Village'}
            value={value.village || ''}
            onChange={handleVillageChange}
            options={villages}
            loading={loading.villages}
            disabled={disabled || !value.taluk}
            placeholder={language === 'tamil' ? 'கிராமம் தேர்ந்தெடுக்கவும்' : 'Select Village'}
            icon={<FiMapPin />}
          />
        </div>
      )}
    </div>
  );
};

export default LocationDropdowns; 