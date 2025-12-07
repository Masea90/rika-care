@echo off
echo 🌟 Starting WellnessApp...
echo.

echo Step 1: Installing dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Error installing dependencies. Make sure Node.js is installed.
    pause
    exit /b 1
)

echo.
echo Step 2: Setting up database...
call npm run seed
if errorlevel 1 (
    echo ⚠️ Warning: Could not seed database. App will still work.
)

echo.
echo Step 3: Starting server...
echo ✅ WellnessApp is starting...
echo 🌐 Open your browser and go to: http://localhost:3000
echo 📱 Or use the web demo in the demo folder
echo.
echo Press Ctrl+C to stop the server
call npm start