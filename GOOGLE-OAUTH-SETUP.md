# Google OAuth Setup Guide for RIKA Care

## 🎯 What You Need

To make the Google Sign-In button work on your production site, you need to set up Google OAuth credentials and configure them in Render.

---

## 📋 Step 1: Create Google OAuth Credentials

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create a New Project (or select existing)
- Click "Select a project" at the top
- Click "NEW PROJECT"
- Name it: "RIKA Care"
- Click "CREATE"

### 3. Enable Google+ API
- In the left sidebar, go to "APIs & Services" → "Library"
- Search for "Google+ API"
- Click on it and click "ENABLE"

### 4. Create OAuth Consent Screen
- Go to "APIs & Services" → "OAuth consent screen"
- Select "External" (for public users)
- Click "CREATE"

**Fill in the form:**
- **App name**: RIKA Care
- **User support email**: Your email
- **App logo**: (Optional - upload your RIKA logo)
- **Application home page**: https://rika-care.onrender.com
- **Authorized domains**: `onrender.com`
- **Developer contact email**: Your email
- Click "SAVE AND CONTINUE"

**Scopes:**
- Click "ADD OR REMOVE SCOPES"
- Select: `../auth/userinfo.email`
- Select: `../auth/userinfo.profile`
- Click "UPDATE"
- Click "SAVE AND CONTINUE"

**Test users** (optional for development):
- Add your email as a test user
- Click "SAVE AND CONTINUE"

**Summary:**
- Review and click "BACK TO DASHBOARD"

### 5. Create OAuth Client ID
- Go to "APIs & Services" → "Credentials"
- Click "+ CREATE CREDENTIALS" → "OAuth client ID"
- **Application type**: Web application
- **Name**: RIKA Care Web App

**Authorized JavaScript origins:**
```
https://rika-care.onrender.com
http://localhost:3000 (for local testing)
```

**Authorized redirect URIs:**
```
https://rika-care.onrender.com/api/auth/google/callback
http://localhost:3000/api/auth/google/callback (for local testing)
```

- Click "CREATE"

### 6. Copy Your Credentials
You'll see a popup with:
- **Client ID**: Something like `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret**: Something like `GOCSPX-abc123def456`

**⚠️ IMPORTANT:** Copy both and save them somewhere safe!

---

## 🚀 Step 2: Configure Render Environment Variables

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com

### 2. Select Your RIKA Care Service
- Click on your "rika-care" web service

### 3. Go to Environment Variables
- Click "Environment" in the left sidebar

### 4. Add the Following Variables

Click "Add Environment Variable" for each:

| Key | Value |
|-----|-------|
| `GOOGLE_CLIENT_ID` | Paste your Client ID from Google |
| `GOOGLE_CLIENT_SECRET` | Paste your Client Secret from Google |
| `GOOGLE_CALLBACK_URL` | `https://rika-care.onrender.com/api/auth/google/callback` |

### 5. Save Changes
- Click "Save Changes"
- Render will automatically redeploy your app

---

## ✅ Step 3: Test Google Sign-In

### After Render Redeploys (2-5 minutes):

1. Visit: `https://rika-care.onrender.com/rika-care.html`
2. You should see the "Sign in with Google" button
3. Click it
4. Google login page appears
5. Select your Google account
6. Grant permissions
7. You're redirected back to RIKA Care, logged in!

---

## 🔍 Troubleshooting

### Google Sign-In Button Still Not Visible

**Check Render Deployment:**
- Dashboard → Your service → Logs
- Look for: "✅ SQLite database initialized"
- Verify no errors

**Clear Browser Cache:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or open in incognito/private window

### "Error 400: redirect_uri_mismatch"

**Problem:** The redirect URI doesn't match Google's configuration

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Click your OAuth Client ID
3. Verify the redirect URI is EXACTLY:
   ```
   https://rika-care.onrender.com/api/auth/google/callback
   ```
4. Make sure there are no trailing slashes or typos
5. Save and try again

### "Error 401: invalid_client"

**Problem:** Client ID or Secret is wrong

**Fix:**
1. Double-check the environment variables in Render
2. Make sure you copied the FULL Client ID and Secret
3. No extra spaces or characters
4. Redeploy if you made changes

### "This app isn't verified"

**This is normal for new apps!**
- Click "Advanced"
- Click "Go to RIKA Care (unsafe)"
- This warning only shows until you verify your app with Google (optional)

---

## 📊 Verification Status (Optional)

For a production app, you can verify it to remove the warning:

1. Go to Google Cloud Console → OAuth consent screen
2. Click "PUBLISH APP"
3. Submit for verification (takes a few days)

**You don't need this for testing or initial launch!**

---

## 🔒 Security Notes

### Keep These SECRET:
- ✅ Client ID: Public (safe to expose)
- ⚠️ Client Secret: PRIVATE (never commit to GitHub!)

### Render Environment Variables are Safe:
- They're encrypted
- Not visible in logs
- Not exposed to frontend
- Only accessible by your backend

---

## 📱 What Users Will See

### First Time Google Sign-In:
1. Click "Sign in with Google"
2. Google consent screen appears
3. Shows: "RIKA Care wants to access your Google Account"
4. Lists permissions: "See your email" and "See your profile"
5. User clicks "Allow"
6. Redirected to app, logged in automatically

### Subsequent Logins:
- If already authorized, instant login!
- No consent screen needed

---

## 🎉 Success Checklist

Once working, users can:
- ✅ Click "Sign in with Google" button
- ✅ Authenticate with their Google account
- ✅ Access app without creating password
- ✅ Profile auto-filled from Google (name, picture)
- ✅ Fast login on return visits

---

## 💡 Tips

### Local Testing:
If you want to test locally:
```bash
# In backend/.env file (create if doesn't exist)
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

Then run:
```bash
cd backend
npm start
```

Visit: http://localhost:3000/rika-care.html

### Multiple Environments:
You can create different OAuth clients for:
- Development (localhost)
- Staging (if you have one)
- Production (Render)

---

## 📞 Need Help?

Common issues:
- **Button not showing**: Check Render deployment logs
- **Redirect error**: Verify redirect URI matches exactly
- **Client error**: Double-check credentials in Render
- **App not verified warning**: Normal, click "Advanced" → "Go to app"

---

## ✅ Quick Summary

1. **Create Google OAuth App** in Cloud Console
2. **Copy Client ID + Secret**
3. **Add to Render** as environment variables
4. **Test** the Google Sign-In button
5. **Done!** Users can now sign in with Google

The button is already in your app - you just need to configure the credentials! 🎯
