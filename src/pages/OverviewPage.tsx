import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ChevronRight, Quote } from 'lucide-react';
import { EmergingNarrative, OverviewData, Platform, ScreenId, TimeFilter } from '../types/nexus';
import { nexusApi } from '../services/api/nexusApi';
import { AnimatedNumber } from '../components/common/AnimatedNumber';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { Sparkline } from '../components/common/Sparkline';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { SentimentDonut } from '../components/common/SentimentDonut';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    nexusApi
      .getOverview(timeFilter, platformFilter)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('[OverviewPage] Failed to fetch overview data:', err);
          setError(err.message || 'Failed to load intelligence brief');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [timeFilter, platformFilter]);

  if (loading) {
    return (
      <div className="space-y-12">
        <SkeletonLoader type="metric" count={4} />
        <SkeletonLoader type="card" count={2} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-12 max-w-5xl mx-auto">
        <div className="p-8 border border-[#E8E8E1] bg-[#FFFFFF] rounded-xs text-center space-y-4">
          <p className="font-sans text-sm text-[#C62828] font-medium">
            {error || 'Unable to load overview intelligence.'}
          </p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              nexusApi
                .getOverview(timeFilter, platformFilter)
                .then((res) => setData(res))
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
            }}
            className="font-sans text-xs px-4 py-2 bg-[#171717] text-white rounded-xs hover:bg-[#333333] transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const [leadNarrative, ...secondaryNarratives] = data.narratives || [];

  return (
    <div className="space-y-16 pb-20 max-w-5xl mx-auto">
      {/* 1. EMERGING NARRATIVES — UNDISPUTED VISUAL FOCAL POINT */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-[#E8E8E1] pb-3">
          <div>
            <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-widest font-medium">
              Briefing Priority 01
            </span>
            <h2 className="font-sans font-bold text-xl md:text-2xl text-[#171717] tracking-tight mt-0.5">
              Emerging Narratives
            </h2>
          </div>
          <button
            onClick={() => onNavigateToScreen('trends')}
            className="text-xs font-sans font-medium text-[#575757] hover:text-[#171717] inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Explore momentum index</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* A. LEAD NARRATIVE — Expansive, high-impact editorial briefing showcase */}
        {leadNarrative && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onSelectNarrative(leadNarrative)}
            className="py-6 px-1 transition-all cursor-pointer group"
          >
            {/* Meta Row: Priority Badge, Sentiment, Platforms, Velocity */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold text-[#FFFFFF] bg-[#171717] px-2 py-0.5 rounded-xs tracking-wider">
                  #1 LEAD TOPIC
                </span>
                <SentimentBadge sentiment={leadNarrative.sentiment} size="sm" />
                <div className="flex items-center gap-1">
                  {(platformFilter === 'all'
                    ? leadNarrative.platforms
                    : leadNarrative.platforms.filter((p) => p === platformFilter)
                  ).map((p) => (
                    <PlatformBadge key={p} platform={p} size="sm" />
                  ))}
                </div>
              </div>

              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-[11px] text-[#8A8A82] uppercase tracking-wider">Momentum</span>
                <span className="text-base md:text-lg font-bold text-[#B45309]">
                  ↑ +{leadNarrative.growthPct}%
                </span>
              </div>
            </div>

            {/* Headline and Narrative Core */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-3">
                <h3 className="font-sans font-bold text-2xl md:text-3xl text-[#171717] group-hover:text-[#B45309] transition-colors leading-tight tracking-tight">
                  {leadNarrative.name}
                </h3>
                <p className="font-sans text-sm text-[#575757] leading-relaxed max-w-2xl font-normal">
                  {leadNarrative.summary}
                </p>

                {/* Direct Key Quote Excerpt */}
                {leadNarrative.keyQuotes?.[0] && (
                  <div className="pt-3 flex items-start gap-3 text-xs text-[#171717] font-sans italic border-t border-[#E8E8E1] mt-5">
                    <Quote className="w-3.5 h-3.5 text-[#B45309] shrink-0 mt-0.5 not-italic" />
                    <span>"{leadNarrative.keyQuotes[0].text}"</span>
                    <span className="font-mono not-italic text-[10px] text-[#8A8A82] shrink-0 ml-auto">
                      {leadNarrative.keyQuotes[0].author} ({leadNarrative.keyQuotes[0].platform.toUpperCase()})
                    </span>
                  </div>
                )}
              </div>

              {/* Sparkline & Mention Volume */}
              <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between self-stretch pt-2 lg:pt-0">
                <div className="text-left lg:text-right space-y-0.5">
                  <div className="font-mono text-2xl md:text-3xl font-medium text-[#171717] tabular-nums">
                    {leadNarrative.mentionCount.toLocaleString()}
                  </div>
                  <div className="font-sans text-xs text-[#8A8A82]">verified mentions</div>
                </div>

                {/* Large Responsive Sparkline */}
                <div className="w-full lg:w-52 my-3">
                  <Sparkline
                    data={leadNarrative.sparkline}
                    width={208}
                    height={52}
                    color="#B45309"
                    strokeWidth={2.2}
                    fillOpacity={0.1}
                  />
                  <div className="flex justify-between font-mono text-[9px] text-[#8A8A82] mt-1">
                    <span>{leadNarrative.firstObserved}</span>
                    <span className="text-[#B45309] font-medium">Breakout Peak</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-sans font-medium text-[#171717] group-hover:text-[#B45309] transition-colors">
                  <span>Inspect trajectory</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* B. SECONDARY NARRATIVES — Editorial hairline divider rows, zero card containers */}
        <div className="divide-y divide-[#E8E8E1] border-t border-b border-[#E8E8E1]">
          {secondaryNarratives.map((narrative, idx) => (
            <motion.div
              key={narrative.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx + 1) * 0.04, duration: 0.25 }}
              onClick={() => onSelectNarrative(narrative)}
              className="py-4 px-1 hover:bg-[#FFFFFF]/60 transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column */}
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs text-[#8A8A82] font-semibold">
                    #{idx + 2}
                  </span>
                  <SentimentBadge sentiment={narrative.sentiment} size="sm" />
                  <span className="font-mono text-xs font-semibold text-[#B45309]">
                    ↑ +{narrative.growthPct}%
                  </span>
                  <div className="flex items-center gap-1 ml-1">
                    {(platformFilter === 'all'
                      ? narrative.platforms
                      : narrative.platforms.filter((p) => p === platformFilter)
                    ).map((p) => (
                      <PlatformBadge key={p} platform={p} size="sm" />
                    ))}
                  </div>
                </div>

                <h4 className="font-sans font-semibold text-base text-[#171717] group-hover:text-[#B45309] transition-colors pt-0.5">
                  {narrative.name}
                </h4>

                <p className="font-sans text-xs text-[#575757] line-clamp-1 leading-relaxed">
                  {narrative.summary}
                </p>
              </div>

              {/* Right Column: Volume & Sparkline */}
              <div className="flex items-center justify-between md:justify-end gap-8 shrink-0">
                <div className="text-left md:text-right">
                  <div className="font-mono text-sm font-semibold text-[#171717] tabular-nums">
                    {narrative.mentionCount.toLocaleString()}
                  </div>
                  <div className="font-sans text-[11px] text-[#8A8A82]">mentions</div>
                </div>

                <div className="w-24">
                  <Sparkline data={narrative.sparkline} width={96} height={26} color="#B45309" />
                </div>

                <div className="w-5 h-5 flex items-center justify-center text-[#8A8A82] group-hover:text-[#171717] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. ACTIVITY CHANGE & MACRO METRICS (Clean horizontal baseline) */}
      <section className="space-y-4">
        <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-widest font-medium block">
          Briefing Priority 02 • Activity Velocity
        </span>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-[#E8E8E1]">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#8A8A82] block uppercase tracking-wider">
              {platformFilter !== 'all' ? `${platformFilter.toUpperCase()} Intake` : 'Total Intake'}
            </span>
            <div className="text-2xl md:text-3xl font-mono font-medium text-[#171717] tracking-tight">
              <AnimatedNumber value={data.metrics.totalPosts} />
            </div>
            <span className="font-sans text-[11px] text-[#8A8A82] block">
              {platformFilter !== 'all' ? `across ${platformFilter.toUpperCase()}` : 'across monitored nodes'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#8A8A82] block uppercase tracking-wider">
              Active Topics
            </span>
            <div className="text-2xl md:text-3xl font-mono font-medium text-[#171717] tracking-tight">
              <AnimatedNumber value={data.metrics.activeTopicsCount} />
            </div>
            <span className="font-sans text-[11px] text-[#8A8A82] block">coherent dialogue threads</span>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#B45309] block uppercase tracking-wider font-semibold">
              Emerging Velocity
            </span>
            <div className="text-2xl md:text-3xl font-mono font-medium text-[#B45309] tracking-tight">
              <AnimatedNumber value={data.metrics.emergingGrowthPct} prefix="+" suffix="%" />
            </div>
            <span className="font-sans text-[11px] text-[#8A8A82] block">peak acceleration index</span>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#C62828] block uppercase tracking-wider font-semibold">
              Negative Skew
            </span>
            <div className="text-2xl md:text-3xl font-mono font-medium text-[#C62828] tracking-tight">
              <AnimatedNumber value={data.metrics.negativeSentimentPct} suffix="%" />
            </div>
            <span className="font-sans text-[11px] text-[#8A8A82] block">distress & conflict proportion</span>
          </div>
        </div>
      </section>

      {/* 3. SUPPORTING CONTEXTUAL INTELLIGENCE (Sentiment, Audience, Network) */}
      <section className="space-y-6 pt-2">
        <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-widest font-medium block">
          Briefing Priority 03–05 • Ecosystem Context
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* A. Sentiment Composition Snapshot */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8E1] pb-2">
              <h4 className="font-sans font-semibold text-sm text-[#171717]">
                Sentiment Balance
              </h4>
              <span className="font-mono text-[10px] text-[#8A8A82]">
                {platformFilter !== 'all' ? platformFilter.toUpperCase() : timeFilter.toUpperCase()} Composition
              </span>
            </div>

            {/* Clean Sentiment Composition Donut */}
            <div className="pt-1">
              <SentimentDonut
                data={data.sentimentBreakdown}
                totalCount={data.metrics.totalPosts}
                size={132}
                strokeWidth={14}
                centerSubtitle="analyzed"
              />
            </div>

            <p className="font-sans text-xs text-[#575757] leading-relaxed">
              Transit disruption distress dominates negative polarity, while volunteer carpool mutual-aid channels offer emerging positive balance.
            </p>

            <button
              onClick={() => onNavigateToScreen('sentiment')}
              className="text-xs font-sans font-medium text-[#171717] hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Inspect sentiment trends</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* B. Audience Signals Snapshot */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8E8E1] pb-2">
              <h4 className="font-sans font-semibold text-sm text-[#171717]">
                Audience Signals
              </h4>
              <span className="font-mono text-[9px] px-1.5 py-0.2 bg-[#F0F0EA] text-[#575757] rounded-xs uppercase">
                Macro Est.
              </span>
            </div>

            <div className="space-y-2 text-xs font-sans pt-1">
              <div className="flex justify-between items-center py-1 border-b border-[#F0F0EA]">
                <span className="text-[#575757]">Core Demographic Age</span>
                <span className="font-mono font-medium text-[#171717]">18–24 (48%)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#F0F0EA]">
                <span className="text-[#575757]">Linguistic Syntax</span>
                <span className="font-mono font-medium text-[#171717]">Hindi / English (61%)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#575757]">Geographic Core</span>
                <span className="font-mono font-medium text-[#171717]">Western Region (43%)</span>
              </div>
            </div>

            <p className="font-sans text-[11px] text-[#8A8A82] leading-tight">
              Macro inferences derived from geotemporal conversation density. Zero individual tracking.
            </p>
          </div>

          {/* C. Network Community Context */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8E8E1] pb-2">
              <h4 className="font-sans font-semibold text-sm text-[#171717]">
                Network Topology
              </h4>
              <span className="font-mono text-[10px] text-[#8A8A82]">
                {data.networkSummary?.activeCommunities ?? 4} Clusters
              </span>
            </div>

            <div className="space-y-2 text-xs font-sans pt-1">
              <div className="flex justify-between items-center py-1 border-b border-[#F0F0EA]">
                <span className="text-[#575757]">Structural Bridge Nodes</span>
                <span className="font-mono font-bold text-[#B45309]">
                  {data.networkSummary?.bridgeNodesCount ?? 0} High-Centrality
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#F0F0EA]">
                <span className="text-[#575757]">Monitored Influence Nodes</span>
                <span className="font-mono font-medium text-[#171717]">
                  {data.networkSummary?.monitoredNodes ?? 0} Nodes
                </span>
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
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
