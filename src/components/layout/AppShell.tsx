import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DetailDrawerState,
  EmergingNarrative,
  NetworkNode,
  Platform,
  ScreenId,
  TimeFilter,
  TimelineEvent,
  UserProfile,
  UserRole
} from '../../types/nexus';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DetailDrawer } from '../drawers/DetailDrawer';
import { OverviewPage } from '../../pages/OverviewPage';
import { TimelinePage } from '../../pages/TimelinePage';
import { SentimentPage } from '../../pages/SentimentPage';
import { TrendsPage } from '../../pages/TrendsPage';
import { NetworkPage } from '../../pages/NetworkPage';
import { nexusApi } from '../../services/api/nexusApi';

export const AppShell: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('overview');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [platformFilter, setPlatformFilter] = useState<Platform>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [dataProvenance, setDataProvenance] = useState<string>('DEMO DATA');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // User Profile and Role Access State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    nexusApi.getProfile()
      .then(setUserProfile)
      .catch((err) => console.error('Failed to load initial profile:', err));
  }, []);

  const handleRoleChange = async (role: UserRole) => {
    try {
      const updated = await nexusApi.setRole(role);
      setUserProfile(updated);
    } catch (err) {
      console.error('Failed to switch operational role:', err);
    }
  };
  
  // Reusable unified detail drawer state
  const [drawerSelection, setDrawerSelection] = useState<DetailDrawerState>(null);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const handleToggleDataProvenance = () => {
    setDataProvenance((prev) => (prev === 'DEMO DATA' ? 'SYNTHETIC STREAM' : 'DEMO DATA'));
  };

  return (
    <div className="flex h-screen w-screen bg-[#F7F7F4] text-[#171717] font-sans overflow-hidden antialiased select-none">
      {/* 1. Left Compact Navigation Rail */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        userProfile={userProfile || undefined}
        onRoleChange={handleRoleChange}
        dataProvenance={dataProvenance}
        onToggleDataProvenance={handleToggleDataProvenance}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Center Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F7F7F4]">
        {/* Minimal Contextual Header */}
        <Header
          currentScreen={currentScreen}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          platformFilter={platformFilter}
          onPlatformFilterChange={setPlatformFilter}
          onManualRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Scrollable Analytical Content Viewport with Motion Transition */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentScreen}-${timeFilter}-${platformFilter}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-6xl mx-auto"
            >
              {currentScreen === 'overview' && (
                <OverviewPage
                  timeFilter={timeFilter}
                  platformFilter={platformFilter}
                  onSelectNarrative={(narrative) =>
                    setDrawerSelection({ type: 'narrative', data: narrative })
                  }
                  onNavigateToScreen={setCurrentScreen}
                />
              )}

              {currentScreen === 'timeline' && (
                <TimelinePage
                  timeFilter={timeFilter}
                  platformFilter={platformFilter}
                  onSelectEvent={(event) =>
                    setDrawerSelection({ type: 'event', data: event })
                  }
                />
              )}

              {currentScreen === 'sentiment' && (
                <SentimentPage
                  timeFilter={timeFilter}
                  platformFilter={platformFilter}
                />
              )}

              {currentScreen === 'trends' && (
                <TrendsPage
                  timeFilter={timeFilter}
                  platformFilter={platformFilter}
                  onSelectTrend={(narrative) =>
                    setDrawerSelection({ type: 'narrative', data: narrative })
                  }
                />
              )}

              {currentScreen === 'network' && (
                <NetworkPage
                  timeFilter={timeFilter}
                  platformFilter={platformFilter}
                  onSelectNode={(node) =>
                    setDrawerSelection({ type: 'node', data: node })
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 3. Unified Reusable Right-Side Detail Drawer */}
      <DetailDrawer
        selection={drawerSelection}
        userProfile={userProfile || undefined}
        onClose={() => setDrawerSelection(null)}
        onNavigateToScreen={(s) => {
          setCurrentScreen(s);
          setDrawerSelection(null);
        }}
      />
    </div>
  );
};
