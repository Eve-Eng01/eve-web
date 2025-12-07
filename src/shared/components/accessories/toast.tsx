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
      <div className={`${bgColor} relative flex gap-3 sm:gap-4 items-center justify-center px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl shadow-lg max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-md`}>
        <p className="text-white text-sm sm:text-base md:text-lg lg:text-base xl:text-sm font-semibold sm:font-bold leading-tight sm:leading-normal pr-1">
          {message}
        </p>
        <div className="bg-white border border-[#dfdfdf] rounded-full w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-9 lg:h-9 xl:w-8 xl:h-8 flex items-center justify-center flex-shrink-0">
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 xl:w-4 xl:h-4 ${iconColor}`} />
        </div>
        <div className={`absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl ${borderColor}`} />
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
    <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 sm:gap-4 items-center pointer-events-none w-full max-w-[95vw] sm:max-w-none px-2 sm:px-0">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full flex justify-center">
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
