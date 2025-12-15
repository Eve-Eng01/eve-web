import { createFileRoute } from "@tanstack/react-router";
import { ServiceOneProps } from "./one";
import { CustomButton } from "@components/button/button";
import logo from "@assets/evaLogo.png";
import { useState } from "react";
import Modal from "@components/accessories/main-modal";
import { useUpdateOnboardingProfile } from "@/shared/api/services/onboarding";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AddPortfolioModal, SocialIcon } from "@/shared/components/portfolio-link-modal";

export const Route = createFileRoute("/_vendor/vendor/onboarding/sub-services/four")({
  component: ServiceFour,
});

export interface PortfolioLink {
  id: string;
  platform: string;
  url: string;
}

// Validation schema for portfolio links (optional but if provided, must be valid)
const portfolioSchema = yup.object({
  termsAccepted: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
  portfolioLinks: yup.array().of(
    yup.object({
      brand: yup.string().required(),
      url: yup.string().url("Must be a valid URL").required(),
    })
  ),
});

export function ServiceFour({
  continue: handleContinue,
  back: handleGoBack,
}: ServiceOneProps) {
  const [portfolioLinks, setPortfolioLinks] = useState<PortfolioLink[]>([]);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // API mutation hook
  const updateProfile = useUpdateOnboardingProfile({
    onSuccess: () => {
      handleContinue();
    },
  });

  // Form validation
  const form = useForm({
    resolver: yupResolver(portfolioSchema) as any,
    mode: "onChange",
    defaultValues: {
      termsAccepted: true,
      portfolioLinks: [],
    },
  });

  const { formState, setValue } = form;
  const { errors, isValid } = formState;

  const addPortfolioLink = (platform: string, url: string) => {
    const newLink: PortfolioLink = {
      id: Date.now().toString(),
      platform,
      url,
    };
    const updatedLinks = [...portfolioLinks, newLink];
    setPortfolioLinks(updatedLinks);
    
    // Update form value
    setValue(
      "portfolioLinks",
      updatedLinks.map((link) => ({ brand: link.platform, url: link.url })),
      { shouldValidate: true }
    );
    setIsModalOpen(false);
  };

  const removePortfolioLink = (id: string) => {
    const updatedLinks = portfolioLinks.filter((link) => link.id !== id);
    setPortfolioLinks(updatedLinks);
    
    // Update form value
    setValue(
      "portfolioLinks",
      updatedLinks.map((link) => ({ brand: link.platform, url: link.url })),
      { shouldValidate: true }
    );
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      return;
    }

    try {
      // Prepare links data
      const linksData = portfolioLinks.length > 0
        ? portfolioLinks.map((link) => ({
            brand: link.platform,
            url: link.url,
          }))
        : undefined;

      await updateProfile.mutateAsync({
        links: linksData,
      });
    } catch (error) {
      console.error("Failed to update portfolio links:", error);
    }
  };

  return (
<>
<div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <div className="mx-auto mb-2 sm:mb-3 md:mb-4 flex items-center justify-center">
          <img src={logo} alt="" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[60px] lg:h-[60px]" />
        </div>
        <h2 className="text-black header text-xl sm:text-2xl md:text-3xl lg:text-[32px] leading-tight">
          Complete Your Profile
        </h2>
        <p className="text-black para text-sm sm:text-base mt-2 sm:mt-3 max-w-xl mx-auto">
          Add your portfolio link (optional) and accept our terms to finish
          setting up your vendor account.
        </p>
      </div>

      {/* Add Your Online Portfolio */}
      <div className="w-full mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            Add Your Online Portfolio
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-full flex items-center justify-center transition-colors duration-200 shrink-0 touch-manipulation"
            aria-label="Add portfolio link"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
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
        <div className="max-h-[240px] sm:max-h-60 md:max-h-72 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
          {portfolioLinks.map((link) => (
            <div
              key={link.id}
              className="bg-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 flex items-center space-x-3 sm:space-x-4"
            >
              <div className="shrink-0">
                <SocialIcon platform={link.platform} />
              </div>

              <div className="flex-1 space-y-1 min-w-0">
                <div className="text-sm sm:text-base font-medium text-gray-900 truncate">
                  {link.platform}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 truncate break-all">
                  {link.url}
                </div>
              </div>

              {portfolioLinks.length > 1 && (
                <button
                  onClick={() => removePortfolioLink(link.id)}
                  className="text-gray-400 hover:text-red-500 active:text-red-600 transition-colors duration-200 shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center touch-manipulation"
                  aria-label="Remove portfolio link"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Review & Accept Terms */}
      <div className="w-full mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
          Review & Accept Terms
        </h3>
        <div className="text-gray-700 text-sm sm:text-base space-y-2 sm:space-y-3 mb-4 sm:mb-5 leading-relaxed">
          <p>By completing your registration, you agree to the following:</p>
          <p>
            You will provide accurate and honest information about your
            services.
          </p>
          <p>
            You are solely responsible for the quality of your services and
            customer interactions.
          </p>
          <p>
            You will not upload any misleading, illegal, or copyrighted
            content without permission.{" "}
            <button className="text-purple-600 hover:text-purple-800 active:text-purple-900 underline font-medium touch-manipulation">
              Read More
            </button>
          </p>
        </div>

        <label className="flex items-start sm:items-center space-x-3 cursor-pointer touch-manipulation">
          <div className="relative shrink-0 mt-0.5 sm:mt-0">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => {
                const checked = e.target.checked;
                setTermsAccepted(checked);
                setValue("termsAccepted", checked, { shouldValidate: true });
              }}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                termsAccepted
                  ? "bg-purple-600 border-purple-600"
                  : "border-gray-300 bg-white"
              }`}
            >
              {termsAccepted && (
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>
          <span className="text-gray-900 font-medium text-sm sm:text-base leading-relaxed">
            I have read and agree to the Terms and Conditions
          </span>
        </label>
      </div>

      <div className="w-full max-w-2xl space-y-3 sm:space-y-4">
        <CustomButton
          title={updateProfile.isPending ? "Saving..." : "Continue"}
          onClick={handleSubmit}
          disabled={!termsAccepted || updateProfile.isPending}
          loading={updateProfile.isPending}
        />
        {errors.termsAccepted && (
          <p className="text-red-500 text-sm text-center mt-2">
            {errors.termsAccepted.message}
          </p>
        )}
        <CustomButton
            onClick={handleGoBack}
            title="Go back"
            className="goBack bg-transparent text-black "
            disabled={updateProfile.isPending}
          />
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
