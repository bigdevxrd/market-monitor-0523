'use client';

import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
    
    const variantStyles = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300',
      secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 disabled:bg-secondary-300',
      outline: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 disabled:bg-neutral-50',
      ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 disabled:bg-transparent',
      link: 'bg-transparent text-primary-600 hover:underline disabled:text-neutral-400 p-0',
    };
    
    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    };
    
    const widthStyles = isFullWidth ? 'w-full' : '';
    
    return (
      <button
        ref={ref}
        className={twMerge(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          widthStyles,
          isLoading && 'cursor-wait opacity-70',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
