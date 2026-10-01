import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Zap,
  ArrowUpRight,
  Sparkles,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';
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
      <div className="space-y-8 max-w-6xl mx-auto">
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
  const plotWidth = 700;
  const plotHeight = 280;
  const padding = { top: 30, right: 40, bottom: 40, left: 50 };
  const innerWidth = plotWidth - padding.left - padding.right;
  const innerHeight = plotHeight - padding.top - padding.bottom;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* 1. Dominant Visualization: Trend Landscape Scatter / Bubble Graph */}
      <section className="p-6 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-sans font-bold text-base md:text-lg text-[#171717] tracking-tight">
              Trend Landscape
            </h2>
            <p className="font-sans text-xs text-[#575757]">
              Differentiating high-volume baseline topics from small, rapidly accelerating breakouts
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A82]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C62828]" /> Neg
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]" /> Neu
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" /> Pos
            </span>
          </div>
        </div>

        {/* Scatter Plot SVG */}
        <div className="relative overflow-x-auto bg-[#FAFAF8] border border-[#F0F0EA] rounded-xs p-2">
          <svg
            viewBox={`0 0 ${plotWidth} ${plotHeight}`}
            className="w-full h-auto select-none overflow-visible"
            onMouseLeave={() => setHoveredTrend(null)}
          >
            {/* Quadrant Divider Guidelines */}
            <line
              x1={padding.left + innerWidth / 2}
              y1={padding.top}
              x2={padding.left + innerWidth / 2}
              y2={padding.top + innerHeight}
              stroke="#E6E6DF"
              strokeDasharray="3,3"
            />
            <line
              x1={padding.left}
              y1={padding.top + innerHeight / 2}
              x2={padding.left + innerWidth}
              y2={padding.top + innerHeight / 2}
              stroke="#E6E6DF"
              strokeDasharray="3,3"
            />

            {/* Quadrant Labels */}
            <text
              x={padding.left + 8}
              y={padding.top + 14}
              className="font-mono text-[9px] fill-[#B45309] font-semibold uppercase tracking-wider"
            >
              Rapid Breakouts (High Velocity)
            </text>
            <text
              x={padding.left + innerWidth - 8}
              y={padding.top + innerHeight - 8}
              textAnchor="end"
              className="font-mono text-[9px] fill-[#8A8A82] uppercase tracking-wider"
            >
              Established High-Volume Baseline
            </text>

            {/* Axis Labels */}
            <text
              x={padding.left + innerWidth / 2}
              y={plotHeight - 8}
              textAnchor="middle"
              className="font-mono text-[10px] fill-[#575757]"
            >
              Activity Volume (Mentions) →
            </text>
            <text
              x={14}
              y={padding.top + innerHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 14 ${padding.top + innerHeight / 2})`}
              className="font-mono text-[10px] fill-[#575757]"
            >
              Acceleration Rate (%) →
            </text>

            {/* Trend Bubbles */}
            {trends.map((item) => {
              const cx = padding.left + (item.x / 100) * innerWidth;
              const cy = padding.top + innerHeight - (item.y / 100) * innerHeight;
              const isHovered = hoveredTrend?.id === item.id;

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
                  onMouseEnter={() => setHoveredTrend(item)}
                  className="cursor-pointer group"
                >
                  {/* Subtle Radar Ring if Accelerating */}
                  {item.isAccelerating && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={item.radius + 6}
                      fill="none"
                      stroke={fillColor}
                      strokeOpacity="0.3"
                      strokeWidth="1.2"
                      strokeDasharray="2,2"
                    />
                  )}

                  {/* Main Bubble */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? item.radius + 3 : item.radius}
                    fill={fillColor}
                    fillOpacity={isHovered ? 0.85 : 0.65}
                    stroke={fillColor}
                    strokeWidth="1.5"
                    className="transition-all duration-200"
                  />

                  {/* Inner Text / Label */}
                  <text
                    x={cx}
                    y={cy - item.radius - 6}
                    textAnchor="middle"
                    className={`font-sans text-[10px] font-semibold transition-all ${
                      isHovered ? 'fill-[#171717] font-bold' : 'fill-[#575757]'
                    }`}
                  >
                    {item.name.length > 22 ? `${item.name.slice(0, 20)}...` : item.name}
                  </text>
                  <text
                    x={cx}
                    y={cy + 3}
                    textAnchor="middle"
                    className="font-mono text-[9px] fill-white font-bold"
                  >
                    +{item.accelerationPct}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hovered Item Callout Bar */}
        {hoveredTrend && (
          <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-[#F7F7F4] border border-[#E6E6DF] rounded-xs flex flex-wrap items-center justify-between gap-4 text-xs"
          >
            <div>
              <span className="font-mono font-bold text-[#171717]">
                {hoveredTrend.name}
              </span>
              <span className="font-sans text-[#575757] ml-2">
                ({hoveredTrend.communityName})
              </span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <span className="text-[#B45309] font-semibold">
                Velocity: +{hoveredTrend.accelerationPct}%
              </span>
              <span className="text-[#171717]">
                Volume: {hoveredTrend.volume.toLocaleString()} mentions
              </span>
              <SentimentBadge sentiment={hoveredTrend.sentiment} size="sm" />
            </div>
          </motion.div>
        )}
      </section>

      {/* 2. Ranked Trend List */}
      <section className="space-y-4">
        <div>
          <h3 className="font-sans font-bold text-base text-[#171717]">
            Ranked Momentum Index
          </h3>
          <p className="font-sans text-xs text-[#575757]">
            All active topics sorted by observed cross-platform acceleration
          </p>
        </div>

        <div className="space-y-3">
          {trends.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => handleItemClick(item)}
              className="p-4 bg-[#FFFFFF] border border-[#E6E6DF] hover:border-[#D4D4CA] rounded-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Left Column */}
              <div className="flex items-start md:items-center gap-4 flex-1">
                <span className="font-mono text-sm font-bold text-[#8A8A82] w-6 shrink-0">
                  #{idx + 1}
                </span>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-sans font-semibold text-sm text-[#171717] group-hover:text-[#B45309] transition-colors">
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
                      {item.platforms.map((p) => (
                        <PlatformBadge key={p} platform={p} size="sm" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Numbers + Sparkline */}
              <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                <div className="text-left md:text-right">
                  <div className="font-mono font-bold text-sm text-[#B45309]">
                    +{item.accelerationPct}%
                  </div>
                  <div className="font-mono text-[11px] text-[#8A8A82]">
                    {item.volume.toLocaleString()} mentions
                  </div>
                </div>

                <div className="w-20">
                  <Sparkline data={item.sparkline} width={80} height={24} color="#B45309" />
                </div>

                <div className="w-6 h-6 rounded-full bg-[#F7F7F4] group-hover:bg-[#171717] group-hover:text-white flex items-center justify-center transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
