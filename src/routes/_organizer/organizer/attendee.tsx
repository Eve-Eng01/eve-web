import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@components/layouts/dashboard-layout";


export const Route = createFileRoute("/_organizer/organizer/attendee")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <div className="text-black">Hello "/Pages/Screens/Attendance"!</div>
    </DashboardLayout>
  );
}
