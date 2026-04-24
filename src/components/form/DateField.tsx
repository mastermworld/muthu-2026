import React, { useRef } from "react";
import { FieldError } from "react-hook-form";
import { Calendar } from "lucide-react";

interface DateFieldProps {
  label: string;
  name: string;
  register: any;
  error?: FieldError;
  placeholder?: string;
  helperText?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function DateField({
  label,
  name,
  register,
  error,
  helperText,
  onKeyDown,
}: DateFieldProps) {
  const reg = register(name);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^0-9/]/g, "");

    const digits = v.replace(/\//g, "");
    let formatted = "";
    for (let i = 0; i < digits.length && i < 8; i++) {
      if (i === 2 || i === 4) formatted += "/";
      formatted += digits[i];
    }
    e.target.value = formatted;
    reg.onChange(e);
  };

  return (
    <div className="w-full group">
      <label htmlFor={name} className="block text-neutral-700 font-semibold mb-2 text-sm">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type="text"
          inputMode="numeric"
          maxLength={10}
          {...reg}
          ref={(el: HTMLInputElement | null) => {
            reg.ref(el);
            inputRef.current = el;
          }}
          onChange={handleChange}
          placeholder="DD/MM/YYYY"
          onKeyDown={onKeyDown}
          className={`w-full px-4 py-3 bg-white border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${
            error
              ? "border-accent-300 focus:ring-accent-200"
              : "border-neutral-300 focus:border-primary-400 focus:ring-primary-500/20"
          } placeholder:text-neutral-400 text-neutral-800 font-medium`}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Calendar className="w-5 h-5 text-neutral-500 group-hover:text-primary-500 transition-colors duration-300" />
        </div>
      </div>
      {error ? (
        <p className="text-accent-600 text-sm mt-1.5 flex items-center space-x-1 animate-slide-up">
          <span className="w-1 h-1 bg-accent-500 rounded-full"></span>
          <span>{error.message}</span>
        </p>
      ) : helperText ? (
        <p className="text-neutral-500 text-xs mt-1.5">{helperText}</p>
      ) : null}
    </div>
  );
}
