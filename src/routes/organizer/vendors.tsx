import React, { useState, useMemo } from 'react';
import { Check, X, Circle } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@components/layouts/dashboard-layout';
import { User } from '.';
import { Heart } from 'iconsax-reactjs';
import ChatWidget from '@components/accessories/MessagePopup';

interface Vendor {
  id: number;
  name: string;
  service: string;
  address: string;
  rate: string;
  jobsDone: number;
  jobSuccess: number;
  isOnline: boolean;
}

const vendors: Vendor[] = [
  { id: 1, name: 'Elite Events Co.', service: 'DJ', address: 'No 35 Lekki avenue Lagos, Nigeria', rate: '$100K-1M', jobsDone: 129, jobSuccess: 89, isOnline: true },
  { id: 2, name: 'Elite Events Co.', service: 'DJ', address: 'No 35 Lekki avenue Lagos, Nigeria', rate: '$100K-1M', jobsDone: 129, jobSuccess: 89, isOnline: true },
  { id: 3, name: 'Elite Events Co.', service: 'DJ', address: 'No 35 Lekki avenue Lagos, Nigeria', rate: '$100K-1M', jobsDone: 129, jobSuccess: 89, isOnline: true },
  { id: 4, name: 'Elite Events Co.', service: 'DJ', address: 'No 35 Lekki avenue Lagos, Nigeria', rate: '$100K-1M', jobsDone: 129, jobSuccess: 15, isOnline: true },
  { id: 5, name: 'Elite Events Co.', service: 'DJ', address: 'No 35 Lekki avenue Lagos, Nigeria', rate: '$100K-1M', jobsDone: 129, jobSuccess: 48, isOnline: true },
  { id: 6, name: 'Elite Events Co.', service: 'DJ', address: 'No 35 Lekki avenue Lagos, Nigeria', rate: '$100K-1M', jobsDone: 129, jobSuccess: 90, isOnline: true },
  { id: 7, name: 'Elite Events Co.', service: 'DJ', address: 'No 35 Lekki avenue Lagos, Nigeria', rate: '$100K-1M', jobsDone: 129, jobSuccess: 59, isOnline: true },
  { id: 8, name: 'Elite Events Co.', service: 'DJ', address: 'No 35 Lekki avenue Lagos, Nigeria', rate: '$100K-1M', jobsDone: 129, jobSuccess: 90, isOnline: true },
];

const services = ['Tailoring', 'Catering', 'Driver/Taxi', 'Event Planners', 'Photography', 'Videography'];
const states = ['Abuja', 'Benue Sate', 'Edo State', 'Lagos State', 'Imo State', 'Delta State'];

export const Route = createFileRoute('/organizer/vendors')({
  component: RouteComponent,
});

