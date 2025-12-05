import React, { useEffect, useState } from "react";
import { BadgeCheck, XCircle } from "lucide-react";
import { useToastStore } from "@/shared/stores/toast-store";
import type { ToastType } from "@/shared/stores/toast-store";

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          onClose();
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  const isError = type === "error";
  const bgColor = isError ? "bg-[#F04438]" : "bg-[#17b26a]";
  const iconColor = isError ? "text-[#F04438]" : "text-[#17b26a]";
  const borderColor = isError ? "shadow-[inset_0px_0px_0px_2px_#F97066]" : "shadow-[inset_0px_0px_0px_2px_#3affa3]";
  const Icon = isError ? XCircle : BadgeCheck;

  return (
    <div
      className={`transition-all duration-300 ${
        isAnimating && isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4"
      }`}
    >
      <div className={`${bgColor} flex flex-col gap-2 items-center justify-center px-6 sm:px-10 py-4 sm:py-6 rounded-2xl shadow-lg min-w-[280px] sm:min-w-[400px]`}>
        <div className="flex gap-4 items-center">
          <p className="text-white text-xl sm:text-2xl md:text-[32px] font-bold leading-[38px] whitespace-nowrap">
            {message}
          </p>
          <div className="bg-white border border-[#dfdfdf] rounded-3xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
            <Icon className={`w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 ${iconColor}`} />
          </div>
        </div>
        <div className={`absolute inset-0 pointer-events-none rounded-2xl ${borderColor}`} />
      </div>
    </div>
  );
};

/**
 * Toast Container Component
 * Renders all active toasts from the toast store
 */
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-4 items-center pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={true}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        </div>
      ))}
    </div>
  );
};
