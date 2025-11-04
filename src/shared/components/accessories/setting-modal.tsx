import React, { useEffect, useState } from 'react';
import { Check, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLDivElement>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, triggerRef }) => {
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

      if (triggerRef?.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        setModalPosition({
          top: triggerRect.bottom + 8,
          right: window.innerWidth - triggerRect.right,
        });
      }

      // Close on ESC key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsVisible(false);
          setTimeout(onClose, 300); // Wait for animation
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      setIsVisible(false);
    }
  }, [isOpen, triggerRef, onClose]);

  // Close on outside click
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (triggerRef?.current && !triggerRef.current.contains(e.target as Node)) {
          const target = e.target as HTMLElement;
          if (!target.closest('[data-settings-modal]')) {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, triggerRef, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { label: 'Edit Event', hasDivider: false },
    { label: 'Edit Ticket', hasDivider: true },
    { label: 'Payout Setting', hasCheck: true, checked: true },
    { label: 'Refund Policy', hasCheck: true, checked: false },
    { label: 'Edit Media', hasDivider: true },
    { label: 'Duplicate Event', hasDivider: false },
    { label: 'Delete Ticket', isDestructive: true },
  ];

  return (
    <>
      {/* Overlay with smooth animation */}
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
      />

      {/* Dropdown Modal */}
      <div
        data-settings-modal
        className={`fixed z-50 bg-white rounded-[14px] shadow-lg py-2 min-w-[186px] transition-all duration-300 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{
          top: `${modalPosition.top}px`,
          right: `${modalPosition.right}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <div
              className={`flex items-center justify-between gap-2 h-[52px] px-[14px] rounded-[8px] mx-2 cursor-pointer transition-colors ${
                item.isDestructive
                  ? 'bg-[#fdeceb] hover:bg-[#fce0df]'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.isDestructive && (
                  <Trash2 className="w-6 h-6 text-[#f04438]" />
                )}
                <p
                  className={`font-medium leading-[20px] text-[14px] ${
                    item.isDestructive ? 'text-[#2d2d2d]' : 'text-[#2d2d2d]'
                  }`}
                >
                  {item.label}
                </p>
              </div>
              {item.hasCheck && (
                <Check
                  className={`w-6 h-6 ${
                    item.checked ? 'text-[#2d2d2d]' : 'text-gray-400'
                  }`}
                />
              )}
            </div>
            {item.hasDivider && (
              <div className="h-px bg-[#eaeaea] my-1 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>

    </>
  );
};

export default SettingsModal;

