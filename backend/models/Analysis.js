const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['skin', 'hair'],
    required: true
  },
  method: {
    type: String,
    enum: ['quiz', 'selfie', 'expert'],
    required: true
  },
  result: {
    skinType: String,
    hairType: String,
    hairTexture: String,
    confidence: Number,
    concerns: [String],
    recommendations: mongoose.Schema.Types.Mixed,
    safetyNotes: [String]
  },
  imageUrl: String, // for selfie analysis
  answers: mongoose.Schema.Types.Mixed, // quiz answers
  timestamp: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Analysis', analysisSchema);