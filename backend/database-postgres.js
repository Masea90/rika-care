const { Pool } = require('pg');

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        googleId TEXT,
        profile JSONB DEFAULT '{}',
        subscription JSONB DEFAULT '{}',
        analytics JSONB DEFAULT '{}',
        following JSONB DEFAULT '[]',
        followers JSONB DEFAULT '[]',
        verification JSONB DEFAULT '{}',
        influencer_status JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT,
        type TEXT,
        category TEXT,
        price DECIMAL(10,2),
        ingredients JSONB DEFAULT '[]',
        flags JSONB DEFAULT '{}',
        rating DECIMAL(3,2),
        reviews_count INTEGER DEFAULT 0,
        image_url TEXT,
        affiliate_url TEXT,
        full_description TEXT,
        benefits JSONB DEFAULT '[]',
        how_to_use TEXT,
        full_ingredient_list TEXT,
        clean_flags JSONB DEFAULT '{}',
        suitability JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Posts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT,
        content TEXT,
        type TEXT,
        tags JSONB DEFAULT '[]',
        images JSONB DEFAULT '[]',
        is_public BOOLEAN DEFAULT true,
        likes JSONB DEFAULT '[]',
        comments JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Routines table
    await client.query(`
      CREATE TABLE IF NOT EXISTS routines (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type TEXT,
        products JSONB DEFAULT '[]',
        completed BOOLEAN DEFAULT false,
        notes TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Analysis table
    await client.query(`
      CREATE TABLE IF NOT EXISTS analysis (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type TEXT,
        method TEXT,
        result JSONB,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User Points table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_points (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        total_points INTEGER DEFAULT 0,
        history JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Rewards table
    await client.query(`
      CREATE TABLE IF NOT EXISTS rewards (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        required_points INTEGER NOT NULL,
        type TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Community Posts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS community_posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        routine_snapshot JSONB,
        visibility TEXT DEFAULT 'PUBLIC',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Community Likes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS community_likes (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id)
      )
    `);

    // User Streaks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_streaks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_activity_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query('COMMIT');
    console.log('✅ PostgreSQL database initialized');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Helper functions for database operations
const dbHelpers = {
  // User operations
  createUser: async (userData) => {
    const { email, password, profile, subscription } = userData;
    const result = await pool.query(
      'INSERT INTO users (email, password, profile, subscription) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, password, profile, subscription]
    );
    return result.rows[0];
  },

  findUserByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  findUserById: async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  updateUser: async (id, updates) => {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');

    await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1}`,
      [...values, id]
    );
  },

  // Analysis operations
  createAnalysis: async (analysisData) => {
    const { user_id, type, method, result } = analysisData;
    const queryResult = await pool.query(
      'INSERT INTO analysis (user_id, type, method, result) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, type, method, result]
    );
    return queryResult.rows[0];
  },

  // Post operations
  createPost: async (postData) => {
    const { user_id, title, content, type, tags, images } = postData;
    const result = await pool.query(
      'INSERT INTO posts (user_id, title, content, type, tags, images) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, title, content, type, tags, images]
    );
    return result.rows[0];
  },

  getPosts: async (limit = 10, offset = 0) => {
    const result = await pool.query(
      `SELECT p.*, u.profile as user_profile
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.is_public = true
       ORDER BY p.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  // Routine operations
  createRoutine: async (routineData) => {
    const { user_id, type, products, completed, notes } = routineData;
    const result = await pool.query(
      'INSERT INTO routines (user_id, type, products, completed, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, type, products, completed, notes]
    );
    return result.rows[0];
  },

  completeRoutineDay: async (userId) => {
    const today = new Date().toISOString().split('T')[0];

    // Check if already completed today
    const checkResult = await pool.query(
      'SELECT COUNT(*) as count FROM routines WHERE user_id = $1 AND DATE(date) = $2 AND completed = true',
      [userId, today]
    );

    if (parseInt(checkResult.rows[0].count) > 0) {
      return { alreadyCompleted: true };
    }

    // Mark as completed
    const result = await pool.query(
      'INSERT INTO routines (user_id, type, products, completed, notes, date) VALUES ($1, $2, $3, true, $4, $5) RETURNING *',
      [userId, 'daily', JSON.stringify(['Daily routine completion']), 'Completed daily routine', today]
    );

    return { alreadyCompleted: false, routineId: result.rows[0].id };
  },

  getUserRoutines: async (userId, limit = 30) => {
    const result = await pool.query(
      'SELECT * FROM routines WHERE user_id = $1 ORDER BY date DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  },

  hasCompletedRoutineToday: async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM routines WHERE user_id = $1 AND DATE(date) = $2 AND completed = true',
      [userId, today]
    );
    return parseInt(result.rows[0].count) > 0;
  },

  // Product operations
  getAllProducts: async (limit = 20) => {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows.map(row => ({
      ...row,
      type: row.category || row.type
    }));
  },

  getProductById: async (id) => {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows[0]) {
      result.rows[0].type = result.rows[0].category || result.rows[0].type;
    }
    return result.rows[0];
  },

  // Points operations
  addPoints: async (userId, action, points) => {
    const existingResult = await pool.query('SELECT * FROM user_points WHERE user_id = $1', [userId]);

    const historyEntry = {
      action,
      points,
      timestamp: new Date().toISOString()
    };

    if (existingResult.rows.length > 0) {
      const row = existingResult.rows[0];
      const currentHistory = row.history || [];
      const newHistory = [...currentHistory, historyEntry];
      const newTotal = row.total_points + points;

      await pool.query(
        'UPDATE user_points SET total_points = $1, history = $2 WHERE user_id = $3',
        [newTotal, JSON.stringify(newHistory), userId]
      );

      return { totalPoints: newTotal, added: points };
    } else {
      await pool.query(
        'INSERT INTO user_points (user_id, total_points, history) VALUES ($1, $2, $3)',
        [userId, points, JSON.stringify([historyEntry])]
      );

      return { totalPoints: points, added: points };
    }
  },

  getPoints: async (userId) => {
    const result = await pool.query('SELECT * FROM user_points WHERE user_id = $1', [userId]);

    if (result.rows.length > 0) {
      return {
        totalPoints: result.rows[0].total_points,
        history: result.rows[0].history || []
      };
    }

    return { totalPoints: 0, history: [] };
  },

  redeemReward: async (userId, rewardId) => {
    const rewardResult = await pool.query('SELECT * FROM rewards WHERE id = $1 AND is_active = true', [rewardId]);

    if (rewardResult.rows.length === 0) {
      throw new Error('Reward not found or inactive');
    }

    const reward = rewardResult.rows[0];
    const pointsResult = await pool.query('SELECT * FROM user_points WHERE user_id = $1', [userId]);
    const currentPoints = pointsResult.rows.length > 0 ? pointsResult.rows[0].total_points : 0;

    if (currentPoints < reward.required_points) {
      const needed = reward.required_points - currentPoints;
      throw new Error(`You need ${needed} more points to redeem this reward.`);
    }

    const historyEntry = {
      action: 'REDEEM',
      rewardId: reward.id,
      rewardName: reward.name,
      pointsUsed: reward.required_points,
      timestamp: new Date().toISOString()
    };

    const currentHistory = pointsResult.rows[0]?.history || [];
    const newHistory = [...currentHistory, historyEntry];
    const newTotal = currentPoints - reward.required_points;

    if (pointsResult.rows.length > 0) {
      await pool.query(
        'UPDATE user_points SET total_points = $1, history = $2 WHERE user_id = $3',
        [newTotal, JSON.stringify(newHistory), userId]
      );
    } else {
      await pool.query(
        'INSERT INTO user_points (user_id, total_points, history) VALUES ($1, $2, $3)',
        [userId, newTotal, JSON.stringify(newHistory)]
      );
    }

    return {
      totalPoints: newTotal,
      redeemed: reward.required_points,
      reward: reward.name
    };
  },

  createProduct: async (productData) => {
    const {
      name, brand, category, price, ingredients, affiliate_url,
      full_description, benefits, how_to_use, full_ingredient_list,
      clean_flags, suitability, image_url
    } = productData;

    const result = await pool.query(
      `INSERT INTO products (
        name, brand, category, price, ingredients, affiliate_url,
        full_description, benefits, how_to_use, full_ingredient_list,
        clean_flags, suitability, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        name, brand, category, price, ingredients, affiliate_url,
        full_description, benefits, how_to_use, full_ingredient_list,
        clean_flags, suitability, image_url
      ]
    );

    return result.rows[0];
  },

  // Rewards operations
  getAllRewards: async () => {
    const result = await pool.query('SELECT * FROM rewards WHERE is_active = true ORDER BY required_points ASC');
    return result.rows;
  },

  getRewardById: async (id) => {
    const result = await pool.query('SELECT * FROM rewards WHERE id = $1 AND is_active = true', [id]);
    return result.rows[0];
  },

  createReward: async (rewardData) => {
    const { name, description, required_points, type } = rewardData;
    const result = await pool.query(
      'INSERT INTO rewards (name, description, required_points, type) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, required_points, type]
    );
    return result.rows[0];
  },

  // Community operations
  createCommunityPost: async (postData) => {
    const { user_id, content, routine_snapshot, visibility } = postData;
    const result = await pool.query(
      'INSERT INTO community_posts (user_id, content, routine_snapshot, visibility) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, content, routine_snapshot || null, visibility || 'PUBLIC']
    );
    return result.rows[0];
  },

  getCommunityFeed: async (currentUserId, limit = 20) => {
    const result = await pool.query(
      `SELECT
        cp.id,
        cp.content,
        cp.routine_snapshot,
        cp.created_at,
        u.profile,
        COUNT(cl.id) as like_count,
        CASE WHEN ucl.user_id IS NOT NULL THEN true ELSE false END as user_liked
      FROM community_posts cp
      JOIN users u ON cp.user_id = u.id
      LEFT JOIN community_likes cl ON cp.id = cl.post_id
      LEFT JOIN community_likes ucl ON cp.id = ucl.post_id AND ucl.user_id = $1
      WHERE cp.visibility = 'PUBLIC'
      AND (u.profile->>'community'->>'profileVisibility' != 'private' OR u.profile->>'community'->>'profileVisibility' IS NULL)
      GROUP BY cp.id, u.profile
      ORDER BY cp.created_at DESC
      LIMIT $2`,
      [currentUserId, limit]
    );

    return result.rows;
  },

  toggleCommunityLike: async (postId, userId) => {
    const existingLike = await pool.query(
      'SELECT id FROM community_likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );

    if (existingLike.rows.length > 0) {
      // Unlike
      await pool.query('DELETE FROM community_likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
      return { liked: false, action: 'unliked' };
    } else {
      // Like
      await pool.query('INSERT INTO community_likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
      return { liked: true, action: 'liked' };
    }
  },

  // Streak operations
  updateStreak: async (userId) => {
    const today = new Date().toISOString().split('T')[0];

    const result = await pool.query('SELECT * FROM user_streaks WHERE user_id = $1', [userId]);

    if (result.rows.length > 0) {
      const row = result.rows[0];
      const lastActivity = row.last_activity_date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newCurrentStreak = row.current_streak;
      let newLongestStreak = row.longest_streak;

      if (lastActivity === today) {
        return { currentStreak: newCurrentStreak, longestStreak: newLongestStreak, lastActivityDate: today };
      } else if (lastActivity === yesterdayStr) {
        newCurrentStreak += 1;
      } else {
        newCurrentStreak = 1;
      }

      if (newCurrentStreak > newLongestStreak) {
        newLongestStreak = newCurrentStreak;
      }

      await pool.query(
        'UPDATE user_streaks SET current_streak = $1, longest_streak = $2, last_activity_date = $3 WHERE user_id = $4',
        [newCurrentStreak, newLongestStreak, today, userId]
      );

      return { currentStreak: newCurrentStreak, longestStreak: newLongestStreak, lastActivityDate: today };
    } else {
      await pool.query(
        'INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date) VALUES ($1, 1, 1, $2)',
        [userId, today]
      );

      return { currentStreak: 1, longestStreak: 1, lastActivityDate: today };
    }
  },

  getStreak: async (userId) => {
    const result = await pool.query('SELECT * FROM user_streaks WHERE user_id = $1', [userId]);

    if (result.rows.length > 0) {
      return {
        currentStreak: result.rows[0].current_streak,
        longestStreak: result.rows[0].longest_streak,
        lastActivityDate: result.rows[0].last_activity_date
      };
    }

    return { currentStreak: 0, longestStreak: 0, lastActivityDate: null };
  }
};

module.exports = { pool, initDatabase, dbHelpers };
