# JWT Token Timeout Feature

## Overview
This feature automatically detects when JWT tokens expire and redirects users to the login page with a notification message. The implementation ensures users are seamlessly logged out when their 4-hour JWT token expires.

## Implementation Details

### 1. JWT Token Decoding and Validation
- **File**: `src/app/core/services/auth.service.ts`
- **Methods**: 
  - `isTokenExpired()`: Decodes JWT payload and checks expiration time
  - `decodeJWTPayload()`: Safely decodes JWT token payload
  - `checkTokenExpiration()`: Triggers logout if token is expired
  - `logoutWithTimeout()`: Logs out user and shows timeout notification

### 2. Automatic Token Checking
- **File**: `src/app/core/services/token-expiration.service.ts`
- **Features**:
  - Checks token expiration immediately on app startup
  - Periodic checks every 5 minutes
  - Checks on route navigation
  - Avoids checking on login/signup pages

### 3. HTTP Interceptor Enhancement
- **File**: `src/app/core/interceptors/auth.interceptor.ts`
- **Features**:
  - Only adds Authorization header if token is valid and not expired
  - Handles 401 responses by triggering automatic logout
  - Shows timeout notification on server-side token rejection

### 4. Notification System
- **Files**: 
  - `src/app/core/services/notification.service.ts`
  - `src/app/shared/components/notification/notification.component.ts`
- **Features**:
  - Global notification system for user feedback
  - Special `showSessionTimeout()` method for timeout messages
  - Auto-dismissing notifications with customizable duration
  - Beautiful UI with different notification types (success, error, warning, info)

### 5. Auth Guard Enhancement
- **File**: `src/app/core/guards/auth.guard.ts`
- **Enhancement**: Now checks token expiration, not just token presence

## User Experience

### When Token Expires:
1. User is automatically redirected to login page
2. A warning notification appears: "Your session has expired. Please log in again."
3. Notification stays visible for 8 seconds
4. User can dismiss notification manually

### Automatic Checks Occur:
- On app startup
- Every 5 minutes while app is running
- On route navigation
- Before making HTTP requests
- When server returns 401 Unauthorized

## Configuration

### Token Expiration Check Interval
Currently set to 5 minutes in `token-expiration.service.ts`:
```typescript
setInterval(() => {
  this.checkTokenExpiration();
}, 5 * 60 * 1000); // 5 minutes
```

### Notification Duration
Session timeout notification duration is 8 seconds:
```typescript
showSessionTimeout(): void {
  this.show('Your session has expired. Please log in again.', 'warning', 8000);
}
```

## Security Benefits

1. **Automatic Cleanup**: Expired tokens are automatically removed from localStorage
2. **Proactive Checking**: Doesn't wait for server rejection to detect expiration
3. **User Awareness**: Clear notification explains why they were logged out
4. **Seamless UX**: Automatic redirect prevents users from seeing error states

## Testing the Feature

To test the JWT timeout feature:

1. Login to the application
2. Manually modify the JWT token in localStorage to have an expired timestamp
3. Navigate to a protected route or wait for the next automatic check
4. Observe automatic redirect to login with timeout notification

Alternatively, wait for the actual 4-hour token expiration in a real scenario. 