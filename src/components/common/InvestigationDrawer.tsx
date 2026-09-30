import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ExternalLink, ShieldCheck, Share2, Layers, Cpu } from 'lucide-react';
import { EmergingNarrative, ScreenId } from '../../types/nexus';

interface InvestigationDrawerProps {
  isOpen: boolean;
  topic: EmergingNarrative | null;
  onClose: () => void;
  onFullInvestigate: (topicId: string) => void;
}

export const InvestigationDrawer: React.FC<InvestigationDrawerProps> = ({
  isOpen,
  topic,
  onClose,
  onFullInvestigate,
}) => {
  if (!isOpen || !topic) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/55 backdrop-blur-xs"
        />

        {/* Analyst Workspace Drawer */}
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg h-full bg-[#171A1C] border-l border-[#232729] shadow-2xl flex flex-col z-10 text-xs font-sans text-[#E8E3D8]"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#232729] flex items-center justify-between bg-[#0D1012]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#C9784A]/10 border border-[#C9784A]/40 rounded-xs flex items-center justify-center text-[#C9784A]">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-[10px] text-[#C9784A] uppercase tracking-wider">
                  ANALYST INVESTIGATION DRAWER
                </div>
                <h2 className="font-sans font-bold text-sm tracking-wide text-[#E8E3D8]">
                  {topic.topic}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#737C80] hover:text-[#E8E3D8] hover:bg-[#232729] rounded-xs transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-[#0D1012] border border-[#232729] rounded-xs font-mono">
              <div>
                <div className="text-[9px] text-[#737C80]">TREND SCORE</div>
                <div className="text-lg font-bold text-[#E8E3D8]">{topic.trendScore} / 100</div>
              </div>
              <div>
                <div className="text-[9px] text-[#737C80]">ACCELERATION</div>
                <div className="text-lg font-bold text-[#5AA9A0]">{topic.acceleration}</div>
              </div>
              <div>
                <div className="text-[9px] text-[#737C80]">VOLUME</div>
                <div className="text-lg font-bold text-[#E8E3D8]">{topic.volume}</div>
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-3.5 bg-[#0D1012] border border-[#232729] rounded-xs">
              <div className="font-mono text-[10px] text-[#737C80] uppercase tracking-wider mb-1.5">
                EXECUTIVE INTELLIGENCE SUMMARY
              </div>
              <p className="font-sans text-xs text-[#E8E3D8]/90 leading-relaxed">
                {topic.summary}
              </p>
            </div>

            {/* Sentiment Spectrum */}
            <div className="p-3.5 bg-[#0D1012] border border-[#232729] rounded-xs font-mono">
              <div className="text-[10px] text-[#737C80] uppercase tracking-wider mb-2 flex justify-between">
                <span>SENTIMENT SPECTRUM</span>
                <span className="text-[#C75C5C] font-semibold">{topic.sentiment.negative}% NEGATIVE</span>
              </div>
              <div className="h-2 w-full bg-[#232729] rounded-xs overflow-hidden flex">
                <div style={{ width: `${topic.sentiment.negative}%` }} className="bg-[#C75C5C]" />
                <div style={{ width: `${topic.sentiment.neutral}%` }} className="bg-[#737C80]" />
                <div style={{ width: `${topic.sentiment.positive}%` }} className="bg-[#5AA9A0]" />
              </div>
              <div className="flex justify-between text-[9px] text-[#737C80] mt-1.5">
                <span>Negative: {topic.sentiment.negative}%</span>
                <span>Neutral: {topic.sentiment.neutral}%</span>
                <span>Positive: {topic.sentiment.positive}%</span>
              </div>
            </div>

            {/* Key Entities & Topological Attributes */}
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between p-2.5 bg-[#0D1012] border border-[#232729] rounded-xs">
                <span className="text-[#737C80]">Primary Community:</span>
                <span className="text-[#E8E3D8] font-semibold">{topic.primaryCommunity}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-[#0D1012] border border-[#232729] rounded-xs">
                <span className="text-[#737C80]">Key Bridge Node:</span>
                <span className="text-[#C9784A] font-semibold">{topic.keyBridgeNode}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-[#0D1012] border border-[#232729] rounded-xs">
                <span className="text-[#737C80]">Platform Coverage:</span>
                <span className="text-[#5AA9A0] font-semibold">{topic.platforms.join(' · ')}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                onFullInvestigate(topic.id);
                onClose();
              }}
              className="w-full py-3 bg-[#C9784A] hover:bg-[#C9784A]/90 text-[#0D1012] font-mono font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <span>OPEN FULL PROPAGATION MATRIX</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Drawer Footer */}
          <div className="p-3 bg-[#0D1012] border-t border-[#232729] font-mono text-[10px] text-[#737C80] flex items-center justify-between">
            <span>MODEL CONFIDENCE: 0.86</span>
            <span>EVIDENCE RECORD: NX-2026-0917</span>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};
