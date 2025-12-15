import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import { EventDashboard } from "@components/pages/organizer/events/event-dashboard";


export const Route = createFileRoute("/_organizer/organizer/layout")({
  component: RouteComponent,
});

function RouteComponent() {
  // Get user from auth store - DashboardLayout now gets user internally
  return (
    <DashboardLayout>
      <EventDashboard />
    </DashboardLayout>
  );
}
