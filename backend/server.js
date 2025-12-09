const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { initDatabase, dbHelpers } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '.')));
app.use(express.static(path.join(__dirname, '..')));

// Initialize SQLite database
initDatabase().then(() => {
  console.log('✅ SQLite database initialized');
  
  // Initialize with sample data in production if needed
  if (NODE_ENV === 'production') {
    console.log('🚀 Production database ready');
  }
}).catch(err => {
  console.error('❌ Database initialization failed:', err);
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// SQLite database helpers (replacing Mongoose models)

// Import services
const { recommendationEngine } = require('../shared/recommendationEngine');
const { monetizationService } = require('./monetizationService');
const { dermatologyExpert } = require('../shared/dermatologyExpert');

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'rika-secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Serve main HTML file at root and /app.html
const serveMainApp = (req, res) => {
  const htmlPath1 = path.join(__dirname, 'rika-care.html');
  const htmlPath2 = path.join(__dirname, '../rika-care.html');

  res.sendFile(htmlPath1, (err) => {
    if (err) {
      res.sendFile(htmlPath2, (err2) => {
        if (err2) {
          console.error('Error serving HTML file:', err2);
          res.status(500).send(`
            <h1>RIKA Care</h1>
            <p>✅ Backend is running!</p>
            <p>API Status: Ready</p>
          `);
        }
      });
    }
  });
};

app.get('/', serveMainApp);
app.get('/app.html', serveMainApp);

// Authentication
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, profile } = req.body;
    
    const existingUser = await dbHelpers.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists', error: 'User already exists' });
    }

    // Ensure user has a name - extract from email if not provided
    const userProfile = profile || {};
    if (!userProfile.personalInfo) {
      userProfile.personalInfo = {};
    }
    if (!userProfile.personalInfo.name) {
      userProfile.personalInfo.name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await dbHelpers.createUser({
      email,
      password: hashedPassword,
      profile: userProfile,
      subscription: { tier: 'FREE', features: ['basic_recommendations', 'community_access'] }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'rika-secret');
    res.json({ success: true, token, user: { id: user.id, email: user.email, profile: user.profile } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await dbHelpers.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', error: 'Invalid credentials' });
    }

    // Check if password is hashed (starts with $2a$ or $2b$) or plain text (legacy)
    let passwordValid = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      passwordValid = await bcrypt.compare(password, user.password);
    } else {
      // Legacy plain text password - hash it and update
      passwordValid = user.password === password;
      if (passwordValid) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await dbHelpers.updateUser(user.id, { password: hashedPassword });
      }
    }

    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'rika-secret');
    res.json({ success: true, token, user: { id: user.id, email: user.email, profile: user.profile } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await dbHelpers.findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ profile: user.profile, email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { profile } = req.body;
    await dbHelpers.updateUser(req.user.userId, { profile });
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Products
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const cleanOnly = req.query.cleanOnly === 'true';

    let products = await dbHelpers.getAllProducts(limit);

    if (cleanOnly) {
      products = products.filter(p => p.isCleanBeauty || p.flags?.isNatural);
    }

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await dbHelpers.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Routines
app.get('/api/routines', authenticateToken, async (req, res) => {
  try {
    const routines = await dbHelpers.getUserRoutines(req.user.userId);
    res.json({ routines });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/routines', authenticateToken, async (req, res) => {
  try {
    const routine = await dbHelpers.createRoutine({
      user_id: req.user.userId,
      ...req.body
    });
    res.json({ success: true, routine });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/routines/complete-day', authenticateToken, async (req, res) => {
  try {
    const result = await dbHelpers.completeRoutineDay(req.user.userId);

    if (result.alreadyCompleted) {
      return res.json({
        success: true,
        alreadyCompleted: true,
        message: 'Already completed today'
      });
    }

    // Update streak
    const streak = await dbHelpers.updateStreak(req.user.userId);

    // Add points
    const points = await dbHelpers.addPoints(req.user.userId, 'Completed daily routine', 10);

    res.json({
      success: true,
      alreadyCompleted: false,
      streak,
      points: points.totalPoints
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Points
app.get('/api/points', authenticateToken, async (req, res) => {
  try {
    const points = await dbHelpers.getPoints(req.user.userId);
    res.json(points);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/points/add', authenticateToken, async (req, res) => {
  try {
    const { action, points } = req.body;
    const result = await dbHelpers.addPoints(req.user.userId, action, points);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Streaks
app.get('/api/streaks', authenticateToken, async (req, res) => {
  try {
    const streak = await dbHelpers.getStreak(req.user.userId);
    res.json(streak);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Rewards
app.get('/api/rewards', authenticateToken, async (req, res) => {
  try {
    const rewards = await dbHelpers.getAllRewards();
    const userPoints = await dbHelpers.getPoints(req.user.userId);

    res.json({
      rewards,
      userPoints: userPoints.totalPoints
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/rewards/redeem', authenticateToken, async (req, res) => {
  try {
    const { rewardId } = req.body;
    const result = await dbHelpers.redeemReward(req.user.userId, rewardId);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Community Feed
app.get('/api/community/feed', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const posts = await dbHelpers.getCommunityFeed(req.user.userId, limit);
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/community/posts', authenticateToken, async (req, res) => {
  try {
    const post = await dbHelpers.createCommunityPost({
      user_id: req.user.userId,
      ...req.body
    });
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/community/like/:postId', authenticateToken, async (req, res) => {
  try {
    const result = await dbHelpers.toggleCommunityLike(req.params.postId, req.user.userId);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 RIKA App Server running on port ${PORT}`);
});

module.exports = app;