import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/evaLogo.png";
import check from "../../assets/onBoarding/checks.png";
import img from "../../assets/onBoarding/signInImage.png";
import smile from "../../assets/onBoarding/smile.png";

export const Route = createFileRoute("/Authentication/OtpVerification")({
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

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image with overlay */}
      <div className="flex-1 relative">
        <img src={img} alt="Sign in background" className="w-full h-full object-cover" />
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

          {/* OTP Form Container with slide transition */}
          <div
            className={`relative overflow-hidden ${isVerified ? "h-[50vh]" : null}  flex flex-col items-center justify-center text-center`}
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
                Sign Up
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

            {/* Success Screen */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 transition-transform duration-700 ease-in-out ${
                isVerified ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
              }`}
            >
              {/* Success Icon */}
              <div className="w-[96px] h-[107px] flex items-center justify-center mb-[50px]">
                <img src={check} alt="" />
              </div>

              {/* Success Message */}
              <div className="space-y-3">
                <h2 className="text-[32px] font-bold text-gray-900">Account Created Successfully!</h2>
                <div className="space-y-2 text-gray-600">
                  <p>Your account has been successfully verified.</p>
                  <p>You're all set to start planning, creating, or discovering amazing events.</p>
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
            <img src={smile} alt="Decorative element" className="w-[247px] h-[245px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
