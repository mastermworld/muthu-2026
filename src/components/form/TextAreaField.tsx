import React from "react";
import { FieldError } from "react-hook-form";
import { FileText } from "lucide-react";

interface TextAreaFieldProps {
  label: string;
  name: string;
  register: any;
  error?: FieldError;
  placeholder?: string;
  rows?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function TextAreaField({
  label,
  name,
  register,
  error,
  placeholder,
  rows = 4,
  onKeyDown,
}: TextAreaFieldProps) {
  return (
    <div className="w-full group">
      <label htmlFor={name} className="block text-neutral-700 font-semibold mb-2 text-sm">
        {label}
      </label>
      <div className="relative">
        <textarea
          id={name}
          {...register(name)}
          placeholder={placeholder}
          rows={rows}
          onKeyDown={onKeyDown}
          className={`w-full px-4 py-3 bg-white border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 resize-none ${
            error 
              ? "border-accent-300 focus:ring-accent-200" 
              : "border-neutral-300 focus:border-primary-400 focus:ring-primary-500/20"
          } placeholder:text-neutral-400 text-neutral-800 font-medium`}
        />
        <div className="absolute top-3.5 right-3 pointer-events-none">
          <FileText className="w-5 h-5 text-neutral-500 group-hover:text-primary-500 transition-colors duration-300" />
        </div>
      </div>
      {error && (
        <p className="text-accent-600 text-sm mt-1.5 flex items-center space-x-1 animate-slide-up">
          <span className="w-1 h-1 bg-accent-500 rounded-full"></span>
          <span>{error.message}</span>
        </p>
      )}
    </div>
  );
}
