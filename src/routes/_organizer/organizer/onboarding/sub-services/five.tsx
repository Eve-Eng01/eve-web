import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_organizer/organizer/onboarding/sub-services/five")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/Onboarding/SubServices/five"!</div>;
}
