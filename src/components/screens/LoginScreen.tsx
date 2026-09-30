import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, ArrowRight, UserCheck, Check } from 'lucide-react';
import { DEMO_IDENTITIES, UserRole } from '../../types/nexus';
import { useNexus } from '../../context/NexusContext';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { setCurrentUserRole, currentUser } = useNexus();
  const [selectedRole, setSelectedRole] = useState<UserRole>('ANALYST');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUserRole(selectedRole);
    onLogin();
  };

  return (
    <div className="min-h-screen w-full bg-[#0D1012] flex items-center justify-center p-4 font-sans text-[#E8E3D8] relative overflow-hidden select-none">
      {/* Background Grid Pattern */}
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
          <div className="inline-block font-mono text-[10px] bg-[#C9784A]/10 border border-[#C9784A]/30 text-[#C9784A] px-2 py-0.5 rounded-xs mt-2 font-bold">
            DEMONSTRATION ENVIRONMENT
          </div>
        </div>

        {/* Identity Selector */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-2">
            <label className="text-[10px] text-[#737C80] uppercase tracking-wider block">
              SELECT DEMO IDENTITY ROLE
            </label>

            <div className="space-y-2">
              {(['ANALYST', 'AUDITOR', 'VIEWER', 'ADMINISTRATOR'] as UserRole[]).map((r) => {
                const identity = DEMO_IDENTITIES[r];
                const isSelected = selectedRole === r;

                return (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`w-full p-3 border rounded-xs text-left transition-all duration-150 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#C9784A] bg-[#232729] text-[#E8E3D8]'
                        : 'border-[#232729] bg-[#0D1012] text-[#737C80] hover:text-[#BDB5A6]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#E8E3D8]">{identity.id}</span>
                        <span className="text-[10px] text-[#C9784A]">({r})</span>
                      </div>
                      <div className="font-sans text-[11px] text-[#BDB5A6] mt-0.5">
                        {identity.name}
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-[#5AA9A0]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 py-3 bg-[#C9784A] hover:bg-[#C9784A]/90 text-[#0D1012] font-bold text-xs tracking-wider rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
          >
            <span>ENTER DEMO SYSTEM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#232729] flex justify-between font-mono text-[10px] text-[#737C80]">
          <span>ENVIRONMENT: DEMO SECURE ACCESS</span>
          <span>SIH 26152 / NTRO</span>
        </div>
      </motion.div>
    </div>
  );
};
