import { useState } from "react";
import googleMeet from "@assets/googlemeet.png";
import zoom from "@assets/zoom.png";
import youtube from "@assets/youtube.png";
import Modal from "./main-modal";

// Event Format Selector Component
const EventFormatSelector = () => {
  const [format, setFormat] = useState("");
  const [showVirtualModal, setShowVirtualModal] = useState(false);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("google-meet");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingPassword, setMeetingPassword] = useState("");

  const platforms = [
    { id: "google-meet", label: "Google Meet", icon: googleMeet },
    { id: "zoom", label: "Zoom", icon: zoom },
    { id: "youtube-live", label: "YouTube Live", icon: youtube },
  ];

  const handleFormatSelect = (fmt: string) => {
    setFormat(fmt);
    if (fmt === "virtual") {
      setShowVirtualModal(true);
    }
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setShowPlatformModal(true);
    setShowVirtualModal(false);
  };

  const handleConfirmPlatform = () => {
    setShowPlatformModal(false);
    setShowVirtualModal(false);
    // Handle the confirmation of platform + meeting details
    console.log({
      format: "virtual",
      platform: selectedPlatform,
      meetingLink,
      meetingPassword,
    });
  };

  const handleBackFromPlatform = () => {
    setShowPlatformModal(false);
    setShowVirtualModal(true);
  };

  const handleCloseVirtualModal = () => {
    setShowVirtualModal(false);
    setShowPlatformModal(false);
    setFormat("");
    setSelectedPlatform("google-meet");
    setMeetingLink("");
    setMeetingPassword("");
  };

  return (
    <div className="p-6 bg-gray-50">
      {/* Format Selection */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-4">
          Select Format
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["in-person", "virtual", "hybrid"].map((fmt) => (
            <label
              key={fmt}
              className={`relative flex items-center px-6 py-4 rounded-2xl cursor-pointer transition-all ${
                format === fmt
                  ? "bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-400"
                  : "border-2 border-dashed border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 ${
                  format === fmt ? "bg-purple-600" : "bg-gray-200"
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
                    className="w-5 h-5 text-white"
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
                className={`text-base font-medium ${
                  format === fmt ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {fmt.charAt(0).toUpperCase() + fmt.slice(1)}
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
                  <img
                    className="w-[30px] h-[30px]"
                    src={platform.icon}
                    alt=""
                  />
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
            Select Platform / Access Type
          </h2>

          <div className="space-y-6">
            {/* Platform Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                title="Platform"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white"
              >
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Meeting Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
                <span className="text-gray-400 px-3 py-3">🔗</span>
                <input
                  type="text"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="flex-1 px-4 py-3 outline-none text-gray-900 bg-white placeholder-gray-400"
                />
              </div>
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
};

export default EventFormatSelector;
