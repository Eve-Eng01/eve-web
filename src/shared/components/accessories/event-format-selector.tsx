import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import googleMeet from "@assets/googlemeet.png";
import zoom from "@assets/zoom.png";
import youtube from "@assets/youtube.png";
import Modal from "./main-modal";
import { DropdownInput, DropdownOption } from "./dropdown-input";

// Platform/Access Type Data Interface
export interface PlatformData {
  platform: string; // "google_meet" | "zoom" | "youtube_live" | "other"
  meetingUrl: string;
  meetingPassword?: string;
  note?: string;
}

// Event Format Selector Component
interface EventFormatSelectorProps {
  value?: string;
  onChange?: (format: string) => void;
  onPlatformDataChange?: (data: PlatformData | null) => void;
  initialPlatformData?: PlatformData | null;
}

export interface EventFormatSelectorHandle {
  openEditModal: () => void;
}

const EventFormatSelector = forwardRef<EventFormatSelectorHandle, EventFormatSelectorProps>(
  ({ value, onChange, onPlatformDataChange, initialPlatformData }, ref) => {
    const [format, setFormat] = useState(value || "");
    const [showVirtualModal, setShowVirtualModal] = useState(false);
    const [showPlatformModal, setShowPlatformModal] = useState(false);
    
    // Convert API platform format (with underscores) to UI format (with hyphens) for internal state
    const getUIPlatformId = (apiPlatform: string) => {
      return apiPlatform.replace(/_/g, "-");
    };
    const getAPIPlatformId = (uiPlatform: string) => {
      return uiPlatform.replace(/-/g, "_");
    };
    
    const [selectedPlatform, setSelectedPlatform] = useState(
      initialPlatformData?.platform ? getUIPlatformId(initialPlatformData.platform) : "google-meet"
    );
    const [meetingUrl, setMeetingUrl] = useState(initialPlatformData?.meetingUrl || "");
    const [meetingPassword, setMeetingPassword] = useState(initialPlatformData?.meetingPassword || "");
    const [meetingNote, setMeetingNote] = useState("");
    const [platformData, setPlatformData] = useState<PlatformData | null>(initialPlatformData || null);
    const [urlError, setUrlError] = useState<string>("");

    // Sync initial platform data when it changes
    useEffect(() => {
      if (initialPlatformData) {
        setPlatformData(initialPlatformData);
        setSelectedPlatform(getUIPlatformId(initialPlatformData.platform));
        setMeetingUrl(initialPlatformData.meetingUrl);
        setMeetingPassword(initialPlatformData.meetingPassword || "");
        setMeetingNote(initialPlatformData.note || "");
      } else if (initialPlatformData === null) {
        // Clear platform data if explicitly set to null
        setPlatformData(null);
      }
    }, [initialPlatformData]);

    // Expose method to open edit modal
    useImperativeHandle(ref, () => ({
      openEditModal: () => {
        if (platformData) {
          // Pre-fill with existing data
          setSelectedPlatform(getUIPlatformId(platformData.platform));
          setMeetingUrl(platformData.meetingUrl);
          setMeetingPassword(platformData.meetingPassword || "");
          setMeetingNote(platformData.note || "");
          setUrlError(""); // Clear any previous errors
          // Open directly to platform details modal (skip platform selection)
          setShowPlatformModal(true);
          setShowVirtualModal(false);
        } else {
          // If no platform data, start from platform selection
          setShowVirtualModal(true);
        }
      },
    }));

  const platforms = [
    { id: "google-meet", apiId: "google_meet", label: "Google Meet", icon: googleMeet },
    { id: "zoom", apiId: "zoom", label: "Zoom", icon: zoom },
    { id: "youtube-live", apiId: "youtube_live", label: "YouTube Live", icon: youtube },
    { id: "other", apiId: "other", label: "Other", icon: null },
  ];

  // Convert platforms to DropdownOption format
  const platformOptions: DropdownOption[] = platforms.map((platform) => ({
    value: platform.id,
    label: platform.label,
    icon: platform.icon ? (
      <img className="w-5 h-5" src={platform.icon} alt={platform.label} />
    ) : (
      <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
        <span className="text-xs font-medium text-gray-600">?</span>
      </div>
    ),
  }));

  // Get current selected platform as DropdownOption
  const selectedPlatformOption: DropdownOption | null = platformOptions.find(
    (opt) => opt.value === selectedPlatform
  ) || null;

  const handleFormatSelect = (fmt: string) => {
    setFormat(fmt);
    onChange?.(fmt);
    if (fmt === "virtual" || fmt === "hybrid") {
      setShowVirtualModal(true);
    } else if (fmt === "in-person") {
      // Clear platform data for in-person events
      setPlatformData(null);
      onPlatformDataChange?.(null);
    }
  };

  // Sync with controlled value
  React.useEffect(() => {
    if (value !== undefined && value !== format) {
      setFormat(value);
      // Clear platform data if switching to in-person
      if (value === "in-person" && platformData) {
        setPlatformData(null);
        onPlatformDataChange?.(null);
      }
    }
  }, [value]);

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setUrlError(""); // Clear any previous errors when selecting platform
    setShowPlatformModal(true);
    setShowVirtualModal(false);
  };

  // Validate meeting URL
  const validateMeetingUrl = (url: string): string => {
    if (!url || url.trim().length === 0) {
      return "Meeting URL is required";
    }

    try {
      const urlObj = new URL(url);
      
      // Check if URL uses HTTPS
      if (urlObj.protocol !== "https:") {
        return "Meeting URL must use HTTPS (secure connection)";
      }

      // Check if URL is valid
      if (!urlObj.hostname) {
        return "Invalid URL format";
      }

      return "";
    } catch (error) {
      return "Please enter a valid URL (e.g., https://meet.google.com/abc-defg-hij)";
    }
  };

  const handleUrlChange = (url: string) => {
    setMeetingUrl(url);
    const error = validateMeetingUrl(url);
    setUrlError(error);
  };

  const handleConfirmPlatform = () => {
    // Validate URL before confirming
    const error = validateMeetingUrl(meetingUrl);
    if (error) {
      setUrlError(error);
      return;
    }

    const platform = platforms.find(p => p.id === selectedPlatform);
    const data: PlatformData = {
      platform: platform?.apiId || getAPIPlatformId(selectedPlatform),
      meetingUrl,
      ...(meetingPassword && { meetingPassword }),
      ...(meetingNote && { note: meetingNote }),
    };
    setPlatformData(data);
    onPlatformDataChange?.(data);
    setUrlError("");
    setShowPlatformModal(false);
    setShowVirtualModal(false);
  };

  const handleBackFromPlatform = () => {
    setShowPlatformModal(false);
    setShowVirtualModal(true);
  };

  const handleCloseVirtualModal = () => {
    setShowVirtualModal(false);
    setShowPlatformModal(false);
    // Only reset format if closing without confirmation and no platform data exists
    if (!platformData && (format === "virtual" || format === "hybrid")) {
      setFormat("");
      onChange?.("");
    }
    // Reset form fields but keep platform data if it exists
    setSelectedPlatform("google-meet");
    setMeetingUrl("");
    setMeetingPassword("");
    setMeetingNote("");
    setUrlError("");
  };

  return (
    <div>
      {/* Format Selection */}
      <div>
        <label className="block text-lg font-medium text-[#5a5a5a] mb-4">
          Select Format
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["in-person", "virtual", "hybrid"].map((fmt) => (
            <label
              key={fmt}
              className={`relative flex items-center px-4 py-4 rounded-2xl cursor-pointer transition-all border-2 border-dashed ${
                format === fmt
                  ? "bg-[#f1e8f9] border-[#d5b9ee]"
                  : "border-[#eaeaea] bg-white hover:border-gray-400"
              }`}
            >
              <div
                className={`flex items-center justify-center w-5 h-5 rounded-[3px] mr-3 ${
                  format === fmt ? "bg-[#7417C6]" : "bg-[#d5d5d5]"
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={fmt}
                  checked={format === fmt}
                  onChange={(e) => handleFormatSelect(e.target.value)}
                  className="appearance-none"
                />
                {format === fmt && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              <span
                className={`text-lg font-medium ${
                  format === fmt ? "text-[#2d2d2d]" : "text-[#777]"
                }`}
              >
                {fmt === "on-time" ? "One-Time" : fmt.charAt(0).toUpperCase() + fmt.slice(1).replace("-", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Virtual Meeting Platforms Modal */}
      <Modal
        isOpen={showVirtualModal && !showPlatformModal}
        onClose={handleCloseVirtualModal}
        size="xl"
        animationDuration={400}
        showCloseButton={true}
        closeOnOverlayClick={false}
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Select Format
          </h2>

          <div className="space-y-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                onClick={() => handlePlatformSelect(platform.id)}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPlatform === platform.id
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-200 hover:border-purple-400 hover:bg-purple-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  {platform.icon ? (
                    <img
                      className="w-[30px] h-[30px]"
                      src={platform.icon}
                      alt=""
                    />
                  ) : (
                    <div className="w-[30px] h-[30px] bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">?</span>
                    </div>
                  )}
                  <span className="text-lg font-medium text-gray-900">
                    {platform.label}
                  </span>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  {selectedPlatform === platform.id && (
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-4 mt-8">
            <button
              onClick={handleCloseVirtualModal}
              className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => handlePlatformSelect(selectedPlatform)}
              className="px-6 py-2 bg-[#7417C6] text-white font-medium hover:bg-purple-700 rounded-lg transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </Modal>

      {/* Platform Details Modal */}
      <Modal
        isOpen={showPlatformModal}
        onClose={handleCloseVirtualModal}
        size="md"
        animationDuration={400}
        showCloseButton={true}
        closeOnOverlayClick={false}
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {platformData ? "Edit Platform / Access Type" : "Select Platform / Access Type"}
          </h2>

          <div className="space-y-6">
            {/* Platform Selector */}
            <div>
              <DropdownInput
                label="Platform"
                options={platformOptions}
                value={selectedPlatformOption}
                onChange={(option) => setSelectedPlatform(option.value)}
                placeholder="Select a platform"
                className="w-full"
                buttonClassName="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white hover:bg-gray-50"
                dropDownClassName="mt-1"
              />
            </div>

            {/* Meeting URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting URL <span className="text-red-500">*</span>
              </label>
              <div className={`flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent ${
                urlError ? "border-red-500" : "border-gray-300"
              }`}>
                <span className="text-gray-400 px-3 py-3">🔗</span>
                <input
                  type="url"
                  value={meetingUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onBlur={() => {
                    const error = validateMeetingUrl(meetingUrl);
                    setUrlError(error);
                  }}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="flex-1 px-4 py-3 outline-none text-gray-900 bg-white placeholder-gray-400"
                  required
                />
              </div>
              {urlError && (
                <p className="mt-1 text-sm text-red-500">{urlError}</p>
              )}
              {!urlError && meetingUrl && (
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Valid secure URL
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password (optional, only if meeting is password-protected)
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
                <span className="text-gray-400 px-3 py-3">🔐</span>
                <input
                  type="password"
                  value={meetingPassword}
                  onChange={(e) => setMeetingPassword(e.target.value)}
                  placeholder="Password"
                  className="flex-1 px-4 py-3 outline-none text-gray-900 bg-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (optional, for virtual attendees)
              </label>
              <textarea
                value={meetingNote}
                onChange={(e) => setMeetingNote(e.target.value)}
                placeholder="Add any additional information for virtual attendees..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white placeholder-gray-400 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-8">
            <button
              onClick={handleBackFromPlatform}
              className="px-6 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-all"
            >
              Back
            </button>
            <button
              onClick={handleConfirmPlatform}
              className="px-6 py-2 bg-[#7417C6] text-white font-medium hover:bg-purple-700 rounded-lg transition-all"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
});

EventFormatSelector.displayName = "EventFormatSelector";

export default EventFormatSelector;
