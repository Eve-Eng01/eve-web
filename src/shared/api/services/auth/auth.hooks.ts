/**
 * Auth Hooks (TanStack Query)
 * React Query hooks for authentication operations
 */

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authService } from "./auth.service";
import type {
  SignUpRequest,
  LoginRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  VerifyPasswordResetOtpRequest,
  ResetPasswordRequest,
  SetRoleRequest,
  GoogleOAuthRequest,
  LinkAccountRequest,
} from "./types";
import { useAuthStore, type UserRole } from "../../../stores/auth-store";
import { setAuthTokens, clearAuthTokens } from "../../client";
import { useToastStore } from "../../../stores/toast-store";

/**
 * Query Keys
 */
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  tokens: () => [...authKeys.all, "tokens"] as const,
};

/**
 * Get User Profile Query
 */
export function useGetUser(enabled = true) {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authService.getUser(),
    enabled,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Sign Up Mutation
 */
export function useSignUp() {
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: SignUpRequest) => authService.signUp(data),
    onSuccess: (response) => {
      if (response.status && response.data) {
        showToast(
          response.message || "Account created successfully! Please verify your email.",
          "success"
        );
      }
    },
    onError: (error) => {
      console.error("Sign up error:", error);
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Sign up failed. Please try again.";
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Login Mutation
 */
export function useLogin() {
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async (response) => {
      if (response.status && response.data) {
        // Check if user is not verified (no tokens in response)
        const hasTokens = "tokens" in response.data && response.data.tokens;
        const isVerified = response.data.isVerified !== false;
        
        if (!hasTokens || !isVerified) {
          // User needs to verify email
          const userEmail = response.data.email;
          
          if (userEmail) {
            // Store user email for OTP verification
            sessionStorage.setItem("otp_verification_email", userEmail);
            
            // Show toast message
            showToast(
              response.message || "Please verify your email to continue",
              "error",
              5000
            );
            
            // Navigate to OTP verification
            navigate({ to: "/auth/otp/verify" });
          } else {
            showToast("Unable to verify user. Please try again.", "error");
          }
          return;
        }
        
        // User is verified, proceed with normal login flow
        const { tokens, ...userData } = response.data;
        
        // Ensure required fields are present
        if (!userData.firstName || !tokens) {
          showToast("Invalid response from server. Please try again.", "error");
          return;
        }
        
        // Update auth store with login response data (like before)
        setUser({
          _id: userData._id,
          firstName: userData.firstName,
          lastname: userData.lastname || "",
          email: userData.email,
          isVerified: userData.isVerified,
          role: userData.role as UserRole | undefined,
          isOnboarded: userData.isOnboarded,
        });
        setTokens(tokens);
        
        // Store tokens in localStorage (also handled by interceptor)
        setAuthTokens(tokens);
        
        try {
          // Fetch user profile to update state with full profile data
          // This syncs through onboarding updates
          const [userResponse] = await Promise.all([
            authService.getUser(),
          ]);
          
          if (userResponse.status && userResponse.data) {
            const profile = userResponse.data.profile;
            
            // Update auth store with full profile data
            setUser({
              _id: profile._id,
              firstName: profile.first_name,
              lastname: profile.last_name,
              email: profile.email,
              isVerified: true,
              role: profile.role as UserRole | undefined,
              isOnboarded: profile.is_onboarded?.completed ?? false,
            });
            
            // Invalidate and refetch user queries
            queryClient.invalidateQueries({ queryKey: authKeys.user() });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Continue with login flow even if profile fetch fails
          // The basic auth data is already set from login response
        }
        
        // Show success toast
        showToast("Login successful!", "success");
        
        // Navigation logic uses profile data if available, otherwise falls back to login response
        const currentUser = useAuthStore.getState().user;
        const userRole = currentUser?.role;
        const isOnboarded = currentUser?.isOnboarded ?? false;
        
        // Check for role FIRST - if no role, user must select one before anything else
        if (!userRole) {
          // Navigate to role selection screen (accessible without role)
          navigate({ to: "/onboarding/user-type" });
          return;
        }
        
        // If user has a role, check onboarding status
        if (isOnboarded) {
          // Navigate to correct dashboard based on role
          if (userRole === "vendor") {
            navigate({ to: "/vendor" });
          } else if (userRole === "event-organizer") {
            navigate({ to: "/organizer" });
          } else {
            // Default to organizer for other roles
            navigate({ to: "/organizer" });
          }
        } else {
          // Navigate to role-specific onboarding
          if (userRole === "vendor") {
            navigate({ to: "/vendor/onboarding/profile" });
          } else if (userRole === "event-organizer") {
            navigate({ to: "/organizer/onboarding/profile" });
          } else {
            // Default to organizer onboarding
            navigate({ to: "/organizer/onboarding/profile" });
          }
        }
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Login failed. Please try again.";
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Google OAuth Login Mutation
 * Handles both signup (new users) and login (existing users)
 */
export function useGoogleLogin() {
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: GoogleOAuthRequest) => authService.loginWithGoogle(data),
    onSuccess: async (response) => {
      if (response.status && response.data) {
        // Check if user is not verified (no tokens in response)
        const hasTokens = "tokens" in response.data && response.data.tokens;
        const isVerified = response.data.isVerified !== false;
        
        if (!hasTokens || !isVerified) {
          // User needs to verify email (shouldn't happen with OAuth, but handle it)
          const userEmail = response.data.email;
          
          if (userEmail) {
            sessionStorage.setItem("otp_verification_email", userEmail);
            showToast(
              response.message || "Please verify your email to continue",
              "error",
              5000
            );
            navigate({ to: "/auth/otp/verify" });
          } else {
            showToast("Unable to verify user. Please try again.", "error");
          }
          return;
        }
        
        // User is verified, proceed with normal login flow
        const { tokens, ...userData } = response.data;
        
        // Ensure required fields are present
        if (!userData.firstName || !tokens) {
          showToast("Invalid response from server. Please try again.", "error");
          return;
        }
        
        // Update auth store with login response data (like before)
        setUser({
          _id: userData._id,
          firstName: userData.firstName,
          lastname: userData.lastname || "",
          email: userData.email,
          isVerified: userData.isVerified,
          role: userData.role as UserRole | undefined,
          isOnboarded: userData.isOnboarded,
        });
        setTokens(tokens);
        
        // Store tokens in localStorage (also handled by interceptor)
        setAuthTokens(tokens);
        
        try {
          // Fetch user profile to update state with full profile data
          // This syncs through onboarding updates
          const [userResponse] = await Promise.all([
            authService.getUser(),
          ]);
          
          if (userResponse.status && userResponse.data) {
            const profile = userResponse.data.profile;
            
            // Update auth store with full profile data
            setUser({
              _id: profile._id,
              firstName: profile.first_name,
              lastname: profile.last_name,
              email: profile.email,
              isVerified: true,
              role: profile.role as UserRole | undefined,
              isOnboarded: profile.is_onboarded?.completed ?? false,
            });
            
            // Invalidate and refetch user queries
            queryClient.invalidateQueries({ queryKey: authKeys.user() });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Continue with login flow even if profile fetch fails
          // The basic auth data is already set from login response
        }
        
        // Show success toast
        showToast("Google sign in successful!", "success");
        
        // Navigation logic uses profile data if available, otherwise falls back to login response
        const currentUser = useAuthStore.getState().user;
        const userRole = currentUser?.role;
        const isOnboarded = currentUser?.isOnboarded ?? false;
        
        // Check for role FIRST - if no role, user must select one before anything else
        if (!userRole) {
          // Navigate to role selection screen (accessible without role)
          navigate({ to: "/onboarding/user-type" });
          return;
        }
        
        // If user has a role, check onboarding status
        if (isOnboarded) {
          // Navigate to correct dashboard based on role
          if (userRole === "vendor") {
            navigate({ to: "/vendor" });
          } else if (userRole === "event-organizer") {
            navigate({ to: "/organizer" });
          } else {
            // Default to organizer for other roles
            navigate({ to: "/organizer" });
          }
        } else {
          // Navigate to role-specific onboarding
          if (userRole === "vendor") {
            navigate({ to: "/vendor/onboarding/profile" });
          } else if (userRole === "event-organizer") {
            navigate({ to: "/organizer/onboarding/profile" });
          } else {
            // Default to organizer onboarding
            navigate({ to: "/organizer/onboarding/profile" });
          }
        }
      }
    },
    onError: (error, variables) => {
      console.error("Google login error:", error);
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Google sign in failed. Please try again.";
      
      // Check if it's an account conflict (409)
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        // Store the Google ID token for account linking
        // Google ID tokens are valid for 1 hour, store expiry timestamp
        const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour from now
        sessionStorage.setItem("google_linking_token", variables.id_token);
        sessionStorage.setItem("google_linking_token_expiry", expiryTime.toString());
        
        // Don't show toast here - let the component handle showing the modal
        // The error will be thrown so the component can catch it and show the modal
      } else {
        showToast(errorMessage, "error");
      }
    },
  });
}

/**
 * Verify OTP Mutation
 */
export function useVerifyOtp() {
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
    onSuccess: (response) => {
      if (response.status && response.data) {
        // Show success toast
        showToast(
          response.message || "Email verified successfully!",
          "success"
        );
        // Don't navigate here - let the component handle navigation after showing success screen
      }
    },
    onError: (error) => {
      console.error("Verify OTP error:", error);
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "OTP verification failed. Please try again.";
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Resend OTP Mutation
 */
export function useResendOtp() {
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: ResendOtpRequest) => authService.resendOtp(data),
    onSuccess: (response) => {
      if (response.status) {
        showToast(
          response.message || "OTP resent to your email",
          "success"
        );
      }
    },
    onError: (error) => {
      console.error("Resend OTP error:", error);
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Failed to resend OTP. Please try again.";
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Refresh Token Mutation
 */
export function useRefreshToken() {
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: (data: RefreshTokenRequest) => authService.refreshToken(data),
    onSuccess: (response) => {
      if (response.status && response.data) {
        const tokens = response.data;
        setTokens(tokens);
        setAuthTokens(tokens);
      }
    },
    onError: (error) => {
      console.error("Refresh token error:", error);
      // Clear tokens on refresh failure
      clearAuthTokens();
      useAuthStore.getState().clearAuth();
    },
  });
}

/**
 * Forgot Password Mutation
 */
export function useForgotPassword() {
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
    onSuccess: (response) => {
      if (response.status) {
        showToast(
          response.message || "OTP sent to your email",
          "success"
        );
      }
    },
    onError: (error) => {
      console.error("Forgot password error:", error);
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Failed to send OTP. Please try again.";
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Verify Password Reset OTP Mutation
 */
export function useVerifyPasswordResetOtp() {
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: VerifyPasswordResetOtpRequest) => 
      authService.verifyPasswordResetOtp(data),
    onSuccess: (response) => {
      if (response.status && response.data) {
        showToast(
          response.message || "OTP verified successfully",
          "success"
        );
      }
    },
    onError: (error) => {
      console.error("Verify password reset OTP error:", error);
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Invalid or expired OTP. Please try again.";
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Reset Password Mutation
 */
export function useResetPassword() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: (response) => {
      if (response.status) {
        showToast(
          response.message || "Password reset successful",
          "success"
        );
        // Navigate to login after successful password reset
        navigate({ to: "/auth/signin", search: {} });
      }
    },
    onError: (error) => {
      console.error("Reset password error:", error);
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Failed to reset password. Please try again.";
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Set Role Mutation
 */
export function useSetRole() {
  const navigate = useNavigate();
  const { setUser, user } = useAuthStore();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: SetRoleRequest) => authService.setRole(data),
    onSuccess: (response) => {
      if (response.status && response.data) {
        // Update user role in auth store
        if (user) {
          setUser({
            ...user,
            role: response.data.role as UserRole,
          });
        }

       

        // Navigate to next step based on role
        if (response.data.role === "event-organizer") {
          navigate({ to: "/organizer/onboarding/profile" });
        } else if (response.data.role === "vendor") {
          navigate({ to: "/vendor/onboarding/profile" });
        }
         // Invalidate and refetch user queries
         queryClient.invalidateQueries({ queryKey: authKeys.user() });
      }
    },
    onError: (error) => {
      console.error("Set role error:", error);
      showToast(
        "Sorry an error occurred while selecting your goal",
        "error"
      );
    },
  });
}

/**
 * Link Account Mutation
 * Links an OAuth provider to an authenticated user's account
 */
export function useLinkAccount() {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: LinkAccountRequest) => authService.linkAccount(data),
    onSuccess: (response) => {
      if (response.status && response.data) {
        // Update user in store to reflect linked providers
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          // User data is already set from login, just show success
          showToast(
            response.message || "Account linked successfully!",
            "success"
          );
          
          // Invalidate and refetch user queries to get updated provider info
          queryClient.invalidateQueries({ queryKey: authKeys.user() });
        }
      }
    },
    onError: (error) => {
      console.error("Link account error:", error);
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || "Failed to link account. Please try again.";
      showToast(errorMessage, "error");
    },
  });
}

/**
 * Logout Function
 */
export function useLogout() {
  const navigate = useNavigate();
  const { logout, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return () => {
    // Clear auth state
    logout();
    clearAuth();
    clearAuthTokens();
    
    // Clear all queries
    queryClient.clear();
    
    // Navigate to login
    navigate({ to: "/auth/signin" });
  };
}


