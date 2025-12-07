const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ['routine', 'product_review', 'milestone', 'tip', 'question'],
    required: true
  },
  images: [String],
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  shares: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
  engagement: {
    type: String,
    enum: ['low', 'medium', 'high', 'viral'],
    default: 'low'
  },
  createdAt: { type: Date, default: Date.now }
});

postSchema.methods.calculateEngagement = function() {
  const totalInteractions = this.likes.length + this.comments.length + this.shares;
  if (totalInteractions > 100) return 'viral';
  if (totalInteractions > 50) return 'high';
  if (totalInteractions > 20) return 'medium';
  return 'low';
};

module.exports = mongoose.model('Post', postSchema);