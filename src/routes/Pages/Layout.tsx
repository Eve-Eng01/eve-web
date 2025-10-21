import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from './Dashboard/DashboardLayout';
import { EventDashboard } from './Dashboard/EventDashboard';


export const Route = createFileRoute('/Pages/Layout')({
  component: RouteComponent,
});

function RouteComponent() {
  const user = {
    name: 'Gabriel Emumwen',
    email: 'gabrielemumwen20@gmail.com',
  };

  return (
    <DashboardLayout user={user}>
      <EventDashboard />
    </DashboardLayout>
  );
}