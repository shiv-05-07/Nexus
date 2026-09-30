import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { IntelligenceMetric } from '../../types/nexus';

interface MetricStripProps {
  metrics: IntelligenceMetric[];
  onMetricClick?: (key: string) => void;
}

// Smooth count-up counter component
const AnimatedCounter: React.FC<{ value: number; format: string }> = ({ value, format }) => {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 800; // 800ms smooth count-up

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.floor(easeProgress * value * 10) / 10);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayVal(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  if (format === 'percentage') {
    return <span>{displayVal.toFixed(1)}%</span>;
  }

  return <span>{Math.round(displayVal).toLocaleString()}</span>;
};

export const MetricStrip: React.FC<MetricStripProps> = ({ metrics, onMetricClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-4">
      {metrics.map((metric, idx) => (
        <motion.div
          key={metric.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => onMetricClick?.(metric.key)}
          className="p-4 bg-[#171A1C] border border-[#232729] hover:border-[#737C80]/40 rounded-sm transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
          {/* Subtle hover accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-[#C9784A] transition-colors duration-200" />

          <div className="flex items-center justify-between font-mono text-[10px] text-[#737C80] tracking-wider uppercase mb-1">
            <span>{metric.label}</span>
            <span className="text-[9px] text-[#737C80]/70">{metric.timestamp}</span>
          </div>

          <div className="font-mono font-bold text-2xl text-[#E8E3D8] tabular-nums tracking-tight my-1">
            <AnimatedCounter value={metric.value} format={metric.format} />
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] mt-1">
            <span
              className={
                metric.isPositiveDelta
                  ? 'text-[#5AA9A0]'
                  : metric.key === 'alerts'
                  ? 'text-[#C75C5C]'
                  : 'text-[#D6A84F]'
              }
            >
              {metric.delta}
            </span>
            <span className="text-[#737C80] text-[9px] group-hover:text-[#BDB5A6] transition-colors">
              INSPECT →
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
