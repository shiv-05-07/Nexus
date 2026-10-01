import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Clock,
  ShieldCheck,
  Table as TableIcon,
  Heart,
  Repeat,
  MessageCircle,
  ArrowUpRight
} from 'lucide-react';
import { Platform, SentimentType, TimeFilter, TimelineEvent } from '../types/nexus';
import { nexusApi } from '../services/api/nexusApi';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';

interface TimelinePageProps {
  timeFilter: TimeFilter;
  platformFilter: Platform;
  onSelectEvent: (event: TimelineEvent) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  timeFilter,
  platformFilter,
  onSelectEvent,
}) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    nexusApi
      .getTimeline({
        platform: platformFilter,
        sentiment: sentimentFilter,
        searchQuery,
      })
      .then((res) => {
        if (isMounted) {
          setEvents(res);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [platformFilter, sentimentFilter, searchQuery, timeFilter]);

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* 1. Header Filters & Mode Switch (Minimal, uncarded) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E1]">
        {/* Search & Sentiment Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Minimal Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A82]" />
            <input
              type="text"
              placeholder="Search content or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#D6D6CC] rounded-xs text-[#171717] focus:outline-none focus:border-[#171717] font-sans"
            />
          </div>

          {/* Sentiment Filter Segmented */}
          <div className="flex items-center gap-1">
            {['all', 'positive', 'neutral', 'negative'].map((s) => (
              <button
                key={s}
                onClick={() => setSentimentFilter(s)}
                className={`px-2.5 py-1 text-xs font-sans rounded-xs capitalize transition-colors cursor-pointer ${
                  sentimentFilter === s
                    ? 'bg-[#171717] text-white font-medium'
                    : 'text-[#575757] hover:text-[#171717] hover:bg-[#F0F0EA]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle: Timeline | Table */}
        <div className="flex items-center p-0.5 bg-[#F0F0EA] rounded-xs border border-[#E0E0D6] self-start sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-sans rounded-xs transition-colors cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-[#FFFFFF] text-[#171717] font-semibold shadow-2xs'
                : 'text-[#575757] hover:text-[#171717]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-sans rounded-xs transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-[#FFFFFF] text-[#171717] font-semibold shadow-2xs'
                : 'text-[#575757] hover:text-[#171717]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* 2. Loading State */}
      {loading && <SkeletonLoader type={viewMode === 'timeline' ? 'timeline' : 'table'} count={5} />}

      {/* 3. Empty State */}
      {!loading && events.length === 0 && (
        <EmptyState
          title="No timeline events match the filter"
          description="Try selecting 'All platforms' or resetting your sentiment filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSentimentFilter('all');
            setSearchQuery('');
          }}
        />
      )}

      {/* 4. Living Stream Vertical Timeline View — NO HEAVY CARD BOXES */}
      {!loading && events.length > 0 && viewMode === 'timeline' && (
        <div className="relative pl-6 md:pl-24 space-y-8 before:absolute before:left-2 md:before:left-18 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#E8E8E1]">
          {events.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.2), duration: 0.25 }}
              onClick={() => onSelectEvent(evt)}
              className="relative group cursor-pointer"
            >
              {/* Timestamp & Indicator Track Node */}
              <div className="absolute -left-6 md:-left-24 top-1 flex items-center gap-2.5">
                <span className="hidden md:inline-block font-mono text-xs text-[#8A8A82] tabular-nums">
                  {evt.timeFormatted}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#FFFFFF] border-2 border-[#8A8A82] group-hover:border-[#171717] group-hover:bg-[#171717] transition-colors" />
              </div>

              {/* Event Body - Clean Editorial Flow, not a boxed card */}
              <div className="space-y-2 pb-6 border-b border-[#E8E8E1] group-hover:bg-[#FFFFFF]/50 transition-colors p-2 -m-2 rounded-xs">
                {/* Meta Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <PlatformBadge platform={evt.platform} size="sm" />
                    <span className="font-mono text-xs font-semibold text-[#171717]">
                      {evt.authorHandle}
                    </span>
                    {evt.authorAlias && (
                      <span className="font-sans text-xs text-[#8A8A82]">
                        ({evt.authorAlias})
                      </span>
                    )}
                    {evt.verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="md:hidden font-mono text-[11px] text-[#8A8A82]">
                      {evt.timeFormatted}
                    </span>
                    <SentimentBadge sentiment={evt.sentiment} size="sm" />
                  </div>
                </div>

                {/* Assigned Narrative Marker */}
                <div className="font-mono text-[10px] text-[#B45309] font-medium uppercase tracking-wider">
                  {evt.topicName}
                </div>

                {/* Post Content */}
                <p className="font-sans text-xs md:text-sm text-[#171717] leading-relaxed">
                  "{evt.content}"
                </p>

                {/* Engagement Signals */}
                <div className="flex items-center justify-between pt-1 text-xs font-mono text-[#8A8A82]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-[#8A8A82]" />
                      <span className="tabular-nums">{evt.engagement.likes}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat className="w-3 h-3 text-[#8A8A82]" />
                      <span className="tabular-nums">{evt.engagement.reposts}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-[#8A8A82]" />
                      <span className="tabular-nums">{evt.engagement.comments}</span>
                    </span>
                  </div>

                  <span className="text-[11px] text-[#8A8A82] group-hover:text-[#171717] transition-colors flex items-center gap-1">
                    <span>Reach: <span className="font-semibold text-[#171717]">{evt.reachScore}/10</span></span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 5. Structured Table View */}
      {!loading && events.length > 0 && viewMode === 'table' && (
        <div className="border border-[#E8E8E1] rounded-xs overflow-x-auto bg-[#FFFFFF]">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#F7F7F4] border-b border-[#E8E8E1] text-[#575757] font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Time</th>
                <th className="py-2.5 px-4">Platform</th>
                <th className="py-2.5 px-4">Author</th>
                <th className="py-2.5 px-4">Narrative Topic</th>
                <th className="py-2.5 px-4">Sentiment</th>
                <th className="py-2.5 px-4">Engagement</th>
                <th className="py-2.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EA]">
              {events.map((evt) => (
                <tr
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="hover:bg-[#F9F9F6] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-[#8A8A82] whitespace-nowrap">
                    {evt.timeFormatted}
                  </td>
                  <td className="py-3 px-4">
                    <PlatformBadge platform={evt.platform} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-[#171717]">
                    {evt.authorHandle}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#171717] max-w-[200px] truncate">
                    {evt.topicName}
                  </td>
                  <td className="py-3 px-4">
                    <SentimentBadge sentiment={evt.sentiment} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono text-[#575757]">
                    {(evt.engagement.likes + evt.engagement.reposts).toLocaleString()} interactions
                  </td>
                  <td className="py-3 px-4 text-right">
                    <ArrowUpRight className="w-3.5 h-3.5 inline text-[#8A8A82]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
