import React from "react";
import { FieldError } from "react-hook-form";
import { translateError } from "./errorTranslations";

interface InputFieldProps {
  label: string;
  name: string;
  register: any;
  error?: FieldError;
  placeholder?: string;
  type?: string;
  uppercase?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  language?: string;
}

export default function InputField({
  label,
  name,
  register,
  error,
  placeholder,
  type = "text",
  uppercase,
  onKeyDown,
  language = "english",
}: InputFieldProps) {
  const reg = register(name);

  const handleChange = uppercase
    ? (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.toUpperCase();
        reg.onChange(e);
      }
    : reg.onChange;

  return (
    <div className="w-full group">
      <label htmlFor={name} className="block text-neutral-700 font-semibold mb-2 text-sm">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={type}
          {...reg}
          onChange={handleChange}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          style={uppercase ? { textTransform: 'uppercase' } : undefined}
          className={`w-full px-4 py-3 bg-white border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${
            error 
              ? "border-accent-300 focus:ring-accent-200" 
              : "border-neutral-300 focus:border-primary-400 focus:ring-primary-500/20"
          } placeholder:text-neutral-400 text-neutral-800 font-medium`}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="w-5 h-5 flex items-center justify-center bg-accent-500 rounded-full">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-accent-600 text-sm mt-1.5 flex items-center space-x-1 animate-slide-up">
          <span className="w-1 h-1 bg-accent-500 rounded-full"></span>
          <span>{translateError(error.message, language)}</span>
        </p>
      )}
    </div>
  );
}
