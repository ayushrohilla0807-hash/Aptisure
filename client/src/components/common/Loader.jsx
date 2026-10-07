import React from 'react';

export const Loader = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeMap[size]} border-slate-200 border-t-brand-600 rounded-full animate-spin`}
      />
    </div>
  );
};

export const MessageSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4 p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200" />
        <div className="w-1/2 h-12 rounded-2xl bg-slate-200" />
      </div>
      <div className="flex items-end justify-end gap-3">
        <div className="w-2/5 h-10 rounded-2xl bg-brand-100" />
      </div>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200" />
        <div className="w-3/5 h-16 rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
};
