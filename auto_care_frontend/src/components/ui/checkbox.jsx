import React from 'react';

export function Checkbox({ checked, onChange, label, className = '' }) {
  return (
    <label className={`flex items-center gap-2 ${className}`}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}
