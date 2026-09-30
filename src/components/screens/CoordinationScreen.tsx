import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CoordinationCluster, ReviewState } from '../../types/nexus';
import { ShieldAlert, CheckCircle, XCircle, Info, UserCheck, AlertTriangle, Lock } from 'lucide-react';
import { useNexus } from '../../context/NexusContext';

export const CoordinationScreen: React.FC = () => {
  const { activeDataset, permissions } = useNexus();
  const [clusters, setClusters] = useState<CoordinationCluster[]>(
    activeDataset.coordinationClusters
  );

  const updateStatus = (id: string, newState: ReviewState) => {
    if (!permissions.canMutateCoordination) return;
    setClusters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, reviewState: newState } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#232729] pb-4">
        <div>
          <h1 className="font-sans font-extrabold text-xl text-[#E8E3D8] tracking-wide uppercase">
            08. COORDINATION SIGNAL ANALYSIS
          </h1>
          <p className="font-mono text-xs text-[#737C80] mt-0.5">
            Statistical posting synchrony detection and false discovery rate corrected signal evaluation
          </p>
        </div>

        {/* Responsible AI Disclaimer */}
        <div className="flex items-center gap-2 font-mono text-[11px] bg-[#171A1C] border border-[#232729] px-3 py-1.5 rounded-xs text-[#D6A84F]">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Statistical association does not establish intent or attribution.</span>
        </div>
      </div>

      {/* Permission Restriction Warning for Viewer/Auditor */}
      {!permissions.canMutateCoordination && (
        <div className="p-3 bg-[#171A1C] border border-[#232729] rounded-xs font-mono text-xs flex items-center gap-2 text-[#737C80]">
          <Lock className="w-3.5 h-3.5 text-[#D6A84F]" />
          <span>
            Signal review actions (Confirm / Dismiss) are disabled for your current role.
          </span>
        </div>
      )}

      {/* Clusters List */}
      <div className="space-y-4">
        {clusters.map((cluster) => (
          <div
            key={cluster.id}
            className="p-5 bg-[#171A1C] border border-[#232729] rounded-sm space-y-4 font-mono text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232729] pb-3">
              <div>
                <div className="text-[10px] text-[#C9784A] font-bold uppercase">{cluster.id}</div>
                <h2 className="font-sans font-bold text-sm text-[#E8E3D8]">{cluster.name}</h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#737C80]">STATE:</span>
                <span
                  className={`px-2 py-0.5 rounded-xs font-bold text-[10px] ${
                    cluster.reviewState === 'CONFIRMED'
                      ? 'bg-[#5AA9A0]/20 text-[#5AA9A0] border border-[#5AA9A0]/40'
                      : cluster.reviewState === 'DISMISSED'
                      ? 'bg-[#737C80]/20 text-[#737C80] border border-[#737C80]/40'
                      : 'bg-[#D6A84F]/20 text-[#D6A84F] border border-[#D6A84F]/40'
                  }`}
                >
                  {cluster.reviewState}
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 bg-[#0D1012] border border-[#232729] rounded-xs text-[11px]">
              <div>
                <div className="text-[9px] text-[#737C80]">MEMBERS</div>
                <div className="text-sm font-bold text-[#E8E3D8]">{cluster.membersCount} Accounts</div>
              </div>
              <div>
                <div className="text-[9px] text-[#737C80]">SHARED PAYLOADS</div>
                <div className="text-sm font-bold text-[#E8E3D8]">{cluster.sharedItemsCount} Items</div>
              </div>
              <div>
                <div className="text-[9px] text-[#737C80]">MEDIAN TIMING GAP</div>
                <div className="text-sm font-bold text-[#C9784A]">{cluster.medianTimingGapSec} sec</div>
              </div>
              <div>
                <div className="text-[9px] text-[#737C80]">SYNCHRONY INDEX</div>
                <div className="text-sm font-bold text-[#5AA9A0]">{cluster.synchronyScore}</div>
              </div>
              <div>
                <div className="text-[9px] text-[#737C80]">P-VALUE (FDR)</div>
                <div className="text-sm font-bold text-[#C75C5C]">p = {cluster.pValue}</div>
              </div>
            </div>

            <p className="font-sans text-xs text-[#BDB5A6]/90 leading-relaxed bg-[#0D1012] p-3 border border-[#232729] rounded-xs">
              {cluster.summary}
            </p>

            {/* Action Buttons Workflow */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#232729]">
              <button
                onClick={() => updateStatus(cluster.id, 'CONFIRMED')}
                disabled={!permissions.canMutateCoordination}
                className={`px-3 py-1.5 font-bold text-[10px] rounded-xs transition-colors cursor-pointer border ${
                  permissions.canMutateCoordination
                    ? 'bg-[#5AA9A0]/20 hover:bg-[#5AA9A0] text-[#5AA9A0] hover:text-[#0D1012] border-[#5AA9A0]/40'
                    : 'bg-[#232729] text-[#737C80] border-[#232729] cursor-not-allowed'
                }`}
              >
                CONFIRM SIGNAL
              </button>
              <button
                onClick={() => updateStatus(cluster.id, 'DISMISSED')}
                disabled={!permissions.canMutateCoordination}
                className={`px-3 py-1.5 font-bold text-[10px] rounded-xs transition-colors cursor-pointer border ${
                  permissions.canMutateCoordination
                    ? 'bg-[#232729] hover:bg-[#737C80]/40 text-[#737C80] hover:text-[#E8E3D8] border-[#232729]'
                    : 'bg-[#232729] text-[#737C80] border-[#232729] cursor-not-allowed'
                }`}
              >
                DISMISS SIGNAL
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
