import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ChevronRight, Share2, Users, PieChart as PieIcon, Radio } from 'lucide-react';
import { EmergingNarrative, OverviewData, Platform, ScreenId, TimeFilter } from '../types/nexus';
import { nexusApi } from '../services/api/nexusApi';
import { AnimatedNumber } from '../components/common/AnimatedNumber';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { Sparkline } from '../components/common/Sparkline';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

interface OverviewPageProps {
  timeFilter: TimeFilter;
  platformFilter: Platform;
  onSelectNarrative: (narrative: EmergingNarrative) => void;
  onNavigateToScreen: (screen: ScreenId) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  timeFilter,
  platformFilter,
  onSelectNarrative,
  onNavigateToScreen,
}) => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    nexusApi.getOverview(timeFilter, platformFilter).then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [timeFilter, platformFilter]);

  if (loading || !data) {
    return (
      <div className="space-y-8">
        <SkeletonLoader type="metric" count={4} />
        <SkeletonLoader type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Refined Horizontal Metric Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pb-6 border-b border-[#E6E6DF]">
        <div className="space-y-1">
          <div className="text-2xl md:text-3xl font-mono font-bold text-[#171717] tracking-tight">
            <AnimatedNumber value={data.metrics.totalPosts} />
          </div>
          <p className="font-sans text-xs text-[#575757]">Monitored Posts</p>
        </div>

        <div className="space-y-1">
          <div className="text-2xl md:text-3xl font-mono font-bold text-[#171717] tracking-tight">
            <AnimatedNumber value={data.metrics.activeTopicsCount} />
          </div>
          <p className="font-sans text-xs text-[#575757]">Active Topics</p>
        </div>

        <div className="space-y-1">
          <div className="text-2xl md:text-3xl font-mono font-bold text-[#B45309] tracking-tight">
            <AnimatedNumber value={data.metrics.emergingGrowthPct} prefix="+" suffix="%" />
          </div>
          <p className="font-sans text-xs text-[#575757]">Emerging Activity</p>
        </div>

        <div className="space-y-1">
          <div className="text-2xl md:text-3xl font-mono font-bold text-[#C62828] tracking-tight">
            <AnimatedNumber value={data.metrics.negativeSentimentPct} suffix="%" />
          </div>
          <p className="font-sans text-xs text-[#575757]">Negative Sentiment</p>
        </div>
      </section>

      {/* 2. Dominant Section: Emerging Narratives */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-bold text-base md:text-lg text-[#171717] tracking-tight">
              Emerging Narratives
            </h2>
            <p className="font-sans text-xs text-[#575757] mt-0.5">
              Ranked conversations gaining velocity across monitored platforms
            </p>
          </div>
          <button
            onClick={() => onNavigateToScreen('trends')}
            className="text-xs font-sans font-medium text-[#171717] hover:text-[#575757] inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Explore all trends</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Narrative Cards List */}
        <div className="space-y-3">
          {data.narratives.map((narrative, idx) => (
            <motion.div
              key={narrative.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.25 }}
              onClick={() => onSelectNarrative(narrative)}
              className="p-5 bg-[#FFFFFF] border border-[#E6E6DF] hover:border-[#D4D4CA] rounded-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#8A8A82]">
                    #{idx + 1}
                  </span>
                  <SentimentBadge sentiment={narrative.sentiment} size="sm" />
                  <span className="font-mono text-xs font-semibold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-xs">
                    ↑ +{narrative.growthPct}%
                  </span>
                  <div className="flex items-center gap-1 ml-1">
                    {narrative.platforms.map((p) => (
                      <PlatformBadge key={p} platform={p} size="sm" />
                    ))}
                  </div>
                </div>

                <h3 className="font-sans font-semibold text-sm md:text-base text-[#171717] group-hover:text-[#B45309] transition-colors">
                  {narrative.name}
                </h3>

                <p className="font-sans text-xs text-[#575757] line-clamp-2 leading-relaxed">
                  {narrative.summary}
                </p>
              </div>

              {/* Right Trajectory & Volume */}
              <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F0F0EA]">
                <div className="text-left md:text-right">
                  <div className="font-mono font-semibold text-sm text-[#171717] tabular-nums">
                    {narrative.mentionCount.toLocaleString()}
                  </div>
                  <div className="font-sans text-[11px] text-[#8A8A82]">mentions</div>
                </div>

                <div className="w-24 flex flex-col items-center">
                  <Sparkline data={narrative.sparkline} width={96} height={28} color="#B45309" />
                  <span className="font-mono text-[9px] text-[#8A8A82] mt-1">velocity curve</span>
                </div>

                <div className="w-7 h-7 rounded-full bg-[#F7F7F4] group-hover:bg-[#171717] group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Three-Column Contextual Briefing Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* A. Sentiment Snapshot */}
        <div className="p-5 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-sm text-[#171717]">
              Sentiment Snapshot
            </h3>
            <span className="font-mono text-[10px] text-[#8A8A82]">24H Aggregate</span>
          </div>

          {/* Segmented Horizontal Bar */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-[#F0F0EA] rounded-full overflow-hidden flex">
              <div
                style={{ width: `${data.sentimentBreakdown.negative}%` }}
                className="bg-[#C62828]"
                title={`Negative: ${data.sentimentBreakdown.negative}%`}
              />
              <div
                style={{ width: `${data.sentimentBreakdown.neutral}%` }}
                className="bg-[#64748B]"
                title={`Neutral: ${data.sentimentBreakdown.neutral}%`}
              />
              <div
                style={{ width: `${data.sentimentBreakdown.positive}%` }}
                className="bg-[#2E7D32]"
                title={`Positive: ${data.sentimentBreakdown.positive}%`}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-sans">
              <span className="text-[#C62828] font-medium">
                Negative {data.sentimentBreakdown.negative}%
              </span>
              <span className="text-[#64748B] font-medium">
                Neutral {data.sentimentBreakdown.neutral}%
              </span>
              <span className="text-[#2E7D32] font-medium">
                Positive {data.sentimentBreakdown.positive}%
              </span>
            </div>
          </div>

          <p className="font-sans text-xs text-[#575757] leading-relaxed">
            Public tone is heavily skewed negative, primarily propelled by transit disruption distress in Depot sector 4.
          </p>

          <button
            onClick={() => onNavigateToScreen('sentiment')}
            className="w-full py-2 bg-[#F7F7F4] hover:bg-[#F0F0EA] border border-[#E6E6DF] text-xs font-medium text-[#171717] rounded-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Sentiment Dynamics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* B. Audience Cohort Snapshot */}
        <div className="p-5 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-sm text-[#171717]">
              Audience Signals
            </h3>
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#F0F0EA] text-[#575757] rounded-xs uppercase">
              Aggregate Est.
            </span>
          </div>

          {/* Age and Region Breakdown */}
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-sans text-[11px] text-[#8A8A82] block mb-1">
                Dominant Age Cohort
              </span>
              <div className="flex justify-between items-center font-mono">
                <span className="text-[#171717]">18–24 Yrs</span>
                <span className="font-bold text-[#171717]">48%</span>
              </div>
              <div className="flex justify-between items-center font-mono text-[#575757]">
                <span>25–34 Yrs</span>
                <span>29%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0F0EA]">
              <span className="font-sans text-[11px] text-[#8A8A82] block mb-1">
                Linguistic Density
              </span>
              <div className="flex justify-between items-center font-mono">
                <span className="text-[#171717]">Hindi / English (Mixed)</span>
                <span className="font-bold text-[#171717]">61%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0F0EA]">
              <span className="font-sans text-[11px] text-[#8A8A82] block mb-1">
                Geographic Core
              </span>
              <div className="flex justify-between items-center font-mono">
                <span className="text-[#171717]">Western Region Metros</span>
                <span className="font-bold text-[#171717]">43%</span>
              </div>
            </div>
          </div>

          <p className="font-sans text-[10px] text-[#8A8A82] leading-tight italic">
            *Inferred at aggregate cohort scale. Zero personal identification.
          </p>
        </div>

        {/* C. Network Snapshot */}
        <div className="p-5 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-sm text-[#171717]">
              Network Topology
            </h3>
            <span className="font-mono text-[10px] text-[#8A8A82]">4 Clusters</span>
          </div>

          {/* Mini Network Visual Preview */}
          <div className="p-3 bg-[#F7F7F4] border border-[#E6E6DF] rounded-xs flex items-center justify-around">
            <div className="text-center">
              <span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block mb-1" />
              <span className="font-mono text-[10px] text-[#575757] block">Commuters</span>
            </div>
            <span className="font-mono text-xs text-[#8A8A82]">⇄</span>
            <div className="text-center">
              <span className="w-3 h-3 rounded-full bg-[#D97706] inline-block mb-1" />
              <span className="font-mono text-[10px] text-[#575757] block">Media Bridge</span>
            </div>
            <span className="font-mono text-xs text-[#8A8A82]">⇄</span>
            <div className="text-center">
              <span className="w-3 h-3 rounded-full bg-[#7C3AED] inline-block mb-1" />
              <span className="font-mono text-[10px] text-[#575757] block">Operators</span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-[#575757]">Bridge Nodes Detected</span>
              <span className="font-bold text-[#B45309]">2 Active</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#575757]">Monitored Influence Nodes</span>
              <span className="font-bold text-[#171717]">142 Nodes</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateToScreen('network')}
            className="w-full py-2 bg-[#F7F7F4] hover:bg-[#F0F0EA] border border-[#E6E6DF] text-xs font-medium text-[#171717] rounded-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Explore Network Graph</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
