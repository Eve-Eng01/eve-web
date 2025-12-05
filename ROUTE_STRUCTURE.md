# Route Structure Documentation

## Overview

This document describes the scalable, secure, and maintainable route structure implemented using TanStack Router route groups.

## Route Groups

### 1. `_public` - Public Routes
**Location:** `src/routes/_public/`
**Purpose:** Routes accessible to unauthenticated users. Authenticated users are automatically redirected to their dashboard.

**Routes:**
- `/` - Landing page (sign-up)
- `/auth/signin` - Sign in page
- `/auth/sign-up` - Sign up page
- `/auth/otp/verify` - OTP verification
- `/auth/password/forget` - Forgot password
- `/auth/password/otp` - Password reset OTP

**Protection:** Redirects authenticated users to their dashboard based on role.

### 2. `_authenticated` - General Authenticated Routes
**Location:** `src/routes/_authenticated/` (implicit - routes not under other groups)
**Purpose:** Routes that require authentication but no specific role.

**Routes:**
- `/account/*` - Account management
- `/messages/*` - Messages
- `/onboarding/*` - Onboarding flow
- `/status/*` - Status pages

**Protection:** Requires authentication. All authenticated users can access.

### 3. `_vendor` - Vendor-Only Routes
**Location:** `src/routes/_vendor/vendor/`
**Purpose:** Routes accessible only to users with the "vendor" role.

**Routes:**
- `/vendor` - Vendor dashboard
- `/vendor/event/*` - Event management
- `/vendor/proposal/*` - Proposal management
- `/vendor/messages/*` - Vendor messages

**Protection:** Requires authentication AND vendor role. Non-vendor users are redirected to their dashboard.

### 4. `_organizer` - Event Organizer Routes
**Location:** `src/routes/_organizer/organizer/`
**Purpose:** Routes accessible only to users with the "event-organizer" role.

**Routes:**
- `/organizer` - Organizer dashboard
- `/organizer/attendee` - Attendee management
- `/organizer/sales` - Sales & reports
- `/organizer/request-vendors` - Vendor requests
- `/organizer/layout` - Event layout

**Protection:** Requires authentication AND event-organizer role. Non-organizer users are redirected to their dashboard.

## Route Protection Utilities

**Location:** `src/shared/utils/route-guards.ts`

### Functions

#### `createRouteGuard(options)`
Creates a route guard function for use in `beforeLoad`.

**Options:**
- `requireAuth?: boolean` - Require authentication
- `requireRoles?: UserRole[]` - Require specific roles
- `redirectTo?: string` - Custom redirect path
- `allowIfAuthenticated?: boolean` - Redirect authenticated users (for public routes)

#### `getCurrentUser(context)`
Gets the current user from store or context.

#### `hasRequiredRole(user, requiredRoles)`
Checks if user has required role(s).

#### `getDashboardRoute(role)`
Returns the dashboard route for a given role.

## Route Group Files

### `_public.tsx`
```typescript
export const Route = createFileRoute("/_public")({
  beforeLoad: createRouteGuard({
    allowIfAuthenticated: true, // Redirect if authenticated
  }),
  component: () => <Outlet />,
});
```

### `_authenticated.tsx`
```typescript
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: createRouteGuard({
    requireAuth: true,
  }),
  component: () => <Outlet />,
});
```

### `_vendor.tsx`
```typescript
export const Route = createFileRoute("/_vendor")({
  beforeLoad: createRouteGuard({
    requireAuth: true,
    requireRoles: ["vendor"],
  }),
  component: () => <Outlet />,
});
```

### `_organizer.tsx`
```typescript
export const Route = createFileRoute("/_organizer")({
  beforeLoad: createRouteGuard({
    requireAuth: true,
    requireRoles: ["event-organizer"],
  }),
  component: () => <Outlet />,
});
```

## Adding New Routes

### Public Route
Create file: `src/routes/_public/your-route.tsx`
```typescript
export const Route = createFileRoute("/_public/your-route")({
  component: YourComponent,
});
```

### Authenticated Route (All Users)
Create file: `src/routes/_authenticated/your-route.tsx`
```typescript
export const Route = createFileRoute("/_authenticated/your-route")({
  component: YourComponent,
});
```

### Vendor-Only Route
Create file: `src/routes/_vendor/vendor/your-route.tsx`
```typescript
export const Route = createFileRoute("/_vendor/vendor/your-route")({
  component: YourComponent,
});
```

### Organizer-Only Route
Create file: `src/routes/_organizer/organizer/your-route.tsx`
```typescript
export const Route = createFileRoute("/_organizer/organizer/your-route")({
  component: YourComponent,
});
```

## Benefits

1. **Scalable:** Easy to add new route groups for new roles
2. **Consistent:** All routes use the same protection pattern
3. **Secure:** Centralized authentication/authorization logic
4. **Readable:** Clear file structure shows route protection
5. **Maintainable:** Single source of truth for route guards
6. **Type-Safe:** Full TypeScript support

## Navigation

When navigating programmatically, use the actual URL paths (without route group prefixes):

```typescript
// ✅ Correct
navigate({ to: "/vendor" });
navigate({ to: "/organizer" });
navigate({ to: "/auth/signin" });

// ❌ Incorrect
navigate({ to: "/_vendor/vendor" });
navigate({ to: "/_organizer/organizer" });
```

Route groups are internal to the file structure and don't appear in URLs.

