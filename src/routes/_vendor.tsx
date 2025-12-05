import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createRouteGuard } from "@/shared/utils/route-guards";

/**
 * Vendor Route Group
 * Routes under this group require authentication and vendor role.
 * Users without vendor role are redirected to their dashboard.
 */
export const Route = createFileRoute("/_vendor")({
  beforeLoad: createRouteGuard({
    requireAuth: true,
    requireRoles: ["vendor"],
  }),
  component: () => <Outlet />,
});

