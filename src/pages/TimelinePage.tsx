import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ListFilter,
  Search,
  SlidersHorizontal,
  Table as TableIcon,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Heart,
  Repeat,
  MessageCircle,
  Eye
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Header Filters & Mode Toggle Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E6DF]">
        {/* Search & Sentiment Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A82]" />
            <input
              type="text"
              placeholder="Search content or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#D4D4CA] rounded-xs text-[#171717] focus:outline-none focus:border-[#171717] font-sans"
            />
          </div>

          {/* Sentiment Quick Filter Buttons */}
          <div className="flex items-center gap-1">
            {['all', 'positive', 'neutral', 'negative'].map((s) => (
              <button
                key={s}
                onClick={() => setSentimentFilter(s)}
                className={`px-2.5 py-1 text-xs font-sans rounded-xs capitalize transition-colors cursor-pointer ${
                  sentimentFilter === s
                    ? 'bg-[#171717] text-white font-medium'
                    : 'bg-[#FFFFFF] border border-[#E6E6DF] text-[#575757] hover:bg-[#F7F7F4]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle: Timeline | Table */}
        <div className="flex items-center p-0.5 bg-[#F0F0EA] rounded-xs border border-[#E0E0D6] self-start md:self-auto">
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-sans rounded-xs transition-colors cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-[#FFFFFF] text-[#171717] font-semibold shadow-xs'
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
                ? 'bg-[#FFFFFF] text-[#171717] font-semibold shadow-xs'
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
          title="No timeline events match the selected criteria"
          description="Try selecting 'All platforms' or resetting your sentiment filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSentimentFilter('all');
            setSearchQuery('');
          }}
        />
      )}

      {/* 4. Vertical Timeline View */}
      {!loading && events.length > 0 && viewMode === 'timeline' && (
        <div className="relative pl-6 md:pl-28 space-y-6 before:absolute before:left-2 md:before:left-20 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[#E6E6DF]">
          {events.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.22 }}
              onClick={() => onSelectEvent(evt)}
              className="relative group cursor-pointer"
            >
              {/* Timestamp Indicator on the Left */}
              <div className="absolute -left-6 md:-left-28 top-3 flex items-center gap-2">
                <span className="hidden md:inline-block font-mono text-xs text-[#8A8A82] tabular-nums">
                  {evt.timeFormatted}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFFFFF] border-2 border-[#171717] group-hover:bg-[#171717] transition-colors" />
              </div>

              {/* Event Container */}
              <div className="p-4 bg-[#FFFFFF] border border-[#E6E6DF] hover:border-[#D4D4CA] rounded-xs shadow-2xs hover:shadow-xs transition-all space-y-3">
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

                  <div className="flex items-center gap-2">
                    <span className="md:hidden font-mono text-[11px] text-[#8A8A82]">
                      {evt.timeFormatted}
                    </span>
                    <SentimentBadge sentiment={evt.sentiment} size="sm" />
                  </div>
                </div>

                {/* Assigned Narrative Label */}
                <div className="font-mono text-[10px] text-[#B45309] font-medium uppercase tracking-wider">
                  {evt.topicName}
                </div>

                {/* Content Quote */}
                <p className="font-sans text-xs md:text-sm text-[#171717] leading-relaxed">
                  "{evt.content}"
                </p>

                {/* Engagement Signals */}
                <div className="flex items-center justify-between pt-2 border-t border-[#F0F0EA] text-xs font-mono text-[#575757]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-[#8A8A82]" />
                      <span>{evt.engagement.likes}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat className="w-3 h-3 text-[#8A8A82]" />
                      <span>{evt.engagement.reposts}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-[#8A8A82]" />
                      <span>{evt.engagement.comments}</span>
                    </span>
                  </div>

                  <span className="text-[11px] text-[#8A8A82]">
                    Reach Score: <span className="text-[#171717] font-semibold">{evt.reachScore}/10</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 5. Structured Table View */}
      {!loading && events.length > 0 && viewMode === 'table' && (
        <div className="bg-[#FFFFFF] border border-[#E6E6DF] rounded-xs overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#F7F7F4] border-b border-[#E6E6DF] text-[#575757] font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Narrative Topic</th>
                <th className="py-3 px-4">Sentiment</th>
                <th className="py-3 px-4">Engagement</th>
                <th className="py-3 px-4 text-right">Action</th>
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
                  <td className="py-3 px-4 font-medium text-[#171717] max-w-[220px] truncate">
                    {evt.topicName}
                  </td>
                  <td className="py-3 px-4">
                    <SentimentBadge sentiment={evt.sentiment} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono text-[#575757]">
                    {evt.engagement.likes + evt.engagement.reposts} interactions
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-xs font-medium text-[#171717] hover:underline cursor-pointer">
                      Inspect
                    </button>
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
