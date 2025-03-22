import { createContext, useContext, ReactNode, useState } from 'react';
import { AppState, ApplicationStatus, CardData } from '../types';

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ApplicationStatus>('idle');
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [otp, setOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStatus('idle');
    setCardData(null);
    setRequestId(null);
    setOtp(null);
    setError(null);
  };

  const value: AppState = {
    status,
    cardData,
    requestId,
    otp,
    error,
    setStatus,
    setCardData,
    setRequestId,
    setOtp,
    setError,
    reset,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
