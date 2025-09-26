import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '../Dashboard/DashboardLayout'
import { User } from './Events'

export const Route = createFileRoute('/Pages/Screens/Attendee')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout user={User}>
      <div className='text-black'>Hello "/Pages/Screens/Attendance"!</div>
    </DashboardLayout>
  )
}