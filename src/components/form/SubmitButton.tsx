import React from "react";
import { Send, Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isValid: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function SubmitButton({ isSubmitting, isValid, className, children }: SubmitButtonProps) {
  const disabled = isSubmitting;

  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full flex items-center justify-center font-bold text-white rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-300/50 ${className} ${
        disabled
          ? "bg-neutral-400 cursor-not-allowed"
          : "bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-xl"
      }`}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span>Submitting...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
} 