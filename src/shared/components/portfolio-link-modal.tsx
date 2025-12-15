/**
 * Portfolio Link Modal Component
 * Reusable modal for adding portfolio/social media links
 * Used by both organizers and vendors during onboarding
 */

import { useState, useMemo } from "react";
import { DropdownInput, DropdownOption } from "@/shared/components/accessories/dropdown-input";

// Social Icon Component
export const SocialIcon = ({ platform }: { platform: string }) => {
  const platformLower = platform.toLowerCase();

  if (platformLower.includes("instagram")) {
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center shrink-0">
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </div>
    );
  }

  if (platformLower.includes("facebook")) {
    return (
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </div>
    );
  }

  if (platformLower.includes("twitter") || platformLower.includes("x.com")) {
    return (
      <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0">
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    );
  }

  if (platformLower.includes("linkedin")) {
    return (
      <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center shrink-0">
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </div>
    );
  }

  if (platformLower.includes("tiktok")) {
    return (
      <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0">
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      </div>
    );
  }

  if (platformLower.includes("website")) {
    return (
      <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center shrink-0">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      </div>
    );
  }

  // Default icon for unknown platforms
  return (
    <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center shrink-0">
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    </div>
  );
};

// Portfolio Link Modal Props
export interface AddPortfolioModalProps {
  onAddLink: (platform: string, url: string) => void;
  onClose: () => void;
}

// Add Portfolio Link Modal Component
export const AddPortfolioModal = ({
  onAddLink,
  onClose,
}: AddPortfolioModalProps) => {
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState<DropdownOption | null>({
    value: "Instagram",
    label: "Instagram",
  });

  // Get base URL for each platform
  const getBaseUrl = (platformName: string): string => {
    const platformLower = platformName.toLowerCase();
    if (platformLower.includes("instagram")) return "https://instagram.com/";
    if (platformLower.includes("facebook")) return "https://facebook.com/";
    if (platformLower.includes("twitter")) return "https://twitter.com/";
    if (platformLower.includes("linkedin")) return "https://linkedin.com/in/";
    if (platformLower.includes("tiktok")) return "https://tiktok.com/@";
    if (platformLower.includes("website")) return "https://";
    return "";
  };

  // Build full URL from handle and platform
  const fullUrl = useMemo(() => {
    if (!platform || !handle.trim()) return "";
    const baseUrl = getBaseUrl(platform.value);
    // For Website, use handle as full URL if it starts with http, otherwise prepend https://
    if (platform.value === "Website") {
      const trimmedHandle = handle.trim();
      if (
        trimmedHandle.startsWith("http://") ||
        trimmedHandle.startsWith("https://")
      ) {
        return trimmedHandle;
      }
      return "https://" + trimmedHandle;
    }
    return baseUrl + handle.trim();
  }, [handle, platform]);

  const handleDone = () => {
    if (handle.trim() && platform) {
      onAddLink(platform.value, fullUrl);
      setHandle("");
      setPlatform({
        value: "Instagram",
        label: "Instagram",
      });
    }
  };

  const handleCancel = () => {
    setHandle("");
    setPlatform({
      value: "Instagram",
      label: "Instagram",
    });
    onClose();
  };

  const platformOptions: DropdownOption[] = [
    { value: "Instagram", label: "Instagram" },
    { value: "Facebook", label: "Facebook" },
    { value: "Twitter", label: "Twitter" },
    { value: "LinkedIn", label: "LinkedIn" },
    { value: "TikTok", label: "TikTok" },
    { value: "Website", label: "Website" },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Add Portfolio Link
        </h2>
        <p className="text-gray-600">
          Share a link to your work on platforms like Instagram, Facebook,
          TikTok, or your website. This helps clients view more of what you
          offer.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Brand name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              {platform && <SocialIcon platform={platform.value} />}
            </div>
            <div className="pl-12">
              <DropdownInput
                options={platformOptions}
                value={platform}
                onChange={(option) => setPlatform(option)}
                placeholder="Select a platform"
                buttonClassName="w-full text-[#000] border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white text-left"
                dropDownClassName="z-50"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {platform?.value === "Website" ? "Website URL" : "Handle"}
          </label>
          <div className="relative">
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder={
                platform?.value === "Website"
                  ? "https://example.com or example.com"
                  : "Enter your handle"
              }
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-purple-600"
            />
          </div>
          {fullUrl && (
            <p className="mt-2 text-sm text-gray-500">
              Full URL:{" "}
              <span className="text-purple-600 break-all">{fullUrl}</span>
            </p>
          )}
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
          disabled={!handle.trim() || !platform}
          className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Done
        </button>
      </div>
    </div>
  );
};

