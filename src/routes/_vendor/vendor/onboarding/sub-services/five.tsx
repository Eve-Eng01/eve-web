import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_vendor/vendor/onboarding/sub-services/five")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/Onboarding/SubServices/five"!</div>;
}
