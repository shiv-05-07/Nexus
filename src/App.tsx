import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, EmergingNarrative, TimelineEvent } from './types/nexus';
import { NexusProvider, useNexus } from './context/NexusContext';

import { Sidebar } from './components/common/Sidebar';
import { TopBar } from './components/common/TopBar';
import { CommandSearchModal } from './components/common/CommandSearchModal';
import { AlertDrawer } from './components/common/AlertDrawer';
import { InvestigationDrawer } from './components/common/InvestigationDrawer';

import { OverviewScreen } from './components/screens/OverviewScreen';
import { TimelineScreen } from './components/screens/TimelineScreen';
import { SentimentScreen } from './components/screens/SentimentScreen';
import { TrendsScreen } from './components/screens/TrendsScreen';
import { AudienceScreen } from './components/screens/AudienceScreen';
import { NetworkScreen } from './components/screens/NetworkScreen';
import { InvestigateScreen } from './components/screens/InvestigateScreen';
import { CoordinationScreen } from './components/screens/CoordinationScreen';
import { IntegrityScreen } from './components/screens/IntegrityScreen';
import { LoginScreen } from './components/screens/LoginScreen';

function MainAppContent() {
  const { activeDataset, isSourceSwitching, sourceMode } = useNexus();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('overview');

  // Interactive drawers & search state
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [selectedDrawerTopic, setSelectedDrawerTopic] = useState<EmergingNarrative | null>(null);

  // Dynamic counter simulation for total events
  const [totalEvents, setTotalEvents] = useState<number>(activeDataset.metrics[0]?.value || 284391);

  // Sync event count when dataset changes
  useEffect(() => {
    if (activeDataset.metrics[0]?.value) {
      setTotalEvents(activeDataset.metrics[0].value);
    }
  }, [activeDataset]);

  // Event ticker interval simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalEvents((prev) => prev + Math.floor(Math.random() * 18) + 8);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Topic selection handler from any screen
  const handleSelectTopic = (topicId: string) => {
    const found =
      activeDataset.narratives.find((t) => t.id === topicId) || activeDataset.narratives[0];
    if (found) {
      setSelectedDrawerTopic(found);
    }
  };

  // Direct navigate to Narrative Investigation Screen
  const handleLaunchFullInvestigation = (topicId: string) => {
    setCurrentScreen('investigate');
    setSelectedDrawerTopic(null);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const alerts = activeDataset.alerts;
  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="flex h-screen w-screen bg-[#0D1012] text-[#E8E3D8] font-sans antialiased overflow-hidden select-none relative">
      {/* Source Switching Transition Overlay */}
      <AnimatePresence>
        {isSourceSwitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-[#0D1012]/90 backdrop-blur-xs z-50 flex items-center justify-center font-mono text-xs text-[#C9784A]"
          >
            <div className="p-4 bg-[#171A1C] border border-[#232729] rounded-xs space-y-2 text-center">
              <div className="font-bold tracking-widest uppercase text-sm">
                DATA SOURCE SWITCHING...
              </div>
              <div className="text-[10px] text-[#737C80]">
                RECONFIGURING PIPELINE TO {sourceMode} MODE
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Left Navigation Rail */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Status & Command Header Bar */}
        <TopBar
          totalEvents={totalEvents}
          unreadAlertsCount={unreadAlertsCount}
          onOpenAlerts={() => setIsAlertsOpen(true)}
          onOpenCommandSearch={() => setIsCommandOpen(true)}
        />

        {/* Page Viewport Area with Premium Smooth Motion Transition */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentScreen}-${sourceMode}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.92, y: 4 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-7xl mx-auto"
            >
              {currentScreen === 'overview' && (
                <OverviewScreen
                  onSelectTopic={handleSelectTopic}
                  onNavigateToScreen={(s) => setCurrentScreen(s as ScreenId)}
                />
              )}

              {currentScreen === 'timeline' && (
                <TimelineScreen
                  onSelectEvent={(evt) => handleSelectTopic(evt.topicId || 'TP-8842')}
                />
              )}

              {currentScreen === 'sentiment' && <SentimentScreen />}

              {currentScreen === 'trends' && (
                <TrendsScreen
                  onInvestigateTopic={handleLaunchFullInvestigation}
                />
              )}

              {currentScreen === 'audience' && <AudienceScreen />}

              {currentScreen === 'network' && (
                <NetworkScreen
                  onSelectNode={(node) => handleSelectTopic('TP-8842')}
                />
              )}

              {currentScreen === 'investigate' && (
                <InvestigateScreen
                  onNavigateToScreen={(s) => setCurrentScreen(s as ScreenId)}
                />
              )}

              {currentScreen === 'coordination' && <CoordinationScreen />}

              {currentScreen === 'integrity' && <IntegrityScreen />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Slide-over Drawers & Modals */}
      <CommandSearchModal
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={(s) => setCurrentScreen(s)}
        onSelectTopic={handleLaunchFullInvestigation}
      />

      <AlertDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onNavigateToTopic={(topicId) => {
          handleLaunchFullInvestigation(topicId);
          setIsAlertsOpen(false);
        }}
      />

      <InvestigationDrawer
        isOpen={selectedDrawerTopic !== null}
        topic={selectedDrawerTopic}
        onClose={() => setSelectedDrawerTopic(null)}
        onFullInvestigate={handleLaunchFullInvestigation}
      />
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  if (!isAuthenticated) {
    return (
      <NexusProvider>
        <LoginScreen onLogin={() => setIsAuthenticated(true)} />
      </NexusProvider>
    );
  }

  return (
    <NexusProvider onSignOut={() => setIsAuthenticated(false)}>
      <MainAppContent />
    </NexusProvider>
  );
}
