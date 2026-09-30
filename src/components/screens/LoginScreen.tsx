import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, ArrowRight, Activity, Terminal } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [analystId, setAnalystId] = useState('AN-9042');
  const [accessKey, setAccessKey] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen w-full bg-[#0D1012] flex items-center justify-center p-4 font-sans text-[#E8E3D8] relative overflow-hidden select-none">
      {/* Background Subtle Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#171A1C_1px,transparent_1px),linear-gradient(to_bottom,#171A1C_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[#171A1C] border border-[#232729] rounded-sm p-8 shadow-2xl space-y-6 z-10 relative"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-[#232729] border border-[#737C80]/30 rounded-xs mb-2">
            <div className="w-2.5 h-2.5 bg-[#C9784A] rounded-full" />
          </div>
          <h1 className="font-sans font-extrabold text-2xl tracking-wider text-[#E8E3D8] uppercase">
            NEXUS
          </h1>
          <p className="font-mono text-[11px] tracking-widest text-[#737C80] uppercase">
            Social Narrative Intelligence
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1">
            <label className="text-[10px] text-[#737C80] uppercase tracking-wider block">
              ANALYST ID
            </label>
            <input
              type="text"
              value={analystId}
              onChange={(e) => setAnalystId(e.target.value)}
              className="w-full bg-[#0D1012] border border-[#232729] focus:border-[#C9784A] text-[#E8E3D8] px-3 py-2.5 rounded-xs outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#737C80] uppercase tracking-wider block">
              ACCESS KEY
            </label>
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="w-full bg-[#0D1012] border border-[#232729] focus:border-[#C9784A] text-[#E8E3D8] px-3 py-2.5 rounded-xs outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-[#C9784A] hover:bg-[#C9784A]/90 text-[#0D1012] font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
          >
            <span>ENTER SYSTEM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#232729] flex justify-between font-mono text-[10px] text-[#737C80]">
          <span>ENVIRONMENT: PROTOTYPE</span>
          <span>SIH 26152 / NTRO</span>
        </div>
      </motion.div>
    </div>
  );
};
