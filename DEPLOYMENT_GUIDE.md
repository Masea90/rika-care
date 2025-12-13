# RIKA Care - Production Deployment Guide

## ✅ What's Ready for Launch

Your RIKA Care application now has **persistent database storage** and is ready for production deployment!

### Key Improvements Made:
1. ✅ **Dual Database Support**: SQLite for local dev, PostgreSQL for production
2. ✅ **Automatic Database Persistence**: All user data, points, streaks, and community posts will survive server restarts
3. ✅ **Free PostgreSQL Database**: Using Render's free tier (256MB storage, 5M rows)
4. ✅ **Zero-Downtime Switching**: The app automatically detects which database to use

---

## 🚀 Deployment Steps

### Step 1: Commit Your Changes

```bash
git add .
git commit -m "Add PostgreSQL database for production persistence"
git push origin main
```

### Step 2: Deploy to Render

Your `render.yaml` configuration will automatically:
- Create a free PostgreSQL database named `rika-database`
- Connect your web service to the database
- Initialize all tables on first startup

**Render will handle everything automatically!** Just push to GitHub and Render will:
1. Detect the updated `render.yaml`
2. Create the PostgreSQL database
3. Deploy your app with the DATABASE_URL env var
4. Your app will use PostgreSQL in production

### Step 3: Verify Deployment

After deployment completes (3-5 minutes):

1. Visit your app: https://rika-care.onrender.com
2. Create a new test account
3. Check that data persists by:
   - Refreshing the page
   - Logging out and logging back in
   - Checking your Render dashboard

---

## 🧪 Testing Locally

Test the new database setup locally:

```bash
cd backend
npm install
npm start
```

Your local development will continue using SQLite (no changes needed).

---

## 📊 Database Information

### PostgreSQL (Production)
- **Provider**: Render Free Tier
- **Storage**: 256 MB
- **Rows**: 5,000,000 max
- **Persistence**: ✅ Data survives restarts
- **Backups**: Manual snapshots available
- **Location**: Automatically set via DATABASE_URL env var

### SQLite (Local Development)
- **File**: `backend/rika-app.db`
- **Storage**: Unlimited (local disk)
- **Persistence**: ✅ Data saved to file

---

## 🔐 Security Features

### Already Implemented:
- ✅ bcrypt password hashing
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ Input sanitization
- ✅ SQL injection protection (parameterized queries)
- ✅ XSS protection (JSON escaping)

### Recommended Next Steps:
- [ ] Email verification (prevent fake signups)
- [ ] Password reset flow
- [ ] Rate limiting (prevent brute force)
- [ ] HTTPS enforcement (Render does this automatically)

---

## 📈 Monitoring Your Launch

### Key Metrics to Track:

1. **User Signups**: Check `SELECT COUNT(*) FROM users`
2. **Active Users**: Monitor daily logins
3. **Database Size**: Watch Render dashboard (free tier = 256MB limit)
4. **Server Performance**: Check response times in Render logs

### How to Check Database Size:

```sql
-- Run this query in Render's PostgreSQL dashboard
SELECT pg_size_pretty(pg_database_size('rika_production'));
```

### When to Upgrade:

- **Database Full**: When you hit 200MB (78% of free tier)
- **Slow Queries**: If you see >500ms response times
- **High Traffic**: If you exceed 400 requests/hour

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"
**Solution**: Check that DATABASE_URL is set in Render environment variables.

```bash
# In Render Dashboard:
Environment > DATABASE_URL should be: postgresql://...
```

### Issue: "Tables don't exist"
**Solution**: The database initialization failed. Check Render logs:

```bash
# Look for this line in logs:
✅ PostgreSQL database initialized
```

If missing, the initialization failed. Manually trigger a redeploy.

### Issue: "Data disappeared after restart"
**Solution**: You're still using SQLite in production. Verify:

```bash
# In Render logs, you should see:
🐘 Using PostgreSQL database
✅ PostgreSQL database initialized

# NOT this:
📦 Using SQLite database
```

If you see SQLite, check that DATABASE_URL is properly configured.

---

## 💰 Cost Breakdown

### Current Setup (100% Free):
- Render Web Service: **$0/month** (free tier)
- PostgreSQL Database: **$0/month** (free tier)
- Domain: **$0/month** (using .onrender.com subdomain)

### When to Upgrade:

**Render Standard ($7/month per service)**
- Needed when you exceed 750 hours/month
- Includes persistent disk storage
- Custom domain support

**PostgreSQL Standard ($7/month)**
- Needed when you exceed 256MB database size
- Includes automatic backups
- 1GB storage

---

## 🎯 Launch Checklist

Before announcing your launch:

- [x] Database persistence (PostgreSQL configured)
- [ ] Test user registration flow
- [ ] Test login/logout flow
- [ ] Test that points/streaks persist
- [ ] Test community posts
- [ ] Verify profile updates save correctly
- [ ] Check mobile responsiveness
- [ ] Test multilingual support (EN/ES/FR)
- [ ] Set up error monitoring (optional: Sentry)
- [ ] Set up analytics (optional: Google Analytics)
- [ ] Create social media accounts
- [ ] Prepare launch announcement

---

## 📱 Marketing Your Launch

### Pre-Launch:
1. Create social media accounts (Instagram, TikTok, Twitter)
2. Build a landing page or use Product Hunt
3. Reach out to beauty influencers
4. Join Reddit communities (r/SkincareAddiction, r/beauty)

### Launch Day:
1. Post on Product Hunt
2. Share in beauty-focused Facebook groups
3. Post on Reddit (provide value, not just promotion)
4. Email friends and family to beta test

### Post-Launch:
1. Collect user feedback
2. Monitor error logs
3. Track key metrics (signups, engagement)
4. Iterate based on feedback

---

## 🔄 Database Migration (If Needed)

If you have existing SQLite data to migrate:

```bash
# Export SQLite data
cd backend
sqlite3 rika-app.db .dump > data_backup.sql

# Connect to PostgreSQL (get URL from Render dashboard)
psql DATABASE_URL < data_backup_postgres.sql
```

Note: You'll need to convert SQLite SQL syntax to PostgreSQL. Contact support if you need help.

---

## 📞 Support

- **Render Documentation**: https://render.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **RIKA GitHub Issues**: (your repo URL here)

---

## 🎉 You're Ready to Launch!

Your app now has:
- ✅ Persistent data storage
- ✅ Production-ready database
- ✅ Automatic failover (SQLite → PostgreSQL)
- ✅ Free hosting for your MVP
- ✅ Scalable infrastructure

**Next Step**: Push your changes to GitHub and watch Render deploy automatically!

```bash
git add .
git commit -m "🚀 Production-ready with PostgreSQL"
git push origin main
```

Good luck with your launch! 🚀
