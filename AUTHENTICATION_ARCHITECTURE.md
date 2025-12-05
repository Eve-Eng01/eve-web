# Authentication & API Integration Architecture

## Overview

This document outlines the production-level authentication and API integration architecture for the Eve Web application. The architecture uses **React Context API**, **TanStack Query**, and **Zustand** to provide a robust, scalable, and secure authentication system.

## Architecture Components

### 1. API Layer (`src/shared/api/`)

#### Configuration (`config.ts`)
- **Base URL**: `https://eve-backend-bi8l.onrender.com/api/v1`
- **Timeout**: 30 seconds
- Centralized API response types and token storage keys

#### Client (`client.ts`)
- Axios instance with interceptors
- **Request Interceptor**: Automatically adds access token to all requests
- **Response Interceptor**: 
  - Handles 401 errors (token expiry)
  - Automatic token refresh with request queuing
  - Auto-logout on refresh failure
  - Prevents token reuse attacks

**Key Features:**
- Token refresh queue to prevent multiple simultaneous refresh requests
- Automatic retry of failed requests after token refresh
- Event-based logout system (`auth:logout` event)

### 2. State Management (`src/shared/stores/`)

#### Auth Store (`auth-store.ts`)
- **Zustand store** with persistence
- Manages:
  - User data
  - Access & refresh tokens
  - Authentication state
  - Loading states
- **Persistence**: Uses localStorage via Zustand's persist middleware
- **Actions**:
  - `setUser()` - Update user data
  - `setTokens()` - Update tokens
  - `logout()` - Clear auth state
  - `clearAuth()` - Complete auth cleanup

### 3. Service Layer (`src/shared/api/services/`)

#### Auth Service Structure
```
services/
  auth/
    ├── types.ts          # TypeScript types for requests/responses
    ├── auth.service.ts   # API service functions
    ├── auth.hooks.ts     # TanStack Query hooks
    └── index.ts          # Exports
```

#### Available Auth Endpoints

1. **Sign Up** (`POST /auth/signup`)
   - Hook: `useSignUp()`
   - Creates new user account
   - Returns user ID and OTP

2. **Login** (`POST /auth/login`)
   - Hook: `useLogin()`
   - Authenticates user
   - Returns user data and tokens
   - Auto-navigates based on onboarding status

3. **Verify OTP** (`POST /auth/verify-otp`)
   - Hook: `useVerifyOtp()`
   - Verifies OTP for account activation
   - Returns user data and tokens

4. **Resend OTP** (`POST /auth/resend-otp`)
   - Hook: `useResendOtp()`
   - Resends OTP to user

5. **Refresh Token** (`POST /auth/refresh`)
   - Hook: `useRefreshToken()`
   - Refreshes access token using refresh token
   - Automatically called by interceptor on 401

6. **Forgot Password** (`POST /auth/forgot-password`)
   - Hook: `useForgotPassword()`
   - Initiates password reset flow

7. **Reset Password** (`POST /auth/reset-password`)
   - Hook: `useResetPassword()`
   - Resets password with OTP verification

8. **Logout**
   - Hook: `useLogout()`
   - Clears auth state and tokens
   - Navigates to login

### 4. Context Provider (`src/providers/auth-provider.tsx`)

- Wraps Zustand store for React Context compatibility
- Listens for logout events
- Validates token on mount
- Provides auth state to router context

## Security Features

### Token Management
1. **Access Token**: Short-lived, stored in localStorage
2. **Refresh Token**: Long-lived, stored in localStorage
3. **Automatic Refresh**: Handled transparently by interceptor
4. **Token Expiry**: Auto-logout on refresh failure

### Security Best Practices
- ✅ Tokens stored securely in localStorage
- ✅ Automatic token refresh prevents session interruption
- ✅ Request queuing prevents race conditions
- ✅ Auto-logout on unauthorized access
- ✅ Token reuse detection (handled by backend)

## Usage Examples

### Login Flow
```typescript
import { useLogin } from "@/shared/api/services/auth";

function LoginComponent() {
  const loginMutation = useLogin();
  
  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync({
        email: "user@example.com",
        password: "password123"
      });
      // Navigation handled automatically by hook
    } catch (error) {
      // Handle error
    }
  };
}
```

### Accessing Auth State
```typescript
import { useAuth } from "@/providers/auth-provider";
import { useAuthStore } from "@/shared/stores/auth-store";

// Via Context (recommended for components)
const { user, isAuthenticated, loading } = useAuth();

// Via Store (for non-component code)
const user = useAuthStore((state) => state.user);
const logout = useAuthStore((state) => state.logout);
```

### Making Authenticated API Calls
```typescript
import { apiClient } from "@/shared/api/client";

// Token automatically added by interceptor
const response = await apiClient.get("/some-protected-endpoint");
```

## Integration Points

### Router Integration
- `_authenticated.tsx` route checks auth state
- Redirects to login if not authenticated
- Preserves redirect URL for post-login navigation

### App Integration
- `app.tsx` syncs router context with auth store
- Provides loading states during auth checks

## Next Steps: Onboarding Service

The onboarding service should follow the same pattern:

```
services/
  onboarding/
    ├── types.ts
    ├── onboarding.service.ts
    ├── onboarding.hooks.ts
    └── index.ts
```

### Recommended Onboarding Endpoints (from Postman collection)
- Vendor onboarding
- Service selection
- Profile completion
- etc.

## File Structure

```
src/
├── shared/
│   ├── api/
│   │   ├── config.ts
│   │   ├── client.ts
│   │   └── services/
│   │       └── auth/
│   │           ├── types.ts
│   │           ├── auth.service.ts
│   │           ├── auth.hooks.ts
│   │           └── index.ts
│   └── stores/
│       └── auth-store.ts
├── providers/
│   └── auth-provider.tsx
└── routes/
    ├── auth/
    │   └── signin.tsx (updated)
    └── _authenticated.tsx (updated)
```

## Error Handling

- All API errors are caught and handled by TanStack Query
- User-friendly error messages displayed in UI
- Network errors automatically retried (configurable)
- 401 errors trigger automatic token refresh
- Refresh failures trigger logout

## Testing Considerations

1. **Mock API Client**: Create mock version for tests
2. **Test Token Refresh**: Verify queue behavior
3. **Test Auto-Logout**: Verify event handling
4. **Test Persistence**: Verify Zustand persistence

## Performance Optimizations

- Token refresh queue prevents duplicate requests
- Zustand persistence reduces unnecessary re-renders
- TanStack Query caching reduces API calls
- Request interceptors minimize code duplication

## Future Enhancements

1. **Token Expiry Warning**: Warn users before token expiry
2. **Session Management**: Multiple device management
3. **Biometric Auth**: Add biometric authentication
4. **OAuth Integration**: Google/Facebook login
5. **2FA**: Two-factor authentication support


