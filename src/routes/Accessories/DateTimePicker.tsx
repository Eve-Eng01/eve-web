import React, { JSX, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { TimePicker } from './TimePicker';

// Define props interface for type safety
interface DateTimePickerProps {
  selectedDate: number;
  setSelectedDate: (date: number) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  startTime: string;
  setStartTime: (time: string) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  setSelectedDate,
  endTime,
  setEndTime,
  startTime,
  setStartTime,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // January
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [showEndTimePicker, setShowEndTimePicker] = useState<boolean>(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState<boolean>(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const renderCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    const days: JSX.Element[] = [];

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
      const isSelected = day === selectedDate;
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`aspect-square flex items-center justify-center text-sm rounded-full transition-colors ${
            isSelected
              ? 'bg-[#7417C6] text-white font-semibold w-[40px] h-[40px]'
              : 'text-gray-900 hover:bg-gray-100 w-[40px] h-[40px]'
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

  return (
    <>
      {/* Date and Time Picker */}
      <div className="grid grid-cols-2 gap-4">
        {/* Calendar Section */}
        <div className="col-span-2 lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4 mt-2">
            <div className="flex items-center justify-between mb-4">
              <button 
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
                {selectedDate} {months[selectedMonth]} {selectedYear}
              </span>
              <button 
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

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-[30px]">
              {renderCalendar()}
            </div>
          </div>
        </div>

        {/* Time Section */}
        <div className="col-span-2 lg:col-span-1 space-y-4">
          <div className="lg:mt-12">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={endTime}
                readOnly
                onClick={() => setShowEndTimePicker(true)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border border-dashed text-black cursor-pointer ${
                  endTime ? 'border-[#DFDFDF]' : 'border-red-500'
                } rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={startTime}
                readOnly
                onClick={() => setShowStartTimePicker(true)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border border-dashed text-black cursor-pointer ${
                  startTime ? 'border-[#DFDFDF]' : 'border-red-500'
                } rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Time Picker Modals */}
      {showEndTimePicker && (
        <TimePicker
          initialTime={endTime}
          onSelectTime={setEndTime}
          onClose={() => setShowEndTimePicker(false)}
        />
      )}

      {showStartTimePicker && (
        <TimePicker
          initialTime={startTime}
          onSelectTime={setStartTime}
          onClose={() => setShowStartTimePicker(false)}
        />
      )}
    </>
  );
};