function RouteComponent() {
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [jobSuccessRange, setJobSuccessRange] = useState([0, 0]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      // Filter by job success
      if (jobSuccessRange[0] > 0 || jobSuccessRange[1] > 0) {
        const maxSuccess = jobSuccessRange[1] || 100;
        if (vendor.jobSuccess < jobSuccessRange[0] || vendor.jobSuccess > maxSuccess) {
          return false;
        }
      }
      return true;
    });
  }, [jobSuccessRange]);

  const handlePriceChange = (index: number, value: number) => {
    const newRange = [...priceRange];
    newRange[index] = value;
    setPriceRange(newRange);
  };

  const handleJobSuccessChange = (index: number, value: number) => {
    const newRange = [...jobSuccessRange];
    newRange[index] = value;
    setJobSuccessRange(newRange);
  };

  const getSuccessIcon = (success: number) => {
    if (success >= 80) return <Check className="w-4 h-4 text-white" />;
    if (success >= 40) return <Circle className="w-4 h-4 text-white" />;
    return <X className="w-4 h-4 text-white" />;
  };

  const getSuccessColor = (success: number) => {
    if (success >= 80) return 'bg-green-500';
    if (success >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <DashboardLayout user={User}>
      <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Filters */}
      <div className="w-[344px]  space-y-6">
        {/* Price Range Filter */}
        <div className="p-4 bg-[#f4f4f4] border-[#DFDFDF] border-2 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">*Price Range</span>
                <button className="text-purple-600 text-sm font-medium">Apply Price</button>
            </div>

            {/* Slider */}
            <div className="relative w-full h-8">
                {/* Track */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-gray-200 rounded-full" />

                {/* Active Range */}
                <div
                className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-purple-600 rounded-full"
                style={{
                    left: `${priceRange[0]}%`,
                    right: `${100 - priceRange[1]}%`,
                }}
                />

                {/* Left Thumb */}
                <input
                type="range"
                min="0"
                max="100"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                className="
                    absolute bottom-2 w-full pointer-events-auto
                    appearance-none bg-transparent
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-purple-600
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-white
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-purple-600
                "
                />

                {/* Right Thumb */}
                <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                className="
                    absolute bottom-2 w-full pointer-events-auto
                    appearance-none bg-transparent
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-purple-600
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-white
                    [&::-webkit-slider-thumb]:shadow-md
                "
                />
            </div>

            <div className="flex justify-between text-sm text-gray-500">
                <span>Min</span>
                <span>Max</span>
            </div>

            <div className="flex justify-between">
                <div className="bg-white rounded-xl w-[142px] py-2 text-center text-gray-700 font-medium">
                ${priceRange[0]}K
                </div>
                <div className="bg-white rounded-xl w-[142px] py-2 text-center text-gray-700 font-medium">
                ${priceRange[1]}M
                </div>
            </div>
        </div>


        {/* Job Success Filter */}
        <div className="p-4 bg-[#f4f4f4] border-[#DFDFDF] border-2 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">*Job Success</span>
                <button className="text-purple-600 text-sm font-medium">Apply</button>
            </div>

            <div className="relative w-full h-8">
                {/* Track */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-gray-200 rounded-full" />

                {/* Active Range */}
                <div
                className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-purple-600 rounded-full"
                style={{
                    left: `${jobSuccessRange[0]}%`,
                    right: `${100 - jobSuccessRange[1]}%`,
                }}
                />

                {/* Left Thumb */}
                <input
                type="range"
                min="0"
                max="100"
                value={jobSuccessRange[0]}
                onChange={(e) => handleJobSuccessChange(0, Number(e.target.value))}
                className="
                    absolute bottom-2 w-full pointer-events-auto
                    appearance-none bg-transparent
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-purple-600
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-white
                    [&::-webkit-slider-thumb]:shadow-md
                "
                />

                {/* Right Thumb */}
                <input
                type="range"
                min="0"
                max="100"
                value={jobSuccessRange[1]}
                onChange={(e) => handleJobSuccessChange(1, Number(e.target.value))}
                className="
                    absolute bottom-2 w-full pointer-events-auto
                    appearance-none bg-transparent
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-purple-600
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-white
                    [&::-webkit-slider-thumb]:shadow-md
                "
                />
            </div>

            <div className="flex justify-between text-sm text-gray-500">
                <span>Min</span>
                <span>Max</span>
            </div>

            <div className="flex justify-between">
                <div className="bg-white rounded-xl w-[142px] py-2 text-center text-gray-700 font-medium">
                {jobSuccessRange[0]}%
                </div>
                <div className="bg-white rounded-xl w-[142px] py-2 text-center text-gray-700 font-medium">
                {jobSuccessRange[1]}%
                </div>
            </div>
        </div>


        {/* Services Type Filter */}
        <div className="p-4 bg-[#f4f4f4] border-[#DFDFDF] border-2 rounded-2xl space-y-4">
            <span className="font-semibold text-gray-900">*Services</span>

            {services.map((service) => (
                <label
                key={service}
                onClick={() => setSelectedServices([service])}
                className="flex justify-between items-center cursor-pointer py-2"
                >
                <div className="flex items-center space-x-3">
                    <div
                    className={`
                        h-5 w-5 rounded-full border-2 flex items-center justify-center
                        ${selectedServices.includes(service) ? "border-purple-600" : "border-gray-300"}
                    `}
                    >
                    {selectedServices.includes(service) && (
                        <div className="h-2.5 w-2.5 rounded-full bg-purple-600" />
                    )}
                    </div>
                    <span className="text-gray-700">{service}</span>
                </div>
                </label>
            ))}
        </div>


        {/* State Filter */}
        <div className="p-4 bg-[#f4f4f4] border-[#DFDFDF] border-2 rounded-2xl space-y-4">
            <span className="font-semibold text-gray-900">*State</span>

            {states.map((state) => (
                <label
                key={state}
                onClick={() => setSelectedStates([state])}
                className="flex items-center justify-between cursor-pointer py-2"
                >
                <div className="flex items-center space-x-3">
                    <div
                    className={`
                        h-5 w-5 rounded-full border-2 flex items-center justify-center
                        ${selectedStates.includes(state) ? "border-purple-600" : "border-gray-300"}
                    `}
                    >
                    {selectedStates.includes(state) && (
                        <div className="h-2.5 w-2.5 rounded-full bg-purple-600" />
                    )}
                    </div>
                    <span className="text-gray-700">{state}</span>
                </div>
                </label>
            ))}
        </div>

      </div>

      <div className="flex-1 p-8">
        <div className="space-y-6">
            {filteredVendors.map((vendor) => (
            <div
                key={vendor.id}
                className="bg-[#F7F7F7] rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative"
            >
                {/* Top-right Action Buttons */}
                <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
                {/* Heart Icon */}
                <button className="p-2.5 hover:bg-gray-100 rounded-full transition">
                    <Heart color='#7417C6'/>
                </button>

                {/* Message Button */}
                <button className="px-5 py-2.5 border border-[#7417C6] text-[#7417C6] rounded-lg font-medium text-sm hover:bg-purple-50 transition">
                    Message
                </button>

                {/* Send Proposal Button */}
                <button className="px-5 py-2.5 bg-[#7417C6] text-white rounded-lg font-medium text-sm hover:bg-purple-700 transition flex items-center gap-2 shadow-md">
                    Send Proposal
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
                </div>

                {/* Main Card Content */}
                <div className="p-6 flex flex-col sm:flex-row items-start gap-6">
                {/* Vendor Image with Online Badge */}
                <div className="relative flex-shrink-0">
                    <img
                    src="https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=400&fit=crop"
                    alt="DJ Equipment"
                    className="w-36 h-36 rounded-2xl object-cover"
                    />
                    <span className="absolute border-2 bottom-0 right-0 bg-green-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Online
                    </span>
                </div>

                {/* Vendor Info + Stats */}
                <div className="flex-1 space-y-4 pt-10 sm:pt-0">
                    <div>
                    <h3 className="text-xl font-medium text-gray-800">
                        Name: {vendor.name}
                    </h3>
                    <p className="text-lg text-gray-700 mt-1">
                        Service: <span className="font-semibold">{vendor.service}</span>
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-2 mt-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {vendor.address}
                    </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-5 pt-4 pb-4 border-t border-b border-gray-200">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Rate</p>
                        <p className="text-2xl font-medium text-purple-600 mt-1">{vendor.rate}</p>
                    </div>
                    <div className='border-l border-gray-200'/>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">No Of Jobs Done</p>
                        <p className="text-2xl font-medium text-purple-600 mt-1">{vendor.jobsDone} Jobs</p>
                    </div>
                    <div className='border-l border-gray-200'/>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Job Success</p>
                        <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-medium text-purple-600">{vendor.jobSuccess}%</span>
                        <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}