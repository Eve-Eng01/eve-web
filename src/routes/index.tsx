import { createFileRoute } from "@tanstack/react-router";
import { RouteComponent as SignUpComponent } from "./Authentication/SignUp";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div>
        <SignUpComponent />
      </div>
    </>
  );
}
