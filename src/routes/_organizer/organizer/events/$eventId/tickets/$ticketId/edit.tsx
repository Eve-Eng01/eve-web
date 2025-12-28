import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import EditTicketForm from "@components/pages/organizer/events/edit-ticket-form";

export const Route = createFileRoute(
  "/_organizer/organizer/events/$eventId/tickets/$ticketId/edit"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { eventId, ticketId } = Route.useParams();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <EditTicketForm
        eventId={eventId}
        ticketId={ticketId}
        onCancel={() => {
          navigate({
            to: "/organizer/events/create",
            search: { eventId },
          });
        }}
        onSuccess={() => {
          navigate({
            to: "/organizer/events/create",
            search: { eventId },
          });
        }}
      />
    </DashboardLayout>
  );
}

