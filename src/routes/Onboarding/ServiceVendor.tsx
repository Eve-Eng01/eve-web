import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Onboarding/ServiceVendor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Onboarding/ServiceVendor"!</div>
}
