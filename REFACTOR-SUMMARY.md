# RIKA Authentication Flow Refactor Summary

## Changes Made

### Frontend Changes (`web/rika-premium.html`)

#### 1. New Screen Structure
- **Auth Screen** (`#auth`): Replaces old welcome screen
  - Signup form with email, password, name
  - Login form with email, password  
  - Toggle between signup/login with clear links
- **Privacy First Screen** (`#privacyFirst`): Separated from auth
  - Visibility options: Women/Men/Everyone/Only Me
  - Only shown during onboarding or if setting missing
- **Beauty Profile Screen** (`#beautyProfile`): Optional profile completion
  - Replaces old "Create Profile" screen
  - Can skip to dashboard or continue to skin quiz

#### 2. Authentication Functions
- `initializeApp()`: Checks session on page load
- `signup()`: Creates new account, goes to Privacy First
- `login()`: Authenticates user, checks if onboarding needed
- `saveVisibilityAndContinue()`: Saves visibility setting via API
- `needsPrivacyOnboarding()`: Checks if user needs visibility setup

#### 3. Flow Control
- **New Users**: Auth → Privacy First → Beauty Profile → Dashboard
- **Existing Users**: Auth → Dashboard (or Privacy First if missing)
- **Session Persistence**: Maintains login state across browser sessions
- Navigation hidden during auth/onboarding screens

### Backend Changes (`backend/server.js`)

#### 1. New API Endpoint
```javascript
POST /api/user/visibility
```
- Saves user's visibility preference
- Updates `profile.community.profileVisibility` field
- Required for completing onboarding

#### 2. Enhanced Session Handling
- Existing `/api/user/profile` validates sessions properly
- Authentication middleware unchanged
- Profile structure supports new visibility field

## New User Flow

### 1. Authentication First
```
Page Load → Check Session
├── No Session → Auth Screen
│   ├── Signup → Privacy First → Beauty Profile → Dashboard  
│   └── Login → Check Visibility
│       ├── Missing → Privacy First → Dashboard
│       └── Set → Dashboard
└── Valid Session → Dashboard
```

### 2. Privacy First Onboarding
- **Trigger**: New signups OR existing users missing `profileVisibility`
- **Options**: Women, Men, Everyone, Only Me
- **Storage**: Saved to `profile.community.profileVisibility`
- **Persistence**: Once set, screen never shows again unless reset

### 3. Session Management
- **Token Storage**: localStorage (`rikaToken`)
- **Validation**: Every API call checks token validity
- **Logout**: Clears token, redirects to auth
- **Persistence**: Survives browser restart

## Testing Instructions

### Start Backend
```bash
cd backend
npm install
node server.js
```

### Test Scenarios

#### 1. New User Signup
1. Open `rika-premium.html`
2. Should show Auth screen with signup form
3. Fill email, password, name → Click "Create Account"
4. Should redirect to Privacy First screen
5. Select visibility → Click "Continue"  
6. Should reach Beauty Profile screen
7. Can continue to quiz or skip to dashboard

#### 2. Existing User Login
1. Click "Already have an account? Log in"
2. Enter existing credentials → Click "Log In"
3. If visibility not set → Privacy First screen
4. If visibility set → Dashboard directly

#### 3. Session Persistence
1. Login successfully
2. Refresh page → Should stay logged in
3. Close/reopen browser → Should stay logged in
4. Invalid token → Should redirect to auth

#### 4. Logout
1. Go to Profile tab in dashboard
2. Click "Sign Out" → Should return to Auth screen
3. Or click "Clear All Data" for complete reset

### Verification Points
- [ ] New users always see Privacy First screen
- [ ] Existing users skip Privacy First if visibility set
- [ ] Sessions persist across browser restarts
- [ ] Navigation hidden during auth/onboarding
- [ ] Logout properly clears session
- [ ] API calls include proper authentication headers

## Files Modified

### Frontend
- `web/rika-premium.html` - Complete authentication flow refactor

### Backend  
- `backend/server.js` - Added `/api/user/visibility` endpoint

### Documentation
- `test-flow.md` - Testing guide
- `REFACTOR-SUMMARY.md` - This summary

## Key Benefits

1. **Proper Separation**: Authentication and onboarding are now distinct
2. **Better UX**: Clear login/signup flow with proper error handling  
3. **Privacy Control**: Users explicitly choose visibility before using app
4. **Session Management**: Robust token-based authentication
5. **Onboarding Logic**: Privacy screen only shows when needed
6. **Maintainable**: Clean separation of concerns in code

The refactored flow now properly handles authentication first, then guides users through privacy onboarding only when necessary, creating a much cleaner and more intuitive user experience.