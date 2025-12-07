import { SKIN_TYPES, SKIN_CONCERNS, HAIR_TYPES } from './types.js';

export class RecommendationEngine {
  constructor() {
    this.productDatabase = this.initializeProductDatabase();
    this.userBehaviorWeights = {
      skinType: 0.3,
      skinConcerns: 0.25,
      hairType: 0.2,
      budget: 0.15,
      certifications: 0.1
    };
  }

  initializeProductDatabase() {
    return [
      {
        id: 1,
        name: 'Gentle Oat Cleanser',
        brand: 'Pure Nature',
        category: 'cleanser',
        price: 24.99,
        rating: 4.6,
        reviews: 1247,
        skinTypes: ['sensitive', 'dry', 'normal'],
        concerns: ['sensitivity', 'dryness'],
        certifications: ['organic', 'cruelty_free', 'vegan'],
        ingredients: ['oat extract', 'chamomile', 'aloe vera'],
        description: 'Ultra-gentle cleanser perfect for sensitive skin',
        affiliate_commission: 0.08
      },
      {
        id: 2,
        name: 'Vitamin C Brightening Serum',
        brand: 'Glow Labs',
        category: 'serum',
        price: 45.00,
        rating: 4.8,
        reviews: 892,
        skinTypes: ['combination', 'oily', 'normal'],
        concerns: ['dark_spots', 'aging', 'dullness'],
        certifications: ['cruelty_free', 'natural'],
        ingredients: ['vitamin c', 'hyaluronic acid', 'niacinamide'],
        description: 'Powerful antioxidant serum for radiant skin',
        affiliate_commission: 0.12
      },
      {
        id: 3,
        name: 'Hydrating Rose Mist',
        brand: 'Botanical Beauty',
        category: 'toner',
        price: 18.50,
        rating: 4.4,
        reviews: 634,
        skinTypes: ['dry', 'sensitive', 'combination'],
        concerns: ['dryness', 'sensitivity'],
        certifications: ['organic', 'cruelty_free', 'vegan'],
        ingredients: ['rose water', 'glycerin', 'cucumber extract'],
        description: 'Refreshing mist for instant hydration',
        affiliate_commission: 0.10
      },
      {
        id: 4,
        name: 'Curl Defining Cream',
        brand: 'Curly Crown',
        category: 'hair_styling',
        price: 32.00,
        rating: 4.7,
        reviews: 1156,
        hairTypes: ['curly', 'coily'],
        concerns: ['frizz', 'definition', 'moisture'],
        certifications: ['cruelty_free', 'natural'],
        ingredients: ['shea butter', 'coconut oil', 'flaxseed gel'],
        description: 'Define and nourish your natural curls',
        affiliate_commission: 0.15
      },
      {
        id: 5,
        name: 'Mineral Sunscreen SPF 50',
        brand: 'Safe Sun',
        category: 'sunscreen',
        price: 28.99,
        rating: 4.5,
        reviews: 2341,
        skinTypes: ['sensitive', 'all'],
        concerns: ['sun_protection', 'sensitivity'],
        certifications: ['reef_safe', 'cruelty_free'],
        ingredients: ['zinc oxide', 'titanium dioxide', 'jojoba oil'],
        description: 'Broad spectrum protection for sensitive skin',
        affiliate_commission: 0.09
      }
    ];
  }

  calculateProductScore(product, userProfile) {
    let score = 0;
    const weights = this.userBehaviorWeights;

    // Skin type matching
    if (product.skinTypes && product.skinTypes.includes(userProfile.skinProfile.skinType)) {
      score += weights.skinType * 100;
    }

    // Skin concerns matching
    if (product.concerns && userProfile.skinProfile.skinConcerns) {
      const matchingConcerns = product.concerns.filter(concern => 
        userProfile.skinProfile.skinConcerns.includes(concern)
      );
      score += weights.skinConcerns * (matchingConcerns.length / userProfile.skinProfile.skinConcerns.length) * 100;
    }

    // Hair type matching
    if (product.hairTypes && product.hairTypes.includes(userProfile.hairProfile?.hairType)) {
      score += weights.hairType * 100;
    }

    // Budget matching
    const userBudget = userProfile.preferences.budgetRange;
    if (product.price >= userBudget.min && product.price <= userBudget.max) {
      score += weights.budget * 100;
    } else if (product.price < userBudget.min) {
      score += weights.budget * 80; // Slightly lower for under-budget items
    }

    // Certification preferences
    if (product.certifications && userProfile.preferences.certificationPreferences) {
      const matchingCerts = product.certifications.filter(cert => 
        userProfile.preferences.certificationPreferences.includes(cert)
      );
      score += weights.certifications * (matchingCerts.length / userProfile.preferences.certificationPreferences.length) * 100;
    }

    // Boost score based on rating and reviews
    score += (product.rating / 5) * 10;
    score += Math.min(product.reviews / 1000, 1) * 5;

    return Math.min(score, 100);
  }

