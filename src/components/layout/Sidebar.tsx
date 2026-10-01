import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Clock,
  Smile,
  TrendingUp,
  Share2,
  Radio,
  X
} from 'lucide-react';
import { ScreenId, UserProfile, UserRole } from '../../types/nexus';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  userRole?: string;
  userProfile?: UserProfile;
  onRoleChange?: (role: UserRole) => void;
  dataProvenance?: string;
  onToggleDataProvenance?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  userRole = 'Lead Analyst',
  userProfile,
  onRoleChange,
  dataProvenance = 'DEMO DATA',
  onToggleDataProvenance,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: { id: ScreenId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'sentiment', label: 'Sentiment', icon: Smile },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'network', label: 'Network', icon: Share2 },
  ];

  const content = (
    <div className="flex flex-col justify-between h-full bg-[#FFFFFF] border-r border-[#E8E8E1] select-none">
      {/* Brand & Subtitle */}
      <div>
        <div className="px-6 py-6 border-b border-[#F0F0EA] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#171717]" />
              <span className="font-sans font-bold text-base tracking-tight text-[#171717]">
                NEXUS
              </span>
            </div>
            <p className="font-sans text-[10px] text-[#8A8A82] tracking-wider uppercase mt-1 pl-4 font-medium">
              Social Intelligence
            </p>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-[#575757] hover:text-[#171717] rounded-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full relative flex items-center gap-3 px-3.5 py-2.5 rounded-xs text-xs text-left transition-colors cursor-pointer group ${
                  isActive
                    ? 'text-[#171717] font-semibold'
                    : 'text-[#575757] hover:text-[#171717] hover:bg-[#F7F7F4] font-medium'
                }`}
              >
                {/* Active Indicator Motion Pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 bg-[#F0F0EA] rounded-xs -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                {/* Active Left Border Accent */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveLine"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#171717] rounded-r-xs"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}

                <Icon
                  className={`w-4 h-4 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'text-[#171717] stroke-[2.2]' : 'text-[#8A8A82] stroke-[1.75]'
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Data Provenance */}
      <div className="p-3 border-t border-[#F0F0EA] space-y-2">
        {/* Data Provenance Indicator */}
        <div
          onClick={onToggleDataProvenance}
          className="flex items-center justify-between px-3 py-1.5 bg-[#F7F7F4] hover:bg-[#F0F0EA] border border-[#E8E8E1] rounded-xs cursor-pointer transition-colors"
          title="Click to toggle data stream simulation mode"
        >
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-[#B45309] animate-calm-pulse" />
            <span className="font-mono text-[10px] text-[#575757] tracking-wider uppercase font-medium">
              {dataProvenance}
            </span>
          </div>
          <span className="font-mono text-[9px] text-[#8A8A82]">v2.4</span>
        </div>

        {/* User Identity & Role Switcher */}
        <div className="p-2 bg-[#FDFDFB] border border-[#E8E8E1] rounded-xs space-y-1.5">
          <div className="flex items-center gap-2.5 px-1 py-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-semibold shrink-0 text-white ${
              userProfile?.role === 'viewer' ? 'bg-[#575757]' : 'bg-[#171717]'
            }`}>
              {userProfile?.avatarInitials || (userRole === 'Viewer' ? 'VR' : 'LA')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-xs font-semibold text-[#171717] truncate">
                {userProfile?.roleLabel || userRole}
              </div>
              <div className="font-mono text-[10px] text-[#8A8A82] truncate">
                {userProfile ? `${userProfile.callsign} • ${userProfile.clearance}` : 'AN-9042 • SEC-04'}
              </div>
            </div>
          </div>

          {/* Operational Role Selector */}
          {onRoleChange && (
            <div className="pt-1 border-t border-[#F0F0EA]">
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="font-mono text-[9px] text-[#8A8A82] uppercase tracking-wider">
                  Access Role
                </span>
                {userProfile?.role === 'viewer' && (
                  <span className="font-mono text-[9px] text-[#B45309] font-medium">
                    Read-Only
                  </span>
                )}
              </div>
              <select
                value={userProfile?.role || 'lead_analyst'}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="w-full text-[11px] font-mono bg-[#FFFFFF] border border-[#D6D6CC] rounded-xs px-2 py-1 text-[#171717] focus:outline-none focus:border-[#171717] cursor-pointer"
                aria-label="Operational role selection"
              >
                <option value="lead_analyst">Lead Analyst (Full Access)</option>
                <option value="analyst">Analyst (Full Access)</option>
                <option value="viewer">Viewer (Read-Only)</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Rail */}
      <aside className="hidden md:flex w-56 lg:w-60 flex-col shrink-0 h-screen z-20">
        {content}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-[#171717]/25 backdrop-blur-xs z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed top-0 left-0 bottom-0 w-64 z-50 md:hidden shadow-xl"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
