import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';

// Types
interface AuthContextValue {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  user: ReturnType<typeof useUser>['user'];
  userId: string | null;
  userEmail: string | null;
  userName: string;
  userImage: string | null;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create Auth Context
const AuthContext = createContext<AuthContextValue | null>(null);

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user } = useUser();

  const value: AuthContextValue = {
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
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
