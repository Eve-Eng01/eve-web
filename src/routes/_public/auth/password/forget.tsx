import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sms } from "iconsax-reactjs";
import { useState } from "react";
import logo from "@assets/evaLogo.png";
import lock from "@assets/onBoarding/forgetpass/lock.png";
import img from "@assets/onBoarding/forgetpass/pass.png";

export const Route = createFileRoute("/_public/auth/password/forget")({
  component: RouteComponent,
});

export function RouteComponent() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Check if both fields are filled
  const isFormValid = email.trim() !== "";

  const handleSignUp = () => {
    /* eslint-disable */ console.log("Sign up clicked");
    navigate({ to: "/auth/password/otp" });
  };

  const handleGoogleSignup = () => {
    /* eslint-disable */ console.log("Google signup clicked");
  };

  const handleFacebookSignUp = () => {
    /* eslint-disable */ console.log("Facebook signUp clicked");
  };

  const handleLogin = () => {
    /* eslint-disable */ console.log("Login clicked");
    navigate({ to: "/auth/signin" });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image with overlay */}
      <div className="flex-1 relative">
        <img
          src={img}
          alt="Sign in background"
          className="w-full h-[100vh] object-cover"
        />
      </div>

      {/* Right side - Sign up form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <img src={logo} alt="" className="w-[60px] h-[60px]" />
            </div>
            <h1 className="text-[32px] font-bold text-gray-900 mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-600 text-[14px] leading-relaxed">
              Log in to access your EVE account and continue creating or
              discovering amazing events.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="border-r-1 border-[#EAEAEA] pr-2 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Sms size="24" color="#BFBFBF" variant="Outline" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="text-[#2D2D2D] w-full pl-13 pr-4 py-3 border border-gray-300 rounded-[14px] focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Sign Up button */}
            <button
              onClick={handleSignUp}
              className={`w-full text-white font-medium py-3 px-4 rounded-[14px] transition-colors duration-200 ${
                isFormValid
                  ? "bg-[#7417C6] hover:bg-[#5f1399]"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              Continue
            </button>



            {/* Login link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Remember Password?{" "}
                <button
                  onClick={handleLogin}
                  className="text-[#7417C6] hover:text-purple-700 font-medium"
                >
                  Log in
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* <OtpVerification/> */}

      {/* Decorative elements on the right side */}
      <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none">
        <div className="relative">
          <img src={lock} alt="" className="w-[199px] h-[179px]" />
        </div>
      </div>
    </div>
  );
}
