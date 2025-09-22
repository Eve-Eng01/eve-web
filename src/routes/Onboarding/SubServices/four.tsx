import { createFileRoute } from "@tanstack/react-router";
import { ServiceOneProps } from "./one";
import { CustomButton } from "../../../components/Button/Button";
import logo from "../../../assets/evaLogo.png";
import { useState } from "react";
import Modal from "../../Accessories/MainModal";

export const Route = createFileRoute("/Onboarding/SubServices/four")({
  component: ServiceFour,
});

export interface PortfolioLink {
  id: string;
  platform: string;
  url: string;
}

// Icon component for different social platforms
export const SocialIcon = ({ platform }: { platform: string }) => {
  const platformLower = platform.toLowerCase();
  
  if (platformLower.includes('instagram')) {
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </div>
    );
  }
  
  if (platformLower.includes('facebook')) {
    return (
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </div>
    );
  }
  
  if (platformLower.includes('twitter') || platformLower.includes('x.com')) {
    return (
      <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>
    );
  }
  
  if (platformLower.includes('linkedin')) {
    return (
      <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </div>
    );
  }
  
  if (platformLower.includes('behance')) {
    return (
      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M0 7.5v9c0 .83.67 1.5 1.5 1.5h21c.83 0 1.5-.67 1.5-1.5v-9c0-.83-.67-1.5-1.5-1.5h-21c-.83 0-1.5.67-1.5 1.5zM9.99 13.5h-3.24c-.55 0-1-.45-1-1s.45-1 1-1h3.24c.55 0 1 .45 1 1s-.45 1-1 1zm7.26-4.5h-2.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2.5c.28 0 .5.22.5.5s-.22.5-.5.5z"/>
        </svg>
      </div>
    );
  }
  
  if (platformLower.includes('whatsapp')) {
    return (
      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.463 3.488"/>
        </svg>
      </div>
    );
  }
  
  // Default icon for websites or unknown platforms
  return (
    <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    </div>
  );
};

// Add Portfolio Link Modal Component
export const AddPortfolioModal = ({ 
  onAddLink,
  onClose
}: { 
  onAddLink: (platform: string, url: string) => void;
  onClose: () => void;
}) => {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('Instagram');

  const handleDone = () => {
    if (url.trim()) {
      onAddLink(platform, url);
      setUrl('');
      setPlatform('Instagram');
    }
  };

  const handleCancel = () => {
    setUrl('');
    setPlatform('Instagram');
    onClose();
  };

  const platforms = [
    'Instagram',
    'Facebook', 
    'Twitter',
    'LinkedIn',
    'Behance',
    'WhatsApp',
    'Website'
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Portfolio Link</h2>
        <p className="text-gray-600">
          Share a link to your work on platforms like Instagram, facebook, 
          whatsapp Behance, or your website. This helps clients view more of 
          what you offer.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Add portfolio or social media Link
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.portfolioplace.com/vendor/jayevents_studio"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-purple-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Brand name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SocialIcon platform={platform} />
            </div>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full text-[#000] pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none bg-white"
            >
              {platforms.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handleCancel}
          className="flex-1 px-6 py-3 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleDone}
          disabled={!url.trim()}
          className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export function ServiceFour({continue: handleContinue, back: handleGoBack}: ServiceOneProps) {
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
          <div className="text-gray-700 space-y-2 mb-4">
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
  )
}