import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import CreateEventForm from "@components/pages/organizer/events/create-event-form";

export const Route = createFileRoute("/_organizer/organizer/events/create")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      eventId: (search.eventId as string) || undefined,
      step: search.step ? parseInt(search.step as string, 10) : undefined,
    } as { eventId?: string; step?: number };
  },
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <CreateEventForm />
    </DashboardLayout>
  );
}

