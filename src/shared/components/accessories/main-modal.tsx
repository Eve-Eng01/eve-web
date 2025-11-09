import React, { useEffect, useState } from 'react';
import { Xrp } from 'iconsax-reactjs';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  animationDuration?: number;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  animationDuration = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle modal open/close with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to trigger animation after element is rendered
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Hide modal after animation completes
      const timer = setTimeout(() => setIsVisible(false), animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDuration]);

  // Handle escape key press
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl ',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  // Animation classes
  const overlayClasses = `
    fixed inset-0 bg-black transition-opacity duration-${animationDuration} ease-out
    ${isAnimating ? 'opacity-50' : 'opacity-0'}
  `;

  const modalClasses = `
    relative bg-white rounded-lg shadow-xl w-full mx-2 sm:mx-4 my-2 sm:my-8 
    ${sizeClasses[size]} max-h-[98vh] sm:max-h-[90vh] overflow-hidden
    transition-all duration-${animationDuration} ease-out transform
    ${isAnimating 
      ? 'opacity-100 scale-100 translate-y-0' 
      : 'opacity-0 scale-95 translate-y-4'
    }
    ${className}
  `;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Animated Overlay */}
      <div
        className={overlayClasses}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* Animated Modal Content */}
      <div
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        style={{
          transitionDuration: `${animationDuration}ms`,
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            {title && (
              <h2 id="modal-title" className="text-lg sm:text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:bg-gray-100 rounded-full"
                aria-label="Close modal"
              >
                <Xrp size="20" color="#000"/>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(98vh-4rem)] sm:max-h-[calc(90vh-8rem)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

// modal usage 
{/* <Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="My Modal"
  size="md"
  animationDuration={400}
>
  <YourCustomComponent />
</Modal>  */}


// the custome component
// Form component example
// const ContactForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
//     const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
//     const handleSubmit = () => {
//       if (formData.name && formData.email && formData.message) {
//         onSubmit(formData);
//       }
//     };
  
//     return (
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Name
//           </label>
//           <input
//             type="text"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter your name"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter your email"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Message
//           </label>
//           <textarea
//             rows={4}
//             value={formData.message}
//             onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//             placeholder="Enter your message"
//           />
//         </div>
//         <div className="flex justify-end space-x-2">
//           <button
//             onClick={() => setFormData({ name: '', email: '', message: '' })}
//             className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
//           >
//             Clear
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
//           >
//             Send Message
//           </button>
//         </div>
//       </div>
//     );
//   };