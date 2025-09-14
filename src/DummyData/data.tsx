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


// avaliability 
export interface AvaliabilityType {
  id: string;
  title: string;
  description?: string;
}

export const avaliabilityTypes: AvaliabilityType[] = [
  {
    id: "30hrs",
    title: "30hrs a week",
  },
  {
    id: "40hrs",
    title: "40hrs a week",
  },
  {
    id: "5days",
    title: "5days a week",
  },
  {
    id: "7days",
    title: "Less Than & 7days a week",
  },
  {
    id: "Anytime",
    title: "Anytime/Anyday",
  },
];

export interface AvaliabilityTypeCardProps {
  avaliableType: AvaliabilityType;
  isSelected: boolean;
  onClick: () => void;
}
