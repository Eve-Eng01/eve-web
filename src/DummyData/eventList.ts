import { EventCardProps } from "../routes/Pages/Vendor/EventCard";

export const events: EventCardProps[] = [
  {
    id: "evt_001",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    title: "Tech Innovators Summit",
    description:
      "Join industry leaders discussing the future of technology and innovation.",
    service: "Tech Conference",
    isNew: true,
  },
  {
    id: "evt_002",
    image: "https://images.unsplash.com/photo-1497493292307-31c376b6e479",
    title: "Creative Design Workshop",
    description:
      "Hands-on creative design sessions for UI/UX and brand designers.",
    service: "Design Workshop",
    isClosingSoon: true,
  },
  {
    id: "evt_003",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    title: "Beach Cleanup Drive",
    description:
      "Volunteer to help keep our beaches clean and save marine life.",
    service: "Community Service",
  },
  {
    id: "evt_004",
    image:
      "https://plus.unsplash.com/premium_photo-1705267936187-aceda1a6c1a6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
    title: "Startup Pitch Night",
    description:
      "Watch aspiring founders pitch their next big idea to investors.",
    service: "Pitch Event",
    isNew: true,
    isClosingSoon: true,
  },
  {
    id: "evt_005",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    title: "Art & Wine Evening",
    description:
      "Enjoy a calm evening with art exhibitions, wine and good music.",
    service: "Lifestyle Event",
  },
];
