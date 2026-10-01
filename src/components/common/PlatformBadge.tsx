import React from 'react';

interface PlatformBadgeProps {
  platform: 'x' | 'telegram' | 'reddit' | 'youtube';
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({
  platform,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const getInfo = () => {
    switch (platform) {
      case 'x':
        return { label: 'X', text: 'X', style: 'bg-[#171717] text-white' };
      case 'telegram':
        return { label: 'Telegram', text: 'TG', style: 'bg-[#229ED9] text-white' };
      case 'reddit':
        return { label: 'Reddit', text: 'RD', style: 'bg-[#FF4500] text-white' };
      case 'youtube':
        return { label: 'YouTube', text: 'YT', style: 'bg-[#FF0000] text-white' };
    }
  };

  const info = getInfo();
  const badgeSize = size === 'sm' ? 'h-4 text-[9px] px-1.5' : 'h-5 text-[10px] px-2';

  return (
    <span
      className={`inline-flex items-center justify-center font-mono font-semibold rounded-xs uppercase tracking-wider ${info.style} ${badgeSize} ${className}`}
      title={info.label}
    >
      {showLabel ? info.label : info.text}
    </span>
  );
};
