import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DataMode, EmergingNarrative, IntelligenceAlert, ScreenId, TimelineEvent } from './types/nexus';
import { EMERGING_NARRATIVES, INTELLIGENCE_ALERTS, TIMELINE_EVENTS } from './data/mockIntelligence';

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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // default logged in for prototype demo
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('overview');
  const [dataMode, setDataMode] = useState<DataMode>('SYNTHETIC');

  // Interactive drawers & search state
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [selectedDrawerTopic, setSelectedDrawerTopic] = useState<EmergingNarrative | null>(null);

  // Live dynamic counter for events
  const [totalEvents, setTotalEvents] = useState<number>(284391);
  const [alerts, setAlerts] = useState<IntelligenceAlert[]>(INTELLIGENCE_ALERTS);

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
    const found = EMERGING_NARRATIVES.find((t) => t.id === topicId) || EMERGING_NARRATIVES[0];
    setSelectedDrawerTopic(found);
  };

  // Direct navigate to Narrative Investigation Screen
  const handleLaunchFullInvestigation = (topicId: string) => {
    setCurrentScreen('investigate');
    setSelectedDrawerTopic(null);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="flex h-screen w-screen bg-[#0D1012] text-[#E8E3D8] font-sans antialiased overflow-hidden select-none">
      {/* Persistent Left Navigation Rail */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        dataMode={dataMode}
        onDataModeChange={(mode) => setDataMode(mode)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Status & Command Header Bar */}
        <TopBar
          totalEvents={totalEvents}
          dataMode={dataMode}
          unreadAlertsCount={unreadAlertsCount}
          onOpenAlerts={() => setIsAlertsOpen(true)}
          onOpenCommandSearch={() => setIsCommandOpen(true)}
        />

        {/* Page Viewport Area with Premium Smooth Motion Transition */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.92, y: 4 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-7xl mx-auto"
            >
              {currentScreen === 'overview' && (
                <OverviewScreen
                  narratives={EMERGING_NARRATIVES}
                  alerts={alerts}
                  onSelectTopic={handleSelectTopic}
                  onNavigateToScreen={(s) => setCurrentScreen(s as ScreenId)}
                />
              )}

              {currentScreen === 'timeline' && (
                <TimelineScreen
                  onSelectEvent={(evt) => handleSelectTopic(evt.topicId || 'TP-8842')}
                  dataMode={dataMode}
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
