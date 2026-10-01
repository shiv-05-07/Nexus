import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SentimentType } from '../../types/nexus';

interface SentimentDonutProps {
  data: {
    positive: number;
    neutral: number;
    negative: number;
  };
  totalCount?: number;
  size?: number;
  strokeWidth?: number;
  centerTitle?: string;
  centerSubtitle?: string;
  showLegend?: boolean;
  className?: string;
}

export const SentimentDonut: React.FC<SentimentDonutProps> = ({
  data,
  totalCount,
  size = 148,
  strokeWidth = 16,
  centerTitle,
  centerSubtitle,
  showLegend = true,
  className = '',
}) => {
  const [hoveredSentiment, setHoveredSentiment] = useState<SentimentType | null>(null);

  const rawTotal = data.positive + data.neutral + data.negative;
  const posPct = rawTotal > 0 ? (data.positive / rawTotal) * 100 : 0;
  const neuPct = rawTotal > 0 ? (data.neutral / rawTotal) * 100 : 0;
  const negPct = rawTotal > 0 ? (data.negative / rawTotal) * 100 : 0;

  // Geometry: SVG circle dash calculations
  // Center is (60, 60), radius R = 44, viewBox 120 120
  const R = 44;
  const circumference = 2 * Math.PI * R; // ~276.46

  const negLength = (negPct / 100) * circumference;
  const neuLength = (neuPct / 100) * circumference;
  const posLength = (posPct / 100) * circumference;

  // Determine dominant sentiment for default center display
  let dominantSentiment: SentimentType = 'negative';
  let dominantPct = negPct;
  if (posPct > negPct && posPct > neuPct) {
    dominantSentiment = 'positive';
    dominantPct = posPct;
  } else if (neuPct > negPct && neuPct > posPct) {
    dominantSentiment = 'neutral';
    dominantPct = neuPct;
  }

  // Active display metric based on hover or dominant
  const displayedPct = hoveredSentiment
    ? hoveredSentiment === 'positive'
      ? Math.round(posPct)
      : hoveredSentiment === 'neutral'
      ? Math.round(neuPct)
      : Math.round(negPct)
    : Math.round(dominantPct);

  const displayedLabel = hoveredSentiment
    ? hoveredSentiment.toUpperCase()
    : centerTitle || `${dominantSentiment.toUpperCase()}`;

  const displayedSub = hoveredSentiment
    ? 'of analyzed posts'
    : centerSubtitle || (totalCount ? `${totalCount.toLocaleString()} posts` : 'dominant polarity');

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-6 ${className}`}>
      {/* SVG Donut Visual */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full select-none"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background Track Circle */}
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#F0F0EA"
            strokeWidth={strokeWidth}
          />

          {/* Negative Segment (Red) */}
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#C62828"
            strokeWidth={hoveredSentiment === 'negative' ? strokeWidth + 3 : strokeWidth}
            strokeDasharray={`${negLength} ${circumference - negLength}`}
            strokeDashoffset={0}
            strokeLinecap="butt"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${negLength} ${circumference - negLength}` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setHoveredSentiment('negative')}
            onMouseLeave={() => setHoveredSentiment(null)}
            className="cursor-pointer transition-all duration-200"
          />

          {/* Neutral Segment (Slate) */}
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#64748B"
            strokeWidth={hoveredSentiment === 'neutral' ? strokeWidth + 3 : strokeWidth}
            strokeDasharray={`${neuLength} ${circumference - neuLength}`}
            strokeDashoffset={-negLength}
            strokeLinecap="butt"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${neuLength} ${circumference - neuLength}` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            onMouseEnter={() => setHoveredSentiment('neutral')}
            onMouseLeave={() => setHoveredSentiment(null)}
            className="cursor-pointer transition-all duration-200"
          />

          {/* Positive Segment (Green) */}
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#2E7D32"
            strokeWidth={hoveredSentiment === 'positive' ? strokeWidth + 3 : strokeWidth}
            strokeDasharray={`${posLength} ${circumference - posLength}`}
            strokeDashoffset={-(negLength + neuLength)}
            strokeLinecap="butt"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${posLength} ${circumference - posLength}` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            onMouseEnter={() => setHoveredSentiment('positive')}
            onMouseLeave={() => setHoveredSentiment(null)}
            className="cursor-pointer transition-all duration-200"
          />
        </svg>

        {/* Center Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#171717] tracking-tight leading-none tabular-nums">
            {displayedPct}%
          </span>
          <span className="font-sans text-[10px] font-semibold text-[#171717] tracking-wider uppercase mt-1 leading-none">
            {displayedLabel}
          </span>
          <span className="font-sans text-[9px] text-[#8A8A82] leading-tight mt-0.5 max-w-[85px] truncate">
            {displayedSub}
          </span>
        </div>
      </div>

      {/* Restrained Compact Legend */}
      {showLegend && (
        <div className="space-y-2 min-w-[130px] w-full sm:w-auto">
          {/* Positive Row */}
          <div
            onMouseEnter={() => setHoveredSentiment('positive')}
            onMouseLeave={() => setHoveredSentiment(null)}
            className={`flex items-center justify-between gap-4 py-1 px-1.5 rounded-xs transition-colors cursor-pointer ${
              hoveredSentiment === 'positive' ? 'bg-[#EEF7EF]' : 'hover:bg-[#F7F7F4]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] shrink-0" />
              <span className="font-sans text-xs text-[#171717] font-medium">Positive</span>
            </div>
            <span className="font-mono text-xs font-semibold text-[#171717] tabular-nums">
              {Math.round(posPct)}%
            </span>
          </div>

          {/* Neutral Row */}
          <div
            onMouseEnter={() => setHoveredSentiment('neutral')}
            onMouseLeave={() => setHoveredSentiment(null)}
            className={`flex items-center justify-between gap-4 py-1 px-1.5 rounded-xs transition-colors cursor-pointer ${
              hoveredSentiment === 'neutral' ? 'bg-[#F1F5F9]' : 'hover:bg-[#F7F7F4]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#64748B] shrink-0" />
              <span className="font-sans text-xs text-[#171717] font-medium">Neutral</span>
            </div>
            <span className="font-mono text-xs font-semibold text-[#171717] tabular-nums">
              {Math.round(neuPct)}%
            </span>
          </div>

          {/* Negative Row */}
          <div
            onMouseEnter={() => setHoveredSentiment('negative')}
            onMouseLeave={() => setHoveredSentiment(null)}
            className={`flex items-center justify-between gap-4 py-1 px-1.5 rounded-xs transition-colors cursor-pointer ${
              hoveredSentiment === 'negative' ? 'bg-[#FDF0F0]' : 'hover:bg-[#F7F7F4]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C62828] shrink-0" />
              <span className="font-sans text-xs text-[#171717] font-medium">Negative</span>
            </div>
            <span className="font-mono text-xs font-semibold text-[#171717] tabular-nums">
              {Math.round(negPct)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
