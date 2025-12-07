const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: {
    type: String,
    enum: ['cleanser', 'moisturizer', 'serum', 'sunscreen', 'toner', 'mask', 'hair_styling', 'shampoo', 'conditioner'],
    required: true
  },
  price: { type: Number, required: true },
  rating: { type: Number, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  description: String,
  ingredients: [String],
  skinTypes: [{
    type: String,
    enum: ['dry', 'oily', 'combination', 'sensitive', 'normal', 'all']
  }],
  hairTypes: [{
    type: String,
    enum: ['straight', 'wavy', 'curly', 'coily']
  }],
  concerns: [String],
  certifications: [{
    type: String,
    enum: ['organic', 'cruelty_free', 'vegan', 'natural', 'reef_safe']
  }],
  images: [String],
  affiliateLink: String,
  affiliateCommission: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);