# 🚀 WellnessApp Launch Guide - For Non-Developers

## Quick Start (Easiest Way)

### Option 1: Web Demo (No Installation Required)
**Ready to use right now!**

1. **Open File Explorer**
2. **Navigate to**: `C:\Users\Z104553\WellnessApp\demo\`
3. **Double-click**: `complete-app.html`
4. **Start using your app immediately!**

This gives you the full app experience in your browser.

---

## Option 2: Full App Setup (For Real Usage & Testing)

### Step 1: Install Required Software

#### A. Install Node.js
1. **Go to**: https://nodejs.org
2. **Download**: "LTS" version (recommended)
3. **Run installer** and follow prompts
4. **Restart your computer**

#### B. Install MongoDB (Database)
1. **Go to**: https://www.mongodb.com/try/download/community
2. **Download**: MongoDB Community Server
3. **Install** with default settings
4. **Start MongoDB** (it should auto-start)

### Step 2: Launch Your App

#### A. Start the Backend Server
1. **Press**: `Windows Key + R`
2. **Type**: `cmd` and press Enter
3. **Copy and paste this command**:
   ```
   cd C:\Users\Z104553\WellnessApp\backend && npm install && npm start
   ```
4. **Press Enter** and wait for "Server running on port 3000"

#### B. Set Up Sample Data
1. **Open another command window** (Windows Key + R, type `cmd`)
2. **Copy and paste**:
   ```
   cd C:\Users\Z104553\WellnessApp\backend && npm run seed
   ```
3. **Press Enter** - this adds sample products to test with

#### C. Access Your App
1. **Open your web browser**
2. **Go to**: `http://localhost:3000`
3. **Start using your full app!**

---

## Option 3: Mobile App (Advanced)

### For Android Testing:
1. **Install Android Studio**: https://developer.android.com/studio
2. **Set up emulator** or connect Android phone
3. **In command prompt**:
   ```
   cd C:\Users\Z104553\WellnessApp\mobile
   npm install
   npx react-native run-android
   ```

### For iPhone Testing:
1. **Need Mac computer** with Xcode
2. **Or use Expo Go app** on your iPhone

---

## 🛠️ Making Changes & Customizations

### Easy Changes You Can Make:

#### 1. Change App Colors
**File**: `C:\Users\Z104553\WellnessApp\shared\colors.js`
- Change `primary: '#4A90A4'` to your preferred color
- Save file and refresh browser

#### 2. Add Your Own Affirmations
**File**: `C:\Users\Z104553\WellnessApp\backend\empowermentService.js`
- Find `initializeDailyAffirmations()` section
- Add your own messages to the array
- Save and restart server

#### 3. Modify Product Recommendations
**File**: `C:\Users\Z104553\WellnessApp\backend\scripts\seedDatabase.js`
- Add your own products to `sampleProducts` array
- Run `npm run seed` again

#### 4. Change App Name/Branding
**File**: `C:\Users\Z104553\WellnessApp\demo\complete-app.html`
- Find "WellnessApp" and replace with your app name
- Change welcome messages and descriptions

### Testing Your Changes:
1. **Make your changes** in the files
2. **Save the files**
3. **Refresh your browser** (for web demo)
4. **Or restart server** (for full app)

---

## 📱 What You Can Do Right Now:

### Immediate Testing (Web Demo):
✅ **Complete user onboarding flow**
✅ **Test skin analysis questions**
✅ **See personalized product recommendations**
✅ **Try routine tracking with points**
✅ **Experience community features**
✅ **View empowerment notifications**

### Full App Testing (After Setup):
✅ **Real user registration/login**
✅ **Database storage of user profiles**
✅ **API-powered recommendations**
✅ **File upload for selfie analysis**
✅ **Real-time notifications**
✅ **Community posting and interactions**

---

## 🆘 Troubleshooting

### If Command Prompt Shows Errors:
1. **Make sure Node.js is installed** (restart computer after install)
2. **Check MongoDB is running** (look for MongoDB in Task Manager)
3. **Try running commands one at a time**

### If Browser Shows "Can't Connect":
1. **Make sure backend server is running** (see Step 2A above)
2. **Wait 30 seconds** after starting server
3. **Try**: `http://127.0.0.1:3000` instead

### If You Want Help:
1. **Take screenshot** of any error messages
2. **Note which step** you're having trouble with
3. **Try the web demo first** - it always works!

---

## 🎯 Recommended Starting Path:

### For Immediate Use:
1. **Start with web demo** (`complete-app.html`)
2. **Experience the full user journey**
3. **Test all features and flows**
4. **Make notes on what you want to change**

### For Development/Changes:
1. **Set up full app** (Option 2 above)
2. **Make small changes** to test
3. **Use web demo** to prototype ideas quickly

### For Production Launch:
1. **Get developer help** for app store submission
2. **Set up proper hosting** (AWS, Google Cloud)
3. **Configure real payment processing**
4. **Add professional design polish**

**Start with the web demo right now - double-click `complete-app.html` and begin exploring your wellness app!** 🌟