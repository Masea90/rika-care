const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    personalInfo: {
      name: String,
      age: Number,
      gender: String,
      location: String,
      bio: String
    },
    skinProfile: {
      skinType: {
        type: String,
        enum: ['dry', 'oily', 'combination', 'sensitive', 'normal']
      },
      skinConcerns: [{
        type: String,
        enum: ['acne', 'aging', 'dark_spots', 'dryness', 'oiliness', 'sensitivity', 'large_pores']
      }],
      allergies: [String],
      currentProducts: [String]
    },
    hairProfile: {
      hairType: {
        type: String,
        enum: ['straight', 'wavy', 'curly', 'coily']
      },
      hairTexture: {
        type: String,
        enum: ['fine', 'medium', 'thick']
      },
      hairConcerns: [String],
      currentHairProducts: [String]
    },
    preferences: {
      budgetRange: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 100 }
      },
      preferredBrands: [String],
      avoidIngredients: [String],
      certificationPreferences: [{
        type: String,
        enum: ['organic', 'cruelty_free', 'vegan', 'natural', 'reef_safe']
      }]
    },
    community: {
      isPublic: { type: Boolean, default: true },
      allowMatching: { type: Boolean, default: true },
      shareRoutines: { type: Boolean, default: true },
      followingCount: { type: Number, default: 0 },
      followersCount: { type: Number, default: 0 }
    }
  },
  subscription: {
    tier: {
      type: String,
      enum: ['FREE', 'PREMIUM', 'PRO'],
      default: 'FREE'
    },
    expiresAt: Date,
    features: [String],
    paymentMethod: String
  },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  analytics: {
    totalRoutines: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    dailyActiveMinutes: { type: Number, default: 0 },
    communityInteractions: { type: Number, default: 0 },
    productViews: { type: Number, default: 0 },
    recommendationViews: { type: Number, default: 0 },
    appUsage: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.methods.isPremium = function() {
  return this.subscription.tier !== 'FREE' && 
         (!this.subscription.expiresAt || this.subscription.expiresAt > new Date());
};

module.exports = mongoose.model('User', userSchema);