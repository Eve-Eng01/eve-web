export interface UserType {
  id: string;
  title: string;
  description?: string;
}

export const userTypes: UserType[] = [
  {
    id: "event-organizer",
    title: "Event Organizer",
  },
  {
    id: "vendor",
    title: "Vendor",
  },
];

export interface UserTypeCardProps {
  userType: UserType;
  isSelected: boolean;
  onClick: () => void;
}
