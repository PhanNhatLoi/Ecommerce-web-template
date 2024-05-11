import React from 'react';

export function Checkbox({ isSelected, onChange, children }) {
  return (
    <>
      <label className="checkbox checkbox-lg checkbox-single d-inline-flex">
        <input type="checkbox" checked={isSelected} onChange={onChange} />
        <span className="mr-2" /> {children}
      </label>
    </>
  );
}
