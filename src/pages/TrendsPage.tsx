import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { EmergingNarrative, Platform, TimeFilter, TrendItem } from '../types/nexus';
import { nexusApi } from '../services/api/nexusApi';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { Sparkline } from '../components/common/Sparkline';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

interface TrendsPageProps {
  timeFilter: TimeFilter;
  platformFilter: Platform;
  onSelectTrend: (narrative: EmergingNarrative) => void;
}

export const TrendsPage: React.FC<TrendsPageProps> = ({
  timeFilter,
  platformFilter,
  onSelectTrend,
}) => {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredTrend, setHoveredTrend] = useState<TrendItem | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    nexusApi.getTrends(timeFilter, platformFilter).then((res) => {
      if (isMounted) {
        setTrends(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [timeFilter, platformFilter]);

  if (loading) {
    return (
      <div className="space-y-12 max-w-5xl mx-auto">
        <SkeletonLoader type="chart" />
        <SkeletonLoader type="card" count={3} />
      </div>
    );
  }

  const handleItemClick = async (trend: TrendItem) => {
    const narrative = await nexusApi.getNarrativeDetail(trend.id);
    if (narrative) {
      onSelectTrend(narrative);
    }
  };

  // Landscape Scatter Plot SVG Dimensions
  const plotWidth = 780;
  const plotHeight = 340;
  const padding = { top: 40, right: 40, bottom: 50, left: 60 };
  const innerWidth = plotWidth - padding.left - padding.right;
  const innerHeight = plotHeight - padding.top - padding.bottom;

  return (
    <div className="space-y-14 pb-20 max-w-5xl mx-auto">
      {/* 1. SIGNATURE COMPONENT: Trend Momentum Landscape */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E8E8E1] pb-3">
          <div>
            <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-widest font-medium">
              Signature Analytics
            </span>
            <h2 className="font-sans font-bold text-xl md:text-2xl text-[#171717] tracking-tight mt-0.5">
              Momentum Landscape {platformFilter !== 'all' ? `— ${platformFilter.toUpperCase()}` : ''}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[11px] text-[#8A8A82]">
            {platformFilter !== 'all' && (
              <span className="font-semibold text-[#171717] px-2 py-0.5 bg-[#F0F0EA] rounded-xs uppercase">
                {platformFilter} only ({trends.length} topics)
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C62828]" /> Negative
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#64748B]" /> Neutral
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]" /> Positive
            </span>
          </div>
        </div>

        {/* Spacious Interactive Scatter Canvas */}
        <div className="relative pt-2">
          <svg
            viewBox={`0 0 ${plotWidth} ${plotHeight}`}
            className="w-full h-auto select-none overflow-visible"
            onMouseLeave={() => {
              setHoveredTrend(null);
              setHoverCoords(null);
            }}
          >
            {/* Subtle Cross Guidelines */}
            <line
              x1={padding.left + innerWidth / 2}
              y1={padding.top}
              x2={padding.left + innerWidth / 2}
              y2={padding.top + innerHeight}
              stroke="#E8E8E1"
              strokeDasharray="2,3"
            />
            <line
              x1={padding.left}
              y1={padding.top + innerHeight / 2}
              x2={padding.left + innerWidth}
              y2={padding.top + innerHeight / 2}
              stroke="#E8E8E1"
              strokeDasharray="2,3"
            />

            {/* Quadrant Editorial Microcopy */}
            <text
              x={padding.left + 10}
              y={padding.top + 16}
              className="font-mono text-[9px] fill-[#B45309] font-medium uppercase tracking-wider"
            >
              Rapid Breakouts (High Velocity)
            </text>
            <text
              x={padding.left + innerWidth - 10}
              y={padding.top + innerHeight - 10}
              textAnchor="end"
              className="font-mono text-[9px] fill-[#8A8A82] font-medium uppercase tracking-wider"
            >
              Established High-Volume Baseline
            </text>

            {/* X Axis Label */}
            <text
              x={padding.left + innerWidth / 2}
              y={plotHeight - 12}
              textAnchor="middle"
              className="font-mono text-[10px] fill-[#8A8A82] tracking-wider uppercase"
            >
              Activity Volume (Mentions) →
            </text>

            {/* Y Axis Label */}
            <text
              x={18}
              y={padding.top + innerHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 18 ${padding.top + innerHeight / 2})`}
              className="font-mono text-[10px] fill-[#8A8A82] tracking-wider uppercase"
            >
              Acceleration Rate (%) →
            </text>

            {/* Trend Bubbles with Smooth Spring Transitions */}
            {trends.map((item) => {
              const cx = padding.left + (item.x / 100) * innerWidth;
              const cy = padding.top + innerHeight - (item.y / 100) * innerHeight;
              const isHovered = hoveredTrend?.id === item.id;
              const hasHover = hoveredTrend !== null;
              const isDimmed = hasHover && !isHovered;

              const fillColor =
                item.sentiment === 'negative'
                  ? '#C62828'
                  : item.sentiment === 'positive'
                  ? '#2E7D32'
                  : '#64748B';

              return (
                <g
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => {
                    setHoveredTrend(item);
                    setHoverCoords({ x: cx, y: cy });
                  }}
                  className="cursor-pointer"
                  style={{
                    opacity: isDimmed ? 0.2 : 1,
                    transition: 'opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {/* Subtle Radar Ring if Accelerating Breakout */}
                  {item.isAccelerating && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={item.radius + 6}
                      fill="none"
                      stroke={fillColor}
                      strokeOpacity="0.25"
                      strokeWidth="1.2"
                      strokeDasharray="2,2"
                    />
                  )}

                  {/* Main Bubble Circle */}
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={item.radius}
                    animate={{
                      scale: isHovered ? 1.18 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    fill={fillColor}
                    fillOpacity={isHovered ? 0.9 : 0.65}
                    stroke={fillColor}
                    strokeWidth="1.5"
                  />

                  {/* Label Text Above */}
                  <text
                    x={cx}
                    y={cy - item.radius - 6}
                    textAnchor="middle"
                    className={`font-sans text-[10px] select-none transition-colors ${
                      isHovered ? 'fill-[#171717] font-bold' : 'fill-[#575757] font-medium'
                    }`}
                  >
                    {item.name.length > 24 ? `${item.name.slice(0, 22)}...` : item.name}
                  </text>

                  {/* Inner Percentage */}
                  <text
                    x={cx}
                    y={cy + 3}
                    textAnchor="middle"
                    className="font-mono text-[9px] fill-white font-bold select-none"
                  >
                    +{item.accelerationPct}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Smooth Floating Detail Callout on Hover */}
        <AnimatePresence>
          {hoveredTrend && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="py-3 px-4 bg-[#FFFFFF] border border-[#E8E8E1] rounded-xs flex flex-wrap items-center justify-between gap-4 text-xs font-sans shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#171717]">
                  {hoveredTrend.name}
                </span>
                <span className="text-[#8A8A82]">
                  ({hoveredTrend.communityName})
                </span>
              </div>
              <div className="flex items-center gap-5 font-mono text-[11px]">
                <span className="text-[#B45309] font-medium">
                  Velocity: +{hoveredTrend.accelerationPct}%
                </span>
                <span className="text-[#171717]">
                  Mentions: {hoveredTrend.volume.toLocaleString()}
                </span>
                <SentimentBadge sentiment={hoveredTrend.sentiment} size="sm" />
                <span className="text-[10px] text-[#8A8A82] underline cursor-pointer">
                  Click to inspect details →
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 2. RANKED MOMENTUM INDEX — Clean editorial list with zero box card clutter */}
      <section className="space-y-4 pt-4 border-t border-[#E8E8E1]">
        <div>
          <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-widest font-medium block">
            Sorted Intake
          </span>
          <h3 className="font-sans font-bold text-lg text-[#171717] tracking-tight mt-0.5">
            Ranked Momentum Index
          </h3>
        </div>

        <div className="divide-y divide-[#E8E8E1] border-b border-[#E8E8E1]">
          {trends.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.2) }}
              onClick={() => handleItemClick(item)}
              className="py-4 px-1 hover:bg-[#FFFFFF]/60 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Left Column */}
              <div className="flex items-start md:items-center gap-4 flex-1">
                <span className="font-mono text-sm font-semibold text-[#8A8A82] w-6 shrink-0">
                  #{idx + 1}
                </span>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h4 className="font-sans font-semibold text-base text-[#171717] group-hover:text-[#B45309] transition-colors">
                      {item.name}
                    </h4>
                    <SentimentBadge sentiment={item.sentiment} size="sm" />
                    {item.isAccelerating && (
                      <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#FEF3C7] text-[#B45309] rounded-xs uppercase font-semibold">
                        Breakout
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#575757]">
                    <span>{item.communityName}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      {(platformFilter === 'all'
                        ? item.platforms
                        : item.platforms.filter((p) => p === platformFilter)
                      ).map((p) => (
                        <PlatformBadge key={p} platform={p} size="sm" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Numbers + Sparkline */}
              <div className="flex items-center justify-between md:justify-end gap-8 shrink-0">
                <div className="text-left md:text-right">
                  <div className="font-mono font-semibold text-sm text-[#B45309]">
                    +{item.accelerationPct}%
                  </div>
                  <div className="font-mono text-[11px] text-[#8A8A82]">
                    {item.volume.toLocaleString()} mentions
                  </div>
                </div>

                <div className="w-20">
                  <Sparkline data={item.sparkline} width={80} height={24} color="#B45309" />
                </div>

                <div className="w-5 h-5 flex items-center justify-center text-[#8A8A82] group-hover:text-[#171717] transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
