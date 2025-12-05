import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useAuthStore, type User } from "../shared/stores/auth-store";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  isAuthenticated: false,
  isInitialized: false,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { user, isLoading, isAuthenticated, isInitialized, logout, initialize } = useAuthStore();

  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    if (!hasInitialized) {
      initialize().then(() => {
        setHasInitialized(true);
      });
    }
  }, [hasInitialized, initialize]);

  // Listen for logout events (triggered by 401 errors or token refresh failures)
  useEffect(() => {
    const handleLogout = () => {
      logout();
      // Redirect to login if not already there
      if (window.location.pathname !== "/auth/signin") {
        window.location.href = "/auth/signin";
      }
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading,
        isAuthenticated,
        isInitialized: isInitialized && hasInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
