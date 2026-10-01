import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Quote
} from 'lucide-react';
import { DetailDrawerState, ScreenId } from '../../types/nexus';
import { SentimentBadge } from '../common/SentimentBadge';
import { PlatformBadge } from '../common/PlatformBadge';
import { Sparkline } from '../common/Sparkline';

interface DetailDrawerProps {
  selection: DetailDrawerState;
  onClose: () => void;
  onNavigateToScreen?: (screen: ScreenId) => void;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  selection,
  onClose,
  onNavigateToScreen,
}) => {
  return (
    <AnimatePresence>
      {selection && (
        <>
          {/* Subtle Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#171717]/25 backdrop-blur-xs z-40"
          />

          {/* Slide-over Drawer Panel with Spring Physics */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:max-w-[460px] bg-[#FFFFFF] border-l border-[#E8E8E1] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-[#F0F0EA] flex items-center justify-between bg-[#FDFDFB]">
              <span className="font-mono text-[10px] font-semibold text-[#8A8A82] uppercase tracking-wider">
                {selection.type === 'narrative' && 'NARRATIVE INVESTIGATION'}
                {selection.type === 'node' && 'NODE CENTRALITY ASSESSMENT'}
                {selection.type === 'event' && 'CHRONOLOGICAL SIGNAL DETAIL'}
              </span>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-xs flex items-center justify-center text-[#575757] hover:text-[#171717] hover:bg-[#F0F0EA] transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Scrollable Content Body with Subtle Stagger */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6"
            >
              {/* 1. NARRATIVE TYPE */}
              {selection.type === 'narrative' && (
                <div className="space-y-6">
                  {/* Title & Velocity */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <SentimentBadge sentiment={selection.data.sentiment} size="sm" />
                      <span className="font-mono text-xs text-[#B45309] font-semibold">
                        ↑ +{selection.data.growthPct}% velocity
                      </span>
                    </div>
                    <h2 className="font-sans font-bold text-xl text-[#171717] leading-snug">
                      {selection.data.name}
                    </h2>
                    <p className="font-sans text-xs text-[#575757] leading-relaxed pt-1 font-normal">
                      {selection.data.summary}
                    </p>
                  </div>

                  {/* Quantitative Baseline (Clean 2x2 grid, uncarded) */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#E8E8E1]">
                    <div>
                      <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-wider block">
                        Verified Mentions
                      </span>
                      <span className="font-mono font-medium text-lg text-[#171717] tabular-nums">
                        {selection.data.mentionCount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-wider block">
                        Acceleration Score
                      </span>
                      <span className="font-mono font-medium text-lg text-[#B45309] tabular-nums">
                        {selection.data.accelerationScore} / 10
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-wider block">
                        First Emergence
                      </span>
                      <span className="font-mono text-xs text-[#171717] mt-0.5 block">
                        {selection.data.firstObserved}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-wider block">
                        Active Channels
                      </span>
                      <div className="flex gap-1 mt-1">
                        {selection.data.platforms.map((p) => (
                          <PlatformBadge key={p} platform={p} size="sm" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sparkline Curve */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-semibold text-[#171717]">Trajectory Sparkline</span>
                      <span className="font-mono text-[10px] text-[#8A8A82]">Last 8 observation intervals</span>
                    </div>
                    <div className="py-3 px-4 bg-[#F7F7F4] border border-[#E8E8E1] rounded-xs flex items-center justify-between">
                      <Sparkline data={selection.data.sparkline} width={260} height={42} color="#B45309" strokeWidth={2} />
                      <span className="font-mono text-xs font-semibold text-[#B45309]">Breakout Peak</span>
                    </div>
                  </div>

                  {/* Field Citations / Observed Signals */}
                  <div className="space-y-3">
                    <h3 className="font-sans text-xs font-semibold text-[#171717] uppercase tracking-wider font-mono">
                      Field Citations
                    </h3>
                    <div className="space-y-3">
                      {selection.data.keyQuotes?.map((quote, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 bg-[#FAF8F5] border-l-2 border-[#171717] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-medium text-[#171717]">{quote.author}</span>
                            <div className="flex items-center gap-1.5">
                              <PlatformBadge platform={quote.platform} size="sm" />
                              <span className="font-mono text-[10px] text-[#8A8A82]">{quote.timestamp}</span>
                            </div>
                          </div>
                          <p className="font-sans text-xs text-[#575757] italic leading-relaxed">
                            "{quote.text}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Shortcuts */}
                  <div className="pt-4 border-t border-[#E8E8E1] flex gap-3">
                    {onNavigateToScreen && (
                      <>
                        <button
                          onClick={() => {
                            onNavigateToScreen('timeline');
                            onClose();
                          }}
                          className="flex-1 py-2 px-3 bg-[#171717] text-[#FFFFFF] text-xs font-medium rounded-xs hover:bg-[#333333] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>View in Timeline</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigateToScreen('network');
                            onClose();
                          }}
                          className="flex-1 py-2 px-3 bg-[#F0F0EA] text-[#171717] text-xs font-medium rounded-xs hover:bg-[#E4E4DC] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Inspect Network</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 2. NODE TYPE */}
              {selection.type === 'node' && (
                <div className="space-y-6">
                  {/* Account Header */}
                  <div className="flex items-start gap-3 pb-4 border-b border-[#E8E8E1]">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-mono font-bold text-xs shrink-0"
                      style={{ backgroundColor: selection.data.avatarColor }}
                    >
                      {selection.data.label.replace('@', '').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-mono font-bold text-sm text-[#171717] truncate">
                          {selection.data.label}
                        </h2>
                        {selection.data.isBridge && (
                          <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#FEF3C7] text-[#B45309] rounded-xs uppercase font-semibold">
                            Bridge
                          </span>
                        )}
                        {selection.data.platform && selection.data.platform !== 'all' && (
                          <PlatformBadge platform={selection.data.platform} size="sm" />
                        )}
                      </div>
                      <p className="font-sans text-xs text-[#575757]">{selection.data.alias}</p>
                      <span className="inline-block mt-0.5 text-[11px] font-sans font-medium text-[#2563EB]">
                        {selection.data.communityName}
                      </span>
                    </div>
                  </div>

                  {/* Network Centrality Scores (Clean strip) */}
                  <div className="grid grid-cols-3 gap-3 py-3 border-b border-[#E8E8E1] text-center">
                    <div>
                      <span className="font-mono text-[10px] text-[#8A8A82] uppercase block">PageRank</span>
                      <span className="font-mono font-medium text-base text-[#171717]">
                        {selection.data.pagerank.toFixed(3)}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#8A8A82] uppercase block">Betweenness</span>
                      <span className="font-mono font-medium text-base text-[#171717]">
                        {selection.data.betweenness.toFixed(3)}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#8A8A82] uppercase block">Degree Links</span>
                      <span className="font-mono font-medium text-base text-[#171717]">
                        {selection.data.connectionsCount}
                      </span>
                    </div>
                  </div>

                  {/* Structural Assessment */}
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] font-semibold text-[#8A8A82] uppercase tracking-wider">
                      Topology Assessment
                    </span>
                    <p className="font-sans text-xs text-[#171717] leading-relaxed">
                      {selection.data.isBridge
                        ? 'High betweenness centrality indicates this node acts as a crucial structural bridge mediating information flow across distinct community clusters.'
                        : 'Demonstrates strong intra-cluster density with high local eigenvector score in community distribution.'}
                    </p>
                  </div>

                  {/* Associated Topics */}
                  <div className="space-y-2 pt-2">
                    <h3 className="font-sans text-xs font-semibold text-[#171717] uppercase tracking-wider font-mono">
                      Associated Topics
                    </h3>
                    <div className="space-y-1.5">
                      {selection.data.recentTopics.map((topic, i) => (
                        <div
                          key={i}
                          className="py-2 px-3 bg-[#FAF8F5] border-l border-[#8A8A82] text-xs text-[#171717] font-medium"
                        >
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. EVENT TYPE */}
              {selection.type === 'event' && (
                <div className="space-y-6">
                  {/* Meta */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E1]">
                    <div className="flex items-center gap-2">
                      <PlatformBadge platform={selection.data.platform} />
                      <span className="font-mono text-xs text-[#8A8A82]">
                        {selection.data.timeFormatted}
                      </span>
                    </div>
                    <SentimentBadge sentiment={selection.data.sentiment} size="sm" />
                  </div>

                  {/* Topic Reference */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-[#8A8A82] uppercase tracking-wider block">
                      Assigned Narrative
                    </span>
                    <span className="font-sans font-bold text-sm text-[#171717]">
                      {selection.data.topicName}
                    </span>
                  </div>

                  {/* Author & Quote Content */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#171717]">
                        {selection.data.authorHandle}
                      </span>
                      {selection.data.authorAlias && (
                        <span className="font-sans text-xs text-[#8A8A82]">
                          ({selection.data.authorAlias})
                        </span>
                      )}
                      {selection.data.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                      )}
                    </div>
                    <div className="p-4 bg-[#FAF8F5] border-l-2 border-[#171717] font-sans text-xs text-[#171717] leading-relaxed">
                      "{selection.data.content}"
                    </div>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="space-y-2 pt-2 border-t border-[#E8E8E1]">
                    <span className="font-mono text-[10px] font-semibold text-[#8A8A82] uppercase tracking-wider block">
                      Engagement & Reach
                    </span>
                    <div className="grid grid-cols-3 gap-3 py-2 text-center font-mono">
                      <div>
                        <span className="text-[10px] text-[#8A8A82] block">Likes</span>
                        <span className="text-sm font-semibold text-[#171717]">{selection.data.engagement.likes}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8A8A82] block">Reposts</span>
                        <span className="text-sm font-semibold text-[#171717]">{selection.data.engagement.reposts}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8A8A82] block">Reach Score</span>
                        <span className="text-sm font-semibold text-[#B45309]">{selection.data.reachScore}/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
