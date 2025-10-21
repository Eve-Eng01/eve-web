import React, { JSX, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { TimePicker } from './TimePicker';

// Define interface for a single date-time entry
interface DateTimeEntry {
  id: number;
  date: number;
  month: number;
  year: number;
  startTime: string;
  endTime: string;
}

// Define props interface
interface DateTimePickerProps {
  dateTimeEntries: DateTimeEntry[];
  setDateTimeEntries: (entries: DateTimeEntry[]) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  dateTimeEntries,
  setDateTimeEntries,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // January
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [showEndTimePicker, setShowEndTimePicker] = useState<number | null>(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState<number | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Add new date-time entry
  const addNewEntry = () => {
    const newEntry: DateTimeEntry = {
      id: Date.now(), // Unique ID for each entry
      date: 1,
      month: selectedMonth,
      year: selectedYear,
      startTime: '',
      endTime: '',
    };
    setDateTimeEntries([...dateTimeEntries, newEntry]);
  };

  // Remove date-time entry
  const removeEntry = (id: number) => {
    setDateTimeEntries(dateTimeEntries.filter(entry => entry.id !== id));
  };

  // Update specific entry
  const updateEntry = (id: number, field: keyof DateTimeEntry, value: any) => {
    setDateTimeEntries(
      dateTimeEntries.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

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
      const isSelected = dateTimeEntries.some(entry => 
        entry.date === day && 
        entry.month === selectedMonth && 
        entry.year === selectedYear
      );
      days.push(
        <button
          key={day}
          onClick={() => {
            const newEntry: DateTimeEntry = {
              id: Date.now(),
              date: day,
              month: selectedMonth,
              year: selectedYear,
              startTime: '',
              endTime: '',
            };
            setDateTimeEntries([...dateTimeEntries, newEntry]);
          }}
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
      <div className='bg-[#F4F4F4] p-[20px]'>
        <div className="flex justify-between border border-[#DFDFDF] p-[20px] rounded-lg bg-white mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Dates and Times for your event
          </label>
          <button
            onClick={addNewEntry}
            className="bg-[#7417C6] text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Add New Date
          </button>
        </div>

        {/* Calendar Section */}
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
              {months[selectedMonth]} {selectedYear}
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

        {/* Selected Dates and Times */}
        <div className="mt-4 space-y-4">
          {dateTimeEntries.map(entry => (
            <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">
                  {entry.date} {months[entry.month]} {entry.year}
                </span>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={entry.startTime}
                    readOnly
                    onClick={() => setShowStartTimePicker(entry.id)}
                    className={`w-32 pl-10 pr-4 py-2 bg-gray-50 border border-dashed text-black cursor-pointer text-gray-700 ${
                      entry.startTime ? 'border-[#DFDFDF]' : 'border-red-500'
                    } rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
                  />
                </div>
                <span>-</span>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={entry.endTime}
                    readOnly
                    onClick={() => setShowEndTimePicker(entry.id)}
                    className={`w-32 pl-10 pr-4 py-2 bg-gray-50 border border-dashed text-black cursor-pointer text-gray-700 ${
                      entry.endTime ? 'border-[#DFDFDF]' : 'border-red-500'
                    } rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
                  />
                </div>
              </div>
              <button
                onClick={() => removeEntry(entry.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Time Picker Modals */}
      {showEndTimePicker !== null && (
        <TimePicker
          initialTime={dateTimeEntries.find(entry => entry.id === showEndTimePicker)?.endTime || ''}
          onSelectTime={(time) => updateEntry(showEndTimePicker, 'endTime', time)}
          onClose={() => setShowEndTimePicker(null)}
        />
      )}

      {showStartTimePicker !== null && (
        <TimePicker
          initialTime={dateTimeEntries.find(entry => entry.id === showStartTimePicker)?.startTime || ''}
          onSelectTime={(time) => updateEntry(showStartTimePicker, 'startTime', time)}
          onClose={() => setShowStartTimePicker(null)}
        />
      )}
    </>
  );
};