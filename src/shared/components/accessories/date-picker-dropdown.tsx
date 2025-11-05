import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLDivElement>;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const DatePickerDropdown: React.FC<DatePickerDropdownProps> = ({
  isOpen,
  onClose,
  triggerRef,
  selectedDate,
  onDateSelect,
}) => {
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    selectedDate ? selectedDate.getMonth() : new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

      if (triggerRef?.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        setModalPosition({
          top: triggerRect.bottom + 8,
          right: window.innerWidth - triggerRect.right,
        });
      }

      // Close on ESC key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsVisible(false);
          setTimeout(onClose, 300); // Wait for animation
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    } else {
      setIsVisible(false);
    }
  }, [isOpen, triggerRef, onClose]);

  // Close on outside click
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          triggerRef?.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          const target = e.target as HTMLElement;
          if (!target.closest("[data-date-picker-dropdown]")) {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, triggerRef, onClose]);

  const renderCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    const days: React.ReactElement[] = [];

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      days.push(
        <button
          key={`prev-${i}`}
          className="aspect-square flex items-center justify-center text-gray-300 text-sm hover:bg-gray-50 rounded-lg w-[40px] h-[40px]"
        >
          {daysInPrevMonth - i}
        </button>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === selectedMonth &&
        selectedDate.getFullYear() === selectedYear;

      days.push(
        <button
          key={day}
          onClick={() => {
            const newDate = new Date(selectedYear, selectedMonth, day);
            onDateSelect(newDate);
            setIsVisible(false);
            setTimeout(onClose, 150);
          }}
          className={`aspect-square flex items-center justify-center text-sm rounded-full transition-colors ${
            isSelected
              ? "bg-[#7417C6] text-white font-semibold w-[40px] h-[40px]"
              : "text-gray-900 hover:bg-gray-100 w-[40px] h-[40px]"
          }`}
        >
          {day}
        </button>
      );
    }

    // Next month days
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <button
          key={`next-${i}`}
          className="aspect-square flex items-center justify-center text-gray-300 text-sm hover:bg-gray-50 rounded-lg w-[40px] h-[40px]"
        >
          {i}
        </button>
      );
    }

    return days;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay with smooth animation */}
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
      />

      {/* Calendar Dropdown */}
      <div
        data-date-picker-dropdown
        className={`fixed z-50 bg-white rounded-[14px] shadow-lg p-4 min-w-[320px] transition-all duration-300 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        style={{
          top: `${modalPosition.top}px`,
          right: `${modalPosition.right}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            title="Previous Month"
            onClick={() => {
              if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
              } else {
                setSelectedMonth(selectedMonth - 1);
              }
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-semibold text-gray-900">
            {months[selectedMonth]} {selectedYear}
          </span>
          <button
            title="Next Month"
            onClick={() => {
              if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
              } else {
                setSelectedMonth(selectedMonth + 1);
              }
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
      </div>
    </>
  );
};

export default DatePickerDropdown;
