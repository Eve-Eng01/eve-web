import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Accessories/Upload')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Accessories/Upload"!</div>
}
