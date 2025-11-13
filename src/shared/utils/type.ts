enum NavSectionType {
  GENERAL = "GENERAL",
}

export type NavType = {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  shouldShowIn: NavSectionType[];
};
