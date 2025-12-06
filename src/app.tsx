import { RouterProvider } from "@tanstack/react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { router } from "./main";
import { AuthProvider, useAuth } from "./providers/auth-provider";
import { SidebarProvider } from "./shared/contexts/sidebar-context";
import { useAuthStore } from "./shared/stores/auth-store";
import { ToastContainer } from "./shared/components/accessories/toast";

function InnerApp() {
  const auth = useAuth();
  const storeUser = useAuthStore((state) => state.user);

  // Sync router context with auth store
  const authContext = {
    user: auth.user || storeUser,
    loading: auth.loading,
    isAuthenticated: auth.isAuthenticated,
    isInitialized: auth.isInitialized,
  };

  // Show loading only during initialization
  // Once initialized, show the router immediately (no flash of unauthenticated content)
  if (!auth.isInitialized || auth.loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return <RouterProvider router={router} context={{ auth: authContext }} />;
}

export function App() {
  // Get Google Client ID from environment variables
  // In Vite, use import.meta.env.VITE_* prefix
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Validate Google Client ID in production
  if (import.meta.env.PROD && !googleClientId) {
    console.error(
      "VITE_GOOGLE_CLIENT_ID is required in production. Please set it in your environment variables."
    );
    // Still render the app, but Google OAuth will not work
    // The GoogleLogin component will handle the missing clientId gracefully
  }

  // In development, warn if missing but don't block
  if (import.meta.env.DEV && !googleClientId) {
    console.warn(
      "VITE_GOOGLE_CLIENT_ID is not set. Google OAuth will not work. Add it to your .env file."
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <AuthProvider>
        <SidebarProvider>
          <InnerApp />
          <ToastContainer />
        </SidebarProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
