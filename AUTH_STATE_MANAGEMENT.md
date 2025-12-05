# Global Authentication State Management

## Overview

This document describes the production-standard global authentication state management system that ensures:
1. **Immediate Dashboard Access**: Authenticated users see the dashboard immediately on app load (no loading flash)
2. **Auto-Logout on 401**: Automatic logout when backend returns 401 Unauthorized
3. **Persistent Sessions**: User sessions persist across page refreshes
4. **Token Validation**: Tokens are validated and synced on app initialization

## Architecture

### 1. Auth Store Initialization (`src/shared/stores/auth-store.ts`)

The auth store now includes:
- `isInitialized`: Tracks if auth state has been initialized from persisted storage
- `initialize()`: Method that loads persisted state and syncs tokens

**Initialization Flow:**
1. Check for persisted tokens in localStorage
2. Check for persisted user in Zustand store
3. Sync tokens with store
4. Set `isInitialized` to true
5. If tokens exist but no user, allow through (token validated on first API call)

### 2. Auth Provider (`src/providers/auth-provider.tsx`)

The provider now:
- Calls `initialize()` on mount
- Tracks initialization state
- Listens for `auth:logout` events
- Redirects to login on logout

**Key Features:**
- Shows loading spinner only during initialization
- Once initialized, immediately shows router (no flash of unauthenticated content)
- Handles logout events globally

### 3. API Client Interceptor (`src/shared/api/client.ts`)

Enhanced 401 handling:
- **Automatic Token Refresh**: Attempts to refresh token on 401
- **Auto-Logout on Refresh Failure**: If refresh fails, immediately logout
- **Auto-Logout on Direct 401**: If refresh token is also invalid, logout immediately
- **Store Synchronization**: Clears auth store on logout

**401 Handling Flow:**
1. Request returns 401
2. Check if refresh token exists
3. If yes, attempt token refresh
4. If refresh succeeds, retry original request
5. If refresh fails, clear tokens and store, dispatch logout event
6. If no refresh token, immediately logout

### 4. App Initialization (`src/app.tsx`)

The app now:
- Waits for auth initialization before rendering router
- Shows loading spinner only during initialization
- Once initialized, immediately shows appropriate route (dashboard or login)

**Loading States:**
- `isInitialized: false` → Show loading spinner
- `isInitialized: true` → Show router immediately

### 5. Protected Routes (`src/routes/_authenticated.tsx`)

Enhanced route protection:
- Checks both context and store for user
- Checks for access token
- Allows through if token exists (even without user - validated on first API call)
- Redirects to login only if no token AND no user

## User Experience Flow

### Authenticated User (First Visit)
1. User opens app
2. Auth store initializes from persisted state
3. Tokens and user loaded from localStorage
4. `isInitialized` set to true
5. Router renders immediately with dashboard
6. No loading flash, seamless experience

### Authenticated User (Page Refresh)
1. User refreshes page
2. Zustand rehydrates persisted state
3. Tokens loaded from localStorage
4. User data loaded from persisted store
5. `initialize()` syncs everything
6. Dashboard appears immediately

### Unauthenticated User
1. User opens app
2. No persisted tokens found
3. `initialize()` clears any stale data
4. `isInitialized` set to true
5. Router renders login page immediately

### Token Expiry (401 Response)
1. API request returns 401
2. Interceptor attempts token refresh
3. If refresh succeeds → Request retried, user continues
4. If refresh fails → Logout event dispatched
5. Auth store cleared
6. User redirected to login
7. All in-flight requests handled gracefully

## Security Features

### 1. Token Validation
- Tokens validated on first API call after initialization
- Invalid tokens trigger immediate logout
- No silent failures

### 2. Auto-Logout
- Automatic logout on 401 responses
- Automatic logout on refresh token failure
- Event-based system ensures all components are notified

### 3. State Synchronization
- Tokens in localStorage synced with Zustand store
- Store cleared when tokens cleared
- No state inconsistencies

### 4. Request Queuing
- Multiple simultaneous 401s handled gracefully
- Requests queued during token refresh
- All requests retried after successful refresh

## Implementation Details

### Initialization Sequence

```typescript
// 1. App starts
App() → AuthProvider

// 2. AuthProvider mounts
useEffect(() => initialize())

// 3. Initialize checks persisted state
- Check localStorage for tokens
- Check Zustand store for user
- Sync tokens with store
- Set isInitialized = true

// 4. App renders router
- If isInitialized && !loading → Show router
- Router checks auth state
- Routes to dashboard or login accordingly
```

### 401 Handling Sequence

```typescript
// 1. API request returns 401
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // 2. Attempt token refresh
      try {
        const newTokens = await refreshToken()
        // 3. Retry original request
        return apiClient(originalRequest)
      } catch {
        // 4. Refresh failed, logout
        clearAuthTokens()
        clearAuthStore()
        dispatchEvent('auth:logout')
      }
    }
  }
)
```

## Benefits

1. **No Loading Flash**: Authenticated users see dashboard immediately
2. **Persistent Sessions**: Users stay logged in across refreshes
3. **Automatic Logout**: Invalid tokens trigger immediate logout
4. **Graceful Error Handling**: All 401s handled automatically
5. **State Consistency**: Tokens and store always in sync
6. **Production Ready**: Handles all edge cases

## Testing Scenarios

1. **Fresh Login**: User logs in, tokens stored, dashboard shown
2. **Page Refresh**: User refreshes, state restored, dashboard shown
3. **Token Expiry**: Token expires, refresh succeeds, user continues
4. **Refresh Failure**: Refresh token invalid, user logged out
5. **Direct 401**: Backend returns 401, user logged out
6. **Multiple Tabs**: Logout in one tab, other tabs notified

## Future Enhancements

1. **Token Expiry Warning**: Warn users before token expiry
2. **Silent Refresh**: Refresh tokens before expiry
3. **Multi-Device Management**: Handle logout from other devices
4. **Session Timeout**: Auto-logout after inactivity


