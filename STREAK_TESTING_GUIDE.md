# RIKA Care Streak System - Testing Guide

## Overview
The streak system rewards users for daily routine completion consistency. Users earn points and see their streak grow when they complete routines multiple days in a row.

## How to Test

### 1. Start the Backend
```bash
cd C:\Users\Z104553\RIKA\backend
node server.js
```

### 2. Open the Frontend
Open `C:\Users\Z104553\RIKA\web\rika-care.html` in your browser

### 3. Test Basic Streak Functionality

#### First Day (Start Streak)
1. Log in to RIKA Care
2. Go to Dashboard - you should see "Start your streak today ✨"
3. Complete all 4 routine items in the Routine tab
4. When you complete the 4th item, the streak should automatically update
5. You should see: "🔥 1 day streak" and earn 5 points

#### Simulate Multiple Days
To test consecutive days without waiting:

**Method 1: Database Manipulation**
```sql
-- Connect to the database and update last_activity_date
UPDATE user_streaks SET last_activity_date = '2024-01-01' WHERE user_id = 1;
```

**Method 2: Manual API Testing**
```bash
# Complete routine for "yesterday"
curl -X POST http://localhost:3000/api/routines/complete-day \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### 4. Test Streak Milestones

#### 7-Day Milestone
- Complete routines for 7 consecutive days
- Should see: "🎉 7-day streak! You're glowing, keep it up!"
- Earn 30 bonus points

#### 14-Day Milestone  
- Complete routines for 14 consecutive days
- Should see: "🌟 14-day streak! Your consistency is amazing!"
- Earn 50 bonus points

#### 30-Day Milestone
- Complete routines for 30 consecutive days
- Should see: "🏆 30-day streak! You're a beauty routine champion!"
- Earn 100 bonus points

### 5. Test Streak Reset
1. Skip a day (don't complete routine)
2. Complete routine the next day
3. Streak should reset to 1
4. Longest streak should remain unchanged

### 6. Test Edge Cases

#### Same Day Completion
- Complete routine multiple times in same day
- Should show "Already completed today"
- Streak should not increment multiple times

#### Streak Recovery
- Break a 5-day streak
- Start new streak
- Verify longest streak shows 5, current shows new count

## API Endpoints

### Get Current Streak
```
GET /api/streaks
Authorization: Bearer TOKEN
```

Response:
```json
{
  "currentStreak": 5,
  "longestStreak": 10,
  "lastActivityDate": "2024-01-15"
}
```

### Complete Daily Routine
```
POST /api/routines/complete-day
Authorization: Bearer TOKEN
```

Response:
```json
{
  "streak": {
    "currentStreak": 6,
    "longestStreak": 10,
    "lastActivityDate": "2024-01-16"
  },
  "milestone": "🎉 7-day streak! You're glowing, keep it up!"
}
```

## Database Schema

### user_streaks Table
```sql
CREATE TABLE user_streaks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## Points System Integration

### Daily Points
- **Routine completion**: +5 points
- **Individual routine steps**: +10 points each

### Milestone Bonuses
- **7 days**: +30 points
- **14 days**: +50 points  
- **30 days**: +100 points

## UI Components

### Dashboard Streak Display
- Shows current streak with fire emoji
- Shows best streak record
- "Complete Today's Routine" button
- Changes to "✓ Completed Today" when done

### Milestone Celebrations
- Animated popup with trophy/celebration emojis
- Milestone message
- Bonus points notification
- Auto-dismisses after 5 seconds

## Troubleshooting

### Streak Not Updating
1. Check browser console for API errors
2. Verify user is authenticated (token exists)
3. Check database connection
4. Ensure routine completion triggers API call

### Points Not Awarded
1. Verify `/api/points/add` endpoint works
2. Check user_points table in database
3. Ensure milestone logic is correct

### Database Issues
1. Run `node initStreakTables.js` to recreate tables
2. Check SQLite database file exists
3. Verify foreign key constraints

## Development Notes

### Streak Logic
- Activity = completing at least one routine on a day
- Consecutive days increment streak
- Missing a day resets current streak to 1
- Longest streak is preserved across resets
- Same-day completions don't increment twice

### Performance Considerations
- Streak updates are atomic database operations
- Points are awarded in same transaction
- UI updates happen after successful API response
- Milestone checks happen server-side

### Future Enhancements
- Weekly/monthly streak challenges
- Streak leaderboards
- Social sharing of milestones
- Streak recovery grace periods
- Custom streak goals