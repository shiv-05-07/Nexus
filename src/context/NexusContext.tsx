import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  DataMode,
  DEMO_IDENTITIES,
  NexusDataset,
  RolePermissions,
  ROLE_PERMISSIONS,
  UserIdentity,
  UserRole,
} from '../types/nexus';
import { DATASETS } from '../data/mockIntelligence';

interface NexusContextType {
  sourceMode: DataMode;
  setSourceMode: (mode: DataMode) => void;
  isSourceSwitching: boolean;
  currentUser: UserIdentity;
  setCurrentUserRole: (role: UserRole) => void;
  permissions: RolePermissions;
  activeDataset: NexusDataset;
  isTampered: boolean;
  setIsTampered: (val: boolean | ((prev: boolean) => boolean)) => void;
  signOut: () => void;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

export const NexusProvider: React.FC<{ children: ReactNode; onSignOut?: () => void }> = ({
  children,
  onSignOut,
}) => {
  const [sourceMode, setSourceModeState] = useState<DataMode>('SYNTHETIC');
  const [isSourceSwitching, setIsSourceSwitching] = useState<boolean>(false);
  const [currentUserRole, setCurrentUserRoleState] = useState<UserRole>('ANALYST');
  const [isTampered, setIsTampered] = useState<boolean>(false);

  const currentUser = DEMO_IDENTITIES[currentUserRole];
  const permissions = ROLE_PERMISSIONS[currentUserRole];
  const activeDataset = DATASETS[sourceMode] || DATASETS.SYNTHETIC;

  const setSourceMode = (mode: DataMode) => {
    if (mode === sourceMode) return;
    setIsSourceSwitching(true);
    setTimeout(() => {
      setSourceModeState(mode);
      setTimeout(() => {
        setIsSourceSwitching(false);
      }, 200);
    }, 250);
  };

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentUserRoleState(role);
  };

  const signOut = () => {
    if (onSignOut) onSignOut();
  };

  return (
    <NexusContext.Provider
      value={{
        sourceMode,
        setSourceMode,
        isSourceSwitching,
        currentUser,
        setCurrentUserRole,
        permissions,
        activeDataset,
        isTampered,
        setIsTampered,
        signOut,
      }}
    >
      {children}
    </NexusContext.Provider>
  );
};

export const useNexus = (): NexusContextType => {
  const context = useContext(NexusContext);
  if (!context) {
    throw new Error('useNexus must be used within a NexusProvider');
  }
  return context;
};
