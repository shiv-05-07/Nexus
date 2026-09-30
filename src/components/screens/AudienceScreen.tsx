import React from 'react';
import { Users, Shield, AlertCircle, Lock } from 'lucide-react';
import { useNexus } from '../../context/NexusContext';

export const AudienceScreen: React.FC = () => {
  const { activeDataset } = useNexus();
  const audienceClusters = activeDataset.audienceClusters;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#232729] pb-4">
        <h1 className="font-sans font-extrabold text-xl text-[#E8E3D8] tracking-wide uppercase">
          05. AUDIENCE CLUSTER INTELLIGENCE
        </h1>
        <p className="font-mono text-xs text-[#737C80] mt-0.5">
          Aggregate demographic cluster estimations, regional distribution, and language indicators ({activeDataset.name})
        </p>
      </div>

      {/* Mandatory Privacy & Responsible AI Disclaimer */}
      <div className="p-4 bg-[#171A1C] border border-[#232729] rounded-xs font-mono text-xs flex items-start gap-3">
        <Lock className="w-4 h-4 text-[#5AA9A0] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-[#5AA9A0] font-bold uppercase tracking-wider text-[11px]">
            DEMOGRAPHIC PRIVACY & COMPLIANCE NOTICE
          </div>
          <p className="text-[#BDB5A6]/80 text-[11px] leading-relaxed">
            “Demographic outputs are aggregate estimates based on observable public signals. Individual-level demographic claims are not displayed.”
            This platform strictly prohibits tracking individual names, addresses, health, or protected personal data.
          </p>
        </div>
      </div>

      {/* Audience Clusters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {audienceClusters.map((cluster) => (
          <div
            key={cluster.id}
            className={`p-5 bg-[#171A1C] border rounded-sm space-y-4 font-mono text-xs ${
              cluster.isUnknown
                ? 'border-[#737C80]/40 bg-[#171A1C]/50'
                : 'border-[#232729] hover:border-[#5AA9A0]/50'
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#232729] pb-2">
              <span className="font-bold text-[#E8E3D8]">{cluster.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-xs ${
                  cluster.isUnknown ? 'bg-[#737C80]/20 text-[#737C80]' : 'bg-[#5AA9A0]/10 text-[#5AA9A0]'
                }`}
              >
                SAMPLE: {cluster.sampleSize}
              </span>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="text-[10px] text-[#737C80]">AGE BRACKET</div>
                <div className="text-[#E8E3D8] font-bold mt-0.5">{cluster.ageBracket}</div>
              </div>

              <div>
                <div className="text-[10px] text-[#737C80]">LANGUAGES</div>
                <div className="text-[#E8E3D8] mt-0.5">{cluster.languages}</div>
              </div>

              <div>
                <div className="text-[10px] text-[#737C80]">REGION</div>
                <div className="text-[#E8E3D8] mt-0.5">{cluster.region}</div>
              </div>

              <div>
                <div className="text-[10px] text-[#737C80]">PRIMARY INTEREST</div>
                <div className="text-[#5AA9A0] font-semibold mt-0.5">{cluster.interests}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#232729] flex justify-between text-[10px] text-[#737C80]">
              <span>CONFIDENCE: <strong className="text-[#E8E3D8]">{cluster.confidence}</strong></span>
              <span>COVERAGE: <strong className="text-[#E8E3D8]">{Math.round(cluster.coverage * 100)}%</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
