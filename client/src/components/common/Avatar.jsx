import React from 'react';
import { getInitials } from '../../utils/helpers';

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const badgeSizeClasses = {
  sm: 'w-2.5 h-2.5 ring-1.5',
  md: 'w-3 h-3 ring-2',
  lg: 'w-3.5 h-3.5 ring-2',
  xl: 'w-4 h-4 ring-2',
};

export const Avatar = ({
  src,
  alt = 'User Avatar',
  name = '',
  size = 'md',
  isOnline = false,
  showStatus = false,
  className = '',
}) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className={`relative inline-block select-none flex-shrink-0 ${className}`}>
      {src && !imgError ? (
        <img
          src={src}
          alt={alt || name}
          onError={() => setImgError(true)}
          className={`${sizeClasses[size]} rounded-full object-cover bg-slate-100 ring-1 ring-slate-200/80 shadow-stitch-sm`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-brand-600 to-indigo-400 text-white font-semibold flex items-center justify-center shadow-stitch-sm ring-1 ring-slate-200/80`}
        >
          {getInitials(name || alt)}
        </div>
      )}

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-white ${badgeSizeClasses[size]} ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          }`}
          title={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};
