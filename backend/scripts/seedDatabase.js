const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  {
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
    affiliateCommission: 0.08
  },
  {
    name: 'Vitamin C Brightening Serum',
    brand: 'Glow Labs',
    category: 'serum',
    price: 45.00,
    rating: 4.8,
    reviews: 892,
    skinTypes: ['combination', 'oily', 'normal'],
    concerns: ['dark_spots', 'aging'],
    certifications: ['cruelty_free', 'natural'],
    ingredients: ['vitamin c', 'hyaluronic acid', 'niacinamide'],
    description: 'Powerful antioxidant serum for radiant skin',
    affiliateCommission: 0.12
  },
  {
    name: 'Curl Defining Cream',
    brand: 'Curly Crown',
    category: 'hair_styling',
    price: 32.00,
    rating: 4.7,
    reviews: 1156,
    hairTypes: ['curly', 'coily'],
    concerns: ['frizz', 'definition'],
    certifications: ['cruelty_free', 'natural'],
    ingredients: ['shea butter', 'coconut oil', 'flaxseed gel'],
    description: 'Define and nourish your natural curls',
    affiliateCommission: 0.15
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/wellness-app');
    
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    
    console.log('✅ Database seeded successfully!');
    console.log(`📦 Added ${sampleProducts.length} products`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();