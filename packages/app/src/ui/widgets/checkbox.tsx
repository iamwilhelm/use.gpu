import React, { ReactNode } from 'react';

type CheckboxProps = {
  label?: string,
  value: boolean,
  onChange: (t: boolean) => void,
};

export const Checkbox = (props: CheckboxProps) => {
  const {label, value, onChange} = props;
  const check = (
    <input
      type="checkbox"
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
  if (label != null) return <label>{check} {label}</label>;
  return check;
};
