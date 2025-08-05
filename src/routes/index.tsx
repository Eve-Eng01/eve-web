import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
<div>
  Hi Ufuoma get started
</div>
    </>
  );
}
