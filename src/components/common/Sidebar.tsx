import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Clock, 
  Smile, 
  TrendingUp, 
  Users, 
  Share2, 
  Search, 
  ShieldAlert, 
  FileCheck,
  Database,
  Cpu,
  FileText
} from 'lucide-react';
import { DataMode, ScreenId } from '../../types/nexus';
import { useNexus } from '../../context/NexusContext';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

const NAV_ITEMS: { id: ScreenId; num: string; label: string; icon: React.ElementType }[] = [
  { id: 'overview', num: '01', label: 'OVERVIEW', icon: Activity },
  { id: 'timeline', num: '02', label: 'TIMELINE', icon: Clock },
  { id: 'sentiment', num: '03', label: 'SENTIMENT', icon: Smile },
  { id: 'trends', num: '04', label: 'TRENDS', icon: TrendingUp },
  { id: 'audience', num: '05', label: 'AUDIENCE', icon: Users },
  { id: 'network', num: '06', label: 'NETWORK', icon: Share2 },
  { id: 'investigate', num: '07', label: 'INVESTIGATE', icon: Search },
  { id: 'coordination', num: '08', label: 'COORDINATION', icon: ShieldAlert },
  { id: 'integrity', num: '09', label: 'INTEGRITY', icon: FileCheck },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate }) => {
  const { sourceMode, setSourceMode, permissions } = useNexus();

  return (
    <aside className="w-64 h-screen bg-[#171A1C] border-r border-[#232729] flex flex-col justify-between select-none shrink-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#232729]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#232729] border border-[#737C80]/30 rounded-sm flex items-center justify-center relative">
              <div className="w-2 h-2 bg-[#C9784A] rounded-full" />
              <div className="absolute inset-0 border border-[#C9784A]/30 rounded-sm scale-110" />
            </div>
            <div>
              <h1 className="font-sans font-extrabold text-base tracking-wider text-[#E8E3D8]">
                NEXUS
              </h1>
              <p className="font-mono text-[10px] tracking-widest text-[#737C80] uppercase">
                Narrative Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Rail */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 font-mono text-[10px] tracking-widest text-[#737C80] uppercase">
            Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = currentScreen === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full relative flex items-center gap-3 px-3 py-2.5 rounded-sm font-mono text-xs text-left transition-colors duration-150 group ${
                  isActive ? 'text-[#E8E3D8] font-semibold' : 'text-[#BDB5A6]/70 hover:text-[#E8E3D8] hover:bg-[#232729]/40'
                }`}
              >
                {/* Active Indicator Moving Bar */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#C9784A] rounded-r-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <span className={`text-[11px] font-mono transition-transform duration-150 group-hover:translate-x-0.5 ${isActive ? 'text-[#C9784A]' : 'text-[#737C80]'}`}>
                  {item.num}
                </span>

                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C9784A]' : 'text-[#737C80] group-hover:text-[#BDB5A6]'}`} />

                <span className="tracking-wide text-[11px] font-sans transition-transform duration-150 group-hover:translate-x-0.5">
                  {item.label}
                </span>

                {item.id === 'investigate' && (
                  <span className="ml-auto text-[9px] font-mono px-1 py-0.5 bg-[#C9784A]/15 text-[#C9784A] border border-[#C9784A]/30 rounded-xs">
                    CORE
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Status Section */}
        <div className="px-3 py-3 mt-2 border-t border-[#232729]">
          <div className="px-3 py-1 font-mono text-[10px] tracking-widest text-[#737C80] uppercase flex justify-between">
            <span>System</span>
            {permissions.canAccessAdminPanel && <span className="text-[#C9784A]">ADMIN</span>}
          </div>
          <div className="space-y-1 mt-1 text-xs text-[#BDB5A6]/80 font-mono text-[11px]">
            <div className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#232729]/30 rounded-sm transition-colors">
              <Database className="w-3.5 h-3.5 text-[#5AA9A0]" />
              <span className="font-sans text-[11px]">Data Ingest Pipeline</span>
              <span className="ml-auto text-[10px] text-[#5AA9A0]">OK</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#232729]/30 rounded-sm transition-colors">
              <Cpu className="w-3.5 h-3.5 text-[#5AA9A0]" />
              <span className="font-sans text-[11px]">ML Models (v3.4)</span>
              <span className="ml-auto text-[10px] text-[#5AA9A0]">READY</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-[#232729]/30 rounded-sm transition-colors">
              <FileText className="w-3.5 h-3.5 text-[#737C80]" />
              <span className="font-sans text-[11px]">Audit Ledger Log</span>
              <span className="ml-auto text-[10px] text-[#737C80]">SYNC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Source Mode Selector at Bottom */}
      <div className="p-3 border-t border-[#232729] bg-[#0D1012]/60">
        <div className="text-[10px] font-mono tracking-widest text-[#737C80] uppercase mb-2 px-1 flex justify-between">
          <span>SOURCE MODE</span>
          <span className="text-[#C9784A] font-bold">{sourceMode}</span>
        </div>
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#232729] rounded-sm relative">
          {(['LIVE', 'ARCHIVE', 'SYNTHETIC'] as DataMode[]).map((mode) => {
            const isSelected = sourceMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setSourceMode(mode)}
                className={`relative py-1 text-[10px] font-mono tracking-wider transition-colors z-10 cursor-pointer ${
                  isSelected ? 'text-[#E8E3D8] font-bold' : 'text-[#737C80] hover:text-[#BDB5A6]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="mode-selected-bg"
                    className="absolute inset-0 bg-[#0D1012] border border-[#C9784A]/40 rounded-xs z-[-1]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {mode}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
