// Shared data types and constants for the wellness app

export const SKIN_TYPES = {
  DRY: 'dry',
  OILY: 'oily',
  COMBINATION: 'combination',
  SENSITIVE: 'sensitive',
  NORMAL: 'normal'
};

export const SKIN_CONCERNS = {
  ACNE: 'acne',
  AGING: 'aging',
  DARK_SPOTS: 'dark_spots',
  DRYNESS: 'dryness',
  OILINESS: 'oiliness',
  SENSITIVITY: 'sensitivity',
  PORES: 'large_pores'
};

export const HAIR_TYPES = {
  STRAIGHT: 'straight',
  WAVY: 'wavy', 
  CURLY: 'curly',
  COILY: 'coily'
};

export const HAIR_TEXTURES = {
  FINE: 'fine',
  MEDIUM: 'medium',
  THICK: 'thick'
};

export const BODY_AREAS = {
  FACE: 'face',
  BODY: 'body',
  HAIR: 'hair',
  HANDS: 'hands'
};

export const PRODUCT_CATEGORIES = {
  CLEANSER: 'cleanser',
  MOISTURIZER: 'moisturizer',
  SERUM: 'serum',
  SUNSCREEN: 'sunscreen',
  BODY_LOTION: 'body_lotion',
  SHAMPOO: 'shampoo',
  CONDITIONER: 'conditioner'
};

export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Basic',
    price: 0,
    features: ['Basic recommendations', 'Community access', 'Limited routine sharing']
  },
  PREMIUM: {
    name: 'Premium',
    price: 9.99,
    features: ['Advanced AI recommendations', 'Unlimited routine sharing', 'Expert consultations', 'Product discounts']
  },
  PRO: {
    name: 'Pro',
    price: 19.99,
    features: ['All Premium features', 'Brand partnerships', 'Early product access', 'Personal beauty coach']
  }
};

export const USER_PROFILE_SCHEMA = {
  personalInfo: {
    name: '',
    age: null,
    gender: '',
    location: '',
    bio: ''
  },
  skinProfile: {
    skinType: '',
    skinConcerns: [],
    allergies: [],
    currentProducts: []
  },
  hairProfile: {
    hairType: '',
    hairTexture: '',
    hairConcerns: [],
    currentHairProducts: []
  },
  preferences: {
    budgetRange: { min: 0, max: 100 },
    preferredBrands: [],
    avoidIngredients: [],
    certificationPreferences: ['organic', 'cruelty_free', 'vegan']
  },
  bodyInfo: {
    height: null,
    weight: null,
    bodyType: ''
  },
  community: {
    isPublic: true,
    allowMatching: true,
    shareRoutines: true,
    followingCount: 0,
    followersCount: 0
  },
  subscription: {
    tier: 'FREE',
    expiresAt: null,
    features: SUBSCRIPTION_TIERS.FREE.features
  }
};