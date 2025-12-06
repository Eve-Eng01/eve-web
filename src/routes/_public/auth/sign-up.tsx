import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock1, Sms, User } from "iconsax-reactjs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import logo from "@assets/evaLogo.png";
import img from "@assets/onBoarding/signInImage.png";
import smile from "@assets/onBoarding/smile.png";
import { useSignUp, useGoogleLogin } from "@/shared/api/services/auth";
import { FormInput, FormError } from "@/shared/forms";
import { signUpSchema, type SignUpFormData } from "@/shared/forms/schemas";
import { CustomButton } from "@components/button/button";
import { AccountLinkingModal } from "@/shared/components/accessories/account-linking-modal";
import { useToastStore } from "@/shared/stores/toast-store";

export const Route = createFileRoute("/_public/auth/sign-up")({
  component: RouteComponent,
});

export function RouteComponent() {
  const navigate = useNavigate();
  const signUpMutation = useSignUp();
  const googleLoginMutation = useGoogleLogin();
  const showToast = useToastStore((state) => state.showToast);
  const [showLinkingModal, setShowLinkingModal] = useState(false);
  const [googleLinkingToken, setGoogleLinkingToken] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      privacy_policy: false,
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  // Helper function to check if stored token is still valid
  const isTokenValid = (): boolean => {
    const expiryStr = sessionStorage.getItem("google_linking_token_expiry");
    if (!expiryStr) return false;
    const expiryTime = parseInt(expiryStr, 10);
    return Date.now() < expiryTime;
  };

  // Check for Google linking token on mount and when mutation error occurs
  useEffect(() => {
    const storedToken = sessionStorage.getItem("google_linking_token");
    if (storedToken && isTokenValid()) {
      setGoogleLinkingToken(storedToken);
      setShowLinkingModal(true);
    } else if (storedToken && !isTokenValid()) {
      // Token expired, clean up
      sessionStorage.removeItem("google_linking_token");
      sessionStorage.removeItem("google_linking_token_expiry");
      showToast("The Google sign-in session has expired. Please try again.", "error");
    }
  }, []);

  // Check for 409 error from Google login
  useEffect(() => {
    const error = googleLoginMutation.error as { response?: { status?: number } } | undefined;
    if (error?.response?.status === 409) {
      const storedToken = sessionStorage.getItem("google_linking_token");
      if (storedToken && isTokenValid()) {
        setGoogleLinkingToken(storedToken);
        setShowLinkingModal(true);
      } else if (storedToken && !isTokenValid()) {
        // Token expired, clean up
        sessionStorage.removeItem("google_linking_token");
        sessionStorage.removeItem("google_linking_token_expiry");
        showToast("The Google sign-in session has expired. Please try again.", "error");
      }
    }
  }, [googleLoginMutation.error]);

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      showToast("No credential received from Google. Please try again.", "error");
      return;
    }

    try {
      setIsGoogleLoading(true);
      await googleLoginMutation.mutateAsync({
        id_token: credentialResponse.credential,
      });
      // Navigation is handled in the hook's onSuccess callback
      // Clear any stored linking token on success
      sessionStorage.removeItem("google_linking_token");
      sessionStorage.removeItem("google_linking_token_expiry");
    } catch (error) {
      // Check if it's a 409 error (account conflict)
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        // Token is already stored in sessionStorage by the hook
        const storedToken = sessionStorage.getItem("google_linking_token");
        if (storedToken && isTokenValid()) {
          setGoogleLinkingToken(storedToken);
          setShowLinkingModal(true);
        } else {
          // Token expired or missing
          if (storedToken) {
            sessionStorage.removeItem("google_linking_token");
            sessionStorage.removeItem("google_linking_token_expiry");
          }
          showToast(
            "An account with this email already exists. Please sign in with your email and password.",
            "error"
          );
        }
      } else {
        // Other errors are handled by the hook's onError callback
        const errorMessage = 
          (error as { response?: { data?: { message?: string } } })
            ?.response?.data?.message || "Google sign up failed. Please try again.";
        showToast(errorMessage, "error");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleCloseLinkingModal = () => {
    setShowLinkingModal(false);
    setGoogleLinkingToken(null);
    sessionStorage.removeItem("google_linking_token");
    sessionStorage.removeItem("google_linking_token_expiry");
  };

  const handleGoogleError = () => {
    setIsGoogleLoading(false);
    showToast("Google sign up was cancelled or failed. Please try again.", "error");
  };

  const handleLogin = () => {
    navigate({ to: "/auth/signin" });
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await signUpMutation.mutateAsync({
        email: data.email.trim(),
        password: data.password,
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
      });

      if (response.status && response.data) {
        // Store user email in sessionStorage for OTP verification
        // We need to get the email from the form data since the response might not include it
        sessionStorage.setItem(
          "otp_verification_email",
          data.email.trim().toLowerCase()
        );

        // Navigate to OTP verification
        navigate({ to: "/auth/otp/verify" });
      }
    } catch (err) {
      // Error handled by useFormError hook
      console.error("Sign up error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Image with overlay - Hidden on mobile and tablet */}
      <div className="hidden lg:flex flex-1 relative">
        <img
          src={img}
          alt="Sign in background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Sign up form */}
      <div className="flex-1 bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <img src={logo} alt="" className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px]" />
            </div>
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-gray-900 mb-2">
              Welcome To Eve
            </h1>
            <p className="text-gray-600 text-[13px] sm:text-[14px] leading-relaxed px-2 sm:px-0">
              Your all-in-one platform for event creators, planners,
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              service providers, and guests.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
            noValidate
          >
            {/* First Name field */}
            <FormInput
              name="first_name"
              label="First Name"
              type="text"
              placeholder="Enter your first name"
              register={register}
              error={errors.first_name}
              required
              icon={<User size="24" color="#BFBFBF" variant="Outline" />}
              iconPosition="left"
              autoComplete="given-name"
            />

            {/* Last Name field */}
            <FormInput
              name="last_name"
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
              register={register}
              error={errors.last_name}
              required
              icon={<User size="24" color="#BFBFBF" variant="Outline" />}
              iconPosition="left"
              autoComplete="family-name"
            />

            {/* Email field */}
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
            />

            {/* Password field */}
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
              autoComplete="new-password"
            />

            {/* Terms checkbox */}
            <div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="privacy_policy"
                  {...register("privacy_policy")}
                  className="mt-1 h-4 w-4 border-gray-300 bg-white accent-purple-600 focus:ring-purple-500 flex-shrink-0"
                />
                <label
                  htmlFor="privacy_policy"
                  className="ml-2 text-xs sm:text-sm text-gray-600"
                >
                  By signing up with eve , you agree to our{" "}
                  <span className="text-purple-600 hover:text-purple-700 cursor-pointer">
                    Terms
                  </span>{" "}
                  and{" "}
                  <span className="text-purple-600 hover:text-purple-700 cursor-pointer">
                    Privacy Policy
                  </span>
                </label>
              </div>
              {errors.privacy_policy && (
                <FormError
                  error={errors.privacy_policy}
                  className=" text-red-600 text-xs sm:text-sm"
                />
              )}
            </div>

            {/* Sign Up button */}
            <CustomButton
              type="submit"
              title="Sign Up"
              loading={isSubmitting}
              disabled={!form.formState.isValid || isSubmitting}
            />

            {/* Social login buttons */}
            <div className="space-y-3 ">
              <div className="w-full flex items-center justify-center relative">
                {isGoogleLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded z-10">
                    <span className="loading loading-spinner text-primary"></span>
                  </div>
                )}
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="signup_with"
                  containerProps={{ className: "google-login-button" }}
                  shape="rectangular"
                  logo_alignment="left"
                />
              </div>
            </div>

            {/* Login link */}
            <div className="text-center">
              <span className="text-xs sm:text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={handleLogin}
                  className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                >
                  Log in
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* <OtpVerification/> */}

      {/* Decorative elements on the right side - Hidden on mobile and tablet */}
      <div className="fixed bottom-0 right-0 overflow-hidden pointer-events-none hidden lg:block">
        <div className="relative">
          <img
            src={smile}
            alt=""
            className="w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] xl:w-[247px] xl:h-[245px]"
          />
        </div>
      </div>

      {/* Account Linking Modal */}
      {googleLinkingToken && (
        <AccountLinkingModal
          isOpen={showLinkingModal}
          onClose={handleCloseLinkingModal}
          googleIdToken={googleLinkingToken}
        />
      )}
    </div>
  );
}
