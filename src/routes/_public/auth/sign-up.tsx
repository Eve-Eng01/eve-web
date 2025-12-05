import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock1, Sms, User } from "iconsax-reactjs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import logo from "@assets/evaLogo.png";
import img from "@assets/onBoarding/signInImage.png";
import smile from "@assets/onBoarding/smile.png";
import { useSignUp } from "@/shared/api/services/auth";
import { FormInput, FormError, useFormError } from "@/shared/forms";
import { signUpSchema, type SignUpFormData } from "@/shared/forms/schemas";
import { CustomButton, BUTTON_STYLES } from "@components/button/button";

export const Route = createFileRoute("/_public/auth/sign-up")({
  component: RouteComponent,
});

export function RouteComponent() {
  const navigate = useNavigate();
  const signUpMutation = useSignUp();

  const form = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
    // TODO: Implement Google OAuth
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
        sessionStorage.setItem("otp_verification_email", data.email.trim().toLowerCase());
        
        // Navigate to OTP verification
        navigate({ to: "/auth/otp/verify" });
      }
    } catch (err) {
      // Error handled by useFormError hook
      console.error("Sign up error:", err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image with overlay */}
      <div className="flex-1 relative">
        <img
          src={img}
          alt="Sign in background"
          className="w-full h-full object-cover"
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
              Welcome To Eve
            </h1>
            <p className="text-gray-600 text-[14px] leading-relaxed">
              Your all-in-one platform for event creators, planners,
              <br />
              service providers, and guests.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
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
            <div className="flex items-start">
            <input
  type="checkbox"
  id="terms"
  className="mt-1 h-4 w-4  border-gray-300 bg-white accent-purple-600 focus:ring-purple-500"
/>
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
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


            {/* Sign Up button */}
            <CustomButton
              type="submit"
              title="Sign Up"
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

            {/* Login link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
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

      {/* Decorative elements on the right side */}
      <div className="fixed bottom-0 right-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="relative">
          <img
            src={smile}
            alt=""
            className="w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] xl:w-[247px] xl:h-[245px]"
          />
        </div>
      </div>
    </div>
  );
}
