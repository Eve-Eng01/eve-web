'use client';

import Modal from "@components/accessories/main-modal";

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { User } from '..';
import { DashboardLayout } from '@components/layouts/dashboard-layout';
import { CustomButton } from '@components/button/button';
import { ArrowLeft, Heart, Star } from 'iconsax-reactjs';
import { CheckCircle, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_organizer/organizer/vendor/details')({
  component: RouteComponent,
});
function RouteComponent() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate({ to: "/organizer/vendors" });
  };
  const goToMessage = () => {
    navigate({ to: "/organizer/messages" })
  }

  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');

  // All photos in the gallery
  const photos = [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop',
  ];

  // Modal + Carousel State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <DashboardLayout user={User}>
      {/* Go Back Button */}
      <CustomButton
        title="Go back"
        icon={<ArrowLeft className="h-4 w-4" />}
        onClick={handleGoBack}
        className="w-auto flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2.5 sm:py-3.5 border border-[#eaeaea] rounded-[14px] text-xs sm:text-sm font-medium text-[#777777] bg-transparent hover:bg-gray-50 disabled:bg-transparent shadow-none transition-colors"
      />

      <div className="mx-auto p-4 sm:p-6 max-w-7xl">
        {/* Main Vendor Card */}
        <div className="bg-[#F7F7F7] rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Vendor Image */}
              <div className="relative w-full lg:w-64 h-64 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop"
                  alt="Vendor"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute bottom-0 right-0 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                  Online
                </div>
              </div>

              {/* Vendor Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-2">
                        Name: Elite Events Co.
                      </h1>
                      <p className="text-lg text-gray-600">
                        Service <span className="text-gray-400">{'>'}</span>{' '}
                        <span className="font-normal text-gray-900">Photographer</span>
                      </p>
                    </div>
                    <button className="p-3 rounded-full border-2 border-purple-600 hover:bg-purple-50 transition-colors">
                      <Heart className="w-6 h-6 text-purple-600" />
                    </button>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">No 35 Lekki avenue Lagos, Nigeria</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">info@elegantmoments.ng</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">081 5993 489</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Rate</p>
                    <p className="text-2xl font-normal text-purple-600">$100K-1M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">No Of Jobs Done</p>
                    <p className="text-2xl font-normal text-purple-600">129 Jobs</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Job Success</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-normal text-purple-600">89%</p>
                      <CheckCircle className="w-6 h-6 text-emerald-500 fill-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Rating</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      <p className="text-xl font-normal text-gray-900">4.4 / 5</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <p className="text-gray-600 leading-relaxed">
              With over 10 years of experience in event management, Elegant Moments specializes in creating unforgettable experiences for weddings, corporate events, and social gatherings. Our team brings creativity, precision, and professionalism to every project.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 sm:px-8 pb-6 sm:pb-8">
            <button 
                onClick={goToMessage}
                className="w-full cursor-pointer py-4 px-6 rounded-2xl border-2 border-purple-600 text-purple-600 font-semibold text-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
              Message Vendor
            </button>
            <button className="w-full cursor-pointer py-4 px-6 rounded-2xl bg-purple-600 text-white font-semibold text-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              Request Proposal
            </button>
          </div>
        </div>

        {/* Services Offered */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-6">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-6">
            +) Services Offered
          </h2>
          <ul className="space-y-4">
            <li className="text-gray-700 text-base sm:text-lg border-b border-gray-100 pb-4">
              • Full-Service Event Planning — From concept to execution.
            </li>
            <li className="text-gray-700 text-base sm:text-lg border-b border-gray-100 pb-4">
              • Catering Services — Customized menus for weddings, parties & corporate events.
            </li>
            <li className="text-gray-700 text-base sm:text-lg border-b border-gray-100 pb-4">
              • Event Styling & Decor — Modern, elegant, and theme-based styling.
            </li>
            <li className="text-gray-700 text-base sm:text-lg">
              • Photography & Videography — Capture every special moment.
            </li>
          </ul>
        </div>

        {/* Photos / Videos Gallery */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-6 py-3 rounded-full font-semibold text-base transition-all ${
                activeTab === 'photos'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-purple-300'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 rounded-full font-semibold text-base transition-all ${
                activeTab === 'videos'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-purple-300'
              }`}
            >
              Videos
            </button>
          </div>

          {/* Photo Grid */}
          {activeTab === 'photos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => openModal(index)}
                >
                  <img
                    src={photo}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="text-center py-12 text-gray-500">No videos available</div>
          )}
        </div>
        
      {/* Testimonials & Reviews Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Testimonials & Reviews
          </h2>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition-colors">
            See More
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Review 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                alt="Reviewer"
                className="w-16 h-16 rounded-full object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900">Pricilla Daniels</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Elegant Moments made my wedding stress-free. Every detail was perfect and everything i was looking forward to was provided for me by elegant moment highly recommend!👏🤩😻
            </p>
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-semibold">September 12 2025</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                alt="Reviewer"
                className="w-16 h-16 rounded-full object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900">Pricilla Daniels</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Elegant Moments made my wedding stress-free. Every detail was perfect and everything i was looking forward to was provided for me by elegant moment highly recommend!👏🤩😻
            </p>
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-semibold">September 12 2025</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                alt="Reviewer"
                className="w-16 h-16 rounded-full object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900">Pricilla Daniels</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Elegant Moments made my wedding stress-free. Every detail was perfect and everything i was looking forward to was provided for me by elegant moment highly recommend!👏🤩😻
            </p>
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-semibold">September 12 2025</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Review 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
                alt="Reviewer"
                className="w-16 h-16 rounded-full object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900">Pricilla Daniels</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Elegant Moments made my wedding stress-free. Every detail was perfect and everything i was looking forward to was provided for me by elegant moment highly recommend!👏🤩😻
            </p>
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-semibold">September 12 2025</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Review 5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                alt="Reviewer"
                className="w-16 h-16 rounded-full object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900">Pricilla Daniels</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Elegant Moments made my wedding stress-free. Every detail was perfect and everything i was looking forward to was provided for me by elegant moment highly recommend!👏🤩😻
            </p>
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-semibold">September 12 2025</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Review 6 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                alt="Reviewer"
                className="w-16 h-16 rounded-full object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900">Pricilla Daniels</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Elegant Moments made my wedding stress-free. Every detail was perfect and everything i was looking forward to was provided for me by elegant moment highly recommend!👏🤩😻
            </p>
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-semibold">September 12 2025</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* REUSABLE MODAL WITH FULL CAROUSEL */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Wedding Setup at Lekki Gardens"
          size="xl"
        //   showCloseButton={false}
          closeOnOverlayClick={false}
        >
          <div className="mx-auto">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              {/* <h3 className="text-xl font-bold text-gray-900">Wedding Setup at Lekki Gardens</h3> */}
              <div className="text-sm text-gray-500">21 September 2025</div>
            </div>

            {/* Carousel Image */}
            <div className="relative bg-gradient-to-br from-purple-100 to-blue-100 p-4 md:p-8">
              <div className="relative mx-auto max-w-5xl aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={photos[currentIndex]}
                  alt={`Image ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Prev Button */}
                <button
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-4 shadow-xl transition-all z-10"
                  aria-label="Previous"
                >
                  <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-4 shadow-xl transition-all z-10"
                  aria-label="Next"
                >
                  <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur rounded-full px-6 py-3 text-lg font-bold text-gray-800 shadow-lg">
                  {currentIndex + 1} / {photos.length}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5">
              <p className="text-gray-700 leading-relaxed mb-4">
                Elegant outdoor wedding held in Lagos, featuring full floral decor, stage setup, and sound equipment. 
                We handled decoration, lighting, and coordination for over 200 guests.
              </p>
              <a
                href="https://www.portfolioplace.com/vendor/jayevents_studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                https://www.portfolioplace.com/vendor/jayevents_studio
              </a>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default RouteComponent;