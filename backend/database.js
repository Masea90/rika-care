const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'rika-app.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        googleId TEXT,
        profile TEXT,
        subscription TEXT,
        analytics TEXT,
        following TEXT,
        followers TEXT,
        verification TEXT,
        influencer_status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Products table
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        brand TEXT,
        type TEXT,
        price REAL,
        ingredients TEXT,
        flags TEXT,
        rating REAL,
        reviews_count INTEGER,
        image_url TEXT,
        affiliate_url TEXT,
        full_description TEXT,
        benefits TEXT,
        how_to_use TEXT,
        full_ingredient_list TEXT,
        clean_flags TEXT,
        suitability TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Posts table
      db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        content TEXT,
        type TEXT,
        tags TEXT,
        images TEXT,
        is_public BOOLEAN DEFAULT 1,
        likes TEXT DEFAULT '[]',
        comments TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);

      // Routines table
      db.run(`CREATE TABLE IF NOT EXISTS routines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT,
        products TEXT,
        completed BOOLEAN DEFAULT 0,
        notes TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);

      // Analysis table
      db.run(`CREATE TABLE IF NOT EXISTS analysis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT,
        method TEXT,
        result TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);
      
      // User Points table
      db.run(`CREATE TABLE IF NOT EXISTS user_points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        total_points INTEGER DEFAULT 0,
        history TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);
      
      // Rewards table
      db.run(`CREATE TABLE IF NOT EXISTS rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        required_points INTEGER NOT NULL,
        type TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      // Community Posts table
      db.run(`CREATE TABLE IF NOT EXISTS community_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        routine_snapshot TEXT,
        visibility TEXT DEFAULT 'PUBLIC',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);
      
      // Community Likes table
      db.run(`CREATE TABLE IF NOT EXISTS community_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES community_posts (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(post_id, user_id)
      )`);
      
      // User Streaks table
      db.run(`CREATE TABLE IF NOT EXISTS user_streaks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_activity_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

// Helper functions for database operations
const dbHelpers = {
  // User operations
  createUser: (userData) => {
    return new Promise((resolve, reject) => {
      const { email, password, profile, subscription } = userData;
      db.run(
        'INSERT INTO users (email, password, profile, subscription) VALUES (?, ?, ?, ?)',
        [email, password, JSON.stringify(profile), JSON.stringify(subscription)],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, email, profile });
        }
      );
    });
  },

  findUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else {
          if (row) {
            row.profile = JSON.parse(row.profile || '{}');
            row.subscription = JSON.parse(row.subscription || '{}');
            row.analytics = JSON.parse(row.analytics || '{}');
            row.verification = JSON.parse(row.verification || '{}');
            row.following = JSON.parse(row.following || '[]');
            row.followers = JSON.parse(row.followers || '[]');
            row.influencer_status = JSON.parse(row.influencer_status || '{}');
          }
          resolve(row);
        }
      });
    });
  },

  findUserById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else {
          if (row) {
            row.profile = JSON.parse(row.profile || '{}');
            row.subscription = JSON.parse(row.subscription || '{}');
            row.analytics = JSON.parse(row.analytics || '{}');
            row.verification = JSON.parse(row.verification || '{}');
            row.following = JSON.parse(row.following || '[]');
            row.followers = JSON.parse(row.followers || '[]');
            row.influencer_status = JSON.parse(row.influencer_status || '{}');
          }
          resolve(row);
        }
      });
    });
  },

  updateUser: (id, updates) => {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates).map(val => 
        typeof val === 'object' ? JSON.stringify(val) : val
      );
      
      db.run(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  },

  // Analysis operations
  createAnalysis: (analysisData) => {
    return new Promise((resolve, reject) => {
      const { user_id, type, method, result } = analysisData;
      db.run(
        'INSERT INTO analysis (user_id, type, method, result) VALUES (?, ?, ?, ?)',
        [user_id, type, method, JSON.stringify(result)],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...analysisData });
        }
      );
    });
  },

  // Post operations
  createPost: (postData) => {
    return new Promise((resolve, reject) => {
      const { user_id, title, content, type, tags, images } = postData;
      db.run(
        'INSERT INTO posts (user_id, title, content, type, tags, images) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, title, content, type, JSON.stringify(tags), JSON.stringify(images)],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...postData });
        }
      );
    });
  },

  getPosts: (limit = 10, offset = 0) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT p.*, u.profile as user_profile 
         FROM posts p 
         JOIN users u ON p.user_id = u.id 
         WHERE p.is_public = 1 
         ORDER BY p.created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset],
        (err, rows) => {
          if (err) reject(err);
          else {
            const posts = rows.map(row => ({
              ...row,
              tags: JSON.parse(row.tags || '[]'),
              images: JSON.parse(row.images || '[]'),
              likes: JSON.parse(row.likes || '[]'),
              user_profile: JSON.parse(row.user_profile || '{}')
            }));
            resolve(posts);
          }
        }
      );
    });
  },

  // Routine operations
  createRoutine: (routineData) => {
    return new Promise((resolve, reject) => {
      const { user_id, type, products, completed, notes } = routineData;
      db.run(
        'INSERT INTO routines (user_id, type, products, completed, notes) VALUES (?, ?, ?, ?, ?)',
        [user_id, type, JSON.stringify(products), completed, notes],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...routineData });
        }
      );
    });
  },
  
  completeRoutineDay: (userId) => {
    return new Promise((resolve, reject) => {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if user already completed routine today
      db.get(
        'SELECT COUNT(*) as count FROM routines WHERE user_id = ? AND DATE(date) = ? AND completed = 1',
        [userId, today],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (row.count > 0) {
            // Already completed today
            resolve({ alreadyCompleted: true });
          } else {
            // Mark as completed for today
            db.run(
              'INSERT INTO routines (user_id, type, products, completed, notes, date) VALUES (?, ?, ?, 1, ?, ?)',
              [userId, 'daily', JSON.stringify(['Daily routine completion']), 'Completed daily routine', today],
              function(err) {
                if (err) reject(err);
                else resolve({ alreadyCompleted: false, routineId: this.lastID });
              }
            );
          }
        }
      );
    });
  },

  getUserRoutines: (userId, limit = 30) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM routines WHERE user_id = ? ORDER BY date DESC LIMIT ?',
        [userId, limit],
        (err, rows) => {
          if (err) reject(err);
          else {
            const routines = rows.map(row => ({
              ...row,
              products: JSON.parse(row.products || '[]')
            }));
            resolve(routines);
          }
        }
      );
    });
  },
  
  hasCompletedRoutineToday: (userId) => {
    return new Promise((resolve, reject) => {
      const today = new Date().toISOString().split('T')[0];
      db.get(
        'SELECT COUNT(*) as count FROM routines WHERE user_id = ? AND DATE(date) = ? AND completed = 1',
        [userId, today],
        (err, row) => {
          if (err) reject(err);
          else resolve(row.count > 0);
        }
      );
    });
  },

  // Product operations
  getAllProducts: (limit = 20) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM products ORDER BY created_at DESC LIMIT ?',
        [limit],
        (err, rows) => {
          if (err) reject(err);
          else {
            const products = rows.map(row => ({
              ...row,
              type: row.category, // Map category to type for compatibility
              ingredients: JSON.parse(row.ingredients || '[]'),
              benefits: JSON.parse(row.benefits || '[]'),
              clean_flags: JSON.parse(row.clean_flags || '{}'),
              suitability: JSON.parse(row.suitability || '{}'),
              flags: row.clean_flags ? JSON.parse(row.clean_flags) : {} // Use clean_flags as flags
            }));
            resolve(products);
          }
        }
      );
    });
  },
  
  getProductById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else {
          if (row) {
            row.type = row.category; // Map category to type for compatibility
            row.ingredients = JSON.parse(row.ingredients || '[]');
            row.benefits = JSON.parse(row.benefits || '[]');
            row.clean_flags = JSON.parse(row.clean_flags || '{}');
            row.suitability = JSON.parse(row.suitability || '{}');
            row.flags = row.clean_flags; // Use clean_flags as flags
          }
          resolve(row);
        }
      });
    });
  },

  // Points operations
  addPoints: (userId, action, points) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM user_points WHERE user_id = ?', [userId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        const historyEntry = {
          action,
          points,
          timestamp: new Date().toISOString()
        };
        
        if (row) {
          // Update existing record
          const currentHistory = JSON.parse(row.history || '[]');
          const newHistory = [...currentHistory, historyEntry];
          const newTotal = row.total_points + points;
          
          db.run(
            'UPDATE user_points SET total_points = ?, history = ? WHERE user_id = ?',
            [newTotal, JSON.stringify(newHistory), userId],
            function(err) {
              if (err) reject(err);
              else resolve({ totalPoints: newTotal, added: points });
            }
          );
        } else {
          // Create new record
          db.run(
            'INSERT INTO user_points (user_id, total_points, history) VALUES (?, ?, ?)',
            [userId, points, JSON.stringify([historyEntry])],
            function(err) {
              if (err) reject(err);
              else resolve({ totalPoints: points, added: points });
            }
          );
        }
      });
    });
  },
  
  getPoints: (userId) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM user_points WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else {
          if (row) {
            resolve({
              totalPoints: row.total_points,
              history: JSON.parse(row.history || '[]')
            });
          } else {
            resolve({ totalPoints: 0, history: [] });
          }
        }
      });
    });
  },
  
  redeemReward: (userId, rewardId) => {
    return new Promise((resolve, reject) => {
      // Get reward details first
      db.get('SELECT * FROM rewards WHERE id = ? AND is_active = 1', [rewardId], (err, reward) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!reward) {
          reject(new Error('Reward not found or inactive'));
          return;
        }
        
        // Get user points
        db.get('SELECT * FROM user_points WHERE user_id = ?', [userId], (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          const currentPoints = row ? row.total_points : 0;
          
          if (currentPoints < reward.required_points) {
            const needed = reward.required_points - currentPoints;
            reject(new Error(`You need ${needed} more points to redeem this reward.`));
            return;
          }
          
          const historyEntry = {
            action: 'REDEEM',
            rewardId: reward.id,
            rewardName: reward.name,
            pointsUsed: reward.required_points,
            timestamp: new Date().toISOString()
          };
          
          const currentHistory = JSON.parse(row?.history || '[]');
          const newHistory = [...currentHistory, historyEntry];
          const newTotal = currentPoints - reward.required_points;
          
          if (row) {
            // Update existing record
            db.run(
              'UPDATE user_points SET total_points = ?, history = ? WHERE user_id = ?',
              [newTotal, JSON.stringify(newHistory), userId],
              function(err) {
                if (err) reject(err);
                else resolve({ 
                  totalPoints: newTotal, 
                  redeemed: reward.required_points,
                  reward: reward.name
                });
              }
            );
          } else {
            // Create new record (shouldn't happen but handle it)
            db.run(
              'INSERT INTO user_points (user_id, total_points, history) VALUES (?, ?, ?)',
              [userId, newTotal, JSON.stringify(newHistory)],
              function(err) {
                if (err) reject(err);
                else resolve({ 
                  totalPoints: newTotal, 
                  redeemed: reward.required_points,
                  reward: reward.name
                });
              }
            );
          }
        });
      });
    });
  },

  createProduct: (productData) => {
    return new Promise((resolve, reject) => {
      const { 
        name, brand, category, price, ingredients, affiliate_url,
        full_description, benefits, how_to_use, full_ingredient_list, 
        clean_flags, suitability, image_url
      } = productData;
      
      db.run(
        `INSERT INTO products (
          name, brand, category, price, ingredients, affiliate_url,
          full_description, benefits, how_to_use, full_ingredient_list,
          clean_flags, suitability, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, brand, category, price, 
          JSON.stringify(ingredients), affiliate_url,
          full_description, benefits, how_to_use, full_ingredient_list,
          clean_flags, suitability, image_url
        ],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...productData });
        }
      );
    });
  },

  // Rewards operations
  getAllRewards: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM rewards WHERE is_active = 1 ORDER BY required_points ASC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  
  getRewardById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM rewards WHERE id = ? AND is_active = 1', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  
  createReward: (rewardData) => {
    return new Promise((resolve, reject) => {
      const { name, description, required_points, type } = rewardData;
      db.run(
        'INSERT INTO rewards (name, description, required_points, type) VALUES (?, ?, ?, ?)',
        [name, description, required_points, type],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...rewardData });
        }
      );
    });
  },

  // Community operations
  createCommunityPost: (postData) => {
    return new Promise((resolve, reject) => {
      const { user_id, content, routine_snapshot, visibility } = postData;
      db.run(
        'INSERT INTO community_posts (user_id, content, routine_snapshot, visibility) VALUES (?, ?, ?, ?)',
        [user_id, content, routine_snapshot ? JSON.stringify(routine_snapshot) : null, visibility || 'PUBLIC'],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...postData });
        }
      );
    });
  },
  
  getCommunityFeed: (currentUserId, limit = 20) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          cp.id,
          cp.content,
          cp.routine_snapshot,
          cp.created_at,
          u.profile,
          COUNT(cl.id) as like_count,
          CASE WHEN ucl.user_id IS NOT NULL THEN 1 ELSE 0 END as user_liked
        FROM community_posts cp
        JOIN users u ON cp.user_id = u.id
        LEFT JOIN community_likes cl ON cp.id = cl.post_id
        LEFT JOIN community_likes ucl ON cp.id = ucl.post_id AND ucl.user_id = ?
        WHERE cp.visibility = 'PUBLIC'
        AND (JSON_EXTRACT(u.profile, '$.community.profileVisibility') != 'private' OR JSON_EXTRACT(u.profile, '$.community.profileVisibility') IS NULL)
        GROUP BY cp.id
        ORDER BY cp.created_at DESC
        LIMIT ?
      `;
      
      db.all(query, [currentUserId, limit], (err, rows) => {
        if (err) reject(err);
        else {
          const posts = rows.map(row => ({
            ...row,
            profile: JSON.parse(row.profile || '{}'),
            routine_snapshot: row.routine_snapshot ? JSON.parse(row.routine_snapshot) : null,
            user_liked: Boolean(row.user_liked)
          }));
          resolve(posts);
        }
      });
    });
  },
  
  toggleCommunityLike: (postId, userId) => {
    return new Promise((resolve, reject) => {
      // Check if like exists
      db.get('SELECT id FROM community_likes WHERE post_id = ? AND user_id = ?', [postId, userId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row) {
          // Unlike - remove the like
          db.run('DELETE FROM community_likes WHERE post_id = ? AND user_id = ?', [postId, userId], function(err) {
            if (err) reject(err);
            else resolve({ liked: false, action: 'unliked' });
          });
        } else {
          // Like - add the like
          db.run('INSERT INTO community_likes (post_id, user_id) VALUES (?, ?)', [postId, userId], function(err) {
            if (err) reject(err);
            else resolve({ liked: true, action: 'liked' });
          });
        }
      });
    });
  },

  // Streak operations
  updateStreak: (userId) => {
    return new Promise((resolve, reject) => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      db.get('SELECT * FROM user_streaks WHERE user_id = ?', [userId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row) {
          // User has existing streak record
          const lastActivity = row.last_activity_date;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          let newCurrentStreak = row.current_streak;
          let newLongestStreak = row.longest_streak;
          
          if (lastActivity === today) {
            // Already completed today, no change
            resolve({ currentStreak: newCurrentStreak, longestStreak: newLongestStreak, lastActivityDate: today });
            return;
          } else if (lastActivity === yesterdayStr) {
            // Consecutive day - increment streak
            newCurrentStreak += 1;
          } else {
            // Streak broken - reset to 1
            newCurrentStreak = 1;
          }
          
          // Update longest streak if current is higher
          if (newCurrentStreak > newLongestStreak) {
            newLongestStreak = newCurrentStreak;
          }
          
          db.run(
            'UPDATE user_streaks SET current_streak = ?, longest_streak = ?, last_activity_date = ? WHERE user_id = ?',
            [newCurrentStreak, newLongestStreak, today, userId],
            function(err) {
              if (err) reject(err);
              else resolve({ currentStreak: newCurrentStreak, longestStreak: newLongestStreak, lastActivityDate: today });
            }
          );
        } else {
          // First time - create new streak record
          db.run(
            'INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date) VALUES (?, 1, 1, ?)',
            [userId, today],
            function(err) {
              if (err) reject(err);
              else resolve({ currentStreak: 1, longestStreak: 1, lastActivityDate: today });
            }
          );
        }
      });
    });
  },
  
  getStreak: (userId) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM user_streaks WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else {
          if (row) {
            resolve({
              currentStreak: row.current_streak,
              longestStreak: row.longest_streak,
              lastActivityDate: row.last_activity_date
            });
          } else {
            resolve({ currentStreak: 0, longestStreak: 0, lastActivityDate: null });
          }
        }
      });
    });
  }
};

module.exports = { db, initDatabase, dbHelpers };