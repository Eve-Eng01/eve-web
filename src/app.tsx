import { RouterProvider } from "@tanstack/react-router";
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
  return (
    <AuthProvider>
      <SidebarProvider>
        <InnerApp />
        <ToastContainer />
      </SidebarProvider>
    </AuthProvider>
  );
}
