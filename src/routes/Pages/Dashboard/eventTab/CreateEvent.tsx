import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import { ArrowDown2, ArrowRight, Calendar } from 'iconsax-reactjs';
import { CustomButton } from '../../../../components/Button/Button';
import { DateTimePicker } from '../../../Accessories/DateTimePicker';

const CreateEvent = () => {
  const [showForm, setShowForm] = useState(false);
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [customUrl, setCustomUrl] = useState('https://events.example.com/wedding/Anthony-Mary');
  const [category, setCategory] = useState('Cultural & Music');
  const [format, setFormat] = useState('');
  const [recurrence, setRecurrence] = useState('');
  const [timezone, setTimezone] = useState('West Africa Time (WAT) UTC +01:00');
  const [location, setLocation] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(0); // January
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(10);
  const [endTime, setEndTime] = useState('10:45 AM');
  const [startTime, setStartTime] = useState('2:45 PM');

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const handleContinue = () => {
    setShowForm(true);
  };

  const handleGoBack = () => {
    setShowForm(false);
  };

  const renderCalendar = () => {
    const days = [];
    const prevMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="text-center py-2 text-gray-300 text-sm">
          {prevMonthDays - i}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`text-center py-2 text-sm cursor-pointer rounded-full ${
            day === selectedDate
              ? 'bg-purple-600 text-white font-semibold'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {day}
        </div>
      );
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <div key={`next-${i}`} className="text-center py-2 text-gray-300 text-sm">
          {i}
        </div>
      );
    }

    return days;
  };

  if (!showForm) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-64 h-48 mb-8">
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
            <div className="relative">
              <Calendar className="w-20 h-20 text-purple-400" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-4 h-4 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Current Events
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-8">
          You don't have any events happening right now. Current events will appear here.
        </p>
        <div className="w-[267px]">
          <CustomButton title="CREATE NEW EVENT" onClick={handleContinue} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto bg-white rounded-lg shadow-sm w-[80%]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={handleGoBack}>
            Go back
          </button>
          <h1 className="text-lg font-semibold text-black">Create Event</h1>
          <div className="text-sm text-gray-600">August 5, 2025</div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center p-6 border-b">
            <div className="flex items-center space-x-4">
                {/* Step 1 - Event Information (Active) */}
                <div className="flex items-center">
                    <div className="w-[24px] h-[24px] rounded-full bg-green-500 flex items-center justify-center">
                        <div className="w-[12.8px] h-[12.8px] rounded-full bg-white"></div>
                    </div>
                    <span className="ml-3 text-base font-medium text-gray-900">Event Information</span>
                </div>
                
                {/* Connector Line */}
                <div className="w-12 h-0.5 bg-gray-300"></div>
                
                {/* Step 2 - Ticketing & Pricing */}
                <div className="flex items-center">
                    <div className="w-[24px] h-[24px] rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                        <div className="w-[12.8px] h-[12.8px] rounded-full bg-gray-300"></div>
                    </div>
                    <span className="ml-3 text-base text-gray-400">Ticketing & Pricing</span>
                </div>
                
                {/* Connector Line */}
                <div className="w-12 h-0.5 bg-gray-300"></div>
                
                {/* Step 3 - Media Upload */}
                <div className="flex items-center">
                    <div className="w-[24px] h-[24px] rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                        <div className="w-[12.8px] h-[12.8px] rounded-full bg-gray-300"></div>
                    </div>
                    <span className="ml-3 text-base text-gray-400">Media Upload</span>
                </div>
                
                {/* Connector Line */}
                <div className="w-12 h-0.5 bg-gray-300"></div>
                
                {/* Step 4 - Review & Publish */}
                <div className="flex items-center">
                    <div className="w-[24px] h-[24px] rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                        <div className="w-[12.8px] h-[12.8px] rounded-full bg-gray-300"></div>
                    </div>
                    <span className="ml-3 text-base text-gray-400">Review & Publish</span>
                </div>
            </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Event Name
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-50 border border-dashed text-black ${
                eventName ? 'border-[#DFDFDF]' : 'border-red-500'
              } rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
              placeholder="Enter event name"
            />
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              maxLength={1000}
              className={`w-full px-4 py-3 bg-gray-50 border border-dashed text-black ${
                description ? 'border-[#DFDFDF]' : 'border-red-500'
              } rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none`}
              placeholder="Describe your event"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {description.length}/1000
            </div>
          </div>

          {/* Custom URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Custom URL
            </label>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-50 border border-dashed text-black ${
                customUrl ? 'border-[#DFDFDF]' : 'border-red-500'
              } rounded-lg focus:ring-2 focus:ring-purple-500 outline-none`}
            />
          </div>

          {/* Event Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Event Categories
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-50 border border-dashed text-black ${
                category ? 'border-[#DFDFDF]' : 'border-red-500'
              } rounded-lg focus:ring-2 focus:ring-purple-500 outline-none appearance-none`}
            >
              <option value="">Select a category</option>
              <option>Cultural & Music</option>
              <option>Business & Professional</option>
              <option>Food & Drink</option>
              <option>Sports & Fitness</option>
            </select>
          </div>

        {/* Format Selection */}
        <div>
        <label className="block text-lg font-medium text-gray-700 mb-4">
            Select Format
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={`
            relative flex items-center px-6 py-4 rounded-2xl cursor-pointer transition-all
            ${format === 'in-person' 
                ? 'bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-400' 
                : 'border-2 border-dashed border-gray-300 bg-white hover:border-gray-400'}
            `}>
            <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg mr-3
                ${format === 'in-person' 
                ? 'bg-purple-600' 
                : 'bg-gray-200'}
            `}>
                <input
                type="radio"
                name="format"
                value="in-person"
                checked={format === 'in-person'}
                onChange={(e) => setFormat(e.target.value)}
                className="appearance-none"
                />
                {format === 'in-person' && (
                <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                </svg>
                )}
            </div>
            <span className={`text-base font-medium ${format === 'in-person' ? 'text-gray-900' : 'text-gray-500'}`}>
                In Person
            </span>
            </label>

            <label className={`
            relative flex items-center px-6 py-4 rounded-2xl cursor-pointer transition-all
            ${format === 'virtual' 
                ? 'bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-400' 
                : 'border-2 border-dashed border-gray-300 bg-white hover:border-gray-400'}
            `}>
            <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg mr-3
                ${format === 'virtual' 
                ? 'bg-purple-600' 
                : 'bg-gray-200'}
            `}>
                <input
                type="radio"
                name="format"
                value="virtual"
                checked={format === 'virtual'}
                onChange={(e) => setFormat(e.target.value)}
                className="appearance-none"
                />
                {format === 'virtual' && (
                <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                </svg>
                )}
            </div>
            <span className={`text-base font-medium ${format === 'virtual' ? 'text-gray-900' : 'text-gray-500'}`}>
                Virtual
            </span>
            </label>

            <label className={`
            relative flex items-center px-6 py-4 rounded-2xl cursor-pointer transition-all
            ${format === 'hybrid' 
                ? 'bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-400' 
                : 'border-2 border-dashed border-gray-300 bg-white hover:border-gray-400'}
            `}>
            <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg mr-3
                ${format === 'hybrid' 
                ? 'bg-purple-600' 
                : 'bg-gray-200'}
            `}>
                <input
                type="radio"
                name="format"
                value="hybrid"
                checked={format === 'hybrid'}
                onChange={(e) => setFormat(e.target.value)}
                className="appearance-none"
                />
                {format === 'hybrid' && (
                <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                </svg>
                )}
            </div>
            <span className={`text-base font-medium ${format === 'hybrid' ? 'text-gray-900' : 'text-gray-500'}`}>
                Hybrid
            </span>
            </label>
        </div>
        </div>

        {/* Recurrence */}
        <div>
        <label className="block text-lg font-medium text-gray-700 mb-4">
            Recurrence
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`
            relative flex items-center px-6 py-4 rounded-2xl cursor-pointer transition-all
            ${recurrence === 'on-time' 
                ? 'bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-400' 
                : 'border-2 border-dashed border-gray-300 bg-white hover:border-gray-400'}
            `}>
            <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg mr-3
                ${recurrence === 'on-time' 
                ? 'bg-purple-600' 
                : 'bg-gray-200'}
            `}>
                <input
                type="radio"
                name="recurrence"
                value="on-time"
                checked={recurrence === 'on-time'}
                onChange={(e) => setRecurrence(e.target.value)}
                className="appearance-none"
                />
                {recurrence === 'on-time' && (
                <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                </svg>
                )}
            </div>
            <span className={`text-base font-medium ${recurrence === 'on-time' ? 'text-gray-900' : 'text-gray-500'}`}>
                on-Time
            </span>
            </label>

            <label className={`
            relative flex items-center px-6 py-4 rounded-2xl cursor-pointer transition-all
            ${recurrence === 'recurring' 
                ? 'bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-400' 
                : 'border-2 border-dashed border-gray-300 bg-white hover:border-gray-400'}
            `}>
            <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg mr-3
                ${recurrence === 'recurring' 
                ? 'bg-purple-600' 
                : 'bg-gray-200'}
            `}>
                <input
                type="radio"
                name="recurrence"
                value="recurring"
                checked={recurrence === 'recurring'}
                onChange={(e) => setRecurrence(e.target.value)}
                className="appearance-none"
                />
                {recurrence === 'recurring' && (
                <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                </svg>
                )}
            </div>
            <span className={`text-base font-medium ${recurrence === 'recurring' ? 'text-gray-900' : 'text-gray-500'}`}>
                Recurring
            </span>
            </label>
        </div>
        </div>

        {/* Timezone - Auto-detected and displayed */}
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Zone
        </label>
        <div className="w-full px-4 py-3 bg-gray-50 border border-dashed border-[#DFDFDF] rounded-lg text-gray-700">
            {timezone || 'Time zone will be detected based on location'}
        </div>
        </div>

        {/* Location with Google Maps iframe */}
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter event Location
        </label>
        <div className="relative">
            <input
            type="text"
            value={location}
            onChange={async (e) => {
                const newLocation = e.target.value;
                setLocation(newLocation);
                
                // Fetch timezone when location is entered
                if (newLocation && newLocation.length > 3) {
                try {
                    // First, geocode the location to get coordinates
                    const geocodeResponse = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(newLocation)}&key=AIzaSyDcL3tvZQRX7QjgvJxzp7ltjwJkNr6-VkY`
                    );
                    const geocodeData = await geocodeResponse.json();
                    
                    if (geocodeData.results && geocodeData.results.length > 0) {
                    const { lat, lng } = geocodeData.results[0].geometry.location;
                    
                    // Then, get the timezone for those coordinates
                    const timestamp = Math.floor(Date.now() / 1000);
                    const timezoneResponse = await fetch(
                        `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=AIzaSyDcL3tvZQRX7QjgvJxzp7ltjwJkNr6-VkY`
                    );
                    const timezoneData = await timezoneResponse.json();
                    
                    if (timezoneData.status === 'OK') {
                        setTimezone(timezoneData.timeZoneName);
                    }
                    }
                } catch (error) {
                    console.error('Error fetching timezone:', error);
                }
                } else if (!newLocation) {
                setTimezone('');
                }
            }}
            className={`w-[80%] px-4 py-3 bg-white border border-dashed left-[10%] top-[5%] text-black absolute  ${
                location ? 'border-[#DFDFDF]' : 'border-purple-500'
            } rounded-lg focus:ring-2 focus:ring-[#7417C6] outline-none`}
            placeholder="Enter event Location"
            />
            <div className="w-full h-[312px] bg-gray-100 rounded-b-lg overflow-hidden">
            <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDcL3tvZQRX7QjgvJxzp7ltjwJkNr6-VkY&q=${
                location ? encodeURIComponent(location) : 'Lagos, Nigeria'
                }`}
                allowFullScreen
            ></iframe>
            </div>
        </div>
        </div>

          {/* Date and Time Picker */}
          <div className='bg-[#F4F4F4] p-[20px]'>
          <div className="flex justify-between border border-[#DFDFDF] p-[20px] rounded-lg bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select the Date and Time for your event
                </label>
                <div className="flex gap-[20px]">
                    <span className='text-[#2D2D2D]'>{selectedDate} {months[selectedMonth]} {selectedYear}</span>
                    <div className="drop">
                        <ArrowDown2 size="24" color="#000"/>
                    </div>
                </div>
            </div>
            <DateTimePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                endTime={endTime}
                setEndTime={setEndTime}
                startTime={startTime}
                setStartTime={setStartTime}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-4 p-6 border-t">
          <button
            className="px-6 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg"
            onClick={handleGoBack}
          >
            Cancel
          </button>
          <div className="w-[131px]">
            <CustomButton
                title="Next"
                icon={<ArrowRight size="24" color="#fff"/>}
                onClick={() => {
                /* Add navigation or form submission logic here */
                }}
                className="w-auto px-6 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;