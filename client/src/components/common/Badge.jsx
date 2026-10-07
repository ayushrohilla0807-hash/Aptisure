import React from 'react';

export const Badge = ({
  count = 0,
  variant = 'brand',
  children,
  className = '',
}) => {
  if (count === 0 && !children) return null;

  const variants = {
    brand: 'bg-brand-600 text-white',
    neutral: 'bg-slate-200 text-slate-700',
    success: 'bg-emerald-500 text-white',
    danger: 'bg-rose-500 text-white',
  };

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full shadow-stitch-sm ${variants[variant]} ${className}`}
    >
      {count > 99 ? '99+' : count || children}
    </span>
  );
};
