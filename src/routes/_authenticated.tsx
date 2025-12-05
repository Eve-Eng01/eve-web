import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createRouteGuard } from "@/shared/utils/route-guards";
import { useAuthStore } from "@/shared/stores/auth-store";
import { getAccessToken } from "@/shared/api/client";

/**
 * Authenticated Route Group
 * Routes under this group require authentication but no specific role.
 * Used for routes accessible to all authenticated users (status pages, etc.)
 * 
 * Note: Account, messages, and onboarding routes are now under _vendor and _organizer
 * route groups to ensure proper role-based access control.
 */
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: createRouteGuard({
    requireAuth: true,
  }),
  shouldReload({ context }) {
    const storeUser = useAuthStore.getState().user;
    const accessToken = getAccessToken();
    // Reload if user was removed and no token exists
    return !context.auth.user && !storeUser && !accessToken;
  },
  component: () => <Outlet />,
});
