import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, AlertTriangle, ArrowRight, Activity, Share2, ShieldAlert } from 'lucide-react';
import { IntelligenceAlert, ScreenId } from '../../types/nexus';

interface AlertDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: IntelligenceAlert[];
  onNavigateToTopic: (topicId: string, screen: ScreenId) => void;
}

export const AlertDrawer: React.FC<AlertDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onNavigateToTopic,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Subtle backdrop dim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Slide-over Drawer */}
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md h-full bg-[#171A1C] border-l border-[#232729] shadow-2xl flex flex-col z-10 text-xs font-sans text-[#E8E3D8]"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#232729] flex items-center justify-between bg-[#0D1012]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#C9784A]/10 border border-[#C9784A]/30 rounded-xs text-[#C9784A]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-sans font-bold text-sm tracking-wide text-[#E8E3D8]">
                  INTELLIGENCE ALERTS
                </h2>
                <p className="font-mono text-[10px] text-[#737C80]">
                  REAL-TIME NARRATIVE DISPATCH STREAM
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#737C80] hover:text-[#E8E3D8] hover:bg-[#232729] rounded-xs transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Alert Cards Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 bg-[#0D1012] border rounded-xs transition-all duration-150 relative group ${
                  alert.read ? 'border-[#232729]' : 'border-[#C9784A]/40'
                }`}
              >
                {!alert.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 bg-[#C9784A] rounded-full animate-quiet-pulse" />
                )}

                <div className="flex items-center gap-2 font-mono text-[10px] text-[#737C80] mb-1">
                  <span className="text-[#C9784A] font-semibold">{alert.type}</span>
                  <span>·</span>
                  <span>{alert.time}</span>
                  <span>·</span>
                  <span>{alert.id}</span>
                </div>

                <h3 className="font-sans font-semibold text-xs text-[#E8E3D8] mb-1">
                  {alert.title}
                </h3>

                <p className="font-mono text-[11px] text-[#BDB5A6]/80 leading-relaxed mb-3">
                  {alert.detail}
                </p>

                {alert.topicId && (
                  <button
                    onClick={() => {
                      onNavigateToTopic(alert.topicId!, 'investigate');
                      onClose();
                    }}
                    className="w-full py-1.5 px-3 bg-[#232729] hover:bg-[#C9784A] text-[#E8E3D8] hover:text-[#0D1012] font-mono text-[10px] tracking-wider rounded-xs flex items-center justify-between transition-colors duration-150 cursor-pointer"
                  >
                    <span>LAUNCH INVESTIGATION</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="p-3 bg-[#0D1012] border-t border-[#232729] font-mono text-[10px] text-[#737C80] flex items-center justify-between">
            <span>AUTOMATED THRESHOLD MONITOR</span>
            <span className="text-[#5AA9A0]">ACTIVE</span>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};
