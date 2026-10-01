import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smile,
  Frown,
  Meh,
  Info,
  ChevronDown,
  ChevronUp,
  Layers,
  Activity
} from 'lucide-react';
import {
  EmotionItem,
  Platform,
  PlatformSentimentComparison,
  SentimentDataPoint,
  TimeFilter
} from '../types/nexus';
import { nexusApi } from '../services/api/nexusApi';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

interface SentimentPageProps {
  timeFilter: TimeFilter;
  platformFilter: Platform;
}

export const SentimentPage: React.FC<SentimentPageProps> = ({
  timeFilter,
  platformFilter,
}) => {
  const [trends, setTrends] = useState<SentimentDataPoint[]>([]);
  const [emotions, setEmotions] = useState<EmotionItem[]>([]);
  const [platformComparison, setPlatformComparison] = useState<PlatformSentimentComparison[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleSeries, setVisibleSeries] = useState<{
    positive: boolean;
    neutral: boolean;
    negative: boolean;
  }>({ positive: true, neutral: true, negative: true });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([
      nexusApi.getSentimentTrends(timeFilter),
      nexusApi.getEmotionDistribution(),
      nexusApi.getPlatformSentiment(),
    ]).then(([trendData, emotionData, platformData]) => {
      if (isMounted) {
        setTrends(trendData);
        setEmotions(emotionData);
        setPlatformComparison(platformData);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [timeFilter, platformFilter]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <SkeletonLoader type="chart" />
        <SkeletonLoader type="card" count={2} />
      </div>
    );
  }

  // SVG Chart Dimensions
  const chartWidth = 740;
  const chartHeight = 220;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Build SVG path strings for multi-series
  const getPathForSeries = (key: 'positive' | 'neutral' | 'negative') => {
    if (trends.length < 2) return '';
    const points = trends.map((d, i) => {
      const x = padding.left + (i / (trends.length - 1)) * graphWidth;
      const y = padding.top + graphHeight - (d[key] / 100) * graphHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const activeHoverPoint = hoveredIndex !== null ? trends[hoveredIndex] : null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* 1. Dominant Visualization: Sentiment Trajectory Over Time */}
      <section className="p-6 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs shadow-2xs space-y-4">
        {/* Header & Series Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-sans font-bold text-base md:text-lg text-[#171717] tracking-tight">
              Sentiment Trajectory
            </h2>
            <p className="font-sans text-xs text-[#575757]">
              Continuous percentage composition across the active time window
            </p>
          </div>

          {/* Series Checkbox Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setVisibleSeries((p) => ({ ...p, negative: !p.negative }))
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans rounded-xs border transition-colors cursor-pointer ${
                visibleSeries.negative
                  ? 'bg-[#FDF0F0] border-[#F9D2D2] text-[#C62828] font-semibold'
                  : 'bg-[#FFFFFF] border-[#E6E6DF] text-[#8A8A82]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#C62828]" />
              <span>Negative (63%)</span>
            </button>

            <button
              onClick={() =>
                setVisibleSeries((p) => ({ ...p, neutral: !p.neutral }))
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans rounded-xs border transition-colors cursor-pointer ${
                visibleSeries.neutral
                  ? 'bg-[#F1F5F9] border-[#E2E8F0] text-[#64748B] font-semibold'
                  : 'bg-[#FFFFFF] border-[#E6E6DF] text-[#8A8A82]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#64748B]" />
              <span>Neutral (21%)</span>
            </button>

            <button
              onClick={() =>
                setVisibleSeries((p) => ({ ...p, positive: !p.positive }))
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans rounded-xs border transition-colors cursor-pointer ${
                visibleSeries.positive
                  ? 'bg-[#EEF7EF] border-[#D2ECD6] text-[#2E7D32] font-semibold'
                  : 'bg-[#FFFFFF] border-[#E6E6DF] text-[#8A8A82]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
              <span>Positive (16%)</span>
            </button>
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="relative overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto max-h-72 select-none overflow-visible"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Horizontal Grid lines */}
            {[0, 25, 50, 75, 100].map((yVal) => {
              const y = padding.top + graphHeight - (yVal / 100) * graphHeight;
              return (
                <g key={yVal}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="#E6E6DF"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="font-mono text-[9px] fill-[#8A8A82]"
                  >
                    {yVal}%
                  </text>
                </g>
              );
            })}

            {/* Negative Line Path */}
            {visibleSeries.negative && (
              <path
                d={getPathForSeries('negative')}
                fill="none"
                stroke="#C62828"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Neutral Line Path */}
            {visibleSeries.neutral && (
              <path
                d={getPathForSeries('neutral')}
                fill="none"
                stroke="#64748B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Positive Line Path */}
            {visibleSeries.positive && (
              <path
                d={getPathForSeries('positive')}
                fill="none"
                stroke="#2E7D32"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Hover Points & Interactive Crosshair Zones */}
            {trends.map((d, i) => {
              const x = padding.left + (i / (trends.length - 1)) * graphWidth;
              const isHovered = hoveredIndex === i;

              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  className="cursor-pointer"
                >
                  {/* Invisible Hitbox */}
                  <rect
                    x={x - 20}
                    y={padding.top}
                    width={40}
                    height={graphHeight}
                    fill="transparent"
                  />

                  {/* Vertical Crosshair */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + graphHeight}
                      stroke="#171717"
                      strokeWidth="1.2"
                      strokeDasharray="3,3"
                    />
                  )}

                  {/* Dots for series */}
                  {isHovered && visibleSeries.negative && (
                    <circle
                      cx={x}
                      cy={padding.top + graphHeight - (d.negative / 100) * graphHeight}
                      r="4"
                      fill="#C62828"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  )}
                  {isHovered && visibleSeries.neutral && (
                    <circle
                      cx={x}
                      cy={padding.top + graphHeight - (d.neutral / 100) * graphHeight}
                      r="4"
                      fill="#64748B"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  )}
                  {isHovered && visibleSeries.positive && (
                    <circle
                      cx={x}
                      cy={padding.top + graphHeight - (d.positive / 100) * graphHeight}
                      r="4"
                      fill="#2E7D32"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* X Axis Label */}
                  <text
                    x={x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className={`font-mono text-[10px] ${
                      isHovered ? 'fill-[#171717] font-bold' : 'fill-[#8A8A82]'
                    }`}
                  >
                    {d.timeLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover Readout Tooltip Box */}
        {activeHoverPoint && (
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-[#F7F7F4] border border-[#E6E6DF] rounded-xs flex flex-wrap items-center justify-between gap-4 text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#8A8A82]">Time Interval:</span>
              <span className="font-bold text-[#171717]">{activeHoverPoint.timeLabel} UTC</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[#C62828] font-semibold">
                Negative: {activeHoverPoint.negative}%
              </span>
              <span className="text-[#64748B] font-semibold">
                Neutral: {activeHoverPoint.neutral}%
              </span>
              <span className="text-[#2E7D32] font-semibold">
                Positive: {activeHoverPoint.positive}%
              </span>
              <span className="text-[#575757]">
                Volume: {activeHoverPoint.volume.toLocaleString()} posts
              </span>
            </div>
          </motion.div>
        )}
      </section>

      {/* 2. Two-Column Supporting Section: Emotions & Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* A. Emotion Distribution */}
        <section className="p-6 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs space-y-4">
          <div>
            <h3 className="font-sans font-bold text-base text-[#171717]">
              Emotion Breakdown
            </h3>
            <p className="font-sans text-xs text-[#575757]">
              Fine-grained emotional signals detected in textual dialogue
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {emotions.map((item) => (
              <div key={item.emotion} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-semibold text-[#171717]">
                      {item.label}
                    </span>
                    <span className="font-mono text-[10px] text-[#8A8A82]">
                      ({item.volume.toLocaleString()} posts)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[#575757] text-[11px]">{item.trendDelta}</span>
                    <span className="font-bold text-[#171717]">{item.percentage}%</span>
                  </div>
                </div>

                {/* Bar */}
                <div className="h-2 w-full bg-[#F0F0EA] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${
                      item.emotion === 'anxiety'
                        ? 'bg-[#C62828]'
                        : item.emotion === 'supportive'
                        ? 'bg-[#2E7D32]'
                        : item.emotion === 'opposition'
                        ? 'bg-[#B45309]'
                        : item.emotion === 'excitement'
                        ? 'bg-[#2563EB]'
                        : 'bg-[#64748B]'
                    }`}
                  />
                </div>
                <p className="font-sans text-[11px] text-[#575757] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* B. Platform Comparison */}
        <section className="p-6 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs space-y-4">
          <div>
            <h3 className="font-sans font-bold text-base text-[#171717]">
              Platform Comparison
            </h3>
            <p className="font-sans text-xs text-[#575757]">
              Differential tone distribution across major networks
            </p>
          </div>

          <div className="space-y-5 pt-2">
            {platformComparison.map((p) => (
              <div key={p.platform} className="space-y-2 p-3 bg-[#F7F7F4] border border-[#E6E6DF] rounded-xs">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <PlatformBadge platform={p.platform} />
                    <span className="font-mono text-[11px] text-[#8A8A82]">
                      {p.totalVolume.toLocaleString()} posts
                    </span>
                  </div>
                  <div className="font-mono text-[11px] space-x-2">
                    <span className="text-[#C62828]">Neg {p.negativePct}%</span>
                    <span className="text-[#64748B]">Neu {p.neutralPct}%</span>
                    <span className="text-[#2E7D32]">Pos {p.positivePct}%</span>
                  </div>
                </div>

                {/* Stacked comparison bar */}
                <div className="h-2.5 w-full bg-[#E0E0D6] rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${p.negativePct}%` }}
                    className="bg-[#C62828]"
                  />
                  <div
                    style={{ width: `${p.neutralPct}%` }}
                    className="bg-[#64748B]"
                  />
                  <div
                    style={{ width: `${p.positivePct}%` }}
                    className="bg-[#2E7D32]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 3. Collapsible Methodology Briefing */}
      <section className="border border-[#E6E6DF] rounded-xs overflow-hidden bg-[#FFFFFF]">
        <button
          onClick={() => setIsMethodologyOpen((prev) => !prev)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#F9F9F6] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#8A8A82]" />
            <span className="font-sans text-xs font-semibold text-[#171717]">
              Classification & Sentiment Methodology
            </span>
          </div>
          {isMethodologyOpen ? (
            <ChevronUp className="w-4 h-4 text-[#8A8A82]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#8A8A82]" />
          )}
        </button>

        <AnimatePresence>
          {isMethodologyOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-5 pb-5 text-xs font-sans text-[#575757] border-t border-[#F0F0EA] pt-3 space-y-2 leading-relaxed"
            >
              <p>
                Tone classification utilizes calibrated multilingual semantic embeddings combined with contextual emotion scoring. Posts are categorized into valence bands with threshold verification.
              </p>
              <p>
                Ambiguous colloquialisms and dialect mixtures (e.g. Hinglish code-switching) undergo syntactic normalization before polarity determination.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
