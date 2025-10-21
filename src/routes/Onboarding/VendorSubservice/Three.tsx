import { createFileRoute } from '@tanstack/react-router';
import { ServiceOneProps } from '../SubServices/one';
import { CustomButton } from '../../Accessories/Button';
import logo from '../../../assets/evaLogo.png';
import { Edit, TickCircle } from 'iconsax-reactjs';
import { useState } from 'react';

export const Route = createFileRoute('/Onboarding/VendorSubservice/Three')({
  component: VendorThree,
});

export function VendorThree({ continue: handleContinue, back: handleGoBack }: ServiceOneProps) {
  // State for each input field's value and editability
  const [formData, setFormData] = useState({
    fullName: 'Emumwen Gabriel Osauoname',
    email: 'gabrielemumwen20@gmail.com',
    companyName: 'Eve Even Platform',
    location: 'Ibeju Lekki Lagos, Nigeria.',
    eventOrganizerNumber: '+234-081-5882-5489',
  });

  const [isEditable, setIsEditable] = useState({
    fullName: false,
    email: false,
    companyName: false,
    location: false,
    eventOrganizerNumber: false,
  });

  // Handle input change
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Toggle editability for a specific field
  const toggleEditable = (field: keyof typeof isEditable) => {
    setIsEditable((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle key press (e.g., Enter to save)
  const handleKeyPress = (field: keyof typeof isEditable, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      toggleEditable(field);
    }
  };

  return (
    <div className="min-h-screen flex bg-white justify-center items-center">
      <div className="flex flex-col justify-center items-center px-4">
        {/* Header */}
        <div className="mx-auto mb-4">
          <img src={logo} alt="" className="w-[60px] h-[60px]" />
        </div>
        <h2 className="text-black header">Review Your Information</h2>
        <p className="text-black para">
          Here’s a summary of everything you’ve added. Make sure your details are correct before submitting your profile.
        </p>

        {/* Profile Information Section */}
        <div className="mb-[50px]">
          <div className="flex items-center gap-3 mb-8">
            <TickCircle size="32" color="#000" variant="Bold" />
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          </div>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onKeyPress={(e) => handleKeyPress('fullName', e)}
                  readOnly={!isEditable.fullName}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none ${
                    isEditable.fullName ? 'bg-white' : 'bg-gray-50'
                  }`}
                />
                <button
                  onClick={() => toggleEditable('fullName')}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700"
                >
                  <Edit size="18" color="#7417C6" variant="Outline" />
                </button>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onKeyPress={(e) => handleKeyPress('email', e)}
                  readOnly={!isEditable.email}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none pr-12 ${
                    isEditable.email ? 'bg-white' : 'bg-gray-50'
                  }`}
                />
                <button
                  onClick={() => toggleEditable('email')}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700"
                >
                  <Edit size="18" color="#7417C6" variant="Outline" />
                </button>
              </div>
            </div>

            {/* Registered Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registered Company Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  onKeyPress={(e) => handleKeyPress('companyName', e)}
                  readOnly={!isEditable.companyName}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none pr-12 ${
                    isEditable.companyName ? 'bg-white' : 'bg-gray-50'
                  }`}
                />
                <button
                  onClick={() => toggleEditable('companyName')}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700"
                >
                  <Edit size="18" color="#7417C6" variant="Outline" />
                </button>
              </div>
            </div>

            {/* Location and Event Organizer Number Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    onKeyPress={(e) => handleKeyPress('location', e)}
                    readOnly={!isEditable.location}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none pr-12 ${
                      isEditable.location ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                  <button
                    onClick={() => toggleEditable('location')}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700"
                  >
                    <Edit size="18" color="#7417C6" variant="Outline" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Organizer Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.eventOrganizerNumber}
                    onChange={(e) => handleInputChange('eventOrganizerNumber', e.target.value)}
                    onKeyPress={(e) => handleKeyPress('eventOrganizerNumber', e)}
                    readOnly={!isEditable.eventOrganizerNumber}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none pr-12 ${
                      isEditable.eventOrganizerNumber ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                  <button
                    onClick={() => toggleEditable('eventOrganizerNumber')}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700"
                  >
                    <Edit size="18" color="#7417C6" variant="Outline" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md otherbtn">
          <CustomButton title="Continue" onClick={handleContinue} />
          <button onClick={handleGoBack} className="goBack">
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}