export  interface UserType {
    id: string;
    title: string;
    description?: string;
  }
  
export  const userTypes: UserType[] = [
    {
      id: 'event-organizer',
      title: 'Event Organizer'
    },
    {
      id: 'vendor',
      title: 'Vendor'
    },
    {
      id: 'small-content-creators',
      title: 'Small Content creators'
    },
    {
      id: 'event-attendee',
      title: 'Event Attendee'
    }
  ];
  
export  interface UserTypeCardProps {
    userType: UserType;
    isSelected: boolean;
    onClick: () => void;
  }