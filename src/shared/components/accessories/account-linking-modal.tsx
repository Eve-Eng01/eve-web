import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Lock1, Sms } from "iconsax-reactjs";
import Modal from "./main-modal";
import {
  useLinkAccount,
  useVerifyOtp,
  useResendOtp,
} from "@/shared/api/services/auth";
import { authService } from "@/shared/api/services/auth/auth.service";
import { FormInput, useFormError } from "@/shared/forms";
import {
  loginSchema,
  verifyOtpSchema,
  type LoginFormData,
  type VerifyOtpFormData,
} from "@/shared/forms/schemas";
import { CustomButton } from "@components/button/button";
import { useAuthStore } from "@/shared/stores/auth-store";
import { setAuthTokens } from "@/shared/api/client";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/shared/api/services/auth/auth.hooks";
import type { UserRole } from "@/shared/stores/auth-store";
import { useToastStore } from "@/shared/stores/toast-store";

interface AccountLinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleIdToken: string;
}

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

export function AccountLinkingModal({
  isOpen,
  onClose,
  googleIdToken,
}: AccountLinkingModalProps) {
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();
  const queryClient = useQueryClient();
  const linkAccountMutation = useLinkAccount();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const showToast = useToastStore((state) => state.showToast);
  const [isLinking, setIsLinking] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [tokens, setTokensState] = useState<any>(null);
  const [otpValues, setOtpValues] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [countdown, setCountdown] = useState<number>(59);
  const [isResending, setIsResending] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const loginForm = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const otpForm = useForm<VerifyOtpFormData>({
    resolver: yupResolver(verifyOtpSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const { register, handleSubmit, formState } = loginForm;
  const { errors, isSubmitting } = formState;

  // Update OTP form email when userEmail is set
  useEffect(() => {
    if (userEmail) {
      otpForm.setValue("email", userEmail);
    }
  }, [userEmail, otpForm]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0 && !verifyOtpMutation.isPending && showOtpVerification) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, verifyOtpMutation.isPending, showOtpVerification]);

  useFormError({
    form: loginForm,
    apiError: loginError || null,
  });

  useFormError({
    form: otpForm,
    apiError: verifyOtpMutation.error
      ? (
          verifyOtpMutation.error as {
            response?: { data?: { message?: string } };
          }
        )?.response?.data?.message ||
        "OTP verification failed. Please try again."
      : null,
  });

  // Helper function to navigate based on user role and onboarding status
  const navigateUser = (userData: any) => {
    if (!userData.role) {
      navigate({ to: "/onboarding/user-type" });
    } else if (userData.isOnboarded) {
      if (userData.role === "vendor") {
        navigate({ to: "/vendor" });
      } else if (userData.role === "event-organizer") {
        navigate({ to: "/organizer" });
      } else {
        navigate({ to: "/organizer" });
      }
    } else {
      if (userData.role === "vendor") {
        navigate({ to: "/vendor/onboarding/profile" });
      } else if (userData.role === "event-organizer") {
        navigate({ to: "/organizer/onboarding/profile" });
      } else {
        navigate({ to: "/organizer/onboarding/profile" });
      }
    }
  };

  // Helper function to complete account linking after verification
  const completeAccountLinking = async (
    verifiedUserData: any,
    verifiedTokens: any
  ) => {
    try {
      // Step 1: Set tokens FIRST before making authenticated API calls
      setUser({
        _id: verifiedUserData._id,
        firstName: verifiedUserData.firstName,
        lastname: verifiedUserData.lastname || "",
        email: verifiedUserData.email,
        isVerified: true, // Now verified after OTP
        role: verifiedUserData.role as UserRole | undefined,
        isOnboarded: verifiedUserData.isOnboarded,
      });
      setTokens(verifiedTokens);
      setAuthTokens(verifiedTokens); // This sets tokens in localStorage for API client

      // Step 2: Link Google account (now with proper authentication)
      await linkAccountMutation.mutateAsync({
        provider: "google",
        id_token: googleIdToken,
      });

      // Step 3: Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: authKeys.user() });

      // Close modal
      onClose();

      // Navigate based on user role and onboarding status
      navigateUser(verifiedUserData);
    } catch (linkError: any) {
      // If linking fails, user is still logged in
      // Update auth store so user can continue, but show warning
      setUser({
        _id: verifiedUserData._id,
        firstName: verifiedUserData.firstName,
        lastname: verifiedUserData.lastname || "",
        email: verifiedUserData.email,
        isVerified: true,
        role: verifiedUserData.role as UserRole | undefined,
        isOnboarded: verifiedUserData.isOnboarded,
      });
      setTokens(verifiedTokens);
      setAuthTokens(verifiedTokens);

      // Show error but allow user to continue
      const linkErrorMessage =
        linkError?.response?.data?.message ||
        "Account linking failed, but you are logged in. You can link your Google account later from settings.";
      showToast(linkErrorMessage, "error", 8000);

      // Close modal and navigate (user is logged in even if linking failed)
      onClose();
      navigateUser(verifiedUserData);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLinking(true);
      setLoginError(null);

      // Step 1: Login with email/password using service directly to avoid auto-navigation
      const loginResponse = await authService.login({
        email: data.email.trim(),
        password: data.password,
      });

      if (loginResponse.status && loginResponse.data) {
        const { tokens: loginTokens, ...loginUserData } = loginResponse.data;

        // Check if user needs email verification
        const hasTokens = loginTokens !== undefined && loginTokens !== null;
        const isVerified = loginResponse.data.isVerified !== false;

        if (!hasTokens || !isVerified) {
          // User needs to verify email - show OTP verification
          setUserEmail(data.email.trim().toLowerCase());
          setUserPassword(data.password); // Store password for re-login after OTP verification
          setUserData(loginUserData);
          setTokensState(loginTokens || null);
          setShowOtpVerification(true);
          setIsLinking(false);
          showToast(
            loginResponse.message || "Please verify your email to continue",
            "error",
            5000
          );
          return;
        }

        // User is verified, proceed with account linking
        await completeAccountLinking(loginUserData, loginTokens);
      }
    } catch (error: any) {
      console.error("Account linking error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";
      setLoginError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLinking(false);
    }
  };

  // OTP input handlers
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
      otpForm.setValue("otp", otpCode, { shouldValidate: true });

      // Focus the last filled input or the last input if all are filled
      const nextFocusIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  const handleInputFocus = (index: number) => {
    inputRefs.current[index]?.select();
  };

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
    otpForm.setValue("otp", otpCode, { shouldValidate: true });
  };

  const handleVerifyOtp = async () => {
    const otpCode = otpValues.join("");

    if (otpCode.length !== 6) {
      otpForm.setError("otp", {
        type: "manual",
        message: "Please enter the complete 6-digit OTP",
      });
      return;
    }

    if (!userEmail) {
      otpForm.setError("email", {
        type: "manual",
        message: "Email is required",
      });
      return;
    }

    try {
      setIsLinking(true);
      await verifyOtpMutation.mutateAsync({
        email: userEmail.trim().toLowerCase(),
        otp: otpCode,
      });

      // OTP verified successfully, now proceed with account linking
      // We need to login again to get tokens after verification
      const loginResponse = await authService.login({
        email: userEmail.trim().toLowerCase(),
        password: userPassword,
      });

      if (loginResponse.status && loginResponse.data) {
        const { tokens: verifiedTokens, ...verifiedUserData } =
          loginResponse.data;

        if (!verifiedTokens) {
          throw new Error(
            "Login failed - no tokens received after verification"
          );
        }

        // Now proceed with account linking
        await completeAccountLinking(verifiedUserData, verifiedTokens);
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      // Clear OTP inputs on error
      setOtpValues(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "OTP verification failed. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setIsLinking(false);
    }
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

  const isLoading =
    isSubmitting ||
    isLinking ||
    linkAccountMutation.isPending ||
    verifyOtpMutation.isPending;
  const isOtpFormValid =
    otpValues.every((value) => value !== "") && otpValues.join("").length === 6;

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowOtpVerification(false);
      setOtpValues(["", "", "", "", "", ""]);
      setCountdown(59);
      setUserEmail("");
      setUserPassword("");
      setUserData(null);
      setTokensState(null);
      setLoginError(null);
      loginForm.reset();
      otpForm.reset();
    }
  }, [isOpen, loginForm, otpForm]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        showOtpVerification ? "Verify Your Email" : "Link Your Google Account"
      }
      size="md"
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="space-y-4">
        {showOtpVerification ? (
          // OTP Verification View
          <>
            <div className="text-center">
              <p className="text-gray-600 text-sm sm:text-base mb-2">
                We've sent a verification code to <strong>{userEmail}</strong>
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                Please enter the 6-digit code to verify your email and complete
                linking your Google account.
              </p>
            </div>

            <div className="space-y-4">
              {/* OTP Input Fields */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otpValues.map((value, index) => (
                  <OtpInput
                    key={index}
                    value={value}
                    onChange={(val) => handleContinuousInput(index, val)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={() => handleInputFocus(index)}
                    onPaste={(e) => handlePaste(e, index)}
                    autoFocus={index === 0}
                    disabled={isLoading}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-gray-600 text-xs sm:text-sm mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={countdown > 0 || isResending || isLoading}
                  className="text-[#7417C6] hover:text-[#5a1299] font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending
                    ? "Sending..."
                    : countdown > 0
                      ? `Resend code in ${countdown}s`
                      : "Resend code"}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpVerification(false);
                    setOtpValues(["", "", "", "", "", ""]);
                    setCountdown(59);
                  }}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-[14px] hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <CustomButton
                  type="button"
                  title={isLinking ? "Linking..." : "Verify & Link"}
                  loading={isLoading}
                  disabled={!isOtpFormValid || isLoading}
                  onClick={handleVerifyOtp}
                />
              </div>
            </div>
          </>
        ) : (
          // Login Form View
          <>
            <div className="text-center">
              <p className="text-gray-600 text-sm sm:text-base mb-2">
                An account with this email already exists. Please sign in with
                your email and password to link your Google account.
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                After linking, you'll be able to sign in with either method.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <FormInput
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                register={register}
                error={errors.email}
                required
                icon={<Sms size="24" color="#BFBFBF" variant="Outline" />}
                iconPosition="left"
                autoComplete="email"
                disabled={isLoading}
              />

              <FormInput
                name="password"
                label="Password"
                type="password"
                placeholder="Enter password"
                register={register}
                error={errors.password}
                required
                icon={<Lock1 size="24" color="#BFBFBF" variant="Outline" />}
                iconPosition="left"
                autoComplete="current-password"
                disabled={isLoading}
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-[14px] hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <CustomButton
                  type="submit"
                  title={isLinking ? "Signing in..." : "Sign In & Link"}
                  loading={isLoading}
                  disabled={!loginForm.formState.isValid || isLoading}
                />
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
