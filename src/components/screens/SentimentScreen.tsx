import React from 'react';
import { motion } from 'motion/react';
import { SENTIMENT_SERIES, EMOTION_BREAKDOWN, EMERGING_NARRATIVES } from '../../data/mockIntelligence';
import { Smile, AlertCircle, HelpCircle } from 'lucide-react';

export const SentimentScreen: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#232729] pb-4">
        <h1 className="font-sans font-extrabold text-xl text-[#E8E3D8] tracking-wide uppercase">
          03. SENTIMENT & EMOTION INTELLIGENCE
        </h1>
        <p className="font-mono text-xs text-[#737C80] mt-0.5">
          Multi-dimensional affective NLP analytics, stance extraction, and sarcasm detection
        </p>
      </div>

      {/* Main Grid: Temporal Graph & Sarcasm Signal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Temporal Sentiment Graph (~65% / 8 cols) */}
        <div className="lg:col-span-8 bg-[#171A1C] border border-[#232729] rounded-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#232729] pb-3">
            <div>
              <h2 className="font-sans font-bold text-sm text-[#E8E3D8] uppercase tracking-wide">
                TEMPORAL SENTIMENT TRAJECTORY
              </h2>
              <p className="font-mono text-[10px] text-[#737C80]">
                24-HOUR STANCE DYNAMICS ACROSS ALL MONITORED PLATFORMS
              </p>
            </div>

            <div className="flex items-center gap-4 font-mono text-[10px]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#C75C5C] rounded-xs" /> Negative</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#737C80] rounded-xs" /> Neutral</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#5AA9A0] rounded-xs" /> Positive</span>
            </div>
          </div>

          {/* Custom SVG Line & Area Visualization */}
          <div className="h-64 w-full bg-[#0D1012] p-4 border border-[#232729] rounded-xs flex flex-col justify-between font-mono text-[10px] text-[#737C80] relative">
            <svg className="absolute inset-0 w-full h-full p-6 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              {/* Negative Sentiment Line (Surging) */}
              <polyline
                fill="none"
                stroke="#C75C5C"
                strokeWidth="2.5"
                points="0,82 20,76 40,68 60,54 80,42 100,32"
              />
              {/* Neutral Line */}
              <polyline
                fill="none"
                stroke="#737C80"
                strokeWidth="2.0"
                strokeDasharray="4 2"
                points="0,42 20,46 40,52 60,62 80,72 100,80"
              />
              {/* Positive Line */}
              <polyline
                fill="none"
                stroke="#5AA9A0"
                strokeWidth="2.0"
                points="0,24 20,22 40,20 60,16 80,14 100,12"
              />
            </svg>

            <div className="flex justify-between z-10">
              <span>100%</span>
              <span>STANCE SHIFT</span>
            </div>
            <div className="flex justify-between z-10 pt-4 border-t border-[#232729]">
              <span>06:00 UTC</span>
              <span>08:00 UTC</span>
              <span>10:00 UTC</span>
              <span>11:42 UTC (NOW)</span>
            </div>
          </div>

          {/* Emotion Spectrum Bands */}
          <div className="pt-2">
            <div className="font-mono text-[10px] text-[#737C80] uppercase tracking-wider mb-2">
              AFFECTIVE EMOTION BANDS
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 font-mono text-[10px]">
              <div className="p-2.5 bg-[#0D1012] border border-[#232729] rounded-xs">
                <div className="text-[#737C80]">OPPOSITION</div>
                <div className="text-base font-bold text-[#C75C5C]">{EMOTION_BREAKDOWN.opposition}%</div>
              </div>
              <div className="p-2.5 bg-[#0D1012] border border-[#232729] rounded-xs">
                <div className="text-[#737C80]">ANXIETY</div>
                <div className="text-base font-bold text-[#D6A84F]">{EMOTION_BREAKDOWN.anxiety}%</div>
              </div>
              <div className="p-2.5 bg-[#0D1012] border border-[#232729] rounded-xs">
                <div className="text-[#737C80]">ANGER</div>
                <div className="text-base font-bold text-[#C75C5C]">{EMOTION_BREAKDOWN.anger}%</div>
              </div>
              <div className="p-2.5 bg-[#0D1012] border border-[#232729] rounded-xs">
                <div className="text-[#737C80]">SARCASM</div>
                <div className="text-base font-bold text-[#C9784A]">{EMOTION_BREAKDOWN.sarcasm}%</div>
              </div>
              <div className="p-2.5 bg-[#0D1012] border border-[#232729] rounded-xs">
                <div className="text-[#737C80]">SUPPORTIVE</div>
                <div className="text-base font-bold text-[#5AA9A0]">{EMOTION_BREAKDOWN.supportive}%</div>
              </div>
              <div className="p-2.5 bg-[#0D1012] border border-[#232729] rounded-xs">
                <div className="text-[#737C80]">EXCITEMENT</div>
                <div className="text-base font-bold text-[#E8E3D8]">{EMOTION_BREAKDOWN.excitement}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sarcasm Signal & Explanations (~35% / 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sarcasm Card */}
          <div className="p-5 bg-[#171A1C] border border-[#C9784A]/40 rounded-sm space-y-3 relative">
            <div className="flex items-center justify-between border-b border-[#232729] pb-3">
              <span className="font-mono text-[10px] text-[#C9784A] font-bold uppercase tracking-wider">
                SARCASM SIGNAL
              </span>
              <span className="font-mono text-[9px] bg-[#C9784A]/20 text-[#C9784A] px-1.5 py-0.5 rounded-xs font-semibold">
                HIGH CONFIDENCE
              </span>
            </div>

            <div className="flex items-baseline justify-between my-2">
              <span className="font-mono text-xs text-[#737C80]">LIKELIHOOD:</span>
              <span className="font-mono text-3xl font-extrabold text-[#C9784A]">0.82</span>
            </div>

            <div className="p-3 bg-[#0D1012] border border-[#232729] rounded-xs">
              <div className="font-mono text-[10px] text-[#737C80] uppercase mb-1">
                NLP EXPLANATION
              </div>
              <p className="font-sans text-xs text-[#E8E3D8]/90 leading-relaxed">
                “Positive lexical indicators conflict with surrounding context and reaction patterns.”
              </p>
            </div>
          </div>

          {/* Platform Sentiment Breakdown */}
          <div className="p-5 bg-[#171A1C] border border-[#232729] rounded-sm space-y-3">
            <h3 className="font-sans font-bold text-xs text-[#E8E3D8] uppercase tracking-wide border-b border-[#232729] pb-2">
              SENTIMENT BY PLATFORM
            </h3>

            <div className="space-y-2.5 font-mono text-[11px]">
              <div>
                <div className="flex justify-between text-[10px] text-[#737C80] mb-1">
                  <span>X (TWITTER)</span>
                  <span className="text-[#C75C5C]">72% NEGATIVE</span>
                </div>
                <div className="h-1.5 bg-[#232729] rounded-xs overflow-hidden flex">
                  <div className="w-[72%] bg-[#C75C5C]" />
                  <div className="w-[18%] bg-[#737C80]" />
                  <div className="w-[10%] bg-[#5AA9A0]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-[#737C80] mb-1">
                  <span>TELEGRAM</span>
                  <span className="text-[#C75C5C]">68% NEGATIVE</span>
                </div>
                <div className="h-1.5 bg-[#232729] rounded-xs overflow-hidden flex">
                  <div className="w-[68%] bg-[#C75C5C]" />
                  <div className="w-[20%] bg-[#737C80]" />
                  <div className="w-[12%] bg-[#5AA9A0]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-[#737C80] mb-1">
                  <span>YOUTUBE</span>
                  <span className="text-[#737C80]">48% NEUTRAL</span>
                </div>
                <div className="h-1.5 bg-[#232729] rounded-xs overflow-hidden flex">
                  <div className="w-[38%] bg-[#C75C5C]" />
                  <div className="w-[48%] bg-[#737C80]" />
                  <div className="w-[14%] bg-[#5AA9A0]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment by Topic List */}
      <div className="p-5 bg-[#171A1C] border border-[#232729] rounded-sm space-y-3">
        <h3 className="font-sans font-bold text-sm text-[#E8E3D8] uppercase tracking-wide border-b border-[#232729] pb-3">
          SENTIMENT BREAKDOWN BY TOPIC
        </h3>

        <div className="divide-y divide-[#232729]">
          {EMERGING_NARRATIVES.map((t) => (
            <div key={t.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
              <div>
                <span className="text-[#C9784A] text-[10px] mr-2">{t.id}</span>
                <span className="font-sans font-bold text-[#E8E3D8]">{t.topic}</span>
              </div>

              <div className="flex items-center gap-6 text-[11px]">
                <span>VOL: <strong className="text-[#E8E3D8]">{t.mentionCount}</strong></span>
                <span className="text-[#C75C5C]">NEG: <strong>{t.sentiment.negative}%</strong></span>
                <span className="text-[#737C80]">NEU: <strong>{t.sentiment.neutral}%</strong></span>
                <span className="text-[#5AA9A0]">POS: <strong>{t.sentiment.positive}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
