# RIKA Authentication Flow Testing Guide

## Backend Setup
1. Start the backend server:
   ```bash
   cd backend
   npm install
   node server.js
   ```
   Server should start on http://localhost:3000

## Frontend Testing
1. Open `web/rika-premium.html` in browser
2. Server should be running on localhost:3000

## Test Scenarios

### 1. New User Signup Flow
1. **Initial Load**: Should show Auth screen with signup form
2. **Create Account**: 
   - Fill in email, password, name
   - Click "Create Account"
   - Should redirect to Privacy First screen
3. **Privacy Selection**:
   - Select visibility option (Women/Men/Everyone/Only Me)
   - Click "Continue"
   - Should redirect to Beauty Profile screen
4. **Complete Profile**:
   - Click "Continue to Skin Quiz" or "Skip for Now"
   - Should reach Dashboard

### 2. Existing User Login Flow
1. **Login Form**: Click "Already have an account? Log in"
2. **Enter Credentials**: Use existing email/password
3. **Check Flow**:
   - If visibility NOT set → Privacy First screen
   - If visibility IS set → Dashboard directly

### 3. Session Persistence
1. **Refresh Page**: Should maintain login state
2. **Close/Reopen Browser**: Should stay logged in
3. **Invalid Token**: Should redirect to Auth screen

### 4. Logout Flow
1. **From Dashboard**: Go to Profile tab
2. **Sign Out**: Click "Sign Out" button
3. **Verify**: Should return to Auth screen

## API Endpoints to Test

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login existing user
- `GET /api/user/profile` - Get user profile (requires auth)

### Visibility Setting
- `POST /api/user/visibility` - Save visibility preference

## Expected Database Changes
- New users should have `profile.community.profileVisibility` set after Privacy First
- Existing users without visibility setting should be prompted for it

## Troubleshooting
- Check browser console for errors
- Verify backend is running on port 3000
- Check network tab for API call responses
- Ensure SQLite database is created in backend folder