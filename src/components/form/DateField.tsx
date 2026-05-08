import React, { useRef } from "react";
import { FieldError } from "react-hook-form";
import { Calendar } from "lucide-react";
import { translateError } from "./errorTranslations";

interface DateFieldProps {
  label: string;
  name: string;
  register: any;
  error?: FieldError;
  helperText?: string;
  min?: string;
  max?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  language?: string;
}

export default function DateField({
  label,
  name,
  register,
  error,
  helperText,
  min = "1900-01-01",
  max,
  onKeyDown,
  language = "english",
}: DateFieldProps) {
  const reg = register(name);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full group">
      <label htmlFor={name} className="block text-neutral-700 font-semibold mb-2 text-sm">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type="date"
          min={min}
          max={max ?? today}
          {...reg}
          ref={(el: HTMLInputElement | null) => {
            reg.ref(el);
            inputRef.current = el;
          }}
          onKeyDown={onKeyDown}
          className={`w-full px-4 py-3 bg-white border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${
            error
              ? "border-accent-300 focus:ring-accent-200"
              : "border-neutral-300 focus:border-primary-400 focus:ring-primary-500/20"
          } text-neutral-800 font-medium`}
        />
        <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
          <Calendar className="w-4 h-4 text-neutral-400 group-hover:text-primary-500 transition-colors duration-300" />
        </div>
      </div>
      {error ? (
        <p className="text-accent-600 text-sm mt-1.5 flex items-center space-x-1 animate-slide-up">
          <span className="w-1 h-1 bg-accent-500 rounded-full"></span>
          <span>{translateError(error.message, language)}</span>
        </p>
      ) : helperText ? (
        <p className="text-neutral-500 text-xs mt-1.5">{helperText}</p>
      ) : null}
    </div>
  );
}
