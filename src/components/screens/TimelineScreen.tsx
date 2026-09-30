import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TimelineEvent, Platform, TimeRange, DataMode } from '../../types/nexus';
import { TIMELINE_EVENTS } from '../../data/mockIntelligence';
import { Clock, Filter, ArrowUpRight, ShieldAlert, Sparkles } from 'lucide-react';

interface TimelineScreenProps {
  onSelectEvent: (event: TimelineEvent) => void;
  dataMode: DataMode;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({ onSelectEvent, dataMode }) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('ALL');

  const filteredEvents = TIMELINE_EVENTS.filter((e) => {
    if (selectedPlatform === 'ALL') return true;
    return e.platform === selectedPlatform;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#232729] pb-4">
        <div>
          <h1 className="font-sans font-extrabold text-xl text-[#E8E3D8] tracking-wide uppercase">
            02. LIVE TIMELINE
          </h1>
          <p className="font-mono text-xs text-[#737C80] mt-0.5">
            Real-time chronological forensic event stream across monitored nodes
          </p>
        </div>

        {/* Source Mode Tag */}
        <div className="flex items-center gap-2 font-mono text-[11px] bg-[#171A1C] border border-[#232729] px-3 py-1.5 rounded-xs">
          <span className="text-[#737C80]">SOURCE:</span>
          <span className="text-[#C9784A] font-bold">{dataMode} PIPELINE</span>
        </div>
      </div>

      {/* Filter Toolbar: Time Ranges & Platform Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-3 bg-[#171A1C] border border-[#232729] rounded-sm font-mono text-[11px]">
        {/* Time Ranges */}
        <div className="flex items-center gap-2">
          <span className="text-[#737C80] text-[10px] uppercase tracking-wider mr-1">WINDOW:</span>
          <div className="flex items-center gap-1 bg-[#0D1012] p-1 rounded-xs border border-[#232729]">
            {(['10m', '1h', '6h', '24h', '7d'] as TimeRange[]).map((range) => {
              const isSelected = selectedRange === range;
              return (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`relative px-2.5 py-1 transition-colors duration-150 cursor-pointer ${
                    isSelected ? 'text-[#E8E3D8] font-bold' : 'text-[#737C80] hover:text-[#BDB5A6]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="timeline-timerange"
                      className="absolute inset-0 bg-[#232729] border border-[#737C80]/30 rounded-xs z-0"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{range.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Platform Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[#737C80] text-[10px] uppercase tracking-wider mr-1">PLATFORM:</span>
          <div className="flex items-center gap-1 bg-[#0D1012] p-1 rounded-xs border border-[#232729]">
            {(['ALL', 'X', 'TELEGRAM', 'YOUTUBE', 'REDDIT'] as Platform[]).map((plat) => {
              const isSelected = selectedPlatform === plat;
              return (
                <button
                  key={plat}
                  onClick={() => setSelectedPlatform(plat)}
                  className={`relative px-3 py-1 transition-colors duration-150 cursor-pointer ${
                    isSelected ? 'text-[#E8E3D8] font-bold' : 'text-[#737C80] hover:text-[#BDB5A6]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="timeline-platform"
                      className="absolute inset-0 bg-[#C9784A]/20 border border-[#C9784A]/40 rounded-xs z-0"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{plat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Temporal Density Strip Visualization */}
      <div className="p-3 bg-[#171A1C] border border-[#232729] rounded-sm font-mono text-[10px]">
        <div className="flex justify-between text-[#737C80] mb-2">
          <span>EVENT DENSITY DYNAMICS</span>
          <span>PEAK: 1,840 EVENTS/HR AT 11:40 UTC</span>
        </div>
        <div className="h-6 flex items-end gap-1 bg-[#0D1012] p-1 rounded-xs border border-[#232729]">
          {[20, 35, 45, 60, 80, 95, 70, 85, 100, 90, 75, 88, 65, 50, 40, 30].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={`flex-1 rounded-xs transition-all duration-300 ${
                i >= 8 && i <= 11 ? 'bg-[#C9784A]' : 'bg-[#232729] hover:bg-[#5AA9A0]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Vertical Timeline Event Stream with Staggered Entrance */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#232729]">
        {filteredEvents.map((evt, idx) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onSelectEvent(evt)}
            className="relative group cursor-pointer"
          >
            {/* Timeline Marker Dot */}
            <div className="absolute -left-[19px] top-3.5 w-3 h-3 rounded-full bg-[#171A1C] border-2 border-[#C9784A] group-hover:scale-125 group-hover:bg-[#C9784A] transition-all duration-200 z-10" />

            <div className="p-4 bg-[#171A1C] border border-[#232729] group-hover:border-[#C9784A]/50 rounded-xs transition-all duration-200 group-hover:translate-x-1 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="text-[#E8E3D8] font-bold">{evt.timestamp}</span>
                  <span className="text-[#737C80]">({evt.timeAgo})</span>
                  <span>·</span>
                  <span className="px-1.5 py-0.5 bg-[#232729] text-[#5AA9A0] font-semibold rounded-xs">
                    {evt.platform}
                  </span>
                  {evt.urgency === 'high' && (
                    <span className="px-1.5 py-0.5 bg-[#C75C5C]/20 border border-[#C75C5C]/40 text-[#C75C5C] font-semibold rounded-xs">
                      HIGH URGENCY
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#737C80]">{evt.community}</span>
                  <span className="text-[#C9784A] font-semibold">{evt.nodeId}</span>
                </div>
              </div>

              <h3 className="font-sans font-bold text-sm text-[#E8E3D8] group-hover:text-[#C9784A] transition-colors mb-1">
                {evt.title}
              </h3>

              <p className="font-sans text-xs text-[#BDB5A6]/80 leading-relaxed mb-3">
                {evt.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#232729] font-mono text-[10px] text-[#737C80]">
                <div className="flex items-center gap-3">
                  <span>EVENTS: <strong className="text-[#E8E3D8]">{evt.eventCount}</strong></span>
                  <span>DELTAS: <strong className="text-[#C75C5C]">{evt.sentimentDelta}</strong></span>
                </div>

                <span className="text-[#C9784A] flex items-center gap-1 group-hover:underline">
                  INSPECT EVENT <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
