import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineEvent, Platform, TimeRange, DataMode } from '../../types/nexus';
import { Clock, Filter, ArrowUpRight, ShieldAlert, Sparkles, Inbox } from 'lucide-react';
import { useNexus } from '../../context/NexusContext';

interface TimelineScreenProps {
  onSelectEvent: (event: TimelineEvent) => void;
}

const TIME_WINDOW_MINUTES: Record<TimeRange, number> = {
  '10m': 10,
  '1h': 60,
  '6h': 360,
  '24h': 1440,
  '7d': 10080,
};

export function filterTimelineEvents(
  events: TimelineEvent[],
  timeWindow: TimeRange,
  platform: Platform
): TimelineEvent[] {
  const maxMinutes = TIME_WINDOW_MINUTES[timeWindow];
  return events.filter((evt) => {
    if (evt.minutesAgo > maxMinutes) return false;
    if (platform !== 'ALL' && evt.platform !== platform) return false;
    return true;
  });
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({ onSelectEvent }) => {
  const { activeDataset, sourceMode } = useNexus();
  const timelineEvents = activeDataset.timelineEvents;

  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('ALL');

  // Single Source of Truth Filtering
  const visibleEvents = useMemo(() => {
    return filterTimelineEvents(timelineEvents, selectedRange, selectedPlatform);
  }, [timelineEvents, selectedRange, selectedPlatform]);

  // Derived Peak Calculation
  const peakMetric = useMemo(() => {
    if (visibleEvents.length === 0) {
      return 'PEAK: 0 EVENTS IN WINDOW';
    }
    const peakEvt = visibleEvents.reduce(
      (max, e) => (e.eventCount > max.eventCount ? e : max),
      visibleEvents[0]
    );
    return `PEAK: ${peakEvt.eventCount.toLocaleString()} EVENTS AT ${peakEvt.timestamp}`;
  }, [visibleEvents]);

  // Derived Density Strip Buckets (16 buckets)
  const densityBuckets = useMemo(() => {
    const maxWindowMins = TIME_WINDOW_MINUTES[selectedRange];
    const bucketSize = maxWindowMins / 16;

    const buckets = Array.from({ length: 16 }, (_, i) => {
      const minMinsAgo = (16 - i - 1) * bucketSize;
      const maxMinsAgo = (16 - i) * bucketSize;

      const matchingEvents = visibleEvents.filter(
        (e) => e.minutesAgo >= minMinsAgo && e.minutesAgo <= maxMinsAgo
      );

      const totalVolume = matchingEvents.reduce((sum, e) => sum + e.eventCount, 0);
      return { index: i, volume: totalVolume, count: matchingEvents.length };
    });

    const maxVolume = Math.max(...buckets.map((b) => b.volume), 1);
    const peakIndex = buckets.reduce(
      (maxIdx, b, idx, arr) => (b.volume > arr[maxIdx].volume ? idx : maxIdx),
      0
    );

    return buckets.map((b) => ({
      ...b,
      heightPercent: b.volume === 0 ? 12 : Math.max(18, Math.round((b.volume / maxVolume) * 100)),
      isPeak: b.volume > 0 && b.index === peakIndex,
    }));
  }, [visibleEvents, selectedRange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#232729] pb-4">
        <div>
          <h1 className="font-sans font-extrabold text-xl text-[#E8E3D8] tracking-wide uppercase">
            02. LIVE TIMELINE
          </h1>
          <p className="font-mono text-xs text-[#737C80] mt-0.5">
            Real-time chronological forensic event stream across monitored nodes ({activeDataset.name})
          </p>
        </div>

        {/* Source Mode Tag & Event Counter */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="bg-[#171A1C] border border-[#232729] px-3 py-1.5 rounded-xs text-[#737C80]">
            SHOWING <span className="text-[#E8E3D8] font-bold">{visibleEvents.length}</span> OF{' '}
            <span className="text-[#E8E3D8] font-bold">{timelineEvents.length}</span> EVENTS
          </div>

          <div className="bg-[#171A1C] border border-[#232729] px-3 py-1.5 rounded-xs">
            <span className="text-[#737C80]">SOURCE:</span>{' '}
            <span className="text-[#C9784A] font-bold">{sourceMode} PIPELINE</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar: Time Ranges & Platform Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-3 bg-[#171A1C] border border-[#232729] rounded-sm font-mono text-[11px]">
        {/* Time Ranges Filter */}
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

        {/* Platform Selector Filter */}
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

      {/* Derived Temporal Density Strip Visualization */}
      <div className="p-3 bg-[#171A1C] border border-[#232729] rounded-sm font-mono text-[10px]">
        <div className="flex justify-between text-[#737C80] mb-2">
          <span>
            EVENT DENSITY DYNAMICS ({selectedRange.toUpperCase()} · {selectedPlatform})
          </span>
          <span className="text-[#C9784A] font-bold">{peakMetric}</span>
        </div>
        <div className="h-6 flex items-end gap-1 bg-[#0D1012] p-1 rounded-xs border border-[#232729]">
          {densityBuckets.map((bucket) => (
            <div
              key={bucket.index}
              style={{ height: `${bucket.heightPercent}%` }}
              className={`flex-1 rounded-xs transition-all duration-300 ${
                bucket.isPeak
                  ? 'bg-[#C9784A]'
                  : bucket.volume > 0
                  ? 'bg-[#232729] hover:bg-[#5AA9A0]'
                  : 'bg-[#232729]/30'
              }`}
              title={`Bucket ${bucket.index + 1}: ${bucket.volume.toLocaleString()} events`}
            />
          ))}
        </div>
      </div>

      {/* Event Stream / Empty State */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedRange}-${selectedPlatform}-${sourceMode}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {visibleEvents.length === 0 ? (
            <div className="p-12 text-center bg-[#171A1C] border border-[#232729] rounded-sm space-y-3 font-mono">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#232729] border border-[#737C80]/30 flex items-center justify-center text-[#737C80]">
                <Inbox className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-[#E8E3D8] uppercase tracking-wide">
                NO EVENTS MATCH CURRENT FILTERS
              </div>
              <p className="text-xs text-[#737C80] max-w-md mx-auto leading-relaxed">
                Try expanding the time window (e.g. 24H or 7D) or selecting ALL platforms to view available intelligence events.
              </p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#232729]">
              {visibleEvents.map((evt, idx) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: idx * 0.03, ease: [0.22, 1, 0.36, 1] }}
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
                        <span>
                          EVENTS: <strong className="text-[#E8E3D8]">{evt.eventCount}</strong>
                        </span>
                        <span>
                          DELTAS: <strong className="text-[#C75C5C]">{evt.sentimentDelta}</strong>
                        </span>
                      </div>

                      <span className="text-[#C9784A] flex items-center gap-1 group-hover:underline">
                        INSPECT EVENT <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
