import React from 'react';

const ColorPickerInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-neutral-700">{label}</label>
    <div className="flex items-center space-x-2 border border-neutral-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-primary-500">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded border-none cursor-pointer"
        style={{ backgroundColor: 'transparent' }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent focus:outline-none text-neutral-800 font-mono"
      />
    </div>
  </div>
);

export default ColorPickerInput; 