import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROPAGATION_SEQUENCE, EMERGING_NARRATIVES, EVIDENCE_RECORDS } from '../../data/mockIntelligence';
import { Search, Play, Pause, RotateCcw, ArrowRight, ShieldAlert, CheckCircle, FileCheck, Share2 } from 'lucide-react';

interface InvestigateScreenProps {
  onNavigateToScreen: (screen: string) => void;
}

export const InvestigateScreen: React.FC<InvestigateScreenProps> = ({ onNavigateToScreen }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto propagation playback
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= PROPAGATION_SEQUENCE.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const topic = EMERGING_NARRATIVES[0]; // Public Transport Strike

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#232729] pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#C9784A]">
            <span>TOPIC ID: {topic.id}</span>
            <span>·</span>
            <span>STATUS: {topic.status}</span>
          </div>
          <h1 className="font-sans font-extrabold text-2xl text-[#E8E3D8] tracking-wide uppercase mt-0.5">
            07. NARRATIVE PROPAGATION RECONSTRUCTION
          </h1>
          <p className="font-mono text-xs text-[#737C80]">
            Forensic cross-community emergence trail for "{topic.topic}"
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToScreen('integrity')}
            className="px-3 py-1.5 bg-[#232729] hover:bg-[#737C80]/30 text-[#E8E3D8] font-mono text-[11px] rounded-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#5AA9A0]" />
            <span>EVIDENCE NX-2026-0917</span>
          </button>
        </div>
      </div>

      {/* Main Narrative Investigation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Summary & Metrics (~30% / 4 cols) */}
        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          {/* Key Metrics */}
          <div className="p-4 bg-[#171A1C] border border-[#232729] rounded-sm space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-[#737C80] text-[10px] uppercase">TREND MOMENTUM SCORE</span>
              <span className="text-xl font-bold text-[#E8E3D8]">{topic.trendScore} / 100</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[#737C80] text-[10px] uppercase">ACCELERATION</span>
              <span className="text-xl font-bold text-[#5AA9A0]">{topic.acceleration}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[#737C80] text-[10px] uppercase">OBSERVED VOLUME</span>
              <span className="text-base font-bold text-[#E8E3D8]">{topic.volume}</span>
            </div>
          </div>

          {/* Sentiment Shift */}
          <div className="p-4 bg-[#171A1C] border border-[#232729] rounded-sm space-y-2">
            <div className="text-[10px] text-[#737C80] uppercase">SENTIMENT SHIFT DYNAMICS</div>
            <div className="flex justify-between text-[11px] pt-1">
              <span>BEFORE: <strong className="text-[#737C80]">Neutral 54%</strong></span>
              <span>AFTER: <strong className="text-[#C75C5C]">Negative 68%</strong></span>
            </div>
            <div className="h-2 w-full bg-[#232729] rounded-xs overflow-hidden flex mt-1">
              <div className="w-[68%] bg-[#C75C5C]" />
              <div className="w-[20%] bg-[#737C80]" />
              <div className="w-[12%] bg-[#5AA9A0]" />
            </div>
          </div>

          {/* Cross Platform Flow */}
          <div className="p-4 bg-[#171A1C] border border-[#232729] rounded-sm space-y-2">
            <div className="text-[10px] text-[#737C80] uppercase">CROSS-PLATFORM SPREAD PATH</div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#C9784A] pt-1">
              <span>X</span>
              <span>→</span>
              <span>TELEGRAM</span>
              <span>→</span>
              <span>YOUTUBE</span>
            </div>
          </div>

          {/* Coordination Signal */}
          <div className="p-4 bg-[#171A1C] border border-[#C9784A]/40 rounded-sm space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-[#C9784A] font-bold uppercase">COORDINATION SIGNAL</span>
              <span className="text-[#D6A84F] font-bold">UNREVIEWED</span>
            </div>
            <p className="font-sans text-xs text-[#E8E3D8]/90 leading-relaxed">
              Statistical association detected across 7 accounts ($p = 0.003$). Analyst review required.
            </p>
            <button
              onClick={() => onNavigateToScreen('coordination')}
              className="w-full mt-2 py-2 bg-[#232729] hover:bg-[#C9784A] hover:text-[#0D1012] text-[#E8E3D8] font-bold text-[10px] rounded-xs transition-colors cursor-pointer"
            >
              REVIEW COORDINATION SIGNAL →
            </button>
          </div>
        </div>

        {/* Center: Interactive Propagation Sequence Timeline (~70% / 8 cols) */}
        <div className="lg:col-span-8 bg-[#171A1C] border border-[#232729] rounded-sm p-5 space-y-5">
          {/* Controls Bar */}
          <div className="flex items-center justify-between border-b border-[#232729] pb-3">
            <div>
              <h2 className="font-sans font-bold text-sm text-[#E8E3D8] uppercase tracking-wide">
                CHRONOLOGICAL PROPAGATION TRAIL
              </h2>
              <p className="font-mono text-[10px] text-[#737C80]">
                TEMPORAL EMERGENCE SEQUENCING ACROSS NODES & PLATFORMS
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px]">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 bg-[#C9784A] text-[#0D1012] font-bold rounded-xs flex items-center gap-1.5 cursor-pointer hover:bg-[#C9784A]/90 transition-colors"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isPlaying ? 'PAUSE' : 'REPLAY PROPAGATION'}</span>
              </button>
              <button
                onClick={() => {
                  setActiveStep(1);
                  setIsPlaying(false);
                }}
                className="p-1.5 bg-[#232729] text-[#737C80] hover:text-[#E8E3D8] rounded-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sequential Propagation Path Visual */}
          <div className="space-y-3">
            {PROPAGATION_SEQUENCE.map((step) => {
              const isRevealed = step.stepIndex <= activeStep;
              const isCurrent = step.stepIndex === activeStep;

              return (
                <motion.div
                  key={step.stepIndex}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: isRevealed ? 1 : 0.25, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setActiveStep(step.stepIndex)}
                  className={`p-4 bg-[#0D1012] border rounded-xs transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? 'border-[#C9784A] bg-[#232729]/40 shadow-lg'
                      : isRevealed
                      ? 'border-[#232729]'
                      : 'border-[#232729]/30 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded-xs font-bold ${isCurrent ? 'bg-[#C9784A] text-[#0D1012]' : 'bg-[#232729] text-[#C9784A]'}`}>
                        STEP 0{step.stepIndex}
                      </span>
                      <span className="text-[#E8E3D8] font-bold">{step.time}</span>
                      <span>·</span>
                      <span className="text-[#5AA9A0]">{step.platform}</span>
                    </div>

                    {step.nodeId && (
                      <span className="text-[#C9784A] font-bold">NODE: {step.nodeId}</span>
                    )}
                  </div>

                  <h3 className="font-sans font-bold text-xs text-[#E8E3D8] mb-1">
                    {step.title}
                  </h3>

                  <p className="font-sans text-xs text-[#BDB5A6]/80">
                    {step.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Structured Evidence Explanation: "WHY THIS ALERT EXISTS" */}
          <div className="p-4 bg-[#0D1012] border border-[#232729] rounded-xs space-y-3 font-mono text-xs">
            <h3 className="font-sans font-bold text-xs text-[#E8E3D8] uppercase tracking-wide text-[#C9784A]">
              WHY THIS ALERT EXISTS (STRUCTURED EVIDENCE REASONING)
            </h3>

            <div className="space-y-1.5 text-[11px] text-[#BDB5A6]">
              <div className="flex items-start gap-2">
                <span className="text-[#5AA9A0] font-bold">•</span>
                <span>Topic volume increased 312% in 4 hours across 4 platforms</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#5AA9A0] font-bold">•</span>
                <span>Acceleration crossed automatic intelligence alert threshold</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#5AA9A0] font-bold">•</span>
                <span>Negative sentiment increased 21.4% with 0.82 sarcasm likelihood score</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#5AA9A0] font-bold">•</span>
                <span>Community 04 activity preceded Community 07 Telegram crossover</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#5AA9A0] font-bold">•</span>
                <span>Bridge Node N184 exhibited high betweenness centrality (0.81)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#5AA9A0] font-bold">•</span>
                <span>Statistical coordination test produced $p = 0.003$ (FDR-adjusted)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
