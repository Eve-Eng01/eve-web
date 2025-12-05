/**
 * Auth Form Validation Schemas
 * Yup schemas for authentication-related forms
 */

import * as yup from "yup";

/**
 * Common validation rules
 */
export const commonRules = {
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .trim()
    .lowercase(),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .trim(),

  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .trim(),

  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits")
    .matches(/^\d+$/, "OTP must contain only numbers"),

  userId: yup.string().required("User ID is required"),
};

/**
 * Login Form Schema
 */
export const loginSchema = yup.object().shape({
  email: commonRules.email,
  password: yup.string().required("Password is required"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

/**
 * Sign Up Form Schema
 */
export const signUpSchema = yup.object().shape({
  email: commonRules.email,
  password: commonRules.password,
  first_name: commonRules.firstName,
  last_name: commonRules.lastName,
});

export type SignUpFormData = yup.InferType<typeof signUpSchema>;

/**
 * Verify OTP Schema
 */
export const verifyOtpSchema = yup.object().shape({
  email: commonRules.email,
  otp: commonRules.otp,
});

export type VerifyOtpFormData = yup.InferType<typeof verifyOtpSchema>;

/**
 * Resend OTP Schema
 */
export const resendOtpSchema = yup.object().shape({
  email: commonRules.email,
});

export type ResendOtpFormData = yup.InferType<typeof resendOtpSchema>;

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = yup.object().shape({
  email: commonRules.email,
});

export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = yup.object().shape({
  id: commonRules.userId,
  otp: commonRules.otp,
  new_password: commonRules.password,
  confirm_password: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("new_password")], "Passwords must match"),
});

export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;


