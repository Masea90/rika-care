# Google OAuth Setup Guide for RIKA Care

This guide explains how to set up Google OAuth authentication for your RIKA Care application.

---

## 📋 Table of Contents

1. [Create Google Cloud Project](#1-create-google-cloud-project)
2. [Configure OAuth Consent Screen](#2-configure-oauth-consent-screen)
3. [Create OAuth Credentials](#3-create-oauth-credentials)
4. [Add Environment Variables to Render](#4-add-environment-variables-to-render)
5. [Test the Integration](#5-test-the-integration)
6. [Troubleshooting](#troubleshooting)

---

## 1. Create Google Cloud Project

### Step 1.1: Access Google Cloud Console
1. Go to https://console.cloud.google.com
2. Sign in with your Google account
3. Click **"Select a project"** at the top
4. Click **"NEW PROJECT"**

### Step 1.2: Create Project
1. **Project name**: `RIKA Care` (or your preferred name)
2. **Organization**: Leave as default
3. Click **"CREATE"**
4. Wait for project creation (takes ~30 seconds)
5. Click **"SELECT PROJECT"** when prompted

---

## 2. Configure OAuth Consent Screen

### Step 2.1: Navigate to OAuth Consent
1. In the left sidebar, click **"APIs & Services"**
2. Click **"OAuth consent screen"**

### Step 2.2: Choose User Type
1. Select **"External"** (allows anyone with a Google account to sign in)
2. Click **"CREATE"**

### Step 2.3: Fill App Information
**App information:**
- **App name**: `RIKA Care`
- **User support email**: Your email address
- **App logo**: (Optional - upload your RIKA logo if you have one)

**App domain:**
- **Application home page**: `https://rika-care.onrender.com`
- **Application privacy policy link**: `https://rika-care.onrender.com` (update when you create a privacy page)
- **Application terms of service link**: `https://rika-care.onrender.com` (update when you create a terms page)

**Authorized domains:**
- Add: `onrender.com`

**Developer contact information:**
- **Email addresses**: Your email address

Click **"SAVE AND CONTINUE"**

### Step 2.4: Scopes
1. Click **"ADD OR REMOVE SCOPES"**
2. Select these scopes:
   - `userinfo.email` - See your primary Google Account email address
   - `userinfo.profile` - See your personal info, including any personal info you've made publicly available
3. Click **"UPDATE"**
4. Click **"SAVE AND CONTINUE"**

### Step 2.5: Test Users (Development Only)
- For now, skip this step by clicking **"SAVE AND CONTINUE"**
- You can add test users later if needed

### Step 2.6: Summary
- Review your settings
- Click **"BACK TO DASHBOARD"**

---

## 3. Create OAuth Credentials

### Step 3.1: Create Credentials
1. In the left sidebar, click **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**

### Step 3.2: Configure OAuth Client
**Application type:**
- Select: **"Web application"**

**Name:**
- Enter: `RIKA Care Web Client`

**Authorized JavaScript origins:**
- Add these URLs (click "+ ADD URI" for each):
  ```
  http://localhost:3000
  https://rika-care.onrender.com
  ```

**Authorized redirect URIs:**
- Add these URLs (click "+ ADD URI" for each):
  ```
  http://localhost:3000/auth/google/callback
  https://rika-care.onrender.com/auth/google/callback
  ```

Click **"CREATE"**

### Step 3.3: Save Your Credentials
A popup will appear with your credentials:

```
Client ID: 1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
Client Secret: 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4
```

**⚠️ IMPORTANT:**
- Copy both values immediately
- Store them securely (you'll need them for Render)
- Click **"OK"**

You can always view these later by clicking the credential name in the Credentials page.

---

## 4. Add Environment Variables to Render

### Step 4.1: Access Render Dashboard
1. Go to https://dashboard.render.com
2. Find your **rika-care** web service
3. Click on it to open settings

### Step 4.2: Add Environment Variables
1. Scroll down to **"Environment"** section
2. Click **"Add Environment Variable"**

**Add these 3 variables:**

**Variable 1:**
- **Key**: `GOOGLE_CLIENT_ID`
- **Value**: `[Paste your Client ID from Step 3.3]`
- Example: `1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`

**Variable 2:**
- **Key**: `GOOGLE_CLIENT_SECRET`
- **Value**: `[Paste your Client Secret from Step 3.3]`
- Example: `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4`

**Variable 3:**
- **Key**: `GOOGLE_CALLBACK_URL`
- **Value**: `https://rika-care.onrender.com/auth/google/callback`

### Step 4.3: Deploy Changes
1. Click **"Save Changes"**
2. Render will automatically redeploy your app
3. Wait 3-5 minutes for deployment to complete

---

## 5. Test the Integration

### Step 5.1: Test on Production
1. Visit: https://rika-care.onrender.com
2. You should see the **"Sign in with Google"** button with the Google logo
3. Click **"Sign in with Google"**
4. Select your Google account
5. Review permissions and click **"Continue"**
6. You should be redirected back to RIKA Care and logged in

### Step 5.2: Verify User Creation
After signing in with Google:
- You should be on the Privacy First screen (first-time login)
- Complete onboarding and access the dashboard
- Your profile should show your Google name/email

### Step 5.3: Test Existing User Login
1. Log out
2. Click **"Sign in with Google"** again
3. You should skip onboarding and go straight to dashboard

---

## 6. Troubleshooting

### Issue: "Error 400: redirect_uri_mismatch"

**Cause:** The callback URL in your Google Cloud Console doesn't match your actual URL.

**Solution:**
1. Go to Google Cloud Console > Credentials
2. Click your OAuth client
3. Under **"Authorized redirect URIs"**, verify you have:
   ```
   https://rika-care.onrender.com/auth/google/callback
   ```
4. Make sure there are NO trailing slashes
5. Save and try again

### Issue: "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen is not properly configured.

**Solution:**
1. Go to Google Cloud Console > OAuth consent screen
2. Verify **App name**, **User support email**, and **Developer contact** are filled
3. Add `onrender.com` to **Authorized domains**
4. Click **"SAVE"** and try again

### Issue: "Failed to load profile. Please try again."

**Cause:** Missing or incorrect environment variables on Render.

**Solution:**
1. Check Render Dashboard > Environment Variables
2. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
3. Verify `GOOGLE_CALLBACK_URL` matches exactly:
   ```
   https://rika-care.onrender.com/auth/google/callback
   ```
4. Click **"Save Changes"** to redeploy

### Issue: Google sign-in button doesn't appear

**Cause:** JavaScript error or old cached version.

**Solution:**
1. Hard refresh the page: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Check browser console for errors (F12 → Console tab)

### Issue: "OAuth failed" error message

**Cause:** Backend authentication failed.

**Solution:**
1. Check Render logs: Dashboard → rika-care → Logs
2. Look for error messages related to Google OAuth
3. Verify database has `googleId` column (should be automatic)
4. Redeploy if necessary

---

## 📊 How It Works

### Authentication Flow

```
User clicks "Sign in with Google"
           ↓
Redirect to /auth/google
           ↓
Google login page appears
           ↓
User selects account and grants permissions
           ↓
Google redirects to /auth/google/callback
           ↓
Backend creates/finds user in database
           ↓
Backend generates JWT token
           ↓
Redirect to frontend with token in URL
           ↓
Frontend stores token and fetches user profile
           ↓
User is logged in!
```

### Database Changes

The users table now includes a `googleId` field:
- For email/password users: `googleId` is `NULL`
- For Google OAuth users: `googleId` contains their Google user ID
- Users can link both methods to the same email

---

## 🔒 Security Notes

1. **Never commit secrets to Git**
   - `GOOGLE_CLIENT_SECRET` should only be in Render environment variables
   - The `.env` file (if you create one) should be in `.gitignore`

2. **HTTPS Only in Production**
   - Google OAuth requires HTTPS for production
   - Render provides this automatically

3. **JWT Secret**
   - Render auto-generates `JWT_SECRET`
   - This is used to sign authentication tokens
   - Never share or expose this value

4. **Password Field**
   - Google OAuth users have an empty password field
   - They cannot use email/password login unless they set a password
   - This is by design for security

---

## 📱 Next Steps

After successful setup:

1. **Publish OAuth App** (when ready for public use):
   - Go to Google Cloud Console > OAuth consent screen
   - Click **"PUBLISH APP"**
   - Submit for verification (optional, but removes "unverified app" warning)

2. **Add Password Reset** (future feature):
   - Allow users to set passwords for Google accounts
   - Implement email-based password reset flow

3. **Monitor Usage**:
   - Google Cloud Console shows OAuth usage stats
   - Track login methods in your analytics

---

## 📞 Support

If you encounter issues not covered here:
- Check Render logs for backend errors
- Check browser console for frontend errors
- Review Google Cloud Console > APIs & Services > Dashboard for API errors

---

**Last Updated**: December 9, 2024
**Version**: 1.0.0-oauth

