import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TimeRange } from '../../types/nexus';
import { MetricStrip } from '../common/MetricStrip';
import { useNexus } from '../../context/NexusContext';
import { OVERVIEW_SNAPSHOTS } from '../../data/mockIntelligence';
import { Radio, AlertCircle } from 'lucide-react';

interface OverviewScreenProps {
  onSelectTopic: (topicId: string) => void;
  onNavigateToScreen: (screen: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onSelectTopic,
  onNavigateToScreen,
}) => {
  const { activeDataset, sourceMode } = useNexus();
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');

  // Retrieve deterministic snapshot for current sourceMode and timeRange
  const snapshot =
    OVERVIEW_SNAPSHOTS[sourceMode]?.[timeRange] || {
      metrics: activeDataset.metrics,
      narratives: activeDataset.narratives,
      alerts: activeDataset.alerts,
      sentimentSeries: activeDataset.sentimentSeries,
    };

  const narratives = snapshot.narratives;
  const alerts = snapshot.alerts;
  const metrics = snapshot.metrics;
  const sentimentSeries = snapshot.sentimentSeries;

  return (
    <div className="space-y-6">
      {/* Live Demonstration Pipeline Disclaimer Banner */}
      {sourceMode === 'LIVE' && (
        <div className="p-3 bg-[#171A1C] border border-[#C9784A]/40 rounded-xs font-mono text-xs flex items-center justify-between text-[#C9784A]">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 animate-quiet-pulse" />
            <span className="font-bold">LIVE DEMONSTRATION PIPELINE</span>
            <span className="text-[#737C80] hidden md:inline">
              — Simulated connection to X, Telegram, YouTube & Reddit streams
            </span>
          </div>
          <span className="text-[10px] bg-[#C9784A]/20 px-2 py-0.5 rounded-xs">
            SIMULATED FEED
          </span>
        </div>
      )}

      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232729] pb-4">
        <div>
          <div className="font-mono text-[10px] text-[#C9784A] uppercase tracking-wider mb-0.5">
            DATASET: {activeDataset.name}
          </div>
          <h1 className="font-sans font-extrabold text-xl text-[#E8E3D8] tracking-wide uppercase flex items-center gap-2">
            INTELLIGENCE OVERVIEW
          </h1>
          <p className="font-mono text-xs text-[#737C80] mt-0.5">
            Cross-platform narrative activity across selected monitoring window
          </p>
        </div>

        {/* Sliding Active Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-[#171A1C] border border-[#232729] rounded-xs self-start sm:self-auto font-mono text-[11px]">
          {(['10m', '1h', '6h', '24h', '7d'] as TimeRange[]).map((range) => {
            const isSelected = timeRange === range;
            return (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`relative px-3 py-1 font-mono transition-colors duration-150 cursor-pointer ${
                  isSelected ? 'text-[#E8E3D8] font-bold' : 'text-[#737C80] hover:text-[#BDB5A6]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="overview-timerange-bg"
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

      {/* Metric Strip */}
      <MetricStrip
        metrics={metrics}
        onMetricClick={(key) => {
          if (key === 'alerts') onNavigateToScreen('coordination');
          if (key === 'topics') onNavigateToScreen('trends');
        }}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Emerging Narratives List (~65% / 8 cols) */}
        <div className="lg:col-span-8 bg-[#171A1C] border border-[#232729] rounded-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#232729] pb-3">
            <div>
              <h2 className="font-sans font-bold text-sm text-[#E8E3D8] uppercase tracking-wide">
                01. EMERGING NARRATIVES
              </h2>
              <p className="font-mono text-[10px] text-[#737C80]">
                RANKED BY ACCELERATION & CROSS-PLATFORM PROPAGATION
              </p>
            </div>
            <button
              onClick={() => onNavigateToScreen('trends')}
              className="font-mono text-[10px] text-[#C9784A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>TREND MATRIX →</span>
            </button>
          </div>

          <div className="space-y-3">
            {narratives.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                onClick={() => onSelectTopic(item.id)}
                className="p-4 bg-[#0D1012] border border-[#232729] hover:border-[#C9784A]/50 rounded-xs transition-all duration-200 cursor-pointer group relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#C9784A] font-bold">
                      {item.rank}
                    </span>
                    <h3 className="font-sans font-extrabold text-sm text-[#E8E3D8] group-hover:text-[#C9784A] transition-colors">
                      {item.topic}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-[#737C80]">SCORE:</span>
                    <span className="text-[#E8E3D8] font-bold">{item.trendScore}</span>
                    <span className="text-[#5AA9A0] font-bold bg-[#5AA9A0]/10 px-1.5 py-0.5 rounded-xs border border-[#5AA9A0]/30">
                      {item.acceleration}
                    </span>
                  </div>
                </div>

                <p className="font-sans text-xs text-[#BDB5A6]/80 leading-relaxed mb-3">
                  {item.summary}
                </p>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#232729]/60 font-mono text-[10px] text-[#737C80]">
                  <div className="flex items-center gap-2">
                    <span>{item.volume}</span>
                    <span>·</span>
                    <span className="text-[#C75C5C] font-semibold">
                      {item.sentiment.negative}% Negative
                    </span>
                    <span>·</span>
                    <span className="text-[#E8E3D8]">{item.primaryCommunity}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#5AA9A0]">{item.platforms.join(' / ')}</span>
                    <span className="text-[#C9784A] font-semibold group-hover:translate-x-1 transition-transform">
                      INVESTIGATE →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Signals & Temporal Sentiment (~35% / 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Signals Panel */}
          <div className="bg-[#171A1C] border border-[#232729] rounded-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#232729] pb-3">
              <h2 className="font-sans font-bold text-sm text-[#E8E3D8] uppercase tracking-wide">
                ACTIVE SIGNALS ({alerts.length})
              </h2>
              <span className="font-mono text-[10px] text-[#5AA9A0]">LIVE FEED</span>
            </div>

            <div className="space-y-2.5">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => alert.topicId && onSelectTopic(alert.topicId)}
                  className="p-3 bg-[#0D1012] border border-[#232729] hover:border-[#737C80]/40 rounded-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#737C80] mb-1">
                    <span className="text-[#C9784A] font-semibold">{alert.title}</span>
                    <span>{alert.time}</span>
                  </div>
                  <p className="font-mono text-[11px] text-[#E8E3D8]/90">
                    {alert.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Temporal Sentiment Field */}
          <div className="bg-[#171A1C] border border-[#232729] rounded-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#232729] pb-3">
              <h2 className="font-sans font-bold text-sm text-[#E8E3D8] uppercase tracking-wide">
                SENTIMENT FIELD
              </h2>
              <span className="font-mono text-[10px] text-[#C75C5C]">NEGATIVE SURGE</span>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              {sentimentSeries.map((pt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-10 text-[#737C80] text-[10px]">{pt.time}</span>
                  <div className="flex-1 h-2 bg-[#232729] rounded-xs overflow-hidden flex">
                    <div style={{ width: `${pt.negative}%` }} className="bg-[#C75C5C]" />
                    <div style={{ width: `${pt.neutral}%` }} className="bg-[#737C80]" />
                    <div style={{ width: `${pt.positive}%` }} className="bg-[#5AA9A0]" />
                  </div>
                  <span className="w-8 text-right text-[10px] text-[#C75C5C] font-semibold">
                    {pt.negative}%
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateToScreen('sentiment')}
              className="w-full py-2 bg-[#232729] hover:bg-[#232729]/80 text-[#E8E3D8] font-mono text-[10px] rounded-xs tracking-wider transition-colors cursor-pointer"
            >
              OPEN SENTIMENT DEEP-DIVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
