import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import {
  EmotionItem,
  Platform,
  PlatformSentimentComparison,
  SentimentDataPoint,
  TimeFilter
} from '../types/nexus';
import { nexusApi, SentimentComposition } from '../services/api/nexusApi';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { SentimentDonut } from '../components/common/SentimentDonut';

interface SentimentPageProps {
  timeFilter: TimeFilter;
  platformFilter: Platform;
}

export const SentimentPage: React.FC<SentimentPageProps> = ({
  timeFilter,
  platformFilter,
}) => {
  const [composition, setComposition] = useState<SentimentComposition | null>(null);
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
      nexusApi.getSentimentComposition(timeFilter),
      nexusApi.getSentimentTrends(timeFilter),
      nexusApi.getEmotionDistribution(),
      nexusApi.getPlatformSentiment(),
    ]).then(([compData, trendData, emotionData, platformData]) => {
      if (isMounted) {
        setComposition(compData);
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
      <div className="space-y-10 max-w-5xl mx-auto">
        <SkeletonLoader type="chart" />
        <SkeletonLoader type="card" count={2} />
      </div>
    );
  }

  // SVG Chart Dimensions
  const chartWidth = 740;
  const chartHeight = 240;
  const padding = { top: 25, right: 25, bottom: 35, left: 40 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Build smooth SVG path strings
  const getPathForSeries = (key: 'positive' | 'neutral' | 'negative') => {
    if (trends.length < 2) return '';
    const points = trends.map((d, i) => {
      const x = padding.left + (i / (trends.length - 1)) * graphWidth;
      const y = padding.top + graphHeight - (d[key] / 100) * graphHeight;
      return { x, y };
    });

    return points.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
      const prev = arr[idx - 1];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      return `${acc} C ${cpX1.toFixed(1)},${prev.y.toFixed(1)} ${cpX2.toFixed(1)},${curr.y.toFixed(1)} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
    }, '');
  };

  const activeHoverPoint = hoveredIndex !== null ? trends[hoveredIndex] : null;

  return (
    <div className="space-y-12 pb-16 max-w-5xl mx-auto">
      {/* 1. PRIMARY ELEMENT: Current Sentiment Composition (Clean donut visualization) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E8E8E1] pb-3">
          <div>
            <h2 className="font-sans font-bold text-lg md:text-xl text-[#171717] tracking-tight">
              Sentiment Composition
            </h2>
            <p className="font-sans text-xs text-[#575757] mt-0.5">
              Current breakdown of conversation sentiment across monitored channels
            </p>
          </div>
          <span className="font-mono text-[11px] text-[#8A8A82]">
            Horizon: {timeFilter.toUpperCase()} • {composition ? `${composition.totalAnalyzed.toLocaleString()} posts analyzed` : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-2">
          {/* Donut Chart with Restrained Compact Legend */}
          <div className="md:col-span-7 flex justify-start">
            {composition && (
              <SentimentDonut
                data={{
                  positive: composition.positive,
                  neutral: composition.neutral,
                  negative: composition.negative,
                }}
                totalCount={composition.totalAnalyzed}
                size={160}
                strokeWidth={17}
                centerSubtitle="analyzed posts"
              />
            )}
          </div>

          {/* Qualitative Context & Dominance Insights */}
          <div className="md:col-span-5 space-y-3 border-l-0 md:border-l border-[#E8E8E1] md:pl-8">
            <div>
              <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-wider block">
                Dominant Polarity
              </span>
              <span className="font-sans font-bold text-base text-[#C62828] capitalize">
                {composition?.dominantSentiment} Skew ({composition?.negative}%)
              </span>
            </div>
            <p className="font-sans text-xs text-[#575757] leading-relaxed">
              {composition?.description}
            </p>
            <div className="flex items-center gap-4 pt-1 font-mono text-[11px] text-[#8A8A82]">
              <span>Coverage: 4 Platforms</span>
              <span>•</span>
              <span>Confidence: 94.2%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LONGITUDINAL TRAJECTORY: Sentiment Change Over Time (Separate time-series visualization) */}
      <section className="space-y-6 pt-4 border-t border-[#E8E8E1]">
        {/* Section Header & Interactive Filter Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#E8E8E1] pb-3">
          <div>
            <h2 className="font-sans font-bold text-lg md:text-xl text-[#171717] tracking-tight">
              Sentiment Trajectory
            </h2>
            <p className="font-sans text-xs text-[#575757] mt-0.5">
              Continuous longitudinal composition across the active time window
            </p>
          </div>

          {/* Series Checkbox Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setVisibleSeries((p) => ({ ...p, negative: !p.negative }))
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans rounded-xs transition-colors cursor-pointer ${
                visibleSeries.negative
                  ? 'bg-[#FDF0F0] text-[#C62828] font-semibold'
                  : 'text-[#8A8A82] hover:text-[#171717]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#C62828]" />
              <span>Negative ({composition ? `${composition.negative}%` : '63%'})</span>
            </button>

            <button
              onClick={() =>
                setVisibleSeries((p) => ({ ...p, neutral: !p.neutral }))
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans rounded-xs transition-colors cursor-pointer ${
                visibleSeries.neutral
                  ? 'bg-[#F1F5F9] text-[#64748B] font-semibold'
                  : 'text-[#8A8A82] hover:text-[#171717]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#64748B]" />
              <span>Neutral ({composition ? `${composition.neutral}%` : '21%'})</span>
            </button>

            <button
              onClick={() =>
                setVisibleSeries((p) => ({ ...p, positive: !p.positive }))
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans rounded-xs transition-colors cursor-pointer ${
                visibleSeries.positive
                  ? 'bg-[#EEF7EF] text-[#2E7D32] font-semibold'
                  : 'text-[#8A8A82] hover:text-[#171717]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
              <span>Positive ({composition ? `${composition.positive}%` : '16%'})</span>
            </button>
          </div>
        </div>

        {/* Analytical Smooth Curve Chart Canvas */}
        <div className="relative pt-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto select-none overflow-visible"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Horizontal Grid guidelines */}
            {[0, 25, 50, 75, 100].map((yVal) => {
              const y = padding.top + graphHeight - (yVal / 100) * graphHeight;
              return (
                <g key={yVal}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="#E8E8E1"
                    strokeDasharray="2,3"
                  />
                  <text
                    x={padding.left - 10}
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
              <motion.path
                initial={{ pathLength: 0.2, opacity: 0.8 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
              <motion.path
                initial={{ pathLength: 0.2, opacity: 0.8 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                d={getPathForSeries('neutral')}
                fill="none"
                stroke="#64748B"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Positive Line Path */}
            {visibleSeries.positive && (
              <motion.path
                initial={{ pathLength: 0.2, opacity: 0.8 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                d={getPathForSeries('positive')}
                fill="none"
                stroke="#2E7D32"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Interactive Crosshair & Hover Hitboxes */}
            {trends.map((d, i) => {
              const x = padding.left + (i / (trends.length - 1)) * graphWidth;
              const isHovered = hoveredIndex === i;

              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  className="cursor-pointer"
                >
                  <rect
                    x={x - 22}
                    y={padding.top}
                    width={44}
                    height={graphHeight}
                    fill="transparent"
                  />

                  {/* Vertical Guideline */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + graphHeight}
                      stroke="#171717"
                      strokeWidth="1.2"
                      strokeDasharray="2,2"
                    />
                  )}

                  {/* Hover Points */}
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

                  {/* X Axis Time Labels */}
                  <text
                    x={x}
                    y={chartHeight - 8}
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

        {/* Hover Crosshair Summary Callout */}
        {activeHoverPoint && (
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-[#FFFFFF] border border-[#E8E8E1] rounded-xs flex flex-wrap items-center justify-between gap-4 text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#8A8A82]">Time Interval:</span>
              <span className="font-bold text-[#171717]">{activeHoverPoint.timeLabel} UTC</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[#C62828] font-medium">
                Negative: {activeHoverPoint.negative}%
              </span>
              <span className="text-[#64748B] font-medium">
                Neutral: {activeHoverPoint.neutral}%
              </span>
              <span className="text-[#2E7D32] font-medium">
                Positive: {activeHoverPoint.positive}%
              </span>
              <span className="text-[#575757]">
                Volume: {activeHoverPoint.volume.toLocaleString()} posts
              </span>
            </div>
          </motion.div>
        )}
      </section>

      {/* 2. SECONDARY SECTION: Emotion Breakdown & Platform Comparison (Integrated, clean horizontal bars) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4 border-t border-[#E8E8E1]">
        {/* A. Emotion Breakdown (No 5 separate cards! Clean horizontal spectrum) */}
        <section className="space-y-4">
          <div>
            <h3 className="font-sans font-bold text-base text-[#171717]">
              Emotion Breakdown
            </h3>
            <p className="font-sans text-xs text-[#575757]">
              Fine-grained emotional signals detected in textual dialogue
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {emotions.map((item) => (
              <div key={item.emotion} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-medium text-[#171717]">
                      {item.label}
                    </span>
                    <span className="font-mono text-[10px] text-[#8A8A82]">
                      ({item.volume.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-[#8A8A82]">{item.trendDelta}</span>
                    <span className="font-bold text-[#171717]">{item.percentage}%</span>
                  </div>
                </div>

                {/* Clean Horizontal Growth Bar */}
                <div className="h-1.5 w-full bg-[#E8E8E1] rounded-full overflow-hidden">
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
        <section className="space-y-4">
          <div>
            <h3 className="font-sans font-bold text-base text-[#171717]">
              Platform Comparison
            </h3>
            <p className="font-sans text-xs text-[#575757]">
              Cross-platform tone dispersion across monitored networks
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {platformComparison.map((p) => (
              <div key={p.platform} className="space-y-1.5 pb-3 border-b border-[#E8E8E1] last:border-b-0">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <PlatformBadge platform={p.platform} size="sm" />
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

                {/* Stacked Horizon Bar */}
                <div className="h-2 w-full bg-[#E8E8E1] rounded-full overflow-hidden flex">
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

      {/* 3. Collapsible Methodology (Analyst Technical Note) */}
      <section className="border-t border-[#E8E8E1] pt-4">
        <button
          onClick={() => setIsMethodologyOpen((prev) => !prev)}
          className="flex items-center justify-between w-full text-left py-2 text-xs font-sans text-[#575757] hover:text-[#171717] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#8A8A82]" />
            <span className="font-medium">
              Sentiment Classification & Tone Calibration Note
            </span>
          </div>
          {isMethodologyOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#8A8A82]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#8A8A82]" />
          )}
        </button>

        <AnimatePresence>
          {isMethodologyOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="py-3 text-xs font-sans text-[#575757] space-y-1.5 leading-relaxed"
            >
              <p>
                Tone classification utilizes multilingual semantic embeddings calibrated against high-confidence benchmark corpora.
              </p>
              <p>
                Ambiguous colloquialisms and vernacular code-mixing undergo contextual normalization prior to polarity scoring.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
