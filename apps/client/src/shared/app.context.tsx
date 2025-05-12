import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { SWRConfig } from 'swr';

import { useMediaQuery } from './app.hook';
import { http } from './http.helper';

type AppContextType = {
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};
export const AppContext = createContext<AppContextType | null>(null);

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
}

type AppProviderProps = {
  children: ReactNode;
};
export function AppProvider({ children }: AppProviderProps) {
  const matches = useMediaQuery('(min-width: 640px)');
  const [sidebarOpen, setSidebarOpen] = useState(matches);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <SWRConfig value={{ fetcher: http }}>
      <AppContext.Provider
        value={{ sidebarOpen, openSidebar, closeSidebar, toggleSidebar }}
      >
        {children}
      </AppContext.Provider>
    </SWRConfig>
  );
}
