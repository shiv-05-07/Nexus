import React from 'react';

interface SkeletonLoaderProps {
  type?: 'metric' | 'card' | 'chart' | 'timeline' | 'table';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 1,
  className = '',
}) => {
  const items = Array.from({ length: count });

  if (type === 'metric') {
    return (
      <div className={`flex gap-6 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="flex-1 space-y-2 animate-pulse">
            <div className="h-8 w-24 bg-[#EAEAE2] rounded-xs" />
            <div className="h-4 w-16 bg-[#F0F0EA] rounded-xs" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`w-full h-64 bg-[#F0F0EA] rounded-xs animate-pulse p-6 flex flex-col justify-end space-y-4 ${className}`}>
        <div className="h-4 w-36 bg-[#E0E0D6] rounded-xs" />
        <div className="h-full w-full bg-[#EAEAE2] rounded-xs opacity-60" />
      </div>
    );
  }

  if (type === 'timeline') {
    return (
      <div className={`space-y-6 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-16 h-4 bg-[#EAEAE2] rounded-xs" />
            <div className="flex-1 space-y-2 pb-6 border-b border-[#E6E6DF]">
              <div className="h-4 w-1/4 bg-[#EAEAE2] rounded-xs" />
              <div className="h-12 w-full bg-[#F0F0EA] rounded-xs" />
              <div className="h-3 w-1/3 bg-[#F0F0EA] rounded-xs" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="p-4 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs animate-pulse space-y-3">
          <div className="h-5 w-1/3 bg-[#EAEAE2] rounded-xs" />
          <div className="h-4 w-full bg-[#F0F0EA] rounded-xs" />
          <div className="h-4 w-2/3 bg-[#F0F0EA] rounded-xs" />
        </div>
      ))}
    </div>
  );
};
