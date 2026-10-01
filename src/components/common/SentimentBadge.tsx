import React from 'react';
import { SentimentType } from '../../types/nexus';

interface SentimentBadgeProps {
  sentiment: SentimentType;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({
  sentiment,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const config = {
    positive: {
      label: 'Positive',
      color: 'text-[#2E7D32]',
      bg: 'bg-[#EEF7EF]',
      border: 'border-[#D2ECD6]',
      dot: 'bg-[#2E7D32]',
    },
    neutral: {
      label: 'Neutral',
      color: 'text-[#575757]',
      bg: 'bg-[#F0F0EA]',
      border: 'border-[#E0E0D6]',
      dot: 'bg-[#8A8A82]',
    },
    negative: {
      label: 'Negative',
      color: 'text-[#C62828]',
      bg: 'bg-[#FDF0F0]',
      border: 'border-[#F9D2D2]',
      dot: 'bg-[#C62828]',
    },
  }[sentiment];

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2 py-0.5 tracking-tight'
      : 'text-xs px-2.5 py-1 tracking-tight';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-sans font-medium rounded-full border ${config.bg} ${config.color} ${config.border} ${sizeClasses} ${className}`}
    >
      {showIcon && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      <span>{config.label}</span>
    </span>
  );
};
