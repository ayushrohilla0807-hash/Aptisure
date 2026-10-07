import React from 'react';

const variants = {
  primary:
    'bg-brand-600 hover:bg-brand-700 text-white shadow-stitch-sm hover:shadow active:scale-[0.98]',
  secondary:
    'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 active:scale-[0.98]',
  outline:
    'border border-slate-300 hover:bg-slate-50 text-slate-700 active:scale-[0.98]',
  danger:
    'bg-rose-500 hover:bg-rose-600 text-white shadow-stitch-sm active:scale-[0.98]',
  ghost:
    'hover:bg-slate-100 text-slate-600 hover:text-slate-900',
  icon:
    'p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 active:scale-95',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg',
  md: 'px-4 py-2 text-sm font-medium rounded-xl',
  lg: 'px-6 py-2.5 text-base font-medium rounded-xl',
  icon: 'p-2',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed ${
        variant !== 'icon' ? sizes[size] : sizes.icon
      } ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
