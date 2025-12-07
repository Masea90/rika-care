const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: {
    type: String,
    enum: ['morning', 'evening', 'weekly'],
    required: true
  },
  steps: [{
    name: String,
    completed: { type: Boolean, default: false },
    timeSpent: Number, // in minutes
    points: { type: Number, default: 0 },
    products: [String]
  }],
  totalPoints: { type: Number, default: 0 },
  completionRate: { type: Number, default: 0 },
  notes: String,
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'tired', 'stressed']
  },
  skinCondition: {
    type: String,
    enum: ['excellent', 'good', 'normal', 'problematic', 'irritated']
  },
  createdAt: { type: Date, default: Date.now }
});

routineSchema.methods.calculateCompletion = function() {
  const completedSteps = this.steps.filter(step => step.completed).length;
  this.completionRate = (completedSteps / this.steps.length) * 100;
  this.totalPoints = this.steps.reduce((sum, step) => sum + (step.completed ? step.points : 0), 0);
  return this.completionRate;
};

module.exports = mongoose.model('Routine', routineSchema);