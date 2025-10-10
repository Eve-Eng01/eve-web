import React, { useState } from 'react';

interface TimePickerProps {
  onSelectTime: (time: string) => void;
  onClose: () => void;
  initialTime?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({ 
  onSelectTime, 
  onClose, 
  initialTime = '1:00 AM' 
}) => {
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialTime.includes('AM') ? 'AM' : 'PM');
  const [selectedTime, setSelectedTime] = useState<string>(initialTime);

  const generateTimeSlots = (period: 'AM' | 'PM'): string[] => {
    const times: string[] = [];
    // 12 AM/PM
    for (let min = 0; min < 60; min += 30) {
      const displayMin = min.toString().padStart(2, '0');
      times.push(`12:${displayMin} ${period}`);
    }
    // 1 to 11 AM/PM
    for (let hour = 1; hour <= 11; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const displayMin = min.toString().padStart(2, '0');
        times.push(`${hour}:${displayMin} ${period}`);
      }
    }
    return times;
  };

  const timeSlots = generateTimeSlots(period);

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex bg-gray-50">
          <button
            onClick={() => setPeriod('AM')}
            className={`flex-1 py-4 text-base font-semibold transition-all ${
              period === 'AM'
                ? 'bg-purple-300 text-purple-900'
                : 'bg-white text-gray-900'
            }`}
          >
            AM
          </button>
          <button
            onClick={() => setPeriod('PM')}
            className={`flex-1 py-4 text-base font-semibold transition-all ${
              period === 'PM'
                ? 'bg-purple-300 text-purple-900'
                : 'bg-white text-gray-900'
            }`}
          >
            PM
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`w-full px-6 py-4 text-left text-base transition-colors ${
                selectedTime === time
                  ? 'bg-purple-100 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSelectTime(selectedTime);
              onClose();
            }}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};