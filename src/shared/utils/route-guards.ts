/**
 * Route Guard Utilities
 * Centralized authentication and authorization logic for route protection
 */

import { redirect } from "@tanstack/react-router";
import { useAuthStore, type UserRole } from "../stores/auth-store";
import { getAccessToken } from "../api/client";

export interface RouteGuardOptions {
  requireAuth?: boolean;
  requireRoles?: UserRole[];
  redirectTo?: string;
  allowIfAuthenticated?: boolean; // For public routes that redirect if authenticated
}

/**
 * Get current user from store or context
 */
export function getCurrentUser(context?: { auth?: { user?: any } }) {
  const storeUser = useAuthStore.getState().user;
  const contextUser = context?.auth?.user;
  return contextUser || storeUser;
}

/**
 * Check if user has required role
 */
export function hasRequiredRole(user: any, requiredRoles?: UserRole[]): boolean {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (!user?.role) return false;
  return requiredRoles.includes(user.role);
}

/**
 * Get dashboard route for user role
 */
export function getDashboardRoute(role?: UserRole): string {
  switch (role) {
    case "vendor":
      return "/vendor";
    case "event-organizer":
      return "/organizer";
    default:
      return "/onboarding/user-type"; // Default fallback
  }
}

/**
 * Route guard for beforeLoad
 */
export function createRouteGuard(options: RouteGuardOptions = {}) {
  return async ({ location, context }: any) => {
    const user = getCurrentUser(context);
    const accessToken = getAccessToken();
    const isAuthenticated = !!user || !!accessToken;

    // Public routes that redirect authenticated users
    // Only redirect if user has a role (users without roles should access role selection)
    if (options.allowIfAuthenticated && isAuthenticated && user?.role) {
      // If user has a role, check onboarding status
      if (user.isOnboarded) {
        const dashboardRoute = getDashboardRoute(user.role);
        throw redirect({
          to: dashboardRoute,
        });
      } else {
        // User has role but not onboarded - redirect to role-specific onboarding
        if (user.role === "vendor") {
          throw redirect({
            to: "/vendor/onboarding/profile",
          });
        } else if (user.role === "event-organizer") {
          throw redirect({
            to: "/organizer/onboarding/profile",
          });
        }
      }
    } else if (options.allowIfAuthenticated && isAuthenticated && !user?.role) {
      // User is authenticated but has no role - redirect to role selection
      throw redirect({
        to: "/onboarding/user-type",
      });
    }

    // Require authentication
    if (options.requireAuth) {
      if (!isAuthenticated) {
        throw redirect({
          to: options.redirectTo || "/auth/signin",
        });
      }

      // Check role requirements
      if (options.requireRoles && !hasRequiredRole(user, options.requireRoles)) {
        // If user has no role, redirect to role selection
        if (!user?.role) {
          throw redirect({
            to: "/onboarding/user-type",
          });
        }
        // Redirect to their dashboard if they don't have access
        const dashboardRoute = getDashboardRoute(user.role);
        throw redirect({
          to: dashboardRoute,
        });
      }
    }

    return {};
  };
}

