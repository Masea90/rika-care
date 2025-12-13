const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { initDatabase, dbHelpers } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'rika-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static('uploads'));
// Disable caching for static files to ensure updates are immediately visible
app.use(express.static('.', {
  etag: false,
  lastModified: false,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// Passport Google OAuth Configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'your-client-id.apps.googleusercontent.com',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-client-secret',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    let user = await dbHelpers.findUserByEmail(profile.emails[0].value);

    if (!user) {
      // Create new user from Google profile
      user = await dbHelpers.createUser({
        email: profile.emails[0].value,
        password: '', // No password for Google OAuth users
        googleId: profile.id,
        profile: {
          personalInfo: {
            name: profile.displayName,
            profilePicture: profile.photos?.[0]?.value
          }
        },
        subscription: { tier: 'FREE', features: ['basic_recommendations', 'community_access'] }
      });
    } else if (!user.googleId) {
      // Link Google account to existing email user
      await dbHelpers.updateUser(user.id, { googleId: profile.id });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await dbHelpers.findUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

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

// Serve rika-care.html with no-cache headers to prevent stale content
app.get('/rika-care.html', (req, res) => {
  // Set cache-control headers to prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const htmlPath = path.join(__dirname, 'rika-care.html');
  console.log('Serving HTML from:', htmlPath);

  res.sendFile(htmlPath, (err) => {
    if (err) {
      console.error('Error serving rika-care.html:', err);
      res.status(500).send(`
        <h1>RIKA Care - Error</h1>
        <p>Could not load application. File path: ${htmlPath}</p>
        <p>Working directory: ${process.cwd()}</p>
        <p>__dirname: ${__dirname}</p>
      `);
    }
  });
});

// Serve main HTML file at root - redirect to rika-care.html
app.get('/', (req, res) => {
  res.redirect('/rika-care.html');
});

// Authentication
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, profile } = req.body;
    
    const existingUser = await dbHelpers.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
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
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await dbHelpers.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
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
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'rika-secret');
    res.json({ success: true, token, user: { id: user.id, email: user.email, profile: user.profile } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Google OAuth Routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/rika-care.html?error=google_auth_failed' }),
  (req, res) => {
    // Successful authentication
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET || 'rika-secret');

    // Redirect to app with token
    res.redirect(`/rika-care.html?token=${token}&google=success`);
  }
);

// Debug endpoint to check users
app.get('/api/debug/users', (req, res) => {
  const { db } = require('./database');
  db.all('SELECT id, email, created_at FROM users', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await dbHelpers.findUserById(req.user.userId);
    delete user.password; // Remove password from response
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    await dbHelpers.updateUser(req.user.userId, { profile: req.body.profile });
    const user = await dbHelpers.findUserById(req.user.userId);
    delete user.password;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Language preferences
app.put('/api/user/language', authenticateToken, async (req, res) => {
  try {
    const { language } = req.body;
    const user = await dbHelpers.findUserById(req.user.userId);
    const profile = user.profile || {};
    profile.preferences = profile.preferences || {};
    profile.preferences.language = language;
    
    await dbHelpers.updateUser(req.user.userId, { profile });
    res.json({ success: true, language });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/language', authenticateToken, async (req, res) => {
  try {
    const user = await dbHelpers.findUserById(req.user.userId);
    const language = user.profile?.preferences?.language || 'en';
    res.json({ language });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Skin/Hair Analysis
app.post('/api/analysis/skin', authenticateToken, async (req, res) => {
  try {
    const { method, data } = req.body;
    let result;

    if (method === 'quiz') {
      result = dermatologyExpert.getSafeRecommendations(
        data.skinType, 
        data.concerns, 
        req.body.userProfile
      );
    } else if (method === 'selfie') {
      // Mock AI analysis - in production, integrate with AI service
      result = {
        skinType: 'combination',
        confidence: 0.87,
        concerns: ['oiliness', 'pores'],
        recommendations: dermatologyExpert.getSafeRecommendations('combination', ['oiliness'], req.body.userProfile)
      };
    }

    const analysis = await dbHelpers.createAnalysis({
      user_id: req.user.userId,
      type: 'skin',
      method,
      result
    });

    res.json({ analysis: result, analysisId: analysis.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/analysis/hair', authenticateToken, async (req, res) => {
  try {
    const { hairType, hairTexture, concerns } = req.body;
    
    const result = dermatologyExpert.getSafeHairRecommendations(hairType, hairTexture, concerns);
    
    const analysis = await dbHelpers.createAnalysis({
      user_id: req.user.userId,
      type: 'hair',
      method: 'quiz',
      result
    });

    res.json({ analysis: result, analysisId: analysis.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Product Recommendations with Personalized Scoring
app.get('/api/recommendations', authenticateToken, async (req, res) => {
  try {
    const user = await dbHelpers.findUserById(req.user.userId);
    const { cleanOnly } = req.query;
    
    // Get products from database
    const allProducts = await dbHelpers.getAllProducts(50);
    
    if (allProducts.length === 0) {
      return res.json({ products: [], message: 'No products available yet' });
    }
    
    // Extract user beauty profile
    const profile = user.profile || {};
    const skinProfile = profile.skinProfile || {};
    const hairProfile = profile.hairProfile || {};
    const preferences = profile.preferences || {};
    
    // Calculate personalized match scores
    const scoredProducts = allProducts.map(product => {
      const score = calculateProductScore(product, {
        skinType: skinProfile.skinType,
        hairType: hairProfile.hairType,
        skinConcerns: skinProfile.concerns || [],
        hairConcerns: hairProfile.concerns || [],
        ingredientSensitivities: preferences.avoidIngredients || [],
        cleanBeautyPreference: preferences.cleanBeauty !== false
      });
      
      return {
        ...product,
        matchScore: score.total,
        matchPercentage: Math.round(score.total),
        whyRecommended: generatePersonalizedReason(product, score.reasons),
        scoreBreakdown: score.breakdown
      };
    });
    
    // Filter by clean beauty if requested
    let filteredProducts = scoredProducts;
    if (cleanOnly === 'true') {
      filteredProducts = scoredProducts.filter(p => 
        p.flags.isNatural || p.flags.isFragranceFree || p.flags.isSulfateFree
      );
    }
    
    // Sort by match score and return top products
    const recommendedProducts = filteredProducts
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
    
    // Track recommendation views for analytics
    const analytics = user.analytics || {};
    analytics.recommendationViews = (analytics.recommendationViews || 0) + 1;
    await dbHelpers.updateUser(req.user.userId, { analytics });

    res.json({ 
      products: recommendedProducts,
      totalProducts: allProducts.length,
      filteredCount: filteredProducts.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Personalized Product Scoring Algorithm
function calculateProductScore(product, userProfile) {
  let score = 50; // Base score
  const reasons = [];
  const breakdown = {};
  
  // 1. Product Type Match (20 points max)
  if (product.type === 'skin' && userProfile.skinType) {
    const skinTypeMatch = getSkinTypeMatch(product, userProfile.skinType);
    score += skinTypeMatch;
    breakdown.skinTypeMatch = skinTypeMatch;
    if (skinTypeMatch > 10) reasons.push(`perfect for ${userProfile.skinType} skin`);
  }
  
  if (product.type === 'hair' && userProfile.hairType) {
    const hairTypeMatch = getHairTypeMatch(product, userProfile.hairType);
    score += hairTypeMatch;
    breakdown.hairTypeMatch = hairTypeMatch;
    if (hairTypeMatch > 10) reasons.push(`ideal for ${userProfile.hairType} hair`);
  }
  
  // 2. Concerns Match (25 points max)
  const concernsMatch = getConcernsMatch(product, userProfile.skinConcerns, userProfile.hairConcerns);
  score += concernsMatch;
  breakdown.concernsMatch = concernsMatch;
  if (concernsMatch > 15) reasons.push('addresses your main concerns');
  
  // 3. Clean Beauty Properties (20 points max)
  const cleanScore = getCleanBeautyScore(product, userProfile.cleanBeautyPreference);
  score += cleanScore;
  breakdown.cleanScore = cleanScore;
  if (cleanScore > 15) reasons.push('clean, natural formula');
  
  // 4. Ingredient Safety (15 points max) - DEDUCT for sensitivities
  const safetyScore = getIngredientSafetyScore(product, userProfile.ingredientSensitivities);
  score += safetyScore;
  breakdown.safetyScore = safetyScore;
  if (safetyScore < -5) reasons.push('⚠️ contains ingredients you avoid');
  
  // 5. Brand Trust & Quality (10 points max)
  const qualityScore = getQualityScore(product);
  score += qualityScore;
  breakdown.qualityScore = qualityScore;
  
  // Cap score between 0-100
  const finalScore = Math.max(0, Math.min(100, score));
  
  return {
    total: finalScore,
    reasons: reasons.slice(0, 3), // Top 3 reasons
    breakdown
  };
}

// Skin type matching logic
function getSkinTypeMatch(product, skinType) {
  const skinTypeKeywords = {
    'dry': ['ceramide', 'hyaluronic', 'glycerin', 'shea butter'],
    'oily': ['niacinamide', 'salicylic', 'clay', 'zinc'],
    'sensitive': ['gentle', 'fragrance-free', 'hypoallergenic'],
    'combination': ['balanced', 'gentle', 'non-comedogenic'],
    'normal': ['balanced', 'gentle']
  };
  
  const keywords = skinTypeKeywords[skinType?.toLowerCase()] || [];
  const productText = (product.name + ' ' + product.ingredients.join(' ')).toLowerCase();
  
  let matches = 0;
  keywords.forEach(keyword => {
    if (productText.includes(keyword.toLowerCase())) matches++;
  });
  
  return Math.min(20, matches * 5);
}

// Hair type matching logic
function getHairTypeMatch(product, hairType) {
  const hairTypeKeywords = {
    'curly': ['curl', 'coconut', 'shea', 'sulfate-free'],
    'straight': ['smooth', 'sleek', 'lightweight'],
    'wavy': ['define', 'enhance', 'frizz-free'],
    'coily': ['moisture', 'deep condition', 'natural oils']
  };
  
  const keywords = hairTypeKeywords[hairType?.toLowerCase()] || [];
  const productText = (product.name + ' ' + product.ingredients.join(' ')).toLowerCase();
  
  let matches = 0;
  keywords.forEach(keyword => {
    if (productText.includes(keyword.toLowerCase())) matches++;
  });
  
  return Math.min(20, matches * 5);
}

// Concerns matching
function getConcernsMatch(product, skinConcerns = [], hairConcerns = []) {
  const allConcerns = [...skinConcerns, ...hairConcerns];
  const concernKeywords = {
    'acne': ['salicylic', 'benzoyl', 'niacinamide', 'tea tree'],
    'dryness': ['hyaluronic', 'ceramide', 'glycerin', 'squalane'],
    'aging': ['retinol', 'vitamin c', 'peptides', 'antioxidant'],
    'sensitivity': ['gentle', 'fragrance-free', 'hypoallergenic'],
    'frizz': ['smoothing', 'anti-frizz', 'keratin', 'argan'],
    'damage': ['repair', 'protein', 'bond', 'strengthen']
  };
  
  let totalMatch = 0;
  allConcerns.forEach(concern => {
    const keywords = concernKeywords[concern?.toLowerCase()] || [];
    const productText = (product.name + ' ' + product.ingredients.join(' ')).toLowerCase();
    
    keywords.forEach(keyword => {
      if (productText.includes(keyword.toLowerCase())) {
        totalMatch += 5;
      }
    });
  });
  
  return Math.min(25, totalMatch);
}

// Clean beauty scoring
function getCleanBeautyScore(product, preferClean = true) {
  if (!preferClean) return 5; // Neutral score if user doesn't prefer clean
  
  let score = 0;
  if (product.flags.isNatural) score += 8;
  if (product.flags.isFragranceFree) score += 6;
  if (product.flags.isCrueltyFree) score += 4;
  if (product.flags.isSulfateFree) score += 4;
  if (product.flags.isParabenFree) score += 3;
  
  return Math.min(20, score);
}

// Ingredient safety scoring
function getIngredientSafetyScore(product, sensitivities = []) {
  if (sensitivities.length === 0) return 5; // Neutral if no sensitivities
  
  const productIngredients = product.ingredients.join(' ').toLowerCase();
  let deductions = 0;
  
  sensitivities.forEach(sensitivity => {
    const sensitivityLower = sensitivity.toLowerCase();
    if (productIngredients.includes(sensitivityLower)) {
      deductions -= 10; // Heavy penalty for containing avoided ingredients
    }
  });
  
  return Math.max(-15, deductions);
}

// Quality scoring based on brand and product attributes
function getQualityScore(product) {
  let score = 5; // Base quality score
  
  // Bonus for established brands (simplified)
  const trustedBrands = ['cerave', 'neutrogena', 'la roche-posay', 'the ordinary'];
  if (trustedBrands.includes(product.brand?.toLowerCase())) {
    score += 3;
  }
  
  // Bonus for having multiple clean flags
  const cleanFlags = Object.values(product.flags || {}).filter(Boolean).length;
  score += Math.min(2, cleanFlags);
  
  return Math.min(10, score);
}

// Generate personalized recommendation reason
function generatePersonalizedReason(product, reasons) {
  if (reasons.length === 0) {
    return 'Recommended based on your profile';
  }
  
  const mainReasons = reasons.slice(0, 2);
  return `Great choice - ${mainReasons.join(' and ')}`;
}

// Generate detailed recommendation for product detail page
function generateDetailedRecommendation(product, score, userProfile) {
  const reasons = [];
  
  // Skin/Hair type match
  if (product.type === 'skin' && userProfile.skinType) {
    if (product.suitability.skinType && product.suitability.skinType.includes(userProfile.skinType)) {
      reasons.push(`specifically formulated for ${userProfile.skinType} skin`);
    }
  }
  
  if (product.type === 'hair' && userProfile.hairType) {
    if (product.suitability.hairType && product.suitability.hairType.includes(userProfile.hairType)) {
      reasons.push(`perfect for ${userProfile.hairType} hair`);
    }
  }
  
  // Concerns match
  if (userProfile.concerns && userProfile.concerns.length > 0) {
    const matchingConcerns = userProfile.concerns.filter(concern => 
      product.suitability.concerns && product.suitability.concerns.includes(concern)
    );
    if (matchingConcerns.length > 0) {
      reasons.push(`addresses your ${matchingConcerns.join(' and ')} concerns`);
    }
  }
  
  // Clean beauty preferences
  if (product.clean_flags) {
    const cleanFeatures = [];
    if (product.clean_flags.sulfateFree) cleanFeatures.push('sulfate-free');
    if (product.clean_flags.fragranceFree) cleanFeatures.push('fragrance-free');
    if (product.clean_flags.natural) cleanFeatures.push('natural');
    if (cleanFeatures.length > 0) {
      reasons.push(`features a ${cleanFeatures.join(', ')} formula`);
    }
  }
  
  if (reasons.length === 0) {
    return `This ${product.type === 'skin' ? 'skincare' : 'haircare'} product matches your beauty profile and preferences.`;
  }
  
  return `RIKA recommends this because it ${reasons.slice(0, 3).join(', ')}.`;
}



app.get('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await dbHelpers.getProductById(parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Get user profile for personalized recommendations
    const user = await dbHelpers.findUserById(req.user.userId);
    const profile = user.profile || {};
    const skinProfile = profile.skinProfile || {};
    const hairProfile = profile.hairProfile || {};
    const preferences = profile.preferences || {};
    
    // Calculate match score and why recommended
    const score = calculateProductScore(product, {
      skinType: skinProfile.skinType,
      hairType: hairProfile.hairType,
      skinConcerns: skinProfile.concerns || [],
      hairConcerns: hairProfile.concerns || [],
      ingredientSensitivities: preferences.avoidIngredients || [],
      cleanBeautyPreference: preferences.cleanBeauty !== false
    });
    
    // Add personalized data to product
    const detailedProduct = {
      ...product,
      matchScore: score.total,
      matchPercentage: Math.round(score.total),
      whyRecommended: generateDetailedRecommendation(product, score, {
        skinType: skinProfile.skinType,
        hairType: hairProfile.hairType,
        concerns: [...(skinProfile.concerns || []), ...(hairProfile.concerns || [])]
      })
    };
    
    // Log analytics
    console.log(`📊 Product detail viewed: User ${req.user.userId} -> Product ${req.params.id} at ${new Date().toISOString()}`);
    
    res.json(detailedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Community Features
app.get('/api/community/feed', authenticateToken, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const posts = await dbHelpers.getCommunityFeed(req.user.userId, parseInt(limit));
    
    // Format posts for frontend
    const formattedPosts = posts.map(post => {
      const profile = post.profile || {};
      const personalInfo = profile.personalInfo || {};
      
      return {
        id: post.id,
        content: post.content,
        routineSnapshot: post.routine_snapshot,
        createdAt: post.created_at,
        likeCount: post.like_count,
        userLiked: post.user_liked,
        user: {
          name: personalInfo.name || 'Anonymous User',
          initials: getInitials(personalInfo.name || 'AU')
        }
      };
    });
    
    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/community/post', authenticateToken, async (req, res) => {
  try {
    const { content, routineSnapshot } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    if (content.length > 280) {
      return res.status(400).json({ error: 'Content must be 280 characters or less' });
    }
    
    const post = await dbHelpers.createCommunityPost({
      user_id: req.user.userId,
      content: content.trim(),
      routine_snapshot: routineSnapshot,
      visibility: 'PUBLIC'
    });
    
    // Get user info for response
    const user = await dbHelpers.findUserById(req.user.userId);
    const personalInfo = user.profile?.personalInfo || {};
    
    const responsePost = {
      id: post.id,
      content: post.content,
      routineSnapshot: post.routine_snapshot,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      userLiked: false,
      user: {
        name: personalInfo.name || 'Anonymous User',
        initials: getInitials(personalInfo.name || 'AU')
      }
    };
    
    console.log(`📝 Community post created: User ${req.user.userId} - "${content.substring(0, 50)}..."`);
    res.json(responsePost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/community/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.body;
    
    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }
    
    const result = await dbHelpers.toggleCommunityLike(parseInt(postId), req.user.userId);
    console.log(`❤️ Post ${result.action}: User ${req.user.userId} -> Post ${postId}`);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to get user initials
function getInitials(name) {
  if (!name) return 'AU';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}



app.post('/api/community/posts', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    const { title, content, type, tags } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];

    const post = await dbHelpers.createPost({
      user_id: req.user.userId,
      title,
      content,
      type,
      tags: JSON.parse(tags || '[]'),
      images
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/community/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.userId;

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes.length, isLiked: post.likes.includes(userId) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routine Tracking
app.get('/api/routines', authenticateToken, async (req, res) => {
  try {
    const routines = await dbHelpers.getUserRoutines(req.user.userId, 30);
    res.json(routines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/routines', authenticateToken, async (req, res) => {
  try {
    const routine = await dbHelpers.createRoutine({
      user_id: req.user.userId,
      ...req.body
    });
    
    // Update user streak
    const user = await dbHelpers.findUserById(req.user.userId);
    const analytics = user.analytics || {};
    analytics.totalRoutines = (analytics.totalRoutines || 0) + 1;
    await dbHelpers.updateUser(req.user.userId, { analytics });

    res.json(routine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profile Verification
app.post('/api/user/verify', authenticateToken, async (req, res) => {
  try {
    const { method, data } = req.body; // method: 'email', 'phone', 'social'
    
    // Mock verification process
    const verification = {
      status: 'verified',
      method,
      verifiedAt: new Date().toISOString(),
      data: method === 'email' ? { email: data.email } : 
            method === 'phone' ? { phone: data.phone } :
            { platform: data.platform, username: data.username }
    };
    
    await dbHelpers.updateUser(req.user.userId, { verification });
    
    res.json({ success: true, verification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/verification-status', authenticateToken, async (req, res) => {
  try {
    const user = await dbHelpers.findUserById(req.user.userId);
    res.json({ verification: user.verification || { status: 'unverified' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Followers System
app.post('/api/user/follow/:userId', authenticateToken, async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.userId);
    const currentUserId = req.user.userId;
    
    if (targetUserId === currentUserId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    const currentUser = await dbHelpers.findUserById(currentUserId);
    const targetUser = await dbHelpers.findUserById(targetUserId);
    
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const following = currentUser.following || [];
    const followers = targetUser.followers || [];
    
    const isFollowing = following.includes(targetUserId);
    
    if (isFollowing) {
      // Unfollow
      const newFollowing = following.filter(id => id !== targetUserId);
      const newFollowers = followers.filter(id => id !== currentUserId);
      
      await dbHelpers.updateUser(currentUserId, { following: newFollowing });
      await dbHelpers.updateUser(targetUserId, { followers: newFollowers });
      
      res.json({ following: false, followersCount: newFollowers.length });
    } else {
      // Follow
      following.push(targetUserId);
      followers.push(currentUserId);
      
      await dbHelpers.updateUser(currentUserId, { following });
      await dbHelpers.updateUser(targetUserId, { followers });
      
      // Check if user qualifies for influencer status
      await checkInfluencerStatus(targetUserId, followers.length);
      
      res.json({ following: true, followersCount: followers.length });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/:userId/followers', authenticateToken, async (req, res) => {
  try {
    const user = await dbHelpers.findUserById(parseInt(req.params.userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const followers = user.followers || [];
    res.json({ 
      count: followers.length,
      followers: followers.slice(0, 50) // Limit for performance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Influencer Program
app.get('/api/influencer/status', authenticateToken, async (req, res) => {
  try {
    const user = await dbHelpers.findUserById(req.user.userId);
    const followersCount = (user.followers || []).length;
    const influencerStatus = user.influencer_status || {};
    
    res.json({
      followersCount,
      status: influencerStatus,
      eligibility: getInfluencerEligibility(followersCount, user)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/influencer/apply', authenticateToken, async (req, res) => {
  try {
    const user = await dbHelpers.findUserById(req.user.userId);
    const followersCount = (user.followers || []).length;
    
    if (followersCount < 100) {
      return res.status(400).json({ error: 'Minimum 100 followers required' });
    }
    
    const influencerStatus = {
      status: 'pending',
      appliedAt: new Date().toISOString(),
      tier: followersCount >= 1000 ? 'gold' : followersCount >= 500 ? 'silver' : 'bronze',
      commission: followersCount >= 1000 ? 0.15 : followersCount >= 500 ? 0.12 : 0.08
    };
    
    await dbHelpers.updateUser(req.user.userId, { influencer_status: influencerStatus });
    
    res.json({ success: true, status: influencerStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
async function checkInfluencerStatus(userId, followersCount) {
  if (followersCount >= 100) {
    const user = await dbHelpers.findUserById(userId);
    const currentStatus = user.influencer_status || {};
    
    if (!currentStatus.status || currentStatus.status === 'none') {
      const newStatus = {
        status: 'eligible',
        eligibleAt: new Date().toISOString(),
        tier: followersCount >= 1000 ? 'gold' : followersCount >= 500 ? 'silver' : 'bronze'
      };
      
      await dbHelpers.updateUser(userId, { influencer_status: newStatus });
    }
  }
}

function getInfluencerEligibility(followersCount, user) {
  if (followersCount < 100) {
    return {
      eligible: false,
      requirement: '100 followers needed',
      remaining: 100 - followersCount
    };
  }
  
  return {
    eligible: true,
    tier: followersCount >= 1000 ? 'gold' : followersCount >= 500 ? 'silver' : 'bronze',
    commission: followersCount >= 1000 ? '15%' : followersCount >= 500 ? '12%' : '8%',
    benefits: [
      'Earn commission on product recommendations',
      'Early access to new products',
      'Featured in community feed',
      'Monthly bonus payments'
    ]
  };
}

// Community Matching with Visibility Filters
app.get('/api/community/matches', authenticateToken, async (req, res) => {
  try {
    const user = await dbHelpers.findUserById(req.user.userId);
    const userGender = user.profile?.personalInfo?.gender;
    const userVisibility = user.profile?.community?.profileVisibility || 'all';
    
    // Build visibility filter
    let visibilityFilter = '';
    if (userVisibility === 'women') {
      visibilityFilter = ` AND JSON_EXTRACT(profile, '$.personalInfo.gender') = 'female'`;
    } else if (userVisibility === 'men') {
      visibilityFilter = ` AND JSON_EXTRACT(profile, '$.personalInfo.gender') = 'male'`;
    }
    
    // Also respect other users' visibility preferences
    let genderFilter = '';
    if (userGender) {
      genderFilter = ` AND (
        JSON_EXTRACT(profile, '$.community.profileVisibility') = 'all' OR
        (JSON_EXTRACT(profile, '$.community.profileVisibility') = 'women' AND '${userGender}' = 'female') OR
        (JSON_EXTRACT(profile, '$.community.profileVisibility') = 'men' AND '${userGender}' = 'male')
      )`;
    }
    
    const query = `
      SELECT id, profile, verification 
      FROM users 
      WHERE id != ? 
      AND JSON_EXTRACT(profile, '$.community.allowMatching') = 1
      ${visibilityFilter}
      ${genderFilter}
      ORDER BY 
        CASE WHEN JSON_EXTRACT(verification, '$.status') = 'verified' THEN 0 ELSE 1 END,
        created_at DESC
      LIMIT 20
    `;
    
    const matches = await new Promise((resolve, reject) => {
      db.all(query, [req.user.userId], (err, rows) => {
        if (err) reject(err);
        else {
          const processedMatches = rows.map(row => ({
            ...row,
            profile: JSON.parse(row.profile || '{}'),
            verification: JSON.parse(row.verification || '{}')
          }));
          resolve(processedMatches);
        }
      });
    });
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subscription Management
app.post('/api/subscription/upgrade', authenticateToken, async (req, res) => {
  try {
    const { tier, paymentMethod } = req.body;
    
    // Mock payment processing - integrate with Stripe/PayPal in production
    const subscription = {
      tier,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      features: monetizationService.subscriptionTiers[tier].features,
      paymentMethod
    };

    await dbHelpers.updateUser(req.user.userId, { subscription });
    
    res.json({ success: true, subscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics & Monetization
app.get('/api/analytics/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await dbHelpers.findUserById(req.user.userId);
    const userBehavior = {
      dailyActiveMinutes: user.analytics?.dailyActiveMinutes || 0,
      communityInteractions: user.analytics?.communityInteractions || 0,
      productViews: user.analytics?.productViews || 0,
      app_usage: user.analytics?.appUsage || 0
    };

    const monetizationStrategy = monetizationService.getPersonalizedMonetizationStrategy(
      user.profile, 
      userBehavior
    );

    res.json({
      userStats: user.analytics,
      monetizationStrategy,
      recommendations: monetizationService.identifyUpsellOpportunities(user.profile, userBehavior)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Points & Rewards System
app.get('/api/points', authenticateToken, async (req, res) => {
  try {
    const points = await dbHelpers.getPoints(req.user.userId);
    res.json(points);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/points/add', authenticateToken, async (req, res) => {
  try {
    const { action, points } = req.body;
    
    if (!action || !points || points <= 0) {
      return res.status(400).json({ error: 'Invalid action or points' });
    }
    
    const result = await dbHelpers.addPoints(req.user.userId, action, points);
    console.log(`⭐ Points added: User ${req.user.userId} +${points} for ${action}`);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rewards endpoints
app.get('/api/rewards', authenticateToken, async (req, res) => {
  try {
    const rewards = await dbHelpers.getAllRewards();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/rewards/redeem', authenticateToken, async (req, res) => {
  try {
    const { rewardId } = req.body;
    
    if (!rewardId) {
      return res.status(400).json({ error: 'Reward ID is required' });
    }
    
    const result = await dbHelpers.redeemReward(req.user.userId, parseInt(rewardId));
    console.log(`🎁 Reward redeemed: User ${req.user.userId} - ${result.reward}`);
    res.json(result);
  } catch (error) {
    if (error.message.includes('more points')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Chat endpoint
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Build user context
    const userContext = await buildUserContext(req.user.userId);
    
    // Generate AI response
    const response = generateAIResponse(message, userContext, history);
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Streak endpoints
app.get('/api/streaks', authenticateToken, async (req, res) => {
  try {
    const streak = await dbHelpers.getStreak(req.user.userId);
    res.json(streak);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/routines/complete-day', authenticateToken, async (req, res) => {
  try {
    const completion = await dbHelpers.completeRoutineDay(req.user.userId);
    
    if (completion.alreadyCompleted) {
      const streak = await dbHelpers.getStreak(req.user.userId);
      return res.json({ message: 'Already completed today', streak });
    }
    
    // Update streak
    const streak = await dbHelpers.updateStreak(req.user.userId);
    
    // Award points for daily completion
    await dbHelpers.addPoints(req.user.userId, 'Daily routine completion', 5);
    
    // Check for streak milestones and award bonus points
    if (streak.currentStreak === 7) {
      await dbHelpers.addPoints(req.user.userId, '7-day streak milestone', 30);
    } else if (streak.currentStreak === 14) {
      await dbHelpers.addPoints(req.user.userId, '14-day streak milestone', 50);
    } else if (streak.currentStreak === 30) {
      await dbHelpers.addPoints(req.user.userId, '30-day streak milestone', 100);
    }
    
    console.log(`🔥 Streak updated: User ${req.user.userId} - ${streak.currentStreak} days`);
    res.json({ streak, milestone: getMilestoneMessage(streak.currentStreak) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function for milestone messages
function getMilestoneMessage(streak) {
  if (streak === 7) return '🎉 7-day streak! You\'re glowing, keep it up!';
  if (streak === 14) return '🌟 14-day streak! Your consistency is amazing!';
  if (streak === 30) return '🏆 30-day streak! You\'re a beauty routine champion!';
  return null;
}

// Build user context for AI chat
async function buildUserContext(userId) {
  try {
    const [user, points, streak, routines, products] = await Promise.all([
      dbHelpers.findUserById(userId),
      dbHelpers.getPoints(userId).catch(() => ({ totalPoints: 0 })),
      dbHelpers.getStreak(userId).catch(() => ({ currentStreak: 0, longestStreak: 0 })),
      dbHelpers.hasCompletedRoutineToday(userId).catch(() => false),
      getTopRecommendations(userId).catch(() => [])
    ]);
    
    const profile = user.profile || {};
    const skinProfile = profile.skinProfile || {};
    const hairProfile = profile.hairProfile || {};
    const preferences = profile.preferences || {};
    
    return {
      user: {
        name: profile.personalInfo?.name || 'there',
        skinType: skinProfile.skinType,
        skinConcerns: skinProfile.concerns || [],
        hairType: hairProfile.type,
        hairConcerns: hairProfile.concerns || [],
        sensitivities: preferences.avoidIngredients || []
      },
      routine: {
        completedToday: routines
      },
      points: {
        total: points.totalPoints,
        streak: streak.currentStreak
      },
      recommendations: products.slice(0, 3),
      community: await getCommunityStats(skinProfile.skinType, hairProfile.type)
    };
  } catch (error) {
    console.error('Error building user context:', error);
    return { user: { name: 'there' }, routine: {}, points: {}, recommendations: [], community: {} };
  }
}

// Get top recommendations for user
async function getTopRecommendations(userId) {
  try {
    const user = await dbHelpers.findUserById(userId);
    const allProducts = await dbHelpers.getAllProducts(10);
    
    if (allProducts.length === 0) return [];
    
    const profile = user.profile || {};
    const skinProfile = profile.skinProfile || {};
    const hairProfile = profile.hairProfile || {};
    const preferences = profile.preferences || {};
    
    return allProducts.map(product => {
      const score = calculateProductScore(product, {
        skinType: skinProfile.skinType,
        hairType: hairProfile.type,
        skinConcerns: skinProfile.concerns || [],
        hairConcerns: hairProfile.concerns || [],
        ingredientSensitivities: preferences.avoidIngredients || [],
        cleanBeautyPreference: preferences.cleanBeauty !== false
      });
      
      return {
        ...product,
        matchScore: score.total,
        whyRecommended: generatePersonalizedReason(product, score.reasons)
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    return [];
  }
}

// Get community stats (aggregated, anonymous)
async function getCommunityStats(skinType, hairType) {
  try {
    const stats = {};
    
    if (skinType) {
      const skinCount = await new Promise((resolve) => {
        db.get(
          `SELECT COUNT(*) as count FROM users WHERE JSON_EXTRACT(profile, '$.skinProfile.skinType') = ?`,
          [skinType],
          (err, row) => resolve(row?.count || 0)
        );
      });
      stats.similarSkinUsers = skinCount;
    }
    
    if (hairType) {
      const hairCount = await new Promise((resolve) => {
        db.get(
          `SELECT COUNT(*) as count FROM users WHERE JSON_EXTRACT(profile, '$.hairProfile.type') = ?`,
          [hairType],
          (err, row) => resolve(row?.count || 0)
        );
      });
      stats.similarHairUsers = hairCount;
    }
    
    return stats;
  } catch (error) {
    return {};
  }
}

// Generate AI response using rule-based logic
function generateAIResponse(message, context, history) {
  const msg = message.toLowerCase();
  const user = context.user || {};
  const recommendations = context.recommendations || [];
  const points = context.points || {};
  const community = context.community || {};
  
  let reply = '';
  let suggestedFollowUps = [];
  
  // Greeting patterns
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    reply = `Hi ${user.name}! I'm your RIKA Care AI assistant. I'm here to help with your skincare and haircare journey. `;
    if (user.skinType) {
      reply += `I see you have ${user.skinType} skin. `;
    }
    reply += `What would you like to know about today?`;
    suggestedFollowUps = ['What products do you recommend for me?', 'How is my routine going?', 'Tell me about my skin type'];
  }
  
  // Product recommendation requests
  else if (msg.includes('recommend') || msg.includes('product') || msg.includes('suggest')) {
    if (recommendations.length > 0) {
      const topProduct = recommendations[0];
      reply = `Based on your ${user.skinType || 'unique'} skin profile, I'd recommend trying ${topProduct.name} by ${topProduct.brand}. `;
      reply += `${topProduct.whyRecommended} `;
      if (community.similarSkinUsers > 1) {
        reply += `Many RIKA Care users with ${user.skinType} skin like you have found this helpful.`;
      }
    } else {
      reply = `I'd love to give you personalized recommendations! Complete your beauty profile first so I can suggest products that match your ${user.skinType || ''} skin and specific concerns.`;
    }
    suggestedFollowUps = ['Tell me more about this product', 'What about hair products?', 'How do I use this?'];
  }
  
  // Skin-related questions
  else if (msg.includes('skin') || msg.includes('face') || msg.includes('acne') || msg.includes('dry')) {
    if (user.skinType) {
      reply = `For your ${user.skinType} skin, `;
      if (user.skinConcerns.length > 0) {
        reply += `I understand you're dealing with ${user.skinConcerns.join(' and ')}. `;
      }
      reply += `Focus on gentle, consistent routines. `;
      if (user.sensitivities.length > 0) {
        reply += `Since you avoid ${user.sensitivities.join(', ')}, look for products that are free from these ingredients. `;
      }
      if (recommendations.length > 0) {
        const skinProduct = recommendations.find(p => p.type === 'skin');
        if (skinProduct) {
          reply += `I'd suggest checking out ${skinProduct.name} - it's formulated for your skin type.`;
        }
      }
    } else {
      reply = `I'd love to help with your skincare! First, let me learn about your skin type and concerns through your beauty profile. This helps me give you the most relevant advice.`;
    }
    suggestedFollowUps = ['What ingredients should I avoid?', 'How often should I use products?', 'Tell me about my routine'];
  }
  
  // Hair-related questions
  else if (msg.includes('hair') || msg.includes('scalp') || msg.includes('frizz') || msg.includes('curl')) {
    if (user.hairType) {
      reply = `With your ${user.hairType} hair, `;
      if (user.hairConcerns.length > 0) {
        reply += `I see you're concerned about ${user.hairConcerns.join(' and ')}. `;
      }
      reply += `The key is using products designed for your hair texture. `;
      if (recommendations.length > 0) {
        const hairProduct = recommendations.find(p => p.type === 'hair');
        if (hairProduct) {
          reply += `${hairProduct.name} could be perfect for you - ${hairProduct.whyRecommended.toLowerCase()}`;
        }
      }
      if (community.similarHairUsers > 1) {
        reply += ` Many users with ${user.hairType} hair in our community have seen great results with consistent care.`;
      }
    } else {
      reply = `Hair care is so personal! Tell me about your hair type and concerns in your profile, and I can give you much more targeted advice.`;
    }
    suggestedFollowUps = ['What hair products do you recommend?', 'How do I reduce frizz?', 'Tell me about sulfate-free options'];
  }
  
  // Routine and progress questions
  else if (msg.includes('routine') || msg.includes('progress') || msg.includes('streak')) {
    reply = `You're doing great with your beauty journey! `;
    if (context.routine.completedToday) {
      reply += `I see you've completed your routine today - that's fantastic! `;
    }
    if (points.streak > 0) {
      reply += `Your ${points.streak}-day streak shows real commitment. `;
    }
    if (points.total > 0) {
      reply += `You've earned ${points.total} points so far, which shows how engaged you are with your self-care. `;
    }
    reply += `Consistency is key in skincare and haircare - small daily steps lead to the best results.`;
    suggestedFollowUps = ['How can I improve my routine?', 'What products should I add?', 'Tell me about my points'];
  }
  
  // Points and rewards questions
  else if (msg.includes('point') || msg.includes('reward') || msg.includes('earn')) {
    reply = `You currently have ${points.total || 0} points! You earn points by completing routines, engaging with the community, and maintaining streaks. `;
    if (points.streak > 0) {
      reply += `Your current ${points.streak}-day streak is helping you earn bonus points. `;
    }
    reply += `Points can be redeemed for discounts, free samples, and exclusive consultations in our rewards store.`;
    suggestedFollowUps = ['How do I earn more points?', 'What rewards are available?', 'Tell me about streaks'];
  }
  
  // Ingredient questions
  else if (msg.includes('ingredient') || msg.includes('avoid') || msg.includes('sensitive')) {
    if (user.sensitivities.length > 0) {
      reply = `I see you avoid ${user.sensitivities.join(', ')}. This is smart for maintaining healthy skin! `;
      reply += `Always check ingredient lists, and look for products specifically labeled as free from these ingredients. `;
    } else {
      reply = `Ingredient awareness is so important! Common ingredients to watch for include fragrances, sulfates, and parabens if you have sensitive skin. `;
    }
    reply += `RIKA Care's clean beauty filters can help you find products that match your preferences.`;
    suggestedFollowUps = ['What are clean beauty products?', 'How do I read ingredient lists?', 'Show me fragrance-free options'];
  }
  
  // Default response
  else {
    reply = `I'm here to help with your skincare and haircare questions! `;
    if (user.skinType || user.hairType) {
      reply += `I know about your ${user.skinType ? user.skinType + ' skin' : ''}${user.skinType && user.hairType ? ' and ' : ''}${user.hairType ? user.hairType + ' hair' : ''}, so feel free to ask specific questions. `;
    }
    reply += `What would you like to know about?`;
    suggestedFollowUps = ['Recommend products for me', 'Help with my routine', 'Tell me about ingredients', 'How do I earn points?'];
  }
  
  return {
    reply: reply.trim(),
    suggestedFollowUps
  };
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 RIKA App Server running on port ${PORT}`);
  console.log(`📊 Analytics enabled`);
  console.log(`💰 Monetization services active`);
  console.log(`🔒 Security middleware loaded`);
});

module.exports = app;