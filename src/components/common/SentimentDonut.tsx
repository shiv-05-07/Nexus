import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

// Ultra-smooth physics-inspired cubic bezier for fluid animations
const BUTTER_EASE = [0.16, 1, 0.3, 1] as const;

export const SentimentDonut: React.FC<SentimentDonutProps> = ({
  data,
  totalCount,
  size = 152,
  strokeWidth = 16,
  centerTitle,
  centerSubtitle,
  showLegend = true,
  className = '',
}) => {
  const [hoveredSentiment, setHoveredSentiment] = useState<SentimentType | null>(null);

  // Normalize percentages to ensure a pristine 100% total
  const rawTotal = data.positive + data.neutral + data.negative;
  const posPct = rawTotal > 0 ? (data.positive / rawTotal) * 100 : 0;
  const neuPct = rawTotal > 0 ? (data.neutral / rawTotal) * 100 : 0;
  const negPct = rawTotal > 0 ? (data.negative / rawTotal) * 100 : 0;

  // SVG Geometry
  // Center is (60, 60), radius R = 44, viewBox 120 120
  const R = 44;
  const circumference = 2 * Math.PI * R; // ~276.46015

  // Arc length calculations
  const negLength = (negPct / 100) * circumference;
  const neuLength = (neuPct / 100) * circumference;
  const posLength = (posPct / 100) * circumference;

  // Determine dominant polarity
  let dominantSentiment: SentimentType = 'negative';
  let dominantPct = negPct;
  if (posPct > negPct && posPct > neuPct) {
    dominantSentiment = 'positive';
    dominantPct = posPct;
  } else if (neuPct > negPct && neuPct > posPct) {
    dominantSentiment = 'neutral';
    dominantPct = neuPct;
  }

  // Target percentage to display in center
  const targetPct = hoveredSentiment
    ? hoveredSentiment === 'positive'
      ? Math.round(posPct)
      : hoveredSentiment === 'neutral'
      ? Math.round(neuPct)
      : Math.round(negPct)
    : Math.round(dominantPct);

  // Smooth numeric counter interpolator (rolls numbers smoothly without jumping)
  const [animatedNumber, setAnimatedNumber] = useState<number>(0);
  const animRef = useRef<number | null>(null);
  const prevNumberRef = useRef<number>(0);

  useEffect(() => {
    const startVal = prevNumberRef.current;
    const endVal = targetPct;
    const startTime = performance.now();
    const duration = 750; // ms

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Buttery ease-out formula: 1 - Math.pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * easeProgress);

      setAnimatedNumber(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        prevNumberRef.current = endVal;
      }
    };

    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [targetPct]);

  const displayedLabel = hoveredSentiment
    ? hoveredSentiment.toUpperCase()
    : centerTitle || `${dominantSentiment.toUpperCase()}`;

  const displayedSub = hoveredSentiment
    ? 'of analyzed posts'
    : centerSubtitle || (totalCount ? `${totalCount.toLocaleString()} posts` : 'dominant tone');

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-6 ${className}`}>
      {/* SVG Donut Visual with Butter-Smooth Entrance */}
      <div className="relative shrink-0 select-none" style={{ width: size, height: size }}>
        <motion.svg
          viewBox="0 0 120 120"
          className="w-full h-full"
          initial={{ rotate: -108, scale: 0.88, opacity: 0 }}
          animate={{ rotate: -90, scale: 1, opacity: 1 }}
          transition={{ duration: 0.85, ease: BUTTER_EASE }}
        >
          {/* Subtle Ambient Background Track */}
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#ECECE5"
            strokeWidth={strokeWidth}
          />

          {/* 1. Negative Arc (Red) */}
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#C62828"
            strokeLinecap="butt"
            initial={{
              strokeDasharray: `0 ${circumference}`,
              strokeDashoffset: 0,
              strokeWidth: strokeWidth,
              opacity: 0,
            }}
            animate={{
              strokeDasharray: `${negLength} ${circumference - negLength}`,
              strokeDashoffset: 0,
              strokeWidth: hoveredSentiment === 'negative' ? strokeWidth + 3.5 : strokeWidth,
              opacity: hoveredSentiment && hoveredSentiment !== 'negative' ? 0.45 : 1,
            }}
            transition={{
              strokeDasharray: { duration: 0.9, ease: BUTTER_EASE },
              strokeDashoffset: { duration: 0.9, ease: BUTTER_EASE },
              strokeWidth: { type: 'spring', stiffness: 380, damping: 26 },
              opacity: { duration: 0.25 },
            }}
            onMouseEnter={() => setHoveredSentiment('negative')}
            onMouseLeave={() => setHoveredSentiment(null)}
            className="cursor-pointer"
          />

          {/* 2. Neutral Arc (Slate) */}
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#64748B"
            strokeLinecap="butt"
            initial={{
              strokeDasharray: `0 ${circumference}`,
              strokeDashoffset: 0,
              strokeWidth: strokeWidth,
              opacity: 0,
            }}
            animate={{
              strokeDasharray: `${neuLength} ${circumference - neuLength}`,
              strokeDashoffset: -negLength,
              strokeWidth: hoveredSentiment === 'neutral' ? strokeWidth + 3.5 : strokeWidth,
              opacity: hoveredSentiment && hoveredSentiment !== 'neutral' ? 0.45 : 1,
            }}
            transition={{
              strokeDasharray: { duration: 0.9, ease: BUTTER_EASE, delay: 0.03 },
              strokeDashoffset: { duration: 0.9, ease: BUTTER_EASE },
              strokeWidth: { type: 'spring', stiffness: 380, damping: 26 },
              opacity: { duration: 0.25 },
            }}
            onMouseEnter={() => setHoveredSentiment('neutral')}
            onMouseLeave={() => setHoveredSentiment(null)}
            className="cursor-pointer"
          />

          {/* 3. Positive Arc (Green) */}
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#2E7D32"
            strokeLinecap="butt"
            initial={{
              strokeDasharray: `0 ${circumference}`,
              strokeDashoffset: 0,
              strokeWidth: strokeWidth,
              opacity: 0,
            }}
            animate={{
              strokeDasharray: `${posLength} ${circumference - posLength}`,
              strokeDashoffset: -(negLength + neuLength),
              strokeWidth: hoveredSentiment === 'positive' ? strokeWidth + 3.5 : strokeWidth,
              opacity: hoveredSentiment && hoveredSentiment !== 'positive' ? 0.45 : 1,
            }}
            transition={{
              strokeDasharray: { duration: 0.9, ease: BUTTER_EASE, delay: 0.06 },
              strokeDashoffset: { duration: 0.9, ease: BUTTER_EASE },
              strokeWidth: { type: 'spring', stiffness: 380, damping: 26 },
              opacity: { duration: 0.25 },
            }}
            onMouseEnter={() => setHoveredSentiment('positive')}
            onMouseLeave={() => setHoveredSentiment(null)}
            className="cursor-pointer"
          />
        </motion.svg>

        {/* Center Content Overlay with Fluid Animated Crossfade */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: BUTTER_EASE, delay: 0.12 }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2"
        >
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#171717] tracking-tight leading-none tabular-nums">
            {animatedNumber}%
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={displayedLabel}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`font-sans text-[10px] font-bold tracking-wider uppercase mt-1 leading-none ${
                hoveredSentiment === 'positive'
                  ? 'text-[#2E7D32]'
                  : hoveredSentiment === 'neutral'
                  ? 'text-[#64748B]'
                  : hoveredSentiment === 'negative'
                  ? 'text-[#C62828]'
                  : 'text-[#171717]'
              }`}
            >
              {displayedLabel}
            </motion.span>
          </AnimatePresence>
          <span className="font-sans text-[9px] text-[#8A8A82] leading-tight mt-0.5 max-w-[88px] truncate">
            {displayedSub}
          </span>
        </motion.div>
      </div>

      {/* Restrained Compact Legend with Butter-Smooth Staggered Entrance */}
      {showLegend && (
        <div className="space-y-1.5 min-w-[130px] w-full sm:w-auto">
          {/* Positive Row */}
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: BUTTER_EASE }}
            onMouseEnter={() => setHoveredSentiment('positive')}
            onMouseLeave={() => setHoveredSentiment(null)}
            className={`flex items-center justify-between gap-4 py-1 px-2 rounded-xs transition-all cursor-pointer ${
              hoveredSentiment === 'positive'
                ? 'bg-[#EEF7EF] translate-x-0.5'
                : 'hover:bg-[#F7F7F4]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full bg-[#2E7D32] shrink-0 transition-transform ${
                  hoveredSentiment === 'positive' ? 'scale-125' : ''
                }`}
              />
              <span className="font-sans text-xs text-[#171717] font-medium">Positive</span>
            </div>
            <span className="font-mono text-xs font-semibold text-[#171717] tabular-nums">
              {Math.round(posPct)}%
            </span>
          </motion.div>

          {/* Neutral Row */}
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.26, ease: BUTTER_EASE }}
            onMouseEnter={() => setHoveredSentiment('neutral')}
            onMouseLeave={() => setHoveredSentiment(null)}
            className={`flex items-center justify-between gap-4 py-1 px-2 rounded-xs transition-all cursor-pointer ${
              hoveredSentiment === 'neutral'
                ? 'bg-[#F1F5F9] translate-x-0.5'
                : 'hover:bg-[#F7F7F4]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full bg-[#64748B] shrink-0 transition-transform ${
                  hoveredSentiment === 'neutral' ? 'scale-125' : ''
                }`}
              />
              <span className="font-sans text-xs text-[#171717] font-medium">Neutral</span>
            </div>
            <span className="font-mono text-xs font-semibold text-[#171717] tabular-nums">
              {Math.round(neuPct)}%
            </span>
          </motion.div>

          {/* Negative Row */}
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.32, ease: BUTTER_EASE }}
            onMouseEnter={() => setHoveredSentiment('negative')}
            onMouseLeave={() => setHoveredSentiment(null)}
            className={`flex items-center justify-between gap-4 py-1 px-2 rounded-xs transition-all cursor-pointer ${
              hoveredSentiment === 'negative'
                ? 'bg-[#FDF0F0] translate-x-0.5'
                : 'hover:bg-[#F7F7F4]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full bg-[#C62828] shrink-0 transition-transform ${
                  hoveredSentiment === 'negative' ? 'scale-125' : ''
                }`}
              />
              <span className="font-sans text-xs text-[#171717] font-medium">Negative</span>
            </div>
            <span className="font-mono text-xs font-semibold text-[#171717] tabular-nums">
              {Math.round(negPct)}%
            </span>
          </motion.div>
        </div>
      )}
    </div>
  );
};
