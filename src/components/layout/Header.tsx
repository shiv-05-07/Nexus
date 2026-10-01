import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Platform, ScreenId, TimeFilter } from '../../types/nexus';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenId;
  timeFilter: TimeFilter;
  onTimeFilterChange: (time: TimeFilter) => void;
  platformFilter: Platform;
  onPlatformFilterChange: (platform: Platform) => void;
  onManualRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  timeFilter,
  onTimeFilterChange,
  platformFilter,
  onPlatformFilterChange,
  onManualRefresh,
  isRefreshing = false,
}) => {
  const [secondsAgo, setSecondsAgo] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 60 ? 4 : prev + 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getScreenDetails = () => {
    switch (currentScreen) {
      case 'overview':
        return {
          title: 'SOCIAL INTELLIGENCE',
          subtitle: "What's happening across monitored conversations",
        };
      case 'timeline':
        return {
          title: 'TIMELINE',
          subtitle: 'Chronological view of observed social activity',
        };
      case 'sentiment':
        return {
          title: 'SENTIMENT',
          subtitle: 'How conversation tone is changing',
        };
      case 'trends':
        return {
          title: 'TREND EXPLORER',
          subtitle: 'Discover conversations gaining momentum',
        };
      case 'network':
        return {
          title: 'NETWORK INTELLIGENCE',
          subtitle: 'Explore communities, influential nodes and information flow',
        };
    }
  };

  const { title, subtitle } = getScreenDetails();
  const timeOptions: TimeFilter[] = ['10m', '1h', '6h', '24h', '7d'];
  const platformOptions: { id: Platform; label: string }[] = [
    { id: 'all', label: 'All platforms' },
    { id: 'x', label: 'X' },
    { id: 'telegram', label: 'Telegram' },
    { id: 'reddit', label: 'Reddit' },
    { id: 'youtube', label: 'YouTube' },
  ];

  return (
    <header className="px-6 py-4 bg-[#FFFFFF] border-b border-[#E6E6DF] flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10">
      {/* Title & Subtitle */}
      <div>
        <h1 className="font-sans font-bold text-sm md:text-base tracking-tight text-[#171717]">
          {title}
        </h1>
        <p className="font-sans text-xs text-[#575757] mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* Action Controls & Live Status */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Live Status Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-[#F7F7F4] border border-[#E6E6DF] rounded-full text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-breathing-dot" />
          <span className="font-semibold text-[#171717]">LIVE</span>
          <span className="text-[#8A8A82] text-[11px]">Updated {secondsAgo}s ago</span>
          {onManualRefresh && (
            <button
              onClick={() => {
                setSecondsAgo(1);
                onManualRefresh();
              }}
              title="Refresh dataset"
              className="text-[#575757] hover:text-[#171717] transition-transform active:rotate-180 cursor-pointer ml-1"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#171717]' : ''}`} />
            </button>
          )}
        </div>

        {/* Time Filter Segmented Control */}
        <div className="flex items-center p-0.5 bg-[#F0F0EA] rounded-xs border border-[#E0E0D6]">
          {timeOptions.map((t) => {
            const isSelected = timeFilter === t;
            return (
              <button
                key={t}
                onClick={() => onTimeFilterChange(t)}
                className={`relative px-2.5 py-1 text-[11px] font-mono font-medium rounded-xs transition-colors cursor-pointer ${
                  isSelected ? 'text-[#171717] font-semibold' : 'text-[#64748B] hover:text-[#171717]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="timePill"
                    className="absolute inset-0 bg-[#FFFFFF] rounded-xs shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{t}</span>
              </button>
            );
          })}
        </div>

        {/* Platform Selector Dropdown / Pills */}
        <div className="relative">
          <select
            value={platformFilter}
            aria-label="Filter by social media platform"
            onChange={(e) => onPlatformFilterChange(e.target.value as Platform)}
            className="text-xs font-sans font-medium px-3 py-1.5 bg-[#FFFFFF] border border-[#D4D4CA] rounded-xs text-[#171717] focus:outline-none focus:border-[#171717] cursor-pointer"
          >
            {platformOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
