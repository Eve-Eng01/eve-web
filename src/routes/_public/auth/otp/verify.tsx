import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import logo from "@assets/evaLogo.png";
import check from "@assets/onBoarding/checks.png";
import img from "@assets/onBoarding/signInImage.png";
import smile from "@assets/onBoarding/smile.png";
import { useVerifyOtp, useResendOtp } from "@/shared/api/services/auth";
import { verifyOtpSchema, type VerifyOtpFormData } from "@/shared/forms/schemas";
import { FormError, useFormError } from "@/shared/forms";
import { CustomButton } from "@components/button/button";

export const Route = createFileRoute("/_public/auth/otp/verify")({
  component: RouteComponent,
});

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  ref?:
    | React.RefObject<HTMLInputElement>
    | ((el: HTMLInputElement | null) => void);
}

const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  onKeyDown,
  onFocus,
  onPaste,
  autoFocus,
  disabled = false,
  ref,
}) => (
  <input
    title="otp"
    type="text"
    inputMode="numeric"
    maxLength={1}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
    onFocus={onFocus}
    onPaste={onPaste}
    autoFocus={autoFocus}
    disabled={disabled}
    ref={ref}
    className="text-[#2D2D2D] w-14 h-14 text-center text-xl font-medium border-2 border-gray-200 rounded-lg focus:border-[#7417C6] focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
  />
);

