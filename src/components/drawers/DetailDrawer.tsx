import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  TrendingUp,
  Share2,
  Clock,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Compass,
  MessageSquare,
  Sparkles,
  Users,
  Activity
} from 'lucide-react';
import { DetailDrawerState, ScreenId } from '../../types/nexus';
import { SentimentBadge } from '../common/SentimentBadge';
import { PlatformBadge } from '../common/PlatformBadge';
import { Sparkline } from '../common/Sparkline';
import { AnimatedNumber } from '../common/AnimatedNumber';

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
            className="fixed inset-0 bg-[#171717]/20 backdrop-blur-[1px] z-40"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[440px] bg-[#FFFFFF] border-l border-[#E6E6DF] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-[#F0F0EA] flex items-center justify-between bg-[#FDFDFB]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-[#8A8A82] uppercase tracking-wider">
                  {selection.type === 'narrative' && 'NARRATIVE INTELLIGENCE'}
                  {selection.type === 'node' && 'NETWORK NODE DETAIL'}
                  {selection.type === 'event' && 'CHRONOLOGICAL SIGNAL'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-xs flex items-center justify-center text-[#575757] hover:text-[#171717] hover:bg-[#F0F0EA] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 1. NARRATIVE TYPE */}
              {selection.type === 'narrative' && (
                <div className="space-y-6">
                  {/* Topic Title & Growth */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <SentimentBadge sentiment={selection.data.sentiment} />
                      <span className="font-mono text-xs text-[#B45309] font-semibold">
                        ↑ +{selection.data.growthPct}% velocity
                      </span>
                    </div>
                    <h2 className="font-sans font-bold text-lg text-[#171717] leading-snug">
                      {selection.data.name}
                    </h2>
                    <p className="font-sans text-xs text-[#575757] mt-2.5 leading-relaxed">
                      {selection.data.summary}
                    </p>
                  </div>

                  {/* High-level metrics */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F7F7F4] border border-[#E6E6DF] rounded-xs">
                    <div>
                      <span className="font-sans text-[11px] text-[#575757] block">Observed Volume</span>
                      <span className="font-mono font-bold text-sm text-[#171717] tabular-nums">
                        {selection.data.mentionCount.toLocaleString()} posts
                      </span>
                    </div>
                    <div>
                      <span className="font-sans text-[11px] text-[#575757] block">Acceleration Index</span>
                      <span className="font-mono font-bold text-sm text-[#B45309] tabular-nums">
                        {selection.data.accelerationScore} / 10
                      </span>
                    </div>
                    <div>
                      <span className="font-sans text-[11px] text-[#575757] block">First Emergence</span>
                      <span className="font-mono text-xs text-[#171717]">{selection.data.firstObserved}</span>
                    </div>
                    <div>
                      <span className="font-sans text-[11px] text-[#575757] block">Active Channels</span>
                      <div className="flex gap-1 mt-1">
                        {selection.data.platforms.map((p) => (
                          <PlatformBadge key={p} platform={p} size="sm" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sparkline & Trajectory */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-xs font-semibold text-[#171717]">Trajectory Sparkline</span>
                      <span className="font-mono text-[10px] text-[#8A8A82]">Last 8 intervals</span>
                    </div>
                    <div className="p-3 bg-[#FAFAF8] border border-[#E6E6DF] rounded-xs flex items-center justify-between">
                      <Sparkline data={selection.data.sparkline} width={280} height={36} color="#B45309" />
                      <span className="font-mono text-xs font-semibold text-[#B45309]">Peak</span>
                    </div>
                  </div>

                  {/* Key Observed Signals */}
                  <div>
                    <h3 className="font-sans text-xs font-semibold text-[#171717] mb-2.5">
                      Key Field Citations
                    </h3>
                    <div className="space-y-2.5">
                      {selection.data.keyQuotes?.map((quote, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px]">
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
                  <div className="pt-2 border-t border-[#F0F0EA] flex gap-2">
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
                  <div className="flex items-start gap-3">
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
                          <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] rounded-xs uppercase font-semibold">
                            Bridge Node
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-[#575757]">{selection.data.alias}</p>
                      <span className="inline-block mt-1 text-[11px] font-sans font-medium text-[#2563EB]">
                        {selection.data.communityName}
                      </span>
                    </div>
                  </div>

                  {/* Network Centrality Scores */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-[#F7F7F4] border border-[#E6E6DF] rounded-xs text-center">
                    <div>
                      <span className="font-sans text-[10px] text-[#8A8A82] block">PageRank</span>
                      <span className="font-mono font-bold text-sm text-[#171717]">
                        {selection.data.pagerank.toFixed(3)}
                      </span>
                    </div>
                    <div>
                      <span className="font-sans text-[10px] text-[#8A8A82] block">Betweenness</span>
                      <span className="font-mono font-bold text-sm text-[#171717]">
                        {selection.data.betweenness.toFixed(3)}
                      </span>
                    </div>
                    <div>
                      <span className="font-sans text-[10px] text-[#8A8A82] block">Degree</span>
                      <span className="font-mono font-bold text-sm text-[#171717]">
                        {selection.data.connectionsCount}
                      </span>
                    </div>
                  </div>

                  {/* Analytical Interpretation */}
                  <div className="p-3.5 bg-[#FAFAF8] border border-[#E6E6DF] rounded-xs space-y-1.5">
                    <span className="font-mono text-[10px] font-semibold text-[#8A8A82] uppercase tracking-wider">
                      TOPOLOGY ASSESSMENT
                    </span>
                    <p className="font-sans text-xs text-[#171717] leading-relaxed">
                      {selection.data.isBridge
                        ? 'High betweenness centrality indicates this node acts as a crucial structural bridge mediating information flow across distinct community clusters.'
                        : 'Demonstrates strong intra-cluster density with high local eigenvector score in community distribution.'}
                    </p>
                  </div>

                  {/* Active Narrative Topics */}
                  <div>
                    <h3 className="font-sans text-xs font-semibold text-[#171717] mb-2">
                      Associated Active Topics
                    </h3>
                    <div className="space-y-1.5">
                      {selection.data.recentTopics.map((topic, i) => (
                        <div
                          key={i}
                          className="px-3 py-2 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs text-xs text-[#171717] font-medium"
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
                  {/* Event Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformBadge platform={selection.data.platform} />
                      <span className="font-mono text-xs text-[#8A8A82]">
                        {selection.data.timeFormatted}
                      </span>
                    </div>
                    <SentimentBadge sentiment={selection.data.sentiment} size="sm" />
                  </div>

                  {/* Topic Reference */}
                  <div className="p-2.5 bg-[#F7F7F4] border border-[#E6E6DF] rounded-xs">
                    <span className="font-mono text-[10px] text-[#8A8A82] uppercase block">
                      ASSIGNED NARRATIVE
                    </span>
                    <span className="font-sans font-semibold text-xs text-[#171717]">
                      {selection.data.topicName}
                    </span>
                  </div>

                  {/* Author & Full Post */}
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
                    <div className="p-4 bg-[#FAFAF8] border border-[#E6E6DF] rounded-xs font-sans text-xs text-[#171717] leading-relaxed">
                      "{selection.data.content}"
                    </div>
                  </div>

                  {/* Engagement Signals */}
                  <div>
                    <h3 className="font-sans text-xs font-semibold text-[#171717] mb-2">
                      Engagement & Reach Metrics
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs text-center">
                        <span className="font-sans text-[10px] text-[#8A8A82] block">Likes</span>
                        <span className="font-mono font-bold text-xs text-[#171717]">
                          {selection.data.engagement.likes}
                        </span>
                      </div>
                      <div className="p-2.5 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs text-center">
                        <span className="font-sans text-[10px] text-[#8A8A82] block">Reposts</span>
                        <span className="font-mono font-bold text-xs text-[#171717]">
                          {selection.data.engagement.reposts}
                        </span>
                      </div>
                      <div className="p-2.5 bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs text-center">
                        <span className="font-sans text-[10px] text-[#8A8A82] block">Reach Score</span>
                        <span className="font-mono font-bold text-xs text-[#B45309]">
                          {selection.data.reachScore} / 10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
