import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import { EventDashboard } from "@components/pages/organizer/events/event-dashboard";

export const Route = createFileRoute("/_organizer/organizer/layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = {
    name: "Gabriel Emumwen",
    email: "gabrielemumwen20@gmail.com",
  };

  return (
    <DashboardLayout user={user}>
      <EventDashboard />
    </DashboardLayout>
  );
}
