import React from 'react';

interface FilterIconProps {
  className?: string;
  color?: string;
}

const FilterIcon: React.FC<FilterIconProps> = ({ className = '', color = '#2d2d2d' }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <path
        id="Icon"
        d="M4 7H16M1 1H19M7 13H13"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FilterIcon;

