import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bell, Shield, UserCheck, ChevronDown, LogOut, Check, Cpu } from 'lucide-react';
import { useNexus } from '../../context/NexusContext';
import { UserRole } from '../../types/nexus';

interface TopBarProps {
  totalEvents: number;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  onOpenCommandSearch: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  totalEvents,
  unreadAlertsCount,
  onOpenAlerts,
  onOpenCommandSearch,
}) => {
  const { sourceMode, currentUser, setCurrentUserRole, permissions, signOut } = useNexus();
  const [secondsAgo, setSecondsAgo] = useState(14);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Ingest timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 28 ? 4 : prev + 2));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Close profile popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

        {/* Dynamic Event Counter */}
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

        {/* Source Mode Tag */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px]">
          <span className="text-[#737C80]">MODE:</span>
          <span className="text-[#C9784A] font-bold">
            {sourceMode === 'LIVE' ? 'LIVE DEMO (SIMULATED)' : sourceMode}
          </span>
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

        {/* Interactive Analyst Profile Badge & Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 pl-1 p-1 rounded-sm hover:bg-[#232729] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#232729] border border-[#5AA9A0]/40 flex items-center justify-center text-[#5AA9A0] font-mono text-[10px] font-bold">
              {currentUser.avatarInitials}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-[11px] font-sans font-semibold text-[#E8E3D8] leading-none">
                {currentUser.id}
              </div>
              <div className="text-[9px] font-mono text-[#737C80] leading-none mt-0.5">
                {currentUser.department}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-[#737C80]" />
          </button>

          {/* Profile Popover */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-10 w-72 bg-[#171A1C] border border-[#232729] rounded-sm shadow-2xl p-4 z-50 text-xs font-mono space-y-3"
              >
                {/* Header User Info */}
                <div className="border-b border-[#232729] pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#C9784A] font-bold">{currentUser.id}</span>
                    <span className="text-[9px] bg-[#5AA9A0]/10 text-[#5AA9A0] border border-[#5AA9A0]/30 px-1.5 py-0.5 rounded-xs font-bold">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="font-sans font-bold text-sm text-[#E8E3D8] mt-1">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-[#737C80] mt-0.5">
                    {currentUser.department}
                  </div>
                </div>

                {/* Session & Source Info */}
                <div className="space-y-1.5 p-2 bg-[#0D1012] border border-[#232729] rounded-xs text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-[#737C80]">SESSION:</span>
                    <span className="text-[#E8E3D8]">DEMONSTRATION SESSION</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737C80]">SOURCE MODE:</span>
                    <span className="text-[#C9784A] font-bold">{sourceMode}</span>
                  </div>
                </div>

                {/* Switch Identity Section */}
                <div className="space-y-1 pt-1">
                  <div className="text-[9px] text-[#737C80] uppercase tracking-wider mb-1">
                    SWITCH DEMO IDENTITY
                  </div>

                  {(['ANALYST', 'AUDITOR', 'VIEWER', 'ADMINISTRATOR'] as UserRole[]).map((r) => {
                    const isSelected = currentUser.role === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          setCurrentUserRole(r);
                          setIsProfileOpen(false);
                        }}
                        className={`w-full p-2 rounded-xs flex items-center justify-between text-left transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#232729] text-[#E8E3D8]' : 'text-[#737C80] hover:text-[#E8E3D8] hover:bg-[#232729]/50'
                        }`}
                      >
                        <div>
                          <div className="text-[11px] font-bold">{r}</div>
                          <div className="text-[9px] text-[#737C80]">
                            {r === 'ANALYST' && 'Full Narrative Analyst'}
                            {r === 'AUDITOR' && 'Evidence Auditor'}
                            {r === 'VIEWER' && 'Read-Only Viewer'}
                            {r === 'ADMINISTRATOR' && 'System Administrator'}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#5AA9A0]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Sign Out */}
                <div className="pt-2 border-t border-[#232729]">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      signOut();
                    }}
                    className="w-full py-1.5 px-3 bg-[#232729] hover:bg-[#C75C5C]/20 hover:text-[#C75C5C] text-[#737C80] rounded-xs font-mono text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>EXIT DEMO SESSION</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
