import { useState } from "react";
import logo from "@assets/evaLogo.png";
import { CustomButton } from "@components/accessories/button";
import Modal from "@components/accessories/main-modal";
import {
  AddPortfolioModal,
  PortfolioLink,
  SocialIcon,
} from "../sub-services/four";

export interface OrganizerSocialsStepProps {
  continue: () => void;
  back: () => void;
  portfolioLinks: PortfolioLink[];
  onPortfolioLinksChange: (links: PortfolioLink[]) => void;
}

export function OrganizerSocialsStep({
  continue: handleContinue,
  back: handleGoBack,
  portfolioLinks,
  onPortfolioLinksChange,
}: OrganizerSocialsStepProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const addPortfolioLink = (platform: string, url: string) => {
    const newLink: PortfolioLink = {
      id: Date.now().toString(),
      platform,
      url,
    };
    onPortfolioLinksChange([...portfolioLinks, newLink]);
    setIsModalOpen(false);
  };

  const removePortfolioLink = (id: string) => {
    onPortfolioLinksChange(portfolioLinks.filter((link) => link.id !== id));
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center px-4 w-full max-w-2xl">
        <div className="mx-auto mb-4">
          <img src={logo} alt="" className="w-[60px] h-[60px]" />
        </div>
        <h2 className="text-black header text-center">Complete Your Profile</h2>
        <p className="text-black para text-center">
          Add your portfolio links (optional) to help clients learn more about
          your organization.
        </p>

        {/* Add Your Online Portfolio */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Add Your Online Portfolio
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors duration-200"
              aria-label="Add portfolio link"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable Portfolio Links Container */}
          <div className="max-h-60 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {portfolioLinks.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No portfolio links added yet. Click the + button to add one.
              </p>
            ) : (
              portfolioLinks.map((link) => (
                <div
                  key={link.id}
                  className="bg-gray-100 rounded-lg p-4 flex items-center space-x-3"
                >
                  <SocialIcon platform={link.platform} />

                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      {link.platform}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {link.url}
                    </div>
                  </div>

                  <button
                    onClick={() => removePortfolioLink(link.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex-shrink-0"
                    aria-label="Remove portfolio link"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-full  otherbtn">
          <CustomButton title="Continue" onClick={handleContinue} />
          <CustomButton onClick={handleGoBack} title="Go back" className="goBack bg-transparent text-black " />
          
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
    </>
  );
}

