import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Onboarding/SubServices/five')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Onboarding/SubServices/five"!</div>
}
