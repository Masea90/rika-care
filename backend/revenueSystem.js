// Real Affiliate Programs for Natural Beauty Products
const AFFILIATE_PROGRAMS = {
  amazon: {
    name: 'Amazon Associates',
    commission: 0.04, // 4%
    signup: 'https://affiliate-program.amazon.com',
    products: ['skincare', 'haircare', 'supplements'],
    payout: 'monthly',
    minimum: 10
  },
  iherb: {
    name: 'iHerb Affiliate',
    commission: 0.10, // 10%
    signup: 'https://www.iherb.com/info/affiliate-program',
    products: ['natural', 'organic', 'supplements'],
    payout: 'monthly',
    minimum: 20
  },
  vitacost: {
    name: 'Vitacost Affiliate',
    commission: 0.08, // 8%
    signup: 'https://www.vitacost.com/affiliate-program',
    products: ['natural', 'organic', 'wellness'],
    payout: 'monthly',
    minimum: 25
  },
  thrive_market: {
    name: 'Thrive Market',
    commission: 0.12, // 12%
    signup: 'https://thrivemarket.com/affiliate',
    products: ['organic', 'natural', 'clean'],
    payout: 'monthly',
    minimum: 50
  }
};

// Revenue Optimization Strategies
const REVENUE_STRATEGIES = {
  // Strategy 1: Product Recommendation Monetization
  productRecommendations: {
    implementation: 'Add affiliate links to all product recommendations',
    revenue_potential: '$500-2000/month',
    effort: 'low',
    timeline: '1 week'
  },
  
  // Strategy 2: Premium Subscription Tiers
  subscriptionTiers: {
    basic: { price: 0, features: ['basic_recommendations', 'community'] },
    premium: { 
      price: 4.99, 
      features: ['unlimited_scans', 'expert_chat', 'exclusive_products'],
      target_conversion: 0.15 // 15% of users
    },
    pro: { 
      price: 9.99, 
      features: ['personal_consultant', 'custom_routines', 'brand_partnerships'],
      target_conversion: 0.05 // 5% of users
    }
  },
  
  // Strategy 3: Sponsored Content
  sponsoredContent: {
    implementation: 'Brands pay for featured placement',
    pricing: {
      featured_product: 100, // $100 per month
      sponsored_post: 50,    // $50 per post
      banner_ad: 200         // $200 per month
    }
  },
  
  // Strategy 4: Influencer Commission Program
  influencerProgram: {
    user_commission: 0.10, // Users get 10%
    your_cut: 0.05,        // You keep 5%
    viral_potential: 'high'
  }
};

// Immediate Action Plan for Revenue
const IMMEDIATE_REVENUE_PLAN = {
  week1: {
    action: 'Sign up for Amazon Associates + iHerb',
    implementation: 'Add affiliate links to existing products',
    expected_revenue: '$50-200'
  },
  week2: {
    action: 'Launch Premium subscription ($4.99/month)',
    implementation: 'Add paywall for advanced features',
    expected_revenue: '$100-500'
  },
  week3: {
    action: 'Contact natural beauty brands for partnerships',
    implementation: 'Offer sponsored product placements',
    expected_revenue: '$200-1000'
  },
  week4: {
    action: 'Launch referral program',
    implementation: 'Users earn money for referrals',
    expected_revenue: '$100-300'
  }
};

module.exports = {
  AFFILIATE_PROGRAMS,
  REVENUE_STRATEGIES,
  IMMEDIATE_REVENUE_PLAN
};