import React, { createContext, useContext, useReducer } from 'react';
import { appReducer, initialAppState } from '../reducers';

// Create Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hooks
export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context.state;
};

export const useAppDispatch = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context.dispatch;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
