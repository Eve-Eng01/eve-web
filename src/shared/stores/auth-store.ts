/**
 * Auth Store (Zustand)
 * Global state management for authentication
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TOKEN_STORAGE_KEYS } from "../api/config";

export type UserRole = "attendee" | "vendor" | "small-creator" | "admin" | "event-organizer";

export interface User {
  _id: string;
  firstName: string;
  lastname: string;
  email: string;
  isVerified: boolean;
  role?: UserRole;
  isOnboarded?: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  logout: () => void;
  clearAuth: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true for initialization
      isInitialized: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setTokens: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setInitialized: (isInitialized) => set({ isInitialized }),

      initialize: async () => {
        const { getAccessToken, getRefreshToken, clearAuthTokens } = await import("../api/client");
        
        set({ isLoading: true });

        try {
          // Get tokens from localStorage
          const accessToken = getAccessToken();
          const refreshToken = getRefreshToken();
          
          // Get user from store (should be hydrated from localStorage by now)
          const persistedUser = get().user;
          
          // Also check localStorage directly for user state (in case store hasn't hydrated yet)
          let storedUser: User | null = null;
          if (typeof window !== "undefined") {
            try {
              const stored = localStorage.getItem("eve-auth-storage");
              if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed?.state?.user) {
                  storedUser = parsed.state.user;
                  // Sync stored user to store if it exists and store doesn't have it
                  if (storedUser && !persistedUser) {
                    set({ user: storedUser, isAuthenticated: true });
                  }
                }
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
          
          // Use stored user if persisted user is not available
          const user = persistedUser || storedUser;

          // If no tokens, clear auth state
          if (!accessToken || !refreshToken) {
            if (user) {
              get().clearAuth();
              clearAuthTokens();
            }
            set({ isLoading: false, isInitialized: true });
            return;
          }

          // Sync tokens with store
          if (accessToken && refreshToken) {
            get().setTokens({
              accessToken,
              refreshToken,
            });
          }

          // If we have tokens and user, we're authenticated
          if (accessToken && user) {
            // Ensure user is set in store
            if (!persistedUser && user) {
              set({ user, isAuthenticated: true });
            }
            set({
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
            });
            return;
          }

          // If we have tokens but no user, token will be validated on first API call
          // The interceptor will handle 401 and trigger logout if invalid
          set({
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          // On any error, clear auth state
          get().clearAuth();
          clearAuthTokens();
          set({
            isLoading: false,
            isInitialized: true,
          });
        }
      },

      logout: () => {
        // Clear tokens synchronously (localStorage is synchronous)
        if (typeof window !== "undefined") {
          localStorage.removeItem("eve_access_token");
          localStorage.removeItem("eve_refresh_token");
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      clearAuth: () => {
        // Clear tokens synchronously (localStorage is synchronous)
        if (typeof window !== "undefined") {
          localStorage.removeItem("eve_access_token");
          localStorage.removeItem("eve_refresh_token");
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "eve-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        // Don't persist loading or initialized state
      }),
      onRehydrateStorage: () => (state) => {
        // After hydration, ensure user state is properly synced
        if (state && typeof window !== "undefined") {
          // Sync tokens from localStorage to store if they exist
          const accessToken = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
          const refreshToken = localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
          
          if (accessToken && refreshToken) {
            // Always sync tokens to ensure store is up to date
            state.setTokens({ accessToken, refreshToken });
          }
          
          // Ensure user and isAuthenticated are properly set after hydration
          if (state.user) {
            // Re-set user to ensure isAuthenticated is correctly set
            state.setUser(state.user);
          }
        }
      },
    }
  )
);

