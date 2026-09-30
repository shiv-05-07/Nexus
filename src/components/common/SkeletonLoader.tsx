import React from 'react';

export const SkeletonLoader: React.FC<{ type?: 'card' | 'chart' | 'list' | 'graph' }> = ({
  type = 'card',
}) => {
  if (type === 'chart') {
    return (
      <div className="w-full h-64 p-4 bg-[#171A1C] border border-[#232729] rounded-sm animate-pulse space-y-4">
        <div className="h-4 bg-[#232729] rounded-xs w-1/4" />
        <div className="h-44 bg-[#232729]/60 rounded-xs flex items-end gap-2 p-2">
          <div className="h-1/2 w-full bg-[#232729]" />
          <div className="h-3/4 w-full bg-[#232729]" />
          <div className="h-2/3 w-full bg-[#232729]" />
          <div className="h-full w-full bg-[#232729]" />
          <div className="h-4/5 w-full bg-[#232729]" />
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-2 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-3 bg-[#171A1C] border border-[#232729] rounded-xs flex gap-3">
            <div className="w-8 h-8 bg-[#232729] rounded-xs shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-[#232729] rounded-xs w-1/3" />
              <div className="h-2 bg-[#232729]/60 rounded-xs w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#171A1C] border border-[#232729] rounded-sm animate-pulse space-y-3">
      <div className="h-3 bg-[#232729] rounded-xs w-1/3" />
      <div className="h-6 bg-[#232729] rounded-xs w-1/2" />
      <div className="h-2 bg-[#232729]/60 rounded-xs w-3/4" />
    </div>
  );
};
