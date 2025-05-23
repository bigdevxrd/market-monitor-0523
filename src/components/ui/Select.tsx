'use client';

import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-neutral-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={twMerge(
            'block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-error-500">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-neutral-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
