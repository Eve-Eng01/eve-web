import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock1, Sms } from "iconsax-reactjs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import logo from "@assets/evaLogo.png";
import img from "@assets/onBoarding/signInImage.png";
import smile from "@assets/onBoarding/smile.png";
import { useLogin } from "@/shared/api/services/auth";
import { FormInput, useFormError } from "@/shared/forms";
import { loginSchema, type LoginFormData } from "@/shared/forms/schemas";
import { CustomButton, BUTTON_STYLES } from "@components/button/button";

export const Route = createFileRoute("/_public/auth/signin")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: (search.email as string) || undefined,
    } as { email?: string };
  },
});

export function RouteComponent() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { email: emailFromQuery } = Route.useSearch();

  // Get email from query params or sessionStorage (for auto-fill)
  const getInitialEmail = () => {
    // Priority: query param > sessionStorage
    if (emailFromQuery) {
      return emailFromQuery.trim().toLowerCase();
    }
    const storedEmail = sessionStorage.getItem("otp_verification_email");
    if (storedEmail) {
      return storedEmail.trim().toLowerCase();
    }
    return "";
  };

  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: getInitialEmail(),
      password: "",
    },
  });

  // Update email field if it comes from query params or sessionStorage
  useEffect(() => {
    const initialEmail = getInitialEmail();
    if (initialEmail) {
      form.setValue("email", initialEmail);
      // Clear sessionStorage after using it
      if (sessionStorage.getItem("otp_verification_email")) {
        sessionStorage.removeItem("otp_verification_email");
      }
    }
  }, [emailFromQuery, form]);

  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  const { displayError } = useFormError({
    form,
    apiError: loginMutation.error
      ? (loginMutation.error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Login failed. Please try again."
      : null,
  });

  const handleSignUp = () => {
    navigate({ to: "/auth/sign-up" });
  };

  const handleGoogleSignup = () => {
    /* eslint-disable */ console.log("Google signup clicked");
    // TODO: Implement Google OAuth
  };

  const handleFacebookSignUp = () => {
    /* eslint-disable */ console.log("Facebook signUp clicked");
    // TODO: Implement Facebook OAuth
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync({
        email: data.email.trim(),
        password: data.password,
      });
    } catch (err) {
      // Error handled by useFormError hook
      console.error("Login error:", err);
    }
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
              Welcome Back To Eve
            </h1>
            <p className="text-gray-600 text-[14px] leading-relaxed">
              Log in to access your EVE account and continue creating or
              discovering amazing events.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
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
              autoComplete="current-password"
            />

            {/* Forgot Password link */}
            <div className="flex items-start">
              <Link
                to="/auth/password/forget"
                className="text-sm text-gray-600"
              >
                <span className="text-[#7417C6] hover:text-[#7417C6] cursor-pointer">
                  Forgot Password?
                </span>
              </Link>
            </div>

      

            {/* Sign In button */}
            <CustomButton
              type="submit"
              title="Sign In"
              loading={isSubmitting}
              disabled={!form.formState.isValid || isSubmitting}
            />

            {/* Social login buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-[14px] text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </button>
            </div>

            {/* Sign Up link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* <OtpVerification/> */}

      {/* Decorative elements on the right side */}
      <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none">
        <div className="relative">
          <img src={smile} alt="" className="w-[247px] h-[245px]" />
        </div>
      </div>
    </div>
  );
}
