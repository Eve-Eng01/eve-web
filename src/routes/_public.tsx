import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createRouteGuard } from "@/shared/utils/route-guards";

/**
 * Public Route Group
 * Routes under this group are accessible to unauthenticated users.
 * Authenticated users are automatically redirected to their dashboard.
 */
export const Route = createFileRoute("/_public")({
  beforeLoad: createRouteGuard({
    allowIfAuthenticated: true, // Redirect if authenticated
  }),
  component: () => <Outlet />,
});
