import React, { createContext, useContext } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component - wraps around Clerk hooks for easier access
export const AuthProvider = ({ children }) => {
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user } = useUser();

  const value = {
    isLoaded,
    isSignedIn,
    user,
    userId: user?.id || null,
    userEmail: user?.primaryEmailAddress?.emailAddress || null,
    userName: user?.fullName || user?.firstName || 'Guest User',
    userImage: user?.imageUrl || null,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
