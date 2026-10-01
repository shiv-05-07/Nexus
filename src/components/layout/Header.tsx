import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Platform, ScreenId, TimeFilter } from '../../types/nexus';
import { RefreshCw, Menu } from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenId;
  timeFilter: TimeFilter;
  onTimeFilterChange: (time: TimeFilter) => void;
  platformFilter: Platform;
  onPlatformFilterChange: (platform: Platform) => void;
  onManualRefresh?: () => void;
  isRefreshing?: boolean;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  timeFilter,
  onTimeFilterChange,
  platformFilter,
  onPlatformFilterChange,
  onManualRefresh,
  isRefreshing = false,
  onOpenMobileMenu,
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
          title: 'OVERVIEW BRIEFING',
          subtitle: "What is happening right now across monitored conversations",
        };
      case 'timeline':
        return {
          title: 'CHRONOLOGICAL STREAM',
          subtitle: 'What happened and when across observed sources',
        };
      case 'sentiment':
        return {
          title: 'SENTIMENT DYNAMICS',
          subtitle: 'How conversation tone is changing over time',
        };
      case 'trends':
        return {
          title: 'TREND MOMENTUM',
          subtitle: 'What topics are emerging, accelerating or establishing baseline',
        };
      case 'network':
        return {
          title: 'NETWORK TOPOLOGY',
          subtitle: 'Who is influencing communities and how information spreads',
        };
    }
  };

  const { title, subtitle } = getScreenDetails();
  const timeOptions: TimeFilter[] = ['10m', '1h', '6h', '24h', '7d', '30d'];
  const platformOptions: { id: Platform; label: string }[] = [
    { id: 'all', label: 'All platforms' },
    { id: 'x', label: 'X' },
    { id: 'telegram', label: 'Telegram' },
    { id: 'reddit', label: 'Reddit' },
    { id: 'youtube', label: 'YouTube' },
  ];

  return (
    <header className="px-5 md:px-8 py-4 bg-[#FFFFFF]/90 backdrop-blur-xs border-b border-[#E8E8E1] flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-10 transition-colors">
      {/* Title & Subtitle with Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 -ml-1.5 text-[#575757] hover:text-[#171717] rounded-xs cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <div>
          <h1 className="font-sans font-bold text-sm md:text-base tracking-tight text-[#171717]">
            {title}
          </h1>
          <p className="font-sans text-xs text-[#575757] mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Action Controls & Live Status */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Calm Live Status Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-[#F7F7F4] border border-[#E8E8E1] rounded-xs text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-calm-pulse" />
          <span className="font-semibold text-[#171717] text-[11px]">LIVE</span>
          <span className="text-[#8A8A82] text-[10px] hidden sm:inline">Updated {secondsAgo}s ago</span>
          {onManualRefresh && (
            <button
              onClick={() => {
                setSecondsAgo(1);
                onManualRefresh();
              }}
              title="Refresh intelligence snapshot"
              className="text-[#8A8A82] hover:text-[#171717] transition-transform active:rotate-180 cursor-pointer ml-0.5"
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
                className={`relative px-2 sm:px-2.5 py-1 text-[11px] font-mono transition-colors cursor-pointer ${
                  isSelected ? 'text-[#171717] font-semibold' : 'text-[#64748B] hover:text-[#171717] font-medium'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="timePill"
                    className="absolute inset-0 bg-[#FFFFFF] rounded-xs shadow-2xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{t}</span>
              </button>
            );
          })}
        </div>

        {/* Platform Selector Dropdown */}
        <div className="relative">
          <select
            value={platformFilter}
            aria-label="Filter by social media platform"
            onChange={(e) => onPlatformFilterChange(e.target.value as Platform)}
            className="text-xs font-sans font-medium px-2.5 py-1.5 bg-[#FFFFFF] border border-[#D6D6CC] rounded-xs text-[#171717] focus:outline-none focus:border-[#171717] cursor-pointer"
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
