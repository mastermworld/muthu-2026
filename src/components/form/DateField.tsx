import React, { useRef, useState, useEffect } from "react";
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

  const [displayValue, setDisplayValue] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 8) val = val.substring(0, 8);
    
    let formatted = val;
    if (val.length > 4) {
      formatted = `${val.substring(0, 2)}/${val.substring(2, 4)}/${val.substring(4)}`;
    } else if (val.length > 2) {
      formatted = `${val.substring(0, 2)}/${val.substring(2)}`;
    }
    setDisplayValue(formatted);
    
    let hiddenVal = "";
    if (val.length === 8) {
      const day = val.substring(0, 2);
      const month = val.substring(2, 4);
      const year = val.substring(4, 8);
      hiddenVal = `${year}-${month}-${day}`;
    }
    
    if (inputRef.current) {
      inputRef.current.value = hiddenVal;
    }
    reg.onChange({
      target: {
        name,
        value: hiddenVal
      }
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // YYYY-MM-DD
    if (val) {
      const [y, m, d] = val.split("-");
      setDisplayValue(`${d}/${m}/${y}`);
    } else {
      setDisplayValue("");
    }
    
    if (inputRef.current) {
      inputRef.current.value = val;
    }
    reg.onChange({
      target: {
        name,
        value: val
      }
    });
  };

  return (
    <div className="w-full group">
      <label htmlFor={`${name}-display`} className="block text-neutral-700 font-semibold mb-2 text-sm">
        {label}
      </label>
      <div className="relative">
        <input
          type="hidden"
          {...reg}
          ref={(el: HTMLInputElement | null) => {
            reg.ref(el);
            inputRef.current = el;
          }}
        />
        <input
          id={`${name}-display`}
          type="text"
          value={displayValue}
          onChange={handleTextChange}
          placeholder="DD/MM/YYYY"
          onKeyDown={onKeyDown}
          maxLength={10}
          className={`w-full px-4 py-3 bg-white border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${
            error
              ? "border-accent-300 focus:ring-accent-200"
              : "border-neutral-300 focus:border-primary-400 focus:ring-primary-500/20"
          } text-neutral-800 font-medium`}
        />
        <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center overflow-hidden">
          <input
            type="date"
            min={min}
            max={max ?? today}
            onChange={handleDateChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Calendar className="w-4 h-4 text-neutral-400 group-hover:text-primary-500 transition-colors duration-300 pointer-events-none" />
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
