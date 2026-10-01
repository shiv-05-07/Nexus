import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No observed signals found',
  description = 'Try expanding your active time range or resetting applied platform filters.',
  actionLabel = 'Reset Filters',
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs ${className}`}>
      <div className="w-10 h-10 rounded-full bg-[#F0F0EA] flex items-center justify-center text-[#575757] mb-3">
        <SearchX className="w-5 h-5 stroke-[1.5]" />
      </div>
      <h3 className="font-sans font-semibold text-[#171717] text-sm mb-1">{title}</h3>
      <p className="font-sans text-xs text-[#575757] max-w-sm mb-4 leading-relaxed">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171717] text-[#FFFFFF] text-xs font-medium rounded-xs hover:bg-[#333333] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
