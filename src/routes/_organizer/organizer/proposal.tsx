import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_organizer/organizer/proposal')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_organizer/organizer/proposal"!</div>
}
