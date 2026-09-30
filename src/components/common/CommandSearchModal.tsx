import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight, Shield, Zap, Hash, Compass, CheckCircle } from 'lucide-react';
import { ScreenId } from '../../types/nexus';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectTopic?: (topicId: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'NARRATIVE' | 'NODE' | 'COMMAND' | 'VERIFICATION';
  screen?: ScreenId;
  topicId?: string;
  description: string;
}

const COMMAND_SUGGESTIONS: CommandItem[] = [
  {
    id: 'cmd-1',
    title: 'Show emerging narratives',
    category: 'COMMAND',
    screen: 'overview',
    description: 'View top ranked topics sorted by acceleration index',
  },
  {
    id: 'cmd-2',
    title: 'Inspect topic: Public Transport Strike',
    category: 'NARRATIVE',
    screen: 'investigate',
    topicId: 'TP-8842',
    description: 'Launch full cross-platform temporal propagation timeline',
  },
  {
    id: 'cmd-3',
    title: 'Find bridge nodes (N184 / N209)',
    category: 'NODE',
    screen: 'network',
    description: 'Highlight high betweenness centrality nodes across communities',
  },
  {
    id: 'cmd-4',
    title: 'Show sentiment spikes & sarcasm signals',
    category: 'COMMAND',
    screen: 'sentiment',
    description: 'Inspect 0.82 sarcasm likelihood score and negative sentiment wave',
  },
  {
    id: 'cmd-5',
    title: 'Verify evidence record NX-2026-0917',
    category: 'VERIFICATION',
    screen: 'integrity',
    description: 'Check tamper-evident SHA-256 ledger hash & Merkle tree chain',
  },
  {
    id: 'cmd-6',
    title: 'Review coordination cluster CORD-04 (p = 0.003)',
    category: 'COMMAND',
    screen: 'coordination',
    description: 'Inspect 7 synchronized accounts with 42s median timing gap',
  },
];

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectTopic,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredCommands = COMMAND_SUGGESTIONS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex]);
    }
  };

  const executeCommand = (cmd: CommandItem) => {
    if (cmd.screen) {
      onNavigate(cmd.screen);
    }
    if (cmd.topicId && onSelectTopic) {
      onSelectTopic(cmd.topicId);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl bg-[#171A1C] border border-[#232729] rounded-sm shadow-2xl overflow-hidden font-sans text-xs text-[#E8E3D8]"
        >
          {/* Search Bar Input */}
          <div className="p-4 border-b border-[#232729] flex items-center gap-3 bg-[#0D1012]">
            <Search className="w-4 h-4 text-[#C9784A]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search topics, nodes, narratives, evidence IDs..."
              className="w-full bg-transparent text-sm text-[#E8E3D8] placeholder-[#737C80] focus:outline-none font-mono"
            />
            <kbd className="font-mono text-[10px] text-[#737C80] bg-[#232729] px-2 py-0.5 rounded-xs border border-[#737C80]/30">
              ESC
            </kbd>
          </div>

          {/* Suggestions List */}
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#232729]/40">
            {filteredCommands.length === 0 ? (
              <div className="p-6 text-center text-[#737C80] font-mono">
                No intelligence items match "{query}"
              </div>
            ) : (
              filteredCommands.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => executeCommand(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-3 rounded-xs flex items-start justify-between transition-colors duration-150 cursor-pointer ${
                      isSelected ? 'bg-[#232729] text-[#E8E3D8]' : 'text-[#BDB5A6] hover:bg-[#232729]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#0D1012] border border-[#737C80]/30 text-[#C9784A] rounded-xs">
                          {item.category}
                        </span>
                        <span className="font-sans font-semibold text-xs text-[#E8E3D8]">
                          {item.title}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-[#737C80] pl-0.5">
                        {item.description}
                      </p>
                    </div>

                    <ArrowRight className={`w-3.5 h-3.5 mt-1 shrink-0 ${isSelected ? 'text-[#C9784A]' : 'text-transparent'}`} />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="p-2.5 bg-[#0D1012] border-t border-[#232729] flex items-center justify-between font-mono text-[10px] text-[#737C80]">
            <div className="flex items-center gap-4">
              <span><kbd className="bg-[#232729] px-1 text-[#E8E3D8]">↑↓</kbd> Navigate</span>
              <span><kbd className="bg-[#232729] px-1 text-[#E8E3D8]">↵</kbd> Select</span>
            </div>
            <div>NEXUS COMMAND DISPATCH</div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
