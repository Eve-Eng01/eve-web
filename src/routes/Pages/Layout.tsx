import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Pages/Layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Pages/Layout"!</div>
}
