const { dbHelpers } = require('./database');

const defaultRewards = [
  {
    name: "10% Discount Code",
    description: "Get 10% off your next clean beauty order",
    required_points: 100,
    type: "DISCOUNT"
  },
  {
    name: "20% Discount Code", 
    description: "Get 20% off your next purchase",
    required_points: 200,
    type: "DISCOUNT"
  },
  {
    name: "Free Sample Box",
    description: "Curated sample box with 5 clean beauty products (placeholder)",
    required_points: 300,
    type: "FREE_SAMPLE"
  },
  {
    name: "Beauty Consultation",
    description: "30-minute personalized beauty consultation with RIKA expert (placeholder)",
    required_points: 500,
    type: "CONSULTATION"
  },
  {
    name: "Digital Skin Guide",
    description: "Exclusive digital guide: 'Clean Beauty Ingredients Decoded'",
    required_points: 150,
    type: "DIGITAL"
  }
];

async function seedRewards() {
  console.log('🎁 Seeding rewards...');
  
  try {
    for (const reward of defaultRewards) {
      await dbHelpers.createReward(reward);
    }
    console.log('✅ Successfully seeded', defaultRewards.length, 'rewards');
  } catch (error) {
    console.error('❌ Error seeding rewards:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedRewards().then(() => process.exit(0));
}

module.exports = { seedRewards };