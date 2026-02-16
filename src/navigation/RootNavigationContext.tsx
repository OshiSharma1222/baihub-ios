import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface RootNavigationContextValue {
  showMainApp: boolean;
  setShowMainApp: (show: boolean) => void;
}

const RootNavigationContext = createContext<RootNavigationContextValue | null>(null);

export function RootNavigationProvider({ children }: { children: React.ReactNode }) {
  const [showMainApp, setShowMainAppState] = useState(false);
  const setShowMainApp = useCallback((show: boolean) => {
    setShowMainAppState(show);
  }, []);

  // On cold start we always show onboarding (showMainApp stays false).
  // When app was in background and user returns, show onboarding again so they always see it "when app open".
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;
      if (prev === 'background' && nextState === 'active') {
        setShowMainAppState(false);
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <RootNavigationContext.Provider value={{ showMainApp, setShowMainApp }}>
      {children}
    </RootNavigationContext.Provider>
  );
}

export function useRootNavigation() {
  const ctx = useContext(RootNavigationContext);
  if (!ctx) {
    throw new Error('useRootNavigation must be used inside RootNavigationProvider');
  }
  return ctx;
}

export function useRootNavigationOptional() {
  return useContext(RootNavigationContext);
}
