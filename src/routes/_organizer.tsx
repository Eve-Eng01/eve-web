import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createRouteGuard } from "@/shared/utils/route-guards";

/**
 * Event Organizer Route Group
 * Routes under this group require authentication and event-organizer role.
 * Users without event-organizer role are redirected to their dashboard.
 */
export const Route = createFileRoute("/_organizer")({
  beforeLoad: createRouteGuard({
    requireAuth: true,
    requireRoles: ["event-organizer"],
  }),
  component: () => <Outlet />,
});

