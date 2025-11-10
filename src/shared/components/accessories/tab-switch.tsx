import React from "react";

import { cn } from "@utils/classnames";

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TabSwitchProps {
  tabs: Array<TabItem | string>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  containerClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
  disabledTabClassName?: string;
}

const normalizeTab = (tab: TabItem | string): TabItem =>
  typeof tab === "string"
    ? {
        id: tab,
        label: tab,
      }
    : tab;

const TabSwitch: React.FC<TabSwitchProps> = ({
  tabs,
  activeTab,
  onTabChange,
  containerClassName,
  tabClassName,
  activeTabClassName,
  inactiveTabClassName,
  disabledTabClassName,
}) => {
  if (!tabs.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2",
        containerClassName
      )}
    >
      {tabs.map((tabDefinition) => {
        const tab = normalizeTab(tabDefinition);
        const isActive = tab.id === activeTab;
        const isDisabled = Boolean(tab.disabled);

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              if (!isDisabled) {
                onTabChange(tab.id);
              }
            }}
            disabled={isDisabled}
            aria-pressed={isActive}
            className={cn(
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7417c6]",
              "transition-colors duration-150",
              tabClassName,
              isDisabled
                ? cn(
                    "cursor-not-allowed opacity-50",
                    disabledTabClassName
                  )
                : isActive
                  ? activeTabClassName
                  : inactiveTabClassName
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabSwitch;