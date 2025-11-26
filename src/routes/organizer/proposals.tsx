import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/organizer/proposals')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/organizer/proposals"!</div>
}
