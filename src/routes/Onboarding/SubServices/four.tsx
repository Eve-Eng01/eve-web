import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Onboarding/SubServices/four')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Onboarding/SubServices/four"!</div>
}
