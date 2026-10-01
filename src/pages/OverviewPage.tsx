import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ChevronRight, Share2, Users, Radio, Quote } from 'lucide-react';
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
      <div className="space-y-10">
        <SkeletonLoader type="metric" count={4} />
        <SkeletonLoader type="card" count={2} />
      </div>
    );
  }

  const [leadNarrative, ...secondaryNarratives] = data.narratives;

  return (
    <div className="space-y-12 pb-16">
      {/* 1. CURRENT SITUATION (Briefing Synopsis & Horizontal Metrics) */}
      <section className="space-y-6">
        {/* Executive Editorial Briefing Statement */}
        <div className="max-w-3xl space-y-2">
          <div className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-widest font-medium">
            Intelligence Briefing • {timeFilter.toUpperCase()} Window
          </div>
          <p className="font-sans text-base md:text-lg text-[#171717] font-normal leading-relaxed">
            Metropolitan transit disruption in Western depot sectors remains the dominant narrative driver. 
            Cross-platform chatter shows an <span className="font-semibold text-[#B45309]">acute +182% momentum surge</span>, 
            skewing overall sentiment to <span className="font-semibold text-[#C62828]">63% negative</span> while decentralized citizen carpools begin establishing secondary positive clusters.
          </p>
        </div>

        {/* Minimalist Horizontal Metrics Strip - No heavy card containers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 pb-6 border-y border-[#E8E8E1]">
          <div className="space-y-1">
            <span className="font-mono text-[11px] text-[#8A8A82] block uppercase tracking-wider">
              Monitored Posts
            </span>
            <div className="text-2xl md:text-3xl font-mono font-medium text-[#171717] tracking-tight">
              <AnimatedNumber value={data.metrics.totalPosts} />
            </div>
            <span className="font-sans text-[11px] text-[#8A8A82] block">cross-channel intake</span>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[11px] text-[#8A8A82] block uppercase tracking-wider">
              Active Topics
            </span>
            <div className="text-2xl md:text-3xl font-mono font-medium text-[#171717] tracking-tight">
              <AnimatedNumber value={data.metrics.activeTopicsCount} />
            </div>
            <span className="font-sans text-[11px] text-[#8A8A82] block">distinct conversation threads</span>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[11px] text-[#B45309] block uppercase tracking-wider font-semibold">
              Emerging Velocity
            </span>
            <div className="text-2xl md:text-3xl font-mono font-medium text-[#B45309] tracking-tight">
              <AnimatedNumber value={data.metrics.emergingGrowthPct} prefix="+" suffix="%" />
            </div>
            <span className="font-sans text-[11px] text-[#8A8A82] block">breakout acceleration</span>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[11px] text-[#C62828] block uppercase tracking-wider font-semibold">
              Negative Skew
            </span>
            <div className="text-2xl md:text-3xl font-mono font-medium text-[#C62828] tracking-tight">
              <AnimatedNumber value={data.metrics.negativeSentimentPct} suffix="%" />
            </div>
            <span className="font-sans text-[11px] text-[#8A8A82] block">public distress & friction</span>
          </div>
        </div>
      </section>

      {/* 2. EMERGING NARRATIVES — THE PRIMARY VISUAL FOCAL POINT */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-[#E8E8E1] pb-3">
          <div>
            <h2 className="font-sans font-bold text-lg md:text-xl text-[#171717] tracking-tight">
              Emerging Narratives
            </h2>
            <p className="font-sans text-xs text-[#575757] mt-0.5">
              Ranked by propagation velocity and cross-platform acceleration
            </p>
          </div>
          <button
            onClick={() => onNavigateToScreen('trends')}
            className="text-xs font-sans font-medium text-[#171717] hover:text-[#575757] inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Explore full landscape</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* A. LEAD DOMINANT NARRATIVE (Featured, significantly larger breathing room & impact) */}
        {leadNarrative && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onSelectNarrative(leadNarrative)}
            className="bg-[#FFFFFF] border border-[#E8E8E1] hover:border-[#D6D6CC] p-6 md:p-8 rounded-xs transition-all cursor-pointer group shadow-2xs hover:shadow-xs relative"
          >
            {/* Top Tag Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-[#FFFFFF] bg-[#171717] px-2 py-0.5 rounded-xs">
                  #1 LEAD SIGNAL
                </span>
                <SentimentBadge sentiment={leadNarrative.sentiment} size="sm" />
                <div className="flex items-center gap-1 ml-1">
                  {leadNarrative.platforms.map((p) => (
                    <PlatformBadge key={p} platform={p} size="sm" />
                  ))}
                </div>
              </div>

              {/* Large Velocity Callout */}
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-xs text-[#575757]">Velocity:</span>
                <span className="font-mono text-base md:text-lg font-bold text-[#B45309]">
                  ↑ +{leadNarrative.growthPct}%
                </span>
              </div>
            </div>

            {/* Main Headline & Context Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Title & Synthesis */}
              <div className="lg:col-span-8 space-y-3">
                <h3 className="font-sans font-bold text-xl md:text-2xl text-[#171717] group-hover:text-[#B45309] transition-colors leading-snug tracking-tight">
                  {leadNarrative.name}
                </h3>
                <p className="font-sans text-xs md:text-sm text-[#575757] leading-relaxed">
                  {leadNarrative.summary}
                </p>

                {/* Direct Citation Excerpt */}
                {leadNarrative.keyQuotes?.[0] && (
                  <div className="pt-2 flex items-start gap-2.5 text-xs text-[#171717] font-sans italic border-t border-[#F0F0EA] mt-4">
                    <Quote className="w-3.5 h-3.5 text-[#B45309] shrink-0 mt-0.5 not-italic" />
                    <span>"{leadNarrative.keyQuotes[0].text}"</span>
                    <span className="font-mono not-italic text-[10px] text-[#8A8A82] shrink-0">
                      — {leadNarrative.keyQuotes[0].author} ({leadNarrative.keyQuotes[0].platform})
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Large Sparkline & Volume */}
              <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between self-stretch pt-2 lg:pt-0 border-t lg:border-t-0 border-[#F0F0EA]">
                <div className="text-left lg:text-right space-y-0.5">
                  <div className="font-mono text-xl md:text-2xl font-semibold text-[#171717] tabular-nums">
                    {leadNarrative.mentionCount.toLocaleString()}
                  </div>
                  <div className="font-sans text-xs text-[#8A8A82]">verified mentions</div>
                </div>

                {/* High Resolution Sparkline */}
                <div className="w-full lg:w-48 my-3">
                  <Sparkline
                    data={leadNarrative.sparkline}
                    width={192}
                    height={48}
                    color="#B45309"
                    strokeWidth={2.2}
                    fillOpacity={0.12}
                  />
                  <div className="flex justify-between font-mono text-[9px] text-[#8A8A82] mt-1">
                    <span>{leadNarrative.firstObserved}</span>
                    <span className="text-[#B45309] font-medium">Breakout Peak</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#171717] group-hover:text-[#B45309] transition-colors">
                  <span>Inspect propagation trail</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* B. SECONDARY NARRATIVES (Clean, elegant editorial rows without card-box clutter) */}
        <div className="divide-y divide-[#E8E8E1] border-b border-[#E8E8E1]">
          {secondaryNarratives.map((narrative, idx) => (
            <motion.div
              key={narrative.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx + 1) * 0.05, duration: 0.25 }}
              onClick={() => onSelectNarrative(narrative)}
              className="py-4 px-2 hover:bg-[#FFFFFF] transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-[#8A8A82] font-semibold">
                    #{idx + 2}
                  </span>
                  <SentimentBadge sentiment={narrative.sentiment} size="sm" />
                  <span className="font-mono text-xs font-semibold text-[#B45309]">
                    ↑ +{narrative.growthPct}%
                  </span>
                  <div className="flex items-center gap-1 ml-1">
                    {narrative.platforms.map((p) => (
                      <PlatformBadge key={p} platform={p} size="sm" />
                    ))}
                  </div>
                </div>

                <h4 className="font-sans font-semibold text-sm md:text-base text-[#171717] group-hover:text-[#B45309] transition-colors">
                  {narrative.name}
                </h4>

                <p className="font-sans text-xs text-[#575757] line-clamp-1 leading-relaxed">
                  {narrative.summary}
                </p>
              </div>

              {/* Right Column: Volume & Sparkline */}
              <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                <div className="text-left md:text-right">
                  <div className="font-mono text-sm font-semibold text-[#171717] tabular-nums">
                    {narrative.mentionCount.toLocaleString()}
                  </div>
                  <div className="font-sans text-[11px] text-[#8A8A82]">mentions</div>
                </div>

                <div className="w-24">
                  <Sparkline data={narrative.sparkline} width={96} height={26} color="#B45309" />
                </div>

                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#8A8A82] group-hover:text-[#171717] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. SUPPORTING CONTEXTUAL INTELLIGENCE (Sentiment, Audience, Network) */}
      <section className="space-y-4 pt-4">
        <h3 className="font-sans font-bold text-sm text-[#171717] uppercase tracking-wider font-mono">
          Contextual Signals
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
          {/* A. Sentiment Composition Snapshot */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-sans font-semibold text-sm text-[#171717]">
                Sentiment Balance
              </h4>
              <span className="font-mono text-[10px] text-[#8A8A82]">24H Aggregate</span>
            </div>

            {/* Seamless Segmented Bar */}
            <div className="space-y-2">
              <div className="h-2 w-full bg-[#E8E8E1] rounded-full overflow-hidden flex">
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

              <div className="flex items-center justify-between text-xs font-mono text-[11px]">
                <span className="text-[#C62828]">Neg {data.sentimentBreakdown.negative}%</span>
                <span className="text-[#64748B]">Neu {data.sentimentBreakdown.neutral}%</span>
                <span className="text-[#2E7D32]">Pos {data.sentimentBreakdown.positive}%</span>
              </div>
            </div>

            <p className="font-sans text-xs text-[#575757] leading-relaxed">
              Distress in regional transit routes dominates negative polarity, while municipal cleanliness initiatives provide mild positive balance.
            </p>

            <button
              onClick={() => onNavigateToScreen('sentiment')}
              className="text-xs font-sans font-medium text-[#171717] hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Inspect sentiment trends</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* B. Audience Signals Snapshot */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-sans font-semibold text-sm text-[#171717]">
                Audience Signals
              </h4>
              <span className="font-mono text-[9px] px-1.5 py-0.2 bg-[#F0F0EA] text-[#575757] rounded-xs uppercase">
                Aggregate
              </span>
            </div>

            <div className="space-y-2 text-xs font-sans">
              <div className="flex justify-between items-center py-1 border-b border-[#F0F0EA]">
                <span className="text-[#575757]">Core Demographic Age</span>
                <span className="font-mono font-medium text-[#171717]">18–24 (48%)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#F0F0EA]">
                <span className="text-[#575757]">Linguistic Syntax</span>
                <span className="font-mono font-medium text-[#171717]">Hindi / English (61%)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#575757]">Geographic Density</span>
                <span className="font-mono font-medium text-[#171717]">Western Region (43%)</span>
              </div>
            </div>

            <p className="font-sans text-[11px] text-[#8A8A82] leading-tight">
              Macro inferences derived from geotemporal conversation density. Zero individual tracking.
            </p>
          </div>

          {/* C. Network Community Context */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-sans font-semibold text-sm text-[#171717]">
                Network Topology
              </h4>
              <span className="font-mono text-[10px] text-[#8A8A82]">4 Clusters</span>
            </div>

            <div className="space-y-2 text-xs font-sans">
              <div className="flex justify-between items-center py-1 border-b border-[#F0F0EA]">
                <span className="text-[#575757]">Active Bridge Nodes</span>
                <span className="font-mono font-bold text-[#B45309]">2 High-Centrality</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#F0F0EA]">
                <span className="text-[#575757]">Monitored Influence Nodes</span>
                <span className="font-mono font-medium text-[#171717]">142 Nodes</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#575757]">Key Structural Channels</span>
                <span className="font-mono font-medium text-[#171717]">Transit ⇄ Media</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToScreen('network')}
              className="text-xs font-sans font-medium text-[#171717] hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Explore social ecosystem</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
