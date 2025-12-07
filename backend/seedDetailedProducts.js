const { dbHelpers } = require('./database');

const sampleProducts = [
  {
    name: "Gentle Ceramide Cleanser",
    brand: "CeraVe",
    category: "skin",
    price: 14.99,
    ingredients: ["Ceramides", "Hyaluronic Acid", "Niacinamide"],
    flags: { isNatural: false, isFragranceFree: true, isCrueltyFree: true },
    full_description: "A gentle, non-foaming cleanser that removes makeup and dirt while maintaining the skin's natural protective barrier. Developed with dermatologists, this cleanser is suitable for normal to dry skin.",
    benefits: [
      "Maintains skin's natural protective barrier",
      "Removes makeup and impurities without stripping",
      "Provides long-lasting hydration",
      "Non-comedogenic and fragrance-free"
    ],
    how_to_use: "Apply to wet skin, massage gently, and rinse with lukewarm water. Use morning and evening.",
    full_ingredient_list: "Aqua/Water, Glycerin, Behentrimonium Methosulfate, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Dimethicone, Cetearyl Alcohol, Sodium Chloride, Sodium Lauroyl Lactylate, Cholesterol, Phenoxyethanol, Disodium EDTA, Dipotassium Phosphate, Tocopheryl Acetate, Phytosphingosine, Xanthan Gum, Ethylhexylglycerin",
    clean_flags: {
      sulfateFree: true,
      siliconeFree: false,
      alcoholFree: true,
      fragranceFree: true,
      vegan: false,
      crueltyFree: true,
      natural: false
    },
    suitability: {
      skinType: ["dry", "normal", "sensitive"],
      concerns: ["dryness", "sensitivity", "barrier repair"]
    },
    affiliate_url: "https://example.com/product?id=cerave-cleanser&utm_source=rika&utm_medium=affiliate&utm_campaign=skincare",
    image_url: "/images/cerave-cleanser.jpg"
  },
  {
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "skin",
    price: 7.20,
    ingredients: ["Niacinamide", "Zinc PCA"],
    flags: { isNatural: false, isFragranceFree: true, isCrueltyFree: true },
    full_description: "A high-strength vitamin and mineral blemish formula with 10% Niacinamide and 1% Zinc PCA to help reduce the appearance of skin blemishes and congestion.",
    benefits: [
      "Reduces appearance of skin blemishes",
      "Balances visible aspects of sebum activity",
      "Supports blemish-prone skin",
      "Improves skin texture over time"
    ],
    how_to_use: "Apply to entire face morning and evening before heavier creams. Dilute with other serums or moisturizers if irritation occurs.",
    full_ingredient_list: "Aqua (Water), Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan Gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin",
    clean_flags: {
      sulfateFree: true,
      siliconeFree: true,
      alcoholFree: true,
      fragranceFree: true,
      vegan: true,
      crueltyFree: true,
      natural: false
    },
    suitability: {
      skinType: ["oily", "combination", "acne-prone"],
      concerns: ["acne", "oiliness", "large pores", "blemishes"]
    },
    affiliate_url: "https://example.com/product?id=ordinary-niacinamide&utm_source=rika&utm_medium=affiliate&utm_campaign=skincare",
    image_url: "/images/ordinary-niacinamide.jpg"
  },
  {
    name: "Sulfate-Free Curl Shampoo",
    brand: "DevaCurl",
    category: "hair",
    price: 22.00,
    ingredients: ["Coconut Oil", "Shea Butter", "Quinoa Protein"],
    flags: { isNatural: true, isFragranceFree: false, isCrueltyFree: true },
    full_description: "A gentle, sulfate-free shampoo specifically formulated for curly and wavy hair. Cleanses without stripping natural oils while enhancing curl definition.",
    benefits: [
      "Enhances natural curl pattern",
      "Reduces frizz and tangles",
      "Maintains hair's natural moisture",
      "Sulfate and silicone-free formula"
    ],
    how_to_use: "Apply to wet hair, gently massage scalp, and rinse thoroughly. Follow with DevaCurl conditioner for best results.",
    full_ingredient_list: "Water, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Sodium Lauroyl Methyl Isethionate, Glycerin, Coconut Oil, Shea Butter, Quinoa Protein, Panthenol, Citric Acid, Sodium Chloride, Phenoxyethanol, Natural Fragrance",
    clean_flags: {
      sulfateFree: true,
      siliconeFree: true,
      alcoholFree: true,
      fragranceFree: false,
      vegan: false,
      crueltyFree: true,
      natural: true
    },
    suitability: {
      hairType: ["curly", "wavy", "coily"],
      concerns: ["frizz", "dryness", "curl definition"]
    },
    affiliate_url: "https://example.com/product?id=devacurl-shampoo&utm_source=rika&utm_medium=affiliate&utm_campaign=haircare",
    image_url: "/images/devacurl-shampoo.jpg"
  },
  {
    name: "Hyaluronic Acid 2% + B5",
    brand: "The Ordinary",
    category: "skin",
    price: 8.90,
    ingredients: ["Hyaluronic Acid", "Vitamin B5", "Sodium Hyaluronate"],
    flags: { isNatural: false, isFragranceFree: true, isCrueltyFree: true },
    full_description: "A water-based serum with multiple types and molecular weights of hyaluronic acid and vitamin B5 for enhanced hydration.",
    benefits: [
      "Intense hydration for all skin types",
      "Plumps and smooths skin texture",
      "Lightweight, non-greasy formula",
      "Suitable for sensitive skin"
    ],
    how_to_use: "Apply to damp skin morning and evening before oils and creams. Can be mixed with other serums.",
    full_ingredient_list: "Aqua (Water), Sodium Hyaluronate, Panthenol, Ahnfeltia Concinna Extract, Glycerin, Pentylene Glycol, Propanediol, Polyacrylate Crosspolymer-6, PPG-26-Buteth-26, PEG-40 Hydrogenated Castor Oil, Trisodium Ethylenediamine Disuccinate, Citric Acid, Ethoxydiglycol, Caprylyl Glycol, Hexylene Glycol, Phenoxyethanol, Chlorphenesin",
    clean_flags: {
      sulfateFree: true,
      siliconeFree: true,
      alcoholFree: true,
      fragranceFree: true,
      vegan: true,
      crueltyFree: true,
      natural: false
    },
    suitability: {
      skinType: ["all"],
      concerns: ["dryness", "dehydration", "fine lines", "dullness"]
    },
    affiliate_url: "https://example.com/product?id=ordinary-hyaluronic&utm_source=rika&utm_medium=affiliate&utm_campaign=skincare",
    image_url: "/images/ordinary-hyaluronic.jpg"
  },
  {
    name: "Argan Oil Hair Treatment",
    brand: "Moroccanoil",
    category: "hair",
    price: 34.00,
    ingredients: ["Argan Oil", "Vitamin E", "Essential Fatty Acids"],
    flags: { isNatural: true, isFragranceFree: false, isCrueltyFree: true },
    full_description: "A versatile, nourishing hair treatment that can be used as a conditioning, styling and finishing tool. Infused with antioxidant-rich argan oil and shine-boosting vitamins.",
    benefits: [
      "Adds instant shine and softness",
      "Reduces frizz and flyaways",
      "Protects against heat damage",
      "Suitable for all hair types"
    ],
    how_to_use: "Apply 1-2 pumps to damp or dry hair from mid-length to ends. Style as usual. Can be used daily.",
    full_ingredient_list: "Argania Spinosa (Argan) Kernel Oil, Cyclopentasiloxane, Dimethicone, Cyclohexasiloxane, Butylphenyl Methylpropional, Linalool, Alpha-Isomethyl Ionone, Parfum/Fragrance, CI 26100 (Red 17), CI 47000 (Yellow 11)",
    clean_flags: {
      sulfateFree: true,
      siliconeFree: false,
      alcoholFree: true,
      fragranceFree: false,
      vegan: true,
      crueltyFree: true,
      natural: true
    },
    suitability: {
      hairType: ["all"],
      concerns: ["dryness", "frizz", "damage", "dullness"]
    },
    affiliate_url: "https://example.com/product?id=moroccanoil-treatment&utm_source=rika&utm_medium=affiliate&utm_campaign=haircare",
    image_url: "/images/moroccanoil-treatment.jpg"
  },
  {
    name: "Vitamin C Serum 20%",
    brand: "Skinceuticals",
    category: "skin",
    price: 169.00,
    ingredients: ["L-Ascorbic Acid", "Vitamin E", "Ferulic Acid"],
    flags: { isNatural: false, isFragranceFree: true, isCrueltyFree: true },
    full_description: "A potent antioxidant serum that delivers advanced environmental protection and improves signs of aging and photodamage.",
    benefits: [
      "Provides advanced antioxidant protection",
      "Improves signs of aging and photodamage",
      "Brightens skin tone",
      "Stimulates collagen synthesis"
    ],
    how_to_use: "Apply 4-5 drops to clean, dry skin in the morning before moisturizer and sunscreen.",
    full_ingredient_list: "Aqua/Water, L-Ascorbic Acid, Alpha Tocopherol, Zinc Sulfate, Phenoxyethanol, Tyrosine, Sodium Hyaluronate, Bioflavonoids, Panthenol",
    clean_flags: {
      sulfateFree: true,
      siliconeFree: true,
      alcoholFree: false,
      fragranceFree: true,
      vegan: false,
      crueltyFree: true,
      natural: false
    },
    suitability: {
      skinType: ["normal", "oily", "combination"],
      concerns: ["aging", "dullness", "dark spots", "environmental damage"]
    },
    affiliate_url: "https://example.com/product?id=skinceuticals-vitamin-c&utm_source=rika&utm_medium=affiliate&utm_campaign=skincare",
    image_url: "/images/skinceuticals-vitamin-c.jpg"
  },
  {
    name: "Olaplex Hair Perfector No. 3",
    brand: "Olaplex",
    category: "hair",
    price: 28.00,
    ingredients: ["Bis-Aminopropyl Diglycol Dimaleate", "Water", "Cetearyl Alcohol"],
    flags: { isNatural: false, isFragranceFree: false, isCrueltyFree: true },
    full_description: "A weekly at-home treatment that reduces breakage and visibly strengthens hair, improving its look and feel.",
    benefits: [
      "Repairs damaged and compromised hair",
      "Strengthens and protects hair structure",
      "Restores healthy appearance and texture",
      "Works on all hair types"
    ],
    how_to_use: "Apply to towel-dried hair, comb through, leave on for minimum 10 minutes, then shampoo and condition.",
    full_ingredient_list: "Water, Bis-Aminopropyl Diglycol Dimaleate, Propylene Glycol, Cetearyl Alcohol, Behentrimonium Methosulfate, Cetyl Alcohol, Phenoxyethanol, Glycerin, Hydroxyethyl Ethylcellulose, Stearamidopropyl Dimethylamine, Quaternium-22, Polyquaternium-37, Tetrasodium EDTA, Benzyl Benzoate, Etidronic Acid, Pentasodium Pentetate, Hexyl Cinnamal, Limonene, Linalool, Citric Acid, Sodium Hydroxide",
    clean_flags: {
      sulfateFree: true,
      siliconeFree: true,
      alcoholFree: true,
      fragranceFree: false,
      vegan: true,
      crueltyFree: true,
      natural: false
    },
    suitability: {
      hairType: ["all"],
      concerns: ["damage", "breakage", "dryness", "chemical damage"]
    },
    affiliate_url: "https://example.com/product?id=olaplex-no3&utm_source=rika&utm_medium=affiliate&utm_campaign=haircare",
    image_url: "/images/olaplex-no3.jpg"
  }
];

async function seedDetailedProducts() {
  console.log('🌱 Seeding detailed products...');
  
  try {
    for (const product of sampleProducts) {
      await dbHelpers.createProduct({
        ...product,
        benefits: JSON.stringify(product.benefits),
        clean_flags: JSON.stringify(product.clean_flags),
        suitability: JSON.stringify(product.suitability)
      });
    }
    console.log('✅ Successfully seeded', sampleProducts.length, 'detailed products');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDetailedProducts().then(() => process.exit(0));
}

module.exports = { seedDetailedProducts };