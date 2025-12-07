import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sms } from "iconsax-reactjs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import logo from "@assets/evaLogo.png";
import lock from "@assets/onBoarding/forgetpass/lock.png";
import img from "@assets/onBoarding/forgetpass/pass.png";
import { useForgotPassword } from "@/shared/api/services/auth";
import { FormInput, useFormError } from "@/shared/forms";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/shared/forms/schemas";
import { CustomButton } from "@components/button/button";

export const Route = createFileRoute("/_public/auth/password/forget")({
  component: RouteComponent,
});

export function RouteComponent() {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  useFormError({
    form,
    apiError: forgotPasswordMutation.error
      ? (forgotPasswordMutation.error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Failed to send OTP. Please try again."
      : null,
  });

  const handleLogin = () => {
    navigate({ to: "/auth/signin" });
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPasswordMutation.mutateAsync({
        email: data.email.trim().toLowerCase(),
      });

      if (response.status) {
        // Store email in sessionStorage for OTP verification page
        sessionStorage.setItem(
          "password_reset_email",
          data.email.trim().toLowerCase()
        );
        // Navigate to OTP verification page
        navigate({ to: "/auth/password/otp" });
      }
    } catch (err) {
      // Error handled by useFormError hook
      console.error("Forgot password error:", err);
    }
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

      {/* Right side - Sign up form */}
      <div className="flex-1 bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <img
                src={logo}
                alt=""
                className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px]"
              />
            </div>
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-gray-900 mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-600 text-[13px] sm:text-[14px] leading-relaxed px-2 sm:px-0">
              Log in to access your EVE account and continue creating or
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              discovering amazing events.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
            noValidate
          >
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

            {/* Continue button */}
            <CustomButton
              type="submit"
              title="Continue"
              loading={isSubmitting}
              disabled={!form.formState.isValid || isSubmitting}
            />
          </form>

          {/* Login link */}
          <div className="text-center mt-4 sm:mt-6">
            <span className="text-xs sm:text-sm text-gray-600">
              Remember Password?{" "}
              <button
                type="button"
                onClick={handleLogin}
                className="text-[#7417C6] hover:text-purple-700 font-medium"
              >
                Log in
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* <OtpVerification/> */}

      {/* Decorative elements on the right side - Hidden on mobile and tablet */}
      <div className="fixed bottom-0 right-0 overflow-hidden pointer-events-none hidden lg:block">
        <div className="relative">
          <img
            src={lock}
            alt=""
            className="w-[180px] h-[160px] lg:w-[199px] lg:h-[179px]"
          />
        </div>
      </div>
    </div>
  );
}
