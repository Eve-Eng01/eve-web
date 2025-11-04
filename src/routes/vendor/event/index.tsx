import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vendor/event/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/vendor/event/"!</div>;
}
