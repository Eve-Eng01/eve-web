import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../../assets/evaLogo.png";
import check from "../../../assets/onBoarding/checks.png";
import lock from "../../../assets/onBoarding/forgetpass/lock.png";
import img from "../../../assets/onBoarding/forgetpass/pass.png";

export const Route = createFileRoute("/Authentication/ForgetPassword/ForgetPassOtp")({
  component: RouteComponent,
});

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  ref?: React.RefObject<HTMLInputElement> | ((el: HTMLInputElement | null) => void);
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, onKeyDown, onFocus, onPaste, autoFocus, ref }) => (
  <input
    type="text"
    maxLength={1}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
    onFocus={onFocus}
    onPaste={onPaste}
    autoFocus={autoFocus}
    ref={ref}
    className="text-[#2D2D2D] w-14 h-14 text-center text-xl font-medium border-2 border-gray-200 rounded-lg focus:border-[#7417C6] focus:outline-none transition-colors duration-200"
  />
);

export function RouteComponent() {
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState<number>(59);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isPasswordSet, setIsPasswordSet] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0 && !isVerified) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isVerified]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event to fill all inputs
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
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

  const handleSignUp = () => {
    const otpCode = otpValues.join("");
    if (otpCode.length === 6) {
      console.log("OTP Code:", otpCode);
      // Simulate OTP verification success
      setTimeout(() => {
        setIsVerified(true);
      }, 500); // Small delay to simulate API call
    }
  };

  const handleSetNewPassword = () => {
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      console.log("Setting new password...");
      // Simulate password reset success
      setTimeout(() => {
        setIsPasswordSet(true);
      }, 500);
    } else {
      console.log("Passwords do not match or are empty");
    }
  };

  const handleResendCode = () => {
    setCountdown(59);
    setOtpValues(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    console.log("Resending OTP code...");
  };

  const handleContinue = () => {
    // Handle navigation to next screen
    console.log("Continuing to next screen...");
    navigate({ to: "/Authentication/SignIn" });
  };

  const isFormValid = otpValues.every((value) => value !== "");
  const isPasswordFormValid =
    newPassword && confirmPassword && newPassword === confirmPassword && newPassword.length >= 6;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image with overlay */}
      <div className="flex-1 relative">
        <img src={img} alt="Sign in background" className="w-full h-[100vh] object-cover" />
      </div>

      {/* Right side - OTP section */}
      <div className="flex-1 bg-white flex items-center justify-center p-8 relative">
        <div className="w-full max-w-3xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex items-center justify-center">
              {!isVerified ? <img src={logo} alt="" className="w-[60px] h-[60px]" /> : null}
            </div>

            {!isVerified && (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email Inbox</h1>
                <p className="text-gray-600 text-base leading-relaxed mb-2">We've sent a 6 digit code to your email</p>
                <p className="text-gray-900 font-medium">gabrielemumwen20@gmail.com. enter the code here</p>
              </>
            )}
          </div>

          {/* Forms Container with slide transition */}
          <div
            className={`relative overflow-hidden ${isVerified ? "h-[70vh]" : null} flex flex-col items-center justify-center text-center`}
          >
            {/* OTP Form */}
            <div
              className={`space-y-8 transition-transform duration-700 ease-in-out ${
                isVerified ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
              }`}
            >
              {/* Enter Code Label */}
              <div className="text-center">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Enter Code</h2>
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
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>

              {/* Sign Up button */}
              <button
                onClick={handleSignUp}
                className={`w-full max-w-md text-white font-medium py-4 px-4 rounded-2xl transition-colors duration-200 ${
                  isFormValid ? "bg-[#7417C6] hover:bg-[#5f1399]" : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                Continue
              </button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Didn't get the code?{" "}
                  {countdown > 0 ? (
                    <span className="text-[#7417C6] font-medium">Resend in {countdown} seconds</span>
                  ) : (
                    <button onClick={handleResendCode} className="text-[#7417C6] font-medium hover:underline">
                      Resend code
                    </button>
                  )}
                </p>
              </div>
            </div>

            {/* Set New Password Screen */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 transition-transform duration-700 ease-in-out ${
                isVerified && !isPasswordSet
                  ? "translate-x-0 opacity-100"
                  : isVerified
                    ? "-translate-x-full opacity-0"
                    : "translate-x-full opacity-0"
              }`}
            >
              {/* Logo for password screen */}
              <div className="mb-8">
                <div className="mx-auto mb-6 w-16 h-16 bg-[#7417C6] rounded-2xl flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#7417C6] rounded-sm"></div>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome To Eve</h1>
                <p className="text-gray-600 text-base leading-relaxed">
                  Your all-in-one platform for event creators, planners,
                  <br />
                  service providers, and guests.
                </p>
              </div>

              {/* Password Form */}
              <div className="w-full max-w-md space-y-6">
                {/* New Password Field */}
                <div className="text-left">
                  <label className="block text-gray-700 font-medium mb-3">New Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <circle cx="12" cy="16" r="1" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 text-[#2D2D2D] border-2 border-gray-200 rounded-2xl focus:border-[#7417C6] focus:outline-none transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                </div>

                {/* Confirm Password Field */}
                <div className="text-left">
                  <label className="block text-gray-700 font-medium mb-3">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <circle cx="12" cy="16" r="1" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 text-[#2D2D2D] py-4 border-2 border-gray-200 rounded-2xl focus:border-[#7417C6] focus:outline-none transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleSetNewPassword}
                  className={`w-full text-white font-medium py-4 px-4 rounded-2xl transition-colors duration-200 ${
                    isPasswordFormValid ? "bg-[#7417C6] hover:bg-[#5f1399]" : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  Continue
                </button>

                {/* Log in link */}
                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Remember Password?{" "}
                    <button
                      onClick={() => navigate({ to: "/Authentication/SignIn" })}
                      className="text-[#7417C6] font-medium hover:underline"
                    >
                      Log in
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Success Screen */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 transition-transform duration-700 ease-in-out ${
                isPasswordSet ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
              }`}
            >
              {/* Success Icon */}
              <div className="w-[96px] h-[107px] flex items-center justify-center mb-[50px]">
                <img src={check} alt="" />
              </div>

              {/* Success Message */}
              <div className="space-y-3">
                <h2 className="text-[32px] font-bold text-gray-900">Reset Successful!!</h2>
                <div className="space-y-2 text-gray-600">
                  <p>
                    Your password has been reset successfully. <br /> You can now log in to your EVE account.
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
            <img src={lock} alt="Decorative element" className="w-[247px] h-[245px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
