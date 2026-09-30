import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EVIDENCE_RECORDS } from '../../data/mockIntelligence';
import { EvidenceRecord } from '../../types/nexus';
import { FileCheck, ShieldCheck, Check, Lock, Database, Cpu } from 'lucide-react';

export const IntegrityScreen: React.FC = () => {
  const [records, setRecords] = useState<EvidenceRecord[]>(EVIDENCE_RECORDS);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<number>(0);

  const handleVerify = (id: string) => {
    setVerifyingId(id);
    setVerificationStep(1);

    setTimeout(() => setVerificationStep(2), 600);
    setTimeout(() => setVerificationStep(3), 1200);
    setTimeout(() => setVerificationStep(4), 1800);
    setTimeout(() => {
      setVerifyingId(null);
      setVerificationStep(0);
    }, 2800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#232729] pb-4">
        <h1 className="font-sans font-extrabold text-xl text-[#E8E3D8] tracking-wide uppercase">
          09. EVIDENCE INTEGRITY & TAMPER-EVIDENT LEDGER
        </h1>
        <p className="font-mono text-xs text-[#737C80] mt-0.5">
          Cryptographic Merkle tree provenance, model version audit log, and forensic verification
        </p>
      </div>

      {/* Forensic Verification Ledger Stream */}
      <div className="space-y-4">
        {records.map((rec) => {
          const isVerifying = verifyingId === rec.id;

          return (
            <div
              key={rec.id}
              className="p-5 bg-[#171A1C] border border-[#232729] rounded-sm space-y-4 font-mono text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232729] pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-[#5AA9A0]/10 border border-[#5AA9A0]/30 text-[#5AA9A0] rounded-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#C9784A] font-bold text-[10px]">{rec.id}</span>
                    <h2 className="font-sans font-bold text-sm text-[#E8E3D8]">{rec.source}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#737C80]">MODEL:</span>
                  <span className="text-[#E8E3D8] font-bold">{rec.model}</span>
                </div>
              </div>

              {/* Hashes & Merkle Checkpoints */}
              <div className="space-y-2 p-3 bg-[#0D1012] border border-[#232729] rounded-xs text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#737C80]">PREVIOUS HASH:</span>
                  <span className="text-[#BDB5A6]">{rec.previousHash}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#737C80]">RECORD HASH (SHA-256):</span>
                  <span className="text-[#5AA9A0] font-bold">{rec.recordHash}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#737C80]">MERKLE CHECKPOINT:</span>
                  <span className="text-[#C9784A]">{rec.merkleCheckpoint}</span>
                </div>
              </div>

              <p className="font-sans text-xs text-[#BDB5A6]/90 leading-relaxed bg-[#0D1012] p-3 border border-[#232729] rounded-xs">
                {rec.payloadSummary}
              </p>

              {/* Verification Sequence Interactive Area */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#232729]">
                <div className="flex items-center gap-4 text-[10px] text-[#737C80]">
                  <span>CONFIDENCE: <strong className="text-[#E8E3D8]">{rec.confidence}</strong></span>
                  <span>SIGNATURE: <strong className="text-[#5AA9A0]">{rec.signatureStatus}</strong></span>
                  <span>CHAIN: <strong className="text-[#5AA9A0]">{rec.chainStatus}</strong></span>
                </div>

                <button
                  onClick={() => handleVerify(rec.id)}
                  disabled={isVerifying}
                  className="px-4 py-2 bg-[#5AA9A0] hover:bg-[#5AA9A0]/90 text-[#0D1012] font-mono font-bold text-xs rounded-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-80"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>
                    {isVerifying ? 'VERIFYING FORENSIC PROVENANCE...' : 'VERIFY RECORD'}
                  </span>
                </button>
              </div>

              {/* Verification Progress Modal Overlay */}
              <AnimatePresence>
                {isVerifying && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-[#0D1012] border border-[#5AA9A0]/50 rounded-xs space-y-2 text-[11px]"
                  >
                    <div className="font-bold text-[#5AA9A0] mb-2 uppercase">
                      RUNNING CRYPTOGRAPHIC PROVENANCE CHECK...
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[#BDB5A6]">1. COMPUTING SHA-256 RECORD HASH MATCH</span>
                        {verificationStep >= 1 && <span className="text-[#5AA9A0] font-bold">HASH MATCH ✓</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#BDB5A6]">2. VERIFYING MODEL ASymmetric SIGNATURE</span>
                        {verificationStep >= 2 && <span className="text-[#5AA9A0] font-bold">SIGNATURE VALID ✓</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#BDB5A6]">3. AUDITING MERKLE TREE PREVIOUS HASH CHAIN</span>
                        {verificationStep >= 3 && <span className="text-[#5AA9A0] font-bold">CHAIN INTACT ✓</span>}
                      </div>
                    </div>

                    {verificationStep >= 4 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-2 bg-[#5AA9A0]/20 border border-[#5AA9A0] text-[#5AA9A0] font-bold text-center rounded-xs mt-3 flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>FINAL STATE: EVIDENCE VERIFIED & UNTAMPERED</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
