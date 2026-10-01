import React from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  Clock,
  Smile,
  TrendingUp,
  Share2,
  Sliders,
  User,
  Radio
} from 'lucide-react';
import { ScreenId } from '../../types/nexus';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  userRole?: string;
  dataProvenance?: string;
  onToggleDataProvenance?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  userRole = 'Lead Analyst',
  dataProvenance = 'DEMO DATA',
  onToggleDataProvenance,
}) => {
  const navItems: { id: ScreenId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'sentiment', label: 'Sentiment', icon: Smile },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'network', label: 'Network', icon: Share2 },
  ];

  return (
    <aside className="w-56 md:w-60 bg-[#FFFFFF] border-r border-[#E6E6DF] flex flex-col justify-between shrink-0 h-screen select-none z-20">
      {/* Brand & Subtitle */}
      <div>
        <div className="px-5 py-6 border-b border-[#F0F0EA]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#171717]" />
            <span className="font-sans font-extrabold text-base tracking-tight text-[#171717]">
              NEXUS
            </span>
          </div>
          <p className="font-sans text-[11px] text-[#575757] tracking-wider uppercase mt-1 pl-4">
            Social Intelligence
          </p>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full relative flex items-center gap-3 px-3.5 py-2.5 rounded-xs text-xs font-medium text-left transition-colors cursor-pointer group ${
                  isActive
                    ? 'text-[#171717] font-semibold'
                    : 'text-[#575757] hover:text-[#171717] hover:bg-[#F7F7F4]'
                }`}
              >
                {/* Active Indicator Motion Pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 bg-[#F0F0EA] rounded-xs -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                {/* Active Left Border Accent */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveLine"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#171717] rounded-r-xs"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <Icon
                  className={`w-4 h-4 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'text-[#171717] stroke-[2.2]' : 'text-[#8A8A82] stroke-[1.8]'
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
        {/* Data Provenance Badge */}
        <div
          onClick={onToggleDataProvenance}
          className="flex items-center justify-between px-3 py-1.5 bg-[#F7F7F4] border border-[#E6E6DF] rounded-xs cursor-pointer hover:bg-[#F0F0EA] transition-colors"
          title="Toggle data stream mode"
        >
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-[#B45309] animate-breathing-dot" />
            <span className="font-mono text-[10px] font-medium text-[#575757] tracking-wider uppercase">
              {dataProvenance}
            </span>
          </div>
          <span className="font-mono text-[9px] text-[#8A8A82]">v2.4</span>
        </div>

        {/* User Identity */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xs bg-[#FFFFFF] hover:bg-[#F7F7F4] transition-colors">
          <div className="w-6 h-6 rounded-full bg-[#171717] text-white flex items-center justify-center font-mono text-[10px] font-semibold">
            LA
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-sans text-xs font-semibold text-[#171717] truncate">
              {userRole}
            </div>
            <div className="font-sans text-[10px] text-[#8A8A82] truncate">
              AN-9042 • Sector 04
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
