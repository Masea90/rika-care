export class DermatologyExpert {
  constructor() {
    this.safeRecommendations = this.initializeSafeRecommendations();
    this.warningFlags = this.initializeWarningFlags();
    this.professionalReferralTriggers = this.initializeProfessionalReferrals();
  }

  initializeSafeRecommendations() {
    return {
      dry_skin: {
        ingredients: ['hyaluronic acid', 'ceramides', 'glycerin', 'squalane', 'niacinamide'],
        avoid: ['alcohol', 'strong fragrances', 'harsh sulfates'],
        routine: ['gentle cream cleanser', 'hydrating toner', 'rich moisturizer', 'sunscreen'],
        tips: ['Use lukewarm water', 'Pat dry, don\'t rub', 'Apply moisturizer on damp skin']
      },
      oily_skin: {
        ingredients: ['salicylic acid', 'niacinamide', 'zinc', 'clay', 'retinol'],
        avoid: ['over-cleansing', 'harsh scrubs', 'heavy oils'],
        routine: ['gel cleanser', 'BHA toner', 'lightweight moisturizer', 'oil-free sunscreen'],
        tips: ['Don\'t skip moisturizer', 'Use clay masks 1-2x weekly', 'Blot excess oil, don\'t wash']
      },
      sensitive_skin: {
        ingredients: ['aloe vera', 'chamomile', 'oat extract', 'zinc oxide', 'ceramides'],
        avoid: ['fragrances', 'essential oils', 'alcohol', 'harsh acids', 'retinoids'],
        routine: ['gentle cleanser', 'fragrance-free moisturizer', 'mineral sunscreen'],
        tips: ['Patch test everything', 'Introduce one product at a time', 'Use minimal ingredients']
      },
      combination_skin: {
        ingredients: ['niacinamide', 'hyaluronic acid', 'gentle BHA', 'lightweight oils'],
        avoid: ['one-size-fits-all products', 'over-treating oily areas'],
        routine: ['gentle cleanser', 'targeted treatments', 'different moisturizers for different areas'],
        tips: ['Treat T-zone and cheeks differently', 'Use lighter products in summer', 'Don\'t over-complicate']
      },
      normal_skin: {
        ingredients: ['vitamin C', 'retinol', 'hyaluronic acid', 'peptides'],
        avoid: ['over-exfoliating', 'too many active ingredients'],
        routine: ['gentle cleanser', 'antioxidant serum', 'moisturizer', 'broad-spectrum SPF'],
        tips: ['Maintain consistency', 'Focus on prevention', 'Listen to your skin\'s needs']
      }
    };
  }

  initializeWarningFlags() {
    return {
      medical_conditions: [
        'persistent redness lasting weeks',
        'unusual moles or growths',
        'severe acne with cysts',
        'rashes that don\'t improve',
        'excessive hair loss',
        'scalp irritation with bleeding'
      ],
      ingredient_allergies: [
        'known allergies to specific ingredients',
        'history of severe reactions',
        'contact dermatitis',
        'eczema flare-ups'
      ],
      age_restrictions: [
        'under 13 years old',
        'pregnancy concerns',
        'breastfeeding considerations'
      ]
    };
  }

  initializeProfessionalReferrals() {
    return {
      dermatologist: [
        'persistent acne after 3 months of treatment',
        'suspicious moles or skin changes',
        'severe eczema or psoriasis',
        'hair loss concerns',
        'skin cancer screening needed'
      ],
      allergist: [
        'multiple product allergies',
        'severe contact dermatitis',
        'unknown allergen identification needed'
      ],
      trichologist: [
        'significant hair loss',
        'scalp conditions',
        'hair texture changes'
      ]
    };
  }

  // Safe recommendation engine
  getSafeRecommendations(skinType, concerns, userProfile) {
    const baseRecs = this.safeRecommendations[skinType] || this.safeRecommendations.normal_skin;
    
    // Check for warning flags first
    const warnings = this.checkWarningFlags(concerns, userProfile);
    if (warnings.requiresProfessional) {
      return {
        type: 'professional_referral',
        message: warnings.message,
        specialist: warnings.specialist,
        urgency: warnings.urgency
      };
    }

    // Generate safe recommendations
    const recommendations = {
      skinType: skinType,
      safeIngredients: baseRecs.ingredients,
      avoidIngredients: baseRecs.avoid,
      basicRoutine: baseRecs.routine,
      careTips: baseRecs.tips,
      concerns: this.addressConcernsSafely(concerns),
      disclaimer: 'These are general skincare suggestions. Individual results may vary. Consult a dermatologist for persistent issues.'
    };

    return recommendations;
  }

  checkWarningFlags(concerns, userProfile) {
    // Check for medical conditions that need professional attention
    const medicalFlags = this.warningFlags.medical_conditions.some(flag => 
      concerns.some(concern => concern.toLowerCase().includes(flag.toLowerCase()))
    );

    if (medicalFlags) {
      return {
        requiresProfessional: true,
        message: 'Based on your concerns, we recommend consulting a dermatologist for proper evaluation.',
        specialist: 'dermatologist',
        urgency: 'moderate'
      };
    }

    // Check age restrictions
    if (userProfile.age && userProfile.age < 13) {
      return {
        requiresProfessional: true,
        message: 'For users under 13, please consult with a pediatric dermatologist for skincare guidance.',
        specialist: 'pediatric_dermatologist',
        urgency: 'low'
      };
    }

    // Check for severe allergies
    if (userProfile.allergies && userProfile.allergies.length > 3) {
      return {
        requiresProfessional: true,
        message: 'With multiple known allergies, an allergist consultation would be beneficial for safe product selection.',
        specialist: 'allergist',
        urgency: 'moderate'
      };
    }

    return { requiresProfessional: false };
  }

  addressConcernsSafely(concerns) {
    const safeConcernAdvice = {
      acne: {
        mild: 'Gentle salicylic acid products, consistent routine, avoid over-cleansing',
        moderate: 'Consider OTC benzoyl peroxide, maintain gentle routine',
        severe: 'Consult dermatologist for prescription options'
      },
      dryness: {
        advice: 'Hyaluronic acid serums, ceramide moisturizers, avoid hot water',
        products: ['gentle cream cleansers', 'hydrating toners', 'occlusive moisturizers']
      },
      sensitivity: {
        advice: 'Minimal ingredient products, patch testing, fragrance-free formulas',
        products: ['mineral sunscreens', 'oat-based cleansers', 'ceramide moisturizers']
      },
      aging: {
        advice: 'Consistent sunscreen use, gentle retinol introduction, antioxidants',
        products: ['vitamin C serums', 'peptide creams', 'broad-spectrum SPF']
      },
      dark_spots: {
        advice: 'Vitamin C, gentle exfoliation, religious sunscreen use',
        products: ['niacinamide serums', 'kojic acid treatments', 'SPF 30+ daily']
      }
    };

    return concerns.map(concern => ({
      concern: concern,
      safeAdvice: safeConcernAdvice[concern] || {
        advice: 'Maintain gentle, consistent routine and consult professional if persistent',
        products: ['gentle cleansers', 'basic moisturizers', 'sunscreen']
      }
    }));
  }

  // Hair analysis safety
  getSafeHairRecommendations(hairType, hairTexture, concerns) {
    const hairAdvice = {
      straight: {
        care: ['lightweight products', 'avoid heavy oils', 'gentle brushing'],
        products: ['volumizing shampoos', 'light conditioners', 'heat protectants']
      },
      wavy: {
        care: ['scrunch don\'t brush when wet', 'use microfiber towels', 'avoid sulfates'],
        products: ['curl-enhancing creams', 'leave-in conditioners', 'diffuser drying']
      },
      curly: {
        care: ['co-washing method', 'wide-tooth comb only', 'plopping technique'],
        products: ['curl creams', 'deep conditioners', 'gel for hold']
      },
      coily: {
        care: ['protective styling', 'deep conditioning weekly', 'gentle detangling'],
        products: ['heavy creams', 'natural oils', 'leave-in treatments']
      }
    };

    const textureAdvice = {
      fine: ['lightweight products', 'avoid over-conditioning', 'gentle handling'],
      medium: ['balanced products', 'regular conditioning', 'moderate styling'],
      thick: ['rich products', 'deep conditioning', 'stronger styling products']
    };

    return {
      hairType: hairType,
      hairTexture: hairTexture,
      careRoutine: hairAdvice[hairType]?.care || ['gentle care', 'regular conditioning'],
      recommendedProducts: hairAdvice[hairType]?.products || ['mild shampoo', 'basic conditioner'],
      textureSpecific: textureAdvice[hairTexture] || ['gentle care'],
      safetyNote: 'Avoid harsh chemicals, excessive heat, and tight styling that may cause damage.',
      professionalAdvice: 'For significant hair concerns, consult a trichologist or dermatologist.'
    };
  }

  // Ingredient safety checker
  checkIngredientSafety(ingredients, userProfile) {
    const safetyReport = {
      safe: [],
      caution: [],
      avoid: [],
      recommendations: []
    };

    const cautionIngredients = {
      'retinol': 'Start slowly, use at night, increase sun protection',
      'salicylic acid': 'May cause dryness, start with low concentration',
      'glycolic acid': 'Can increase sun sensitivity, use sunscreen',
      'benzoyl peroxide': 'May bleach fabrics, can cause dryness',
      'essential oils': 'Potential allergens, patch test recommended'
    };

    const avoidIngredients = {
      'hydroquinone': 'Requires professional supervision',
      'tretinoin': 'Prescription only, professional guidance needed',
      'high concentration acids': 'Professional treatment recommended'
    };

    ingredients.forEach(ingredient => {
      const lowerIngredient = ingredient.toLowerCase();
      
      if (avoidIngredients[lowerIngredient]) {
        safetyReport.avoid.push({
          ingredient: ingredient,
          reason: avoidIngredients[lowerIngredient]
        });
      } else if (cautionIngredients[lowerIngredient]) {
        safetyReport.caution.push({
          ingredient: ingredient,
          advice: cautionIngredients[lowerIngredient]
        });
      } else {
        safetyReport.safe.push(ingredient);
      }
    });

    // Add personalized recommendations
    if (userProfile.skinProfile?.skinType === 'sensitive') {
      safetyReport.recommendations.push('With sensitive skin, introduce new ingredients one at a time');
    }

    if (userProfile.age && userProfile.age < 25) {
      safetyReport.recommendations.push('Focus on gentle, preventive care rather than anti-aging actives');
    }

    return safetyReport;
  }

  // Generate safety disclaimer
  generateSafetyDisclaimer(analysisType) {
    const disclaimers = {
      skin_analysis: 'This analysis is for educational and cosmetic guidance only. It is not a medical diagnosis. For persistent skin issues, unusual changes, or medical concerns, please consult a qualified dermatologist.',
      
      hair_analysis: 'This hair analysis provides general care guidance. For significant hair loss, scalp conditions, or other hair-related medical concerns, consult a trichologist or dermatologist.',
      
      product_recommendations: 'Product recommendations are based on general skin/hair characteristics. Individual reactions may vary. Always patch test new products and discontinue use if irritation occurs.',
      
      ingredient_advice: 'Ingredient information is for educational purposes. Concentrations, formulations, and individual sensitivities can affect results. When in doubt, consult a skincare professional.'
    };

    return {
      disclaimer: disclaimers[analysisType] || disclaimers.skin_analysis,
      emergencyNote: 'If you experience severe reactions, persistent symptoms, or concerning changes, seek immediate professional medical attention.',
      ageNote: 'Recommendations may vary based on age, pregnancy, medical conditions, and medications. Consult healthcare providers when appropriate.'
    };
  }
}

export const dermatologyExpert = new DermatologyExpert();