  getPersonalizedRecommendations(userProfile, limit = 10) {
    const scoredProducts = this.productDatabase.map(product => ({
      ...product,
      matchScore: this.calculateProductScore(product, userProfile),
      matchReasons: this.getMatchReasons(product, userProfile)
    }));

    return scoredProducts
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  getMatchReasons(product, userProfile) {
    const reasons = [];

    if (product.skinTypes && product.skinTypes.includes(userProfile.skinProfile.skinType)) {
      reasons.push(`Perfect for ${userProfile.skinProfile.skinType} skin`);
    }

    if (product.concerns && userProfile.skinProfile.skinConcerns) {
      const matchingConcerns = product.concerns.filter(concern => 
        userProfile.skinProfile.skinConcerns.includes(concern)
      );
      if (matchingConcerns.length > 0) {
        reasons.push(`Addresses your ${matchingConcerns.join(', ')} concerns`);
      }
    }

    if (product.hairTypes && product.hairTypes.includes(userProfile.hairProfile?.hairType)) {
      reasons.push(`Designed for ${userProfile.hairProfile.hairType} hair`);
    }

    const matchingCerts = product.certifications?.filter(cert => 
      userProfile.preferences.certificationPreferences?.includes(cert)
    ) || [];
    if (matchingCerts.length > 0) {
      reasons.push(`${matchingCerts.join(', ')} certified`);
    }

    if (product.rating >= 4.5) {
      reasons.push(`Highly rated (${product.rating}★)`);
    }

    return reasons.slice(0, 3); // Limit to top 3 reasons
  }

  getTrendingProducts(userProfile, limit = 5) {
    // Simulate trending based on recent reviews and high ratings
    return this.productDatabase
      .filter(product => product.reviews > 500 && product.rating >= 4.3)
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, limit)
      .map(product => ({
        ...product,
        trendingReason: `${product.reviews} people love this`,
        matchScore: this.calculateProductScore(product, userProfile)
      }));
  }

  getSimilarUserRecommendations(userProfile, limit = 5) {
    // Simulate recommendations based on similar users
    const similarUserProducts = this.productDatabase
      .filter(product => {
        // Products popular among users with similar characteristics
        return product.skinTypes?.includes(userProfile.skinProfile.skinType) ||
               product.hairTypes?.includes(userProfile.hairProfile?.hairType);
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);

    return similarUserProducts.map(product => ({
      ...product,
      socialProof: `Users like you rated this ${product.rating}★`,
      matchScore: this.calculateProductScore(product, userProfile)
    }));
  }

  getBudgetFriendlyAlternatives(expensiveProductId, userProfile) {
    const expensiveProduct = this.productDatabase.find(p => p.id === expensiveProductId);
    if (!expensiveProduct) return [];

    return this.productDatabase
      .filter(product => 
        product.id !== expensiveProductId &&
        product.category === expensiveProduct.category &&
        product.price < expensiveProduct.price &&
        product.price <= userProfile.preferences.budgetRange.max
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
      .map(product => ({
        ...product,
        savings: expensiveProduct.price - product.price,
        matchScore: this.calculateProductScore(product, userProfile)
      }));
  }

  getSeasonalRecommendations(userProfile, season = 'current') {
    // Simulate seasonal recommendations
    const seasonalProducts = {
      winter: this.productDatabase.filter(p => 
        p.concerns?.includes('dryness') || p.category === 'moisturizer'
      ),
      summer: this.productDatabase.filter(p => 
        p.category === 'sunscreen' || p.concerns?.includes('oiliness')
      ),
      spring: this.productDatabase.filter(p => 
        p.concerns?.includes('sensitivity') || p.category === 'cleanser'
      ),
      fall: this.productDatabase.filter(p => 
        p.concerns?.includes('aging') || p.category === 'serum'
      )
    };

    const currentSeason = season === 'current' ? this.getCurrentSeason() : season;
    return seasonalProducts[currentSeason]?.slice(0, 5).map(product => ({
      ...product,
      seasonalReason: `Perfect for ${currentSeason} skincare`,
      matchScore: this.calculateProductScore(product, userProfile)
    })) || [];
  }

  getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  generateDailyRecommendations(userProfile) {
    return {
      featured: this.getPersonalizedRecommendations(userProfile, 1)[0],
      trending: this.getTrendingProducts(userProfile, 3),
      similarUsers: this.getSimilarUserRecommendations(userProfile, 3),
      seasonal: this.getSeasonalRecommendations(userProfile, 'current').slice(0, 2),
      budgetPicks: this.getPersonalizedRecommendations(userProfile)
        .filter(p => p.price <= userProfile.preferences.budgetRange.max * 0.7)
        .slice(0, 3)
    };
  }
}

export const recommendationEngine = new RecommendationEngine();