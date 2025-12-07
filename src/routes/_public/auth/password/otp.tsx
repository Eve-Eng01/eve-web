import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Lock1 } from "iconsax-reactjs";
import logo from "@assets/evaLogo.png";
import check from "@assets/onBoarding/checks.png";
import lock from "@assets/onBoarding/forgetpass/lock.png";
import img from "@assets/onBoarding/forgetpass/pass.png";
import {
  useVerifyPasswordResetOtp,
  useResetPassword,
  useForgotPassword,
} from "@/shared/api/services/auth";
import { useFormError } from "@/shared/forms";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/shared/forms/schemas";
import { CustomButton } from "@components/button/button";
import { useToastStore } from "@/shared/stores/toast-store";

export const Route = createFileRoute("/_public/auth/password/otp")({
  component: RouteComponent,
});

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
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
  ref,
}) => (
  <input
    title="otp"
    type="text"
    maxLength={1}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
    onFocus={onFocus}
    onPaste={onPaste}
    autoFocus={autoFocus}
    ref={ref}
    className="text-[#2D2D2D] w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-medium border-2 border-gray-200 rounded-lg focus:border-[#7417C6] focus:outline-none transition-colors duration-200"
  />
);

export function RouteComponent() {
  const [otpValues, setOtpValues] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [countdown, setCountdown] = useState<number>(900); // 15 minutes in seconds
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isPasswordSet, setIsPasswordSet] = useState<boolean>(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const verifyOtpMutation = useVerifyPasswordResetOtp();
  const resetPasswordMutation = useResetPassword();
  const resendOtpMutation = useForgotPassword();
  const showToast = useToastStore((state) => state.showToast);

  // Get email from sessionStorage on mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("password_reset_email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email found, redirect back to forget password page
      navigate({ to: "/auth/password/forget" });
    }
  }, [navigate]);

  // Countdown timer effect (15 minutes)
  useEffect(() => {
    if (countdown > 0 && !isVerified) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isVerified]);

  // Password reset form
  const passwordForm = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      email: email,
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update email in form when it's loaded
  useEffect(() => {
    if (email) {
      passwordForm.setValue("email", email);
    }
  }, [email, passwordForm]);

  // Update token in form when it's received
  useEffect(() => {
    if (resetToken) {
      passwordForm.setValue("token", resetToken);
    }
  }, [resetToken, passwordForm]);

  useFormError({
    form: passwordForm,
    apiError: resetPasswordMutation.error
      ? (resetPasswordMutation.error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Failed to reset password. Please try again."
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
  };

  const handleVerifyOtp = async () => {
    const otpCode = otpValues.join("");
    if (otpCode.length === 6 && email) {
      try {
        const response = await verifyOtpMutation.mutateAsync({
          email: email.trim().toLowerCase(),
          otp: otpCode,
        });

        if (response.status && response.data) {
          // Store token in sessionStorage (not localStorage)
          const token = response.data.token;
          setResetToken(token);
          sessionStorage.setItem("password_reset_token", token);
          setIsVerified(true);
        }
      } catch (err) {
        // Error handled by hook's onError callback
        console.error("Verify OTP error:", err);
      }
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    if (!resetToken) {
      showToast("Reset token is missing. Please verify OTP again.", "error");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        email: data.email.trim().toLowerCase(),
        token: resetToken,
        newPassword: data.newPassword,
      });
      // Success is handled by the hook (shows toast and navigates)
      setIsPasswordSet(true);
      // Clear stored data
      sessionStorage.removeItem("password_reset_email");
      sessionStorage.removeItem("password_reset_token");
    } catch (err) {
      // Error handled by useFormError hook
      console.error("Reset password error:", err);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      showToast("Email not found. Please start over.", "error");
      navigate({ to: "/auth/password/forget" });
      return;
    }

    try {
      await resendOtpMutation.mutateAsync({
        email: email.trim().toLowerCase(),
      });
      // Reset countdown to 15 minutes (900 seconds)
      setCountdown(900);
      setOtpValues(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      // Error handled by hook's onError callback
      console.error("Resend OTP error:", err);
    }
  };

  const handleContinue = () => {
    navigate({ to: "/auth/signin" });
  };

  const isFormValid = otpValues.every((value) => value !== "");
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Image with overlay - Hidden on mobile and tablet */}
      <div className="hidden lg:flex flex-1 relative">
        <img
          src={img}
          alt="Sign in background"
          className="w-full h-[100vh] object-cover"
        />
      </div>

      {/* Right side - OTP section */}
      <div className="flex-1 bg-white flex items-center justify-center p-4 sm:p-6 md:p-8 relative">
        <div className="w-full max-w-3xl">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              {!isVerified ? (
                <img
                  src={logo}
                  alt=""
                  className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px]"
                />
              ) : null}
            </div>

            {!isVerified && (
              <>
                <h1 className="text-2xl sm:text-[28px] lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Check Your Email Inbox
                </h1>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-2 px-2 sm:px-0">
                  We've sent a 6 digit code to your email
                </p>
                {email && (
                  <p className="text-gray-900 font-medium text-sm sm:text-base px-2 sm:px-0 break-all">
                    {email}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Forms Container with slide transition */}
          <div
            className={`relative overflow-hidden ${isVerified ? "h-[70vh]" : null} flex flex-col items-center justify-center text-center`}
          >
            {/* OTP Form */}
            <div
              className={`space-y-6 sm:space-y-8 transition-transform duration-700 ease-in-out ${
                isVerified
                  ? "-translate-x-full opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              {/* Enter Code Label */}
              <div className="text-center">
                <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">
                  Enter Code
                </h2>
              </div>

              {/* OTP Input Fields */}
              <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4 sm:px-0">
                {otpValues.map((value, index) => (
                  <OtpInput
                    key={index}
                    value={value}
                    onChange={(value) => handleContinuousInput(index, value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={() => handleInputFocus(index)}
                    onPaste={(e) => handlePaste(e, index)}
                    autoFocus={index === 0}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>

              {/* Continue button */}
              <CustomButton
                type="button"
                title="Continue"
                onClick={handleVerifyOtp}
                loading={verifyOtpMutation.isPending}
                disabled={!isFormValid || verifyOtpMutation.isPending}
              />

              {/* Resend Code */}
              <div className="text-center px-4 sm:px-0">
                <p className="text-gray-600 text-xs sm:text-sm">
                  Didn't get the code?{" "}
                  {countdown > 0 ? (
                    <span className="text-[#7417C6] font-medium">
                      Resend in {formatTime(countdown)}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendOtpMutation.isPending}
                      className="text-[#7417C6] font-medium hover:underline disabled:opacity-50"
                    >
                      {resendOtpMutation.isPending ? "Sending..." : "Resend code"}
                    </button>
                  )}
                </p>
              </div>
            </div>

            {/* Set New Password Screen */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 transition-transform duration-700 ease-in-out px-4 sm:px-0 ${
                isVerified && !isPasswordSet
                  ? "translate-x-0 opacity-100"
                  : isVerified
                    ? "-translate-x-full opacity-0"
                    : "translate-x-full opacity-0"
              }`}
            >
              {/* Logo for password screen */}
              <div className="mb-6 sm:mb-8">
                <div className="mx-auto mb-4 sm:mb-6 w-12 h-12 sm:w-16 sm:h-16 bg-[#7417C6] rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#7417C6] rounded-sm"></div>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-[28px] lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Welcome To Eve
                </h1>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed px-2 sm:px-0">
                  Your all-in-one platform for event creators, planners,
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  service providers, and guests.
                </p>
              </div>

              {/* Password Form */}
              <form
                onSubmit={passwordForm.handleSubmit(handleResetPassword)}
                className="w-full max-w-md space-y-4 sm:space-y-6"
                noValidate
              >
                {/* New Password Field */}
                <div className="text-left">
                  <label className="block text-gray-700 font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Lock1 size="20" color="#BFBFBF" variant="Outline" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      {...passwordForm.register("newPassword")}
                      className="w-full pl-12 pr-12 py-3 sm:py-4 text-sm sm:text-base text-[#2D2D2D] border-2 border-gray-200 rounded-2xl focus:border-[#7417C6] focus:outline-none transition-colors duration-200"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {passwordForm.formState.errors.newPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="text-left">
                  <label className="block text-gray-700 font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Lock1 size="20" color="#BFBFBF" variant="Outline" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      {...passwordForm.register("confirmPassword")}
                      className="w-full pl-12 pr-12 py-3 sm:py-4 text-sm sm:text-base text-[#2D2D2D] border-2 border-gray-200 rounded-2xl focus:border-[#7417C6] focus:outline-none transition-colors duration-200"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Continue Button */}
                <CustomButton
                  type="submit"
                  title="Continue"
                  loading={resetPasswordMutation.isPending}
                  disabled={
                    !passwordForm.formState.isValid ||
                    resetPasswordMutation.isPending
                  }
                />
              </form>
              {/* Log in link */}
              <div className="text-center">
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Remember Password?{" "}
                    <button
                      onClick={() => navigate({ to: "/auth/signin" })}
                      className="text-[#7417C6] font-medium hover:underline"
                    >
                      Log in
                    </button>
                  </p>
              </div>
            </div>

            {/* Success Screen */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 transition-transform duration-700 ease-in-out px-4 sm:px-0 ${
                isPasswordSet
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
            >
              {/* Success Icon */}
              <div className="w-[80px] h-[90px] sm:w-[96px] sm:h-[107px] flex items-center justify-center mb-8 sm:mb-[50px]">
                <img src={check} alt="" className="w-full h-full object-contain" />
              </div>

              {/* Success Message */}
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-gray-900">
                  Reset Successful!!
                </h2>
                <div className="space-y-2 text-gray-600 text-sm sm:text-base px-2 sm:px-0">
                  <p>
                    Your password has been reset successfully.
                    <br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>
                    You can now log in to your EVE account.
                  </p>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="w-full max-w-md bg-[#7417C6] hover:bg-[#5f1399] text-white font-medium py-3 sm:py-4 px-4 rounded-2xl transition-colors duration-200 mt-6 sm:mt-8 text-sm sm:text-base"
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        {/* Decorative elements on the right side - Hidden on mobile and tablet */}
        <div className="fixed bottom-0 right-0 overflow-hidden pointer-events-none hidden lg:block">
          <div className="relative">
            <img
              src={lock}
              alt="Decorative element"
              className="w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] xl:w-[247px] xl:h-[245px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
 