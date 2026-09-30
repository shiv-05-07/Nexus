import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { EmergingNarrative } from '../../types/nexus';
import { TrendingUp, Zap, ArrowRight, Activity, Globe, Share2 } from 'lucide-react';
import { useNexus } from '../../context/NexusContext';

interface TrendsScreenProps {
  onInvestigateTopic: (topicId: string) => void;
}

export const TrendsScreen: React.FC<TrendsScreenProps> = ({ onInvestigateTopic }) => {
  const { activeDataset } = useNexus();
  const narratives = activeDataset.narratives;
  const [selectedTopic, setSelectedTopic] = useState<EmergingNarrative>(narratives[0]);

  useEffect(() => {
    if (narratives.length > 0) {
      setSelectedTopic(narratives[0]);
    }
  }, [narratives]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#232729] pb-4">
        <h1 className="font-sans font-extrabold text-xl text-[#E8E3D8] tracking-wide uppercase">
          04. TREND EXPLORER & ACCELERATION MATRIX
        </h1>
        <p className="font-mono text-xs text-[#737C80] mt-0.5">
          Velocity-focused narrative momentum detection — why raw volume alone is insufficient ({activeDataset.name})
        </p>
      </div>

      {/* Explanatory Banner */}
      <div className="p-4 bg-[#171A1C] border-l-4 border-l-[#C9784A] border border-[#232729] rounded-xs font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-[#C9784A] font-bold uppercase tracking-wider text-[11px]">
            ANALYTICAL PRINCIPLE: ACCELERATION &gt; VOLUME
          </div>
          <p className="text-[#BDB5A6]/80 text-[11px] leading-relaxed">
            High volume without acceleration indicates mature, steady-state discourse.
            Critical intelligence value lies in high derivative acceleration ($d^2V/dt^2$) across communities.
          </p>
        </div>

        {selectedTopic && (
          <button
            onClick={() => onInvestigateTopic(selectedTopic.id)}
            className="px-4 py-2 bg-[#C9784A] hover:bg-[#C9784A]/90 text-[#0D1012] font-bold text-xs rounded-xs shrink-0 cursor-pointer transition-colors shadow-sm"
          >
            INVESTIGATE SELECTED ({selectedTopic.id})
          </button>
        )}
      </div>

      {/* Main Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ranked Topic Acceleration Table (~65% / 8 cols) */}
        <div className="lg:col-span-8 bg-[#171A1C] border border-[#232729] rounded-sm p-5 space-y-3">
          <h2 className="font-sans font-bold text-sm text-[#E8E3D8] uppercase tracking-wide border-b border-[#232729] pb-3">
            ACCELERATION-RANKED TOPICS
          </h2>

          <div className="space-y-2">
            {narratives.map((topic) => {
              const isSelected = selectedTopic?.id === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 bg-[#0D1012] border rounded-xs transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-[#C9784A] bg-[#232729]/30'
                      : 'border-[#232729] hover:border-[#737C80]/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#C9784A] font-bold">
                        {topic.rank}
                      </span>
                      <h3 className="font-sans font-bold text-sm text-[#E8E3D8]">
                        {topic.topic}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-[#5AA9A0] font-bold bg-[#5AA9A0]/10 px-2 py-0.5 rounded-xs border border-[#5AA9A0]/30">
                        {topic.acceleration}
                      </span>
                      <span className="text-[#E8E3D8] font-bold">
                        SCORE: {topic.trendScore}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] text-[#737C80] pt-2 border-t border-[#232729]/60">
                    <div>MENTIONS: <strong className="text-[#E8E3D8]">{topic.mentionCount}</strong></div>
                    <div>PLATFORMS: <strong className="text-[#5AA9A0]">{topic.platforms.length}</strong></div>
                    <div>COMMUNITIES: <strong className="text-[#E8E3D8]">{topic.communitiesCount}</strong></div>
                    <div>BRIDGE NODE: <strong className="text-[#C9784A]">{topic.keyBridgeNode}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Topic Details (~35% / 4 cols) */}
        {selectedTopic && (
          <div className="lg:col-span-4 bg-[#171A1C] border border-[#232729] rounded-sm p-5 space-y-4">
            <div className="border-b border-[#232729] pb-3">
              <span className="font-mono text-[10px] text-[#C9784A] uppercase tracking-wider">
                SELECTED TOPIC PROFILE
              </span>
              <h3 className="font-sans font-extrabold text-base text-[#E8E3D8] mt-1">
                {selectedTopic.topic}
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#0D1012] border border-[#232729] rounded-xs space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#737C80]">Trend Momentum Score:</span>
                  <span className="text-[#E8E3D8] font-bold">{selectedTopic.trendScore} / 100</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#737C80]">2h Acceleration Delta:</span>
                  <span className="text-[#5AA9A0] font-bold">{selectedTopic.acceleration}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#737C80]">Primary Community:</span>
                  <span className="text-[#E8E3D8]">{selectedTopic.primaryCommunity}</span>
                </div>
              </div>

              <div className="p-3 bg-[#0D1012] border border-[#232729] rounded-xs space-y-1.5">
                <div className="text-[10px] text-[#737C80] uppercase">TOPIC SUMMARY</div>
                <p className="font-sans text-xs text-[#BDB5A6]/90 leading-relaxed">
                  {selectedTopic.summary}
                </p>
              </div>

              <button
                onClick={() => onInvestigateTopic(selectedTopic.id)}
                className="w-full py-2.5 bg-[#C9784A] hover:bg-[#C9784A]/90 text-[#0D1012] font-mono font-bold text-xs rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>LAUNCH FULL INVESTIGATION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
