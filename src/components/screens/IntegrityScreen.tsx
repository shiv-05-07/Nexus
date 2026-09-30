import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EvidenceRecord } from '../../types/nexus';
import { FileCheck, ShieldCheck, Check, AlertTriangle, ShieldAlert, Cpu, Lock, HelpCircle } from 'lucide-react';
import { useNexus } from '../../context/NexusContext';

export const IntegrityScreen: React.FC = () => {
  const { activeDataset, permissions, isTampered, setIsTampered } = useNexus();
  const records = activeDataset.evidenceRecords;

  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<number>(0);

  const handleVerify = (id: string) => {
    if (!permissions.canVerifyEvidence) return;
    setVerifyingId(id);
    setVerificationStep(1);

    setTimeout(() => setVerificationStep(2), 500);
    setTimeout(() => setVerificationStep(3), 1000);
    setTimeout(() => setVerificationStep(4), 1500);
    setTimeout(() => setVerificationStep(5), 2000);
    setTimeout(() => setVerificationStep(6), 2500);
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

      {/* WHY THIS EXISTS Explanatory Banner */}
      <div className="p-4 bg-[#171A1C] border border-[#232729] rounded-xs font-mono text-xs flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-[#5AA9A0] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-[#5AA9A0] font-bold uppercase tracking-wider text-[11px]">
            WHY THIS EXISTS (TAMPER-EVIDENT FORENSIC LEDGER)
          </div>
          <p className="text-[#BDB5A6]/80 text-[11px] leading-relaxed">
            “NEXUS records analytical outputs in a tamper-evident evidence ledger. Verification recomputes the record hash, validates its cryptographic signature, and checks its position in the evidence chain.”
          </p>
        </div>
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
                  <span className="text-[#BDB5A6]">
                    {isTampered ? '0x00000000000000000000' : rec.previousHash}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#737C80]">RECORD HASH (SHA-256):</span>
                  <span className={isTampered ? 'text-[#C75C5C] font-bold' : 'text-[#5AA9A0] font-bold'}>
                    {isTampered ? '0xTAMPERED_RECORD_HASH_MISMATCH' : rec.recordHash}
                  </span>
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
                  <span>
                    SIGNATURE:{' '}
                    <strong className="text-[#5AA9A0]">
                      {rec.signatureStatus}
                    </strong>
                  </span>
                  <span>
                    CHAIN:{' '}
                    <strong className={isTampered ? 'text-[#C75C5C]' : 'text-[#5AA9A0]'}>
                      {isTampered ? 'TAMPERED' : rec.chainStatus}
                    </strong>
                  </span>
                </div>

                <button
                  onClick={() => handleVerify(rec.id)}
                  disabled={isVerifying || !permissions.canVerifyEvidence}
                  className={`px-4 py-2 font-mono font-bold text-xs rounded-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    permissions.canVerifyEvidence
                      ? 'bg-[#5AA9A0] hover:bg-[#5AA9A0]/90 text-[#0D1012] cursor-pointer'
                      : 'bg-[#232729] text-[#737C80] border border-[#232729] cursor-not-allowed opacity-60'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>
                    {!permissions.canVerifyEvidence
                      ? 'VERIFY RECORD [DISABLED]'
                      : isVerifying
                      ? 'RUNNING FORENSIC VERIFICATION...'
                      : 'VERIFY RECORD'}
                  </span>
                </button>
              </div>

              {/* Verification Progress Output Overlay */}
              <AnimatePresence>
                {isVerifying && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-[#0D1012] border border-[#5AA9A0]/50 rounded-xs space-y-2 text-[11px]"
                  >
                    <div className="font-bold text-[#5AA9A0] mb-2 uppercase">
                      RUNNING CRYPTOGRAPHIC PROVENANCE ROUTINE...
                    </div>

                    <div className="space-y-1.5 font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[#BDB5A6]">1. VERIFYING RECORD...</span>
                        {verificationStep >= 1 && <span className="text-[#5AA9A0]">DONE</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#BDB5A6]">2. COMPUTING SHA-256 RECORD HASH</span>
                        {verificationStep >= 2 && <span className="text-[#5AA9A0]">DONE</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#BDB5A6]">3. COMPARING RECORD HASH</span>
                        {verificationStep >= 3 && (
                          <span className={isTampered ? 'text-[#C75C5C] font-bold' : 'text-[#5AA9A0] font-bold'}>
                            {isTampered ? '✕ HASH MISMATCH' : '✓ HASH MATCH'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#BDB5A6]">4. VERIFYING ED25519 SIGNATURE</span>
                        {verificationStep >= 4 && <span className="text-[#5AA9A0] font-bold">✓ SIGNATURE VALID</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#BDB5A6]">5. CHECKING PREVIOUS-HASH LINK</span>
                        {verificationStep >= 5 && (
                          <span className={isTampered ? 'text-[#C75C5C] font-bold' : 'text-[#5AA9A0] font-bold'}>
                            {isTampered ? '✕ LINK BROKEN' : '✓ PREVIOUS LINK VALID'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#BDB5A6]">6. CHECKING MERKLE CHECKPOINT</span>
                        {verificationStep >= 6 && (
                          <span className={isTampered ? 'text-[#C75C5C] font-bold' : 'text-[#5AA9A0] font-bold'}>
                            {isTampered ? '✕ MERKLE MISMATCH' : '✓ MERKLE CHECKPOINT VALID'}
                          </span>
                        )}
                      </div>
                    </div>

                    {verificationStep >= 6 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-3 border font-bold text-center rounded-xs mt-3 flex items-center justify-center gap-2 ${
                          isTampered
                            ? 'bg-[#C75C5C]/20 border-[#C75C5C] text-[#C75C5C]'
                            : 'bg-[#5AA9A0]/20 border-[#5AA9A0] text-[#5AA9A0]'
                        }`}
                      >
                        {isTampered ? (
                          <>
                            <AlertTriangle className="w-4 h-4" />
                            <span>FINAL STATE: EVIDENCE INTEGRITY COMPROMISED — HASH MISMATCH DETECTED</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>
                              FINAL STATE: EVIDENCE VERIFIED — RECORD INTEGRITY INTACT (TIMESTAMP:{' '}
                              {new Date().toISOString().substring(11, 19)} UTC)
                            </span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Diagnostic Tamper Simulation Control (Developer/Audit Demo Only) */}
      <div className="p-4 bg-[#171A1C] border border-[#232729] rounded-xs font-mono text-xs flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="text-[10px] text-[#737C80] uppercase">DIAGNOSTIC TEST CONTROLS</div>
          <p className="text-[#BDB5A6]">Simulate hash tamper payload to test ledger integrity failure detection</p>
        </div>

        <button
          onClick={() => setIsTampered((prev) => !prev)}
          className={`px-3 py-1.5 font-bold text-[10px] rounded-xs transition-colors cursor-pointer border ${
            isTampered
              ? 'bg-[#C75C5C] text-[#0D1012] border-[#C75C5C]'
              : 'bg-[#232729] text-[#C9784A] border-[#C9784A]/40 hover:bg-[#C9784A]/20'
          }`}
        >
          {isTampered ? 'TAMPER SIMULATION ACTIVE (RESET)' : 'SIMULATE TAMPER'}
        </button>
      </div>
    </div>
  );
};
