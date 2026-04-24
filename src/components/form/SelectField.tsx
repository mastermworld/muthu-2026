import React from "react";
import { FieldError } from "react-hook-form";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  register: any;
  error?: FieldError;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
}

export default function SelectField({
  label,
  name,
  register,
  error,
  placeholder,
  options,
  disabled = false,
  onKeyDown,
}: SelectFieldProps) {
  return (
    <div className="w-full group">
      <label htmlFor={name} className="block text-neutral-700 font-semibold mb-2 text-sm">
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          {...register(name)}
          disabled={disabled}
          onKeyDown={onKeyDown}
          className={`w-full px-4 py-3 bg-white border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 appearance-none ${
            error
              ? "border-accent-300 focus:ring-accent-200"
              : disabled
              ? "border-neutral-300 bg-neutral-50 text-neutral-500 cursor-not-allowed"
              : "border-neutral-300 focus:border-primary-400 focus:ring-primary-500/20"
          } text-neutral-800 font-medium`}
        >
          <option value="" className="text-neutral-400">
            {placeholder || `Select ${label}`}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-neutral-800">
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown 
            className={`w-5 h-5 transition-colors duration-300 ${
              disabled ? 'text-neutral-300' : 'text-neutral-500 group-hover:text-primary-500'
            }`} 
          />
        </div>
      </div>
      
      {error && (
        <p className="text-accent-600 text-sm mt-1.5 flex items-center space-x-1 animate-slide-up">
          <span className="w-1 h-1 bg-accent-500 rounded-full"></span>
          <span>{error.message}</span>
        </p>
      )}
      
      {disabled && !error && (
        <p className="text-neutral-500 text-xs mt-1 flex items-center space-x-1">
          <span>Please select the previous option first</span>
        </p>
      )}
    </div>
  );
} 