import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bell, Shield, UserCheck } from 'lucide-react';
import { DataMode } from '../../types/nexus';

interface TopBarProps {
  totalEvents: number;
  dataMode: DataMode;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  onOpenCommandSearch: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  totalEvents,
  dataMode,
  unreadAlertsCount,
  onOpenAlerts,
  onOpenCommandSearch,
}) => {
  const [secondsAgo, setSecondsAgo] = useState(14);

  // Ingest timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 28 ? 4 : prev + 2));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-14 bg-[#171A1C] border-b border-[#232729] px-6 flex items-center justify-between text-xs font-mono select-none z-20 shrink-0">
      {/* Zone 1: Sub-Header Context / Status Indicators */}
      <div className="flex items-center gap-6">
        {/* Operational Indicator with subtle pulse */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-quiet-pulse absolute inline-flex h-full w-full rounded-full bg-[#5AA9A0] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5AA9A0]"></span>
          </span>
          <span className="text-[#E8E3D8] font-medium tracking-wide">
            SYSTEM: <span className="text-[#5AA9A0]">OPERATIONAL</span>
          </span>
        </div>

        <div className="h-3 w-[1px] bg-[#232729]" />

        {/* Dynamic Ingest Timer */}
        <div className="text-[#737C80] hidden sm:flex items-center gap-1.5">
          <span>LAST INGEST:</span>
          <span className="text-[#E8E3D8] tabular-nums font-semibold">
            {secondsAgo} SEC AGO
          </span>
        </div>

        <div className="h-3 w-[1px] bg-[#232729] hidden sm:block" />

        {/* Dynamic Event Counter with number interpolation */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#737C80]">EVENTS:</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={totalEvents}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="text-[#E8E3D8] font-bold tabular-nums"
            >
              {totalEvents.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="h-3 w-[1px] bg-[#232729] hidden lg:block" />

        {/* Mode Tag */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px]">
          <span className="text-[#737C80]">MODE:</span>
          <span className="text-[#C9784A] font-medium">{dataMode}</span>
        </div>
      </div>

      {/* Zone 3: Actions, Search Trigger, Notification Bell, Analyst Profile */}
      <div className="flex items-center gap-3">
        {/* Command Search Trigger */}
        <button
          onClick={onOpenCommandSearch}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0D1012] border border-[#232729] hover:border-[#737C80]/50 rounded-sm text-[#BDB5A6]/80 hover:text-[#E8E3D8] transition-all duration-150 group cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#737C80] group-hover:text-[#C9784A] transition-colors" />
          <span className="font-sans text-[11px] hidden md:inline">Search narratives, nodes...</span>
          <kbd className="font-mono text-[9px] bg-[#232729] text-[#BDB5A6] px-1.5 py-0.5 rounded-xs border border-[#737C80]/20 ml-2">
            ⌘K
          </kbd>
        </button>

        {/* Alert Bell Trigger */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 bg-[#0D1012] border border-[#232729] hover:border-[#737C80]/50 rounded-sm text-[#BDB5A6] hover:text-[#E8E3D8] transition-all cursor-pointer"
          title="Intelligence Alerts"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9784A] text-[9px] font-mono text-[#0D1012] font-bold">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        <div className="h-4 w-[1px] bg-[#232729]" />

        {/* Analyst Profile */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-6 h-6 rounded-full bg-[#232729] border border-[#5AA9A0]/40 flex items-center justify-center text-[#5AA9A0]">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-[11px] font-sans font-semibold text-[#E8E3D8] leading-none">
              AN-9042
            </div>
            <div className="text-[9px] font-mono text-[#737C80] leading-none mt-0.5">
              NTRO / CYBER-INT
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