export function RouteComponent() {
  const navigate = useNavigate();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  // Get email from sessionStorage
  const [userEmail, setUserEmail] = useState<string>("");
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState<number>(59);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get email from sessionStorage on mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("otp_verification_email");
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      // If no email found, redirect to sign up
      navigate({ to: "/auth/sign-up" });
    }
  }, [navigate]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0 && !verifyOtpMutation.isPending) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, verifyOtpMutation.isPending]);

  // Form setup for validation
  const form = useForm<VerifyOtpFormData>({
    resolver: yupResolver(verifyOtpSchema),
    mode: "onBlur",
    defaultValues: {
      email: userEmail,
      otp: "",
    },
  });

  // Update form email when userEmail is loaded
  useEffect(() => {
    if (userEmail) {
      form.setValue("email", userEmail);
    }
  }, [userEmail, form]);

  const { displayError } = useFormError({
    form,
    apiError: verifyOtpMutation.error
      ? (verifyOtpMutation.error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "OTP verification failed. Please try again."
      : null,
  });

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event to fill all inputs
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, ""); // Only digits
    if (pastedData.length > 0) {
      const newOtpValues = [...otpValues];
      for (let i = 0; i < Math.min(pastedData.length, 6 - index); i++) {
        newOtpValues[index + i] = pastedData[i];
      }
      setOtpValues(newOtpValues);

      // Update form value
      const otpCode = newOtpValues.join("");
      form.setValue("otp", otpCode, { shouldValidate: true });

      // Focus the last filled input or the last input if all are filled
      const nextFocusIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  const handleInputFocus = (index: number) => {
    inputRefs.current[index]?.select();
  };

  // Handle continuous typing across inputs
  const handleContinuousInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    if (value.length <= 1) {
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      // Handle multi-digit input
      const digits = value.slice(0, 6 - index).split("");
      for (let i = 0; i < digits.length; i++) {
        newOtpValues[index + i] = digits[i];
      }
      setOtpValues(newOtpValues);
      const nextFocusIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextFocusIndex]?.focus();
    }

    // Update form value
    const otpCode = newOtpValues.join("");
    form.setValue("otp", otpCode, { shouldValidate: true });
  };

  const handleVerifyOtp = async () => {
    const otpCode = otpValues.join("");
    
    if (otpCode.length !== 6) {
      form.setError("otp", {
        type: "manual",
        message: "Please enter the complete 6-digit OTP",
      });
      return;
    }

    if (!userEmail) {
      form.setError("email", {
        type: "manual",
        message: "Email is required",
      });
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({
        email: userEmail.trim().toLowerCase(),
        otp: otpCode,
      });
      // Show success screen on successful verification
      setIsVerified(true);
    } catch (err) {
      // Error handled by useFormError hook
      console.error("Verify OTP error:", err);
      // Clear OTP inputs on error
      setOtpValues(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleContinue = () => {
    // Navigate to login with email pre-filled
    const email = userEmail.trim().toLowerCase();
    navigate({ 
      to: "/auth/signin",
      search: email ? { email } : {}
    });
  };

  const handleResendCode = async () => {
    if (!userEmail || countdown > 0 || isResending) {
      return;
    }

    setIsResending(true);
    try {
      await resendOtpMutation.mutateAsync({
        email: userEmail.trim().toLowerCase(),
      });
      // Reset countdown and clear OTP inputs
      setCountdown(59);
      setOtpValues(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      // Error handled by hook
      console.error("Resend OTP error:", err);
    } finally {
      setIsResending(false);
    }
  };

  const isFormValid = otpValues.every((value) => value !== "") && otpValues.join("").length === 6;
  const isLoading = verifyOtpMutation.isPending;

  // Don't render if email is not loaded
  if (!userEmail) {
    return null;
  }

  return (
    <div className="min-h-screen flex" >
      {/* Left side - Image with overlay */}
      <div className="flex-1 relative">
        <img
          src={img}
          alt="Sign in background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - OTP section */}
      <div className="flex-1 bg-white flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex items-center justify-center">
              {!isVerified ? (
                <img src={logo} alt="" className="w-[60px] h-[60px]" />
              ) : null}
            </div>

            {!isVerified && (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Check Your Email Inbox
                </h1>
                <p className="text-gray-600 text-base leading-relaxed mb-2">
                  We've sent a 6 digit code to your email
                </p>
                <p className="text-gray-900 font-medium">
                  {userEmail}. Enter the code here
                </p>
              </>
            )}
          </div>

          {/* OTP Form Container with slide transition */}
          <div
            className={`relative overflow-hidden ${isVerified ? "h-[50vh]" : null} flex flex-col items-center justify-center text-center`}
          >
            {/* OTP Form */}
            <div
              className={`space-y-8 w-full transition-transform duration-700 ease-in-out ${
                isVerified
                  ? "-translate-x-full opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              {/* Enter Code Label */}
              <div className="text-center">
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Enter Code
                </h2>
              </div>

              {/* OTP Input Fields */}
              <div className="flex justify-center gap-3 mb-8">
                {otpValues.map((value, index) => (
                  <OtpInput
                    key={index}
                    value={value}
                    onChange={(value) => handleContinuousInput(index, value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={() => handleInputFocus(index)}
                    onPaste={(e) => handlePaste(e, index)}
                    autoFocus={index === 0}
                    disabled={isLoading}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>

              {/* Error message */}
              {displayError && <FormError error={displayError} />}

              {/* Verify button */}
              <div>
                <CustomButton
                  title="Verify OTP"
                  onClick={handleVerifyOtp}
                  loading={isLoading}
                  disabled={!isFormValid || isLoading}
                />
              </div>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Didn't get the code?{" "}
                  {countdown > 0 ? (
                    <span className="text-[#7417C6] font-medium">
                      Resend in {countdown} seconds
                    </span>
                  ) : (
                    <button
                      onClick={handleResendCode}
                      disabled={isResending || isLoading}
                      className="text-[#7417C6] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed relative inline-flex items-center"
                    >
                      {isResending && (
                        <svg
                          className="animate-spin h-4 w-4 text-[#7417C6] mr-1"
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
                      <span className={isResending ? "opacity-0" : ""}>Resend code</span>
                    </button>
                  )}
                </p>
              </div>
            </div>

            {/* Success Screen */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 transition-transform duration-700 ease-in-out ${
                isVerified
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
            >
              {/* Success Icon */}
              <div className="w-[96px] h-[107px] flex items-center justify-center mb-[50px]">
                <img src={check} alt="" />
              </div>

              {/* Success Message */}
              <div className="space-y-3">
                <h2 className="text-[32px] font-bold text-gray-900">
                  Account Created Successfully!
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p>Your account has been successfully verified.</p>
                  <p>
                    You're all set to start planning, creating, or discovering
                    amazing events.
                  </p>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="w-full max-w-md bg-[#7417C6] hover:bg-[#5f1399] text-white font-medium py-4 px-4 rounded-2xl transition-colors duration-200 mt-8"
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        {/* Decorative elements on the right side */}
        <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none">
          <div className="relative">
            <img
              src={smile}
              alt="Decorative element"
              className="w-[247px] h-[245px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
