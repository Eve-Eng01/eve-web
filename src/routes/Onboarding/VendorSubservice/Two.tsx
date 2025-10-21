import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { AddPortfolioModal, PortfolioLink, SocialIcon } from '../SubServices/four';
import logo from "../../../assets/evaLogo.png";
import { CustomButton } from '../../Accessories/Button';
import { ServiceOneProps } from '../SubServices/one';
import Modal from '../../Accessories/MainModal';

export const Route = createFileRoute('/Onboarding/VendorSubservice/Two')({
  component: VendorTwo,
})

export function VendorTwo({continue: handleContinue, back: handleGoBack}: ServiceOneProps) {
    const [portfolioLinks, setPortfolioLinks] = useState<PortfolioLink[]>([]);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const addPortfolioLink = (platform: string, url: string) => {
    const newLink: PortfolioLink = {
      id: Date.now().toString(),
      platform,
      url
    };
    setPortfolioLinks([...portfolioLinks, newLink]);
    setIsModalOpen(false);
  };

  const removePortfolioLink = (id: string) => {
    setPortfolioLinks(portfolioLinks.filter(link => link.id !== id));
  };

  return (
    <div className="min-h-screen flex bg-white justify-center items-center">
      <div className="flex flex-col justify-center items-center px-4">
        <div className="mx-auto mb-4">
          <img src={logo} alt="" className="w-[60px] h-[60px]" />
        </div>
        <h2 className="text-black header">Complete Your Profile</h2>
        <p className="text-black para">
          Add your portfolio link (optional) and accept our terms to finish setting up your vendor account.
        </p>

        {/* Add Your Online Portfolio */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Add Your Online Portfolio</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors duration-200"
              aria-label="Add portfolio link"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Scrollable Portfolio Links Container */}
          <div className="max-h-60 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {portfolioLinks.map((link) => (
              <div key={link.id} className="bg-gray-100 rounded-lg p-4 flex items-center space-x-3">
                <SocialIcon platform={link.platform} />
                
                <div className="flex-1 space-y-1">
                  <div className="text-sm font-medium text-gray-900">
                    {link.platform}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {link.url}
                  </div>
                </div>

                {portfolioLinks.length > 1 && (
                  <button
                    onClick={() => removePortfolioLink(link.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex-shrink-0"
                    aria-label="Remove portfolio link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Review & Accept Terms */}
        <div className="w-full mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Review & Accept Terms</h3>
          <div className="text-[#5A5A5A] space-y-2 mb-4" style={{fontWeight: "300"}}>
            <p>By completing your registration, you agree to the following:</p>
            <p>You will provide accurate and honest information about your services.</p>
            <p>You are solely responsible for the quality of your services and customer interactions.</p>
            <p>You will not upload any misleading, illegal, or copyrighted content without permission. {' '}
              <button className="text-purple-600 hover:text-purple-800 underline font-medium">
                Read More
              </button>
            </p>
          </div>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                termsAccepted 
                  ? 'bg-purple-600 border-purple-600' 
                  : 'border-gray-300 bg-white'
              }`}>
                {termsAccepted && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-gray-900 font-medium">I have read and agree to the Terms and Conditions</span>
          </label>
        </div>

        <div className="w-full max-w-md otherbtn">
          <CustomButton title="Continue" onClick={handleContinue} />
          <button onClick={handleGoBack} className="goBack">
            Go back
          </button>
        </div>
      </div>

      {/* Add Portfolio Link Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
        animationDuration={400}
        showCloseButton={false}
        closeOnOverlayClick={false}
      >
        <AddPortfolioModal
          onAddLink={addPortfolioLink} 
          onClose={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
)}