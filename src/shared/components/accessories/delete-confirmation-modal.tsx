import Modal from "./main-modal";
import { Trash2 } from "lucide-react";

const DeleteConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  isLoading?: boolean;
}> = ({ isOpen, onClose, onConfirm, title, description, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
      animationDuration={300}
      closeOnOverlayClick={!isLoading}
    >
      <div className="text-center py-4 sm:py-6">
        {/* Trash Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-red-50 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">{title}?</h2>

        {/* Description */}
        <div className="px-2">{description}</div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-[#7417C6] text-[#7417C6] rounded-2xl hover:bg-purple-50 transition-colors font-semibold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors font-semibold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            <span className={isLoading ? "opacity-0" : ""}>Delete</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
