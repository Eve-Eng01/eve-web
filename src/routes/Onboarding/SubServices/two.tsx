import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Onboarding/SubServices/two')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Onboarding/SubServices/two"!</div>
}
