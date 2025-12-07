// How to run: node seedProducts.js
// This script seeds the database with sample clean beauty products

const { initDatabase, dbHelpers } = require('./database');

const sampleProducts = [
  {
    name: "Gentle Ceramide Cleanser",
    brand: "CeraVe",
    type: "skin",
    price: 24.99,
    ingredients: ["Ceramides", "Hyaluronic Acid", "Niacinamide"],
    flags: {
      isNatural: true,
      isFragranceFree: true,
      isVegan: false,
      isCrueltyFree: true,
      isSulfateFree: true,
      isSiliconeFree: true
    },
    affiliate_url: "https://example.com/cerave-cleanser"
  },
  {
    name: "Sulfate-Free Curl Shampoo",
    brand: "DevaCurl",
    type: "hair",
    price: 32.00,
    ingredients: ["Coconut Oil", "Shea Butter", "Quinoa Protein"],
    flags: {
      isNatural: true,
      isFragranceFree: false,
      isVegan: true,
      isCrueltyFree: true,
      isSulfateFree: true,
      isSiliconeFree: true
    },
    affiliate_url: "https://example.com/devacurl-shampoo"
  },
  {
    name: "Organic Rose Hip Oil",
    brand: "The Ordinary",
    type: "skin",
    price: 18.50,
    ingredients: ["Rose Hip Seed Oil", "Vitamin E"],
    flags: {
      isNatural: true,
      isFragranceFree: true,
      isVegan: true,
      isCrueltyFree: true,
      isSulfateFree: true,
      isSiliconeFree: true
    },
    affiliate_url: "https://example.com/ordinary-rosehip"
  },
  {
    name: "Argan Oil Hair Mask",
    brand: "Moroccanoil",
    type: "hair",
    price: 45.00,
    ingredients: ["Argan Oil", "Keratin", "Vitamin E"],
    flags: {
      isNatural: true,
      isFragranceFree: false,
      isVegan: false,
      isCrueltyFree: true,
      isSulfateFree: true,
      isSiliconeFree: false
    },
    affiliate_url: "https://example.com/moroccanoil-mask"
  },
  {
    name: "Vitamin C Brightening Serum",
    brand: "Mad Hippie",
    type: "skin",
    price: 33.99,
    ingredients: ["Vitamin C", "Hyaluronic Acid", "Ferulic Acid"],
    flags: {
      isNatural: true,
      isFragranceFree: true,
      isVegan: true,
      isCrueltyFree: true,
      isSulfateFree: true,
      isSiliconeFree: true
    },
    affiliate_url: "https://example.com/madhippie-vitc"
  },
  {
    name: "Natural Dry Shampoo",
    brand: "Batiste",
    type: "hair",
    price: 12.99,
    ingredients: ["Rice Starch", "Kaolin Clay", "Essential Oils"],
    flags: {
      isNatural: true,
      isFragranceFree: false,
      isVegan: true,
      isCrueltyFree: true,
      isSulfateFree: true,
      isSiliconeFree: true
    },
    affiliate_url: "https://example.com/batiste-dry"
  },
  {
    name: "Hydrating Gel Moisturizer",
    brand: "Neutrogena",
    type: "skin",
    price: 19.99,
    ingredients: ["Hyaluronic Acid", "Olive Extract", "Glycerin"],
    flags: {
      isNatural: false,
      isFragranceFree: true,
      isVegan: false,
      isCrueltyFree: false,
      isSulfateFree: true,
      isSiliconeFree: true
    },
    affiliate_url: "https://example.com/neutrogena-gel"
  },
  {
    name: "Coconut Oil Leave-In Treatment",
    brand: "Shea Moisture",
    type: "hair",
    price: 16.99,
    ingredients: ["Coconut Oil", "Shea Butter", "Hibiscus Extract"],
    flags: {
      isNatural: true,
      isFragranceFree: false,
      isVegan: true,
      isCrueltyFree: true,
      isSulfateFree: true,
      isSiliconeFree: true
    },
    affiliate_url: "https://example.com/sheamoisture-coconut"
  },
  {
    name: "Mineral Sunscreen SPF 30",
    brand: "EltaMD",
    type: "skin",
    price: 37.00,
    ingredients: ["Zinc Oxide", "Titanium Dioxide", "Niacinamide"],
    flags: {
      isNatural: false,
      isFragranceFree: true,
      isVegan: false,
      isCrueltyFree: true,
      isSulfateFree: true,
      isSiliconeFree: false
    },
    affiliate_url: "https://example.com/eltamd-sunscreen"
  },
  {
    name: "Clarifying Apple Cider Vinegar Rinse",
    brand: "Bragg",
    type: "hair",
    price: 8.99,
    ingredients: ["Apple Cider Vinegar", "Water", "Natural Enzymes"],
    flags: {
      isNatural: true,
      isFragranceFree: true,
      isVegan: true,
      isCrueltyFree: true,
      isSulfateFree: true,
      isSiliconeFree: true
    },
    affiliate_url: "https://example.com/bragg-acv"
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Initializing database...');
    await initDatabase();
    
    console.log('🌱 Seeding products...');
    
    for (const product of sampleProducts) {
      try {
        await dbHelpers.createProduct(product);
        console.log(`✅ Added: ${product.name} by ${product.brand}`);
      } catch (error) {
        console.log(`⚠️  Skipped: ${product.name} (already exists)`);
      }
    }
    
    console.log('🎉 Product seeding completed!');
    console.log(`📦 Added ${sampleProducts.length} clean beauty products to database`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();