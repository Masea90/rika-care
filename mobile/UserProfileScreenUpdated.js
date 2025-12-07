import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SKIN_TYPES, SKIN_CONCERNS, HAIR_TYPES, HAIR_TEXTURES, USER_PROFILE_SCHEMA, SUBSCRIPTION_TIERS } from '../shared/types.js';
import { COLORS } from '../shared/colors.js';

const UserProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(USER_PROFILE_SCHEMA);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const updateProfile = (section, field, value) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const toggleArrayItem = (section, field, item) => {
    setProfile(prev => {
      const currentArray = prev[section][field];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray
        }
      };
    });
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell us about yourself</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Your name"
        value={profile.personalInfo.name}
        onChangeText={(text) => updateProfile('personalInfo', 'name', text)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={profile.personalInfo.age?.toString() || ''}
        onChangeText={(text) => updateProfile('personalInfo', 'age', parseInt(text) || null)}
      />
      
      <Text style={styles.label}>Gender</Text>
      <View style={styles.optionRow}>
        {['Female', 'Male', 'Other'].map(gender => (
          <TouchableOpacity
            key={gender}
            style={[styles.option, profile.personalInfo.gender === gender && styles.selectedOption]}
            onPress={() => updateProfile('personalInfo', 'gender', gender)}
          >
            <Text style={styles.optionText}>{gender}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your skin type?</Text>
      
      <View style={styles.optionGrid}>
        {Object.entries(SKIN_TYPES).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={[styles.skinTypeOption, profile.skinProfile.skinType === value && styles.selectedOption]}
            onPress={() => updateProfile('skinProfile', 'skinType', value)}
          >
            <Text style={styles.optionText}>{key}</Text>
            <Text style={styles.optionDescription}>
              {getSkinTypeDescription(value)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Any skin concerns?</Text>
      <Text style={styles.subtitle}>Select all that apply</Text>
      
      <View style={styles.optionGrid}>
        {Object.entries(SKIN_CONCERNS).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.concernOption,
              profile.skinProfile.skinConcerns.includes(value) && styles.selectedOption
            ]}
            onPress={() => toggleArrayItem('skinProfile', 'skinConcerns', value)}
          >
            <Text style={styles.optionText}>{key.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell us about your hair</Text>
      
      <Text style={styles.label}>Hair type</Text>
      <View style={styles.optionGrid}>
        {Object.entries(HAIR_TYPES).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={[styles.hairOption, profile.hairProfile.hairType === value && styles.selectedOption]}
            onPress={() => updateProfile('hairProfile', 'hairType', value)}
          >
            <Text style={styles.optionText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Hair texture</Text>
      <View style={styles.optionGrid}>
        {Object.entries(HAIR_TEXTURES).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={[styles.hairOption, profile.hairProfile.hairTexture === value && styles.selectedOption]}
            onPress={() => updateProfile('hairProfile', 'hairTexture', value)}
          >
            <Text style={styles.optionText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Budget & Preferences</Text>
      
      <Text style={styles.label}>Monthly budget for beauty products ($)</Text>
      <View style={styles.budgetRow}>
        <TextInput
          style={[styles.input, styles.budgetInput]}
          placeholder="Min"
          keyboardType="numeric"
          value={profile.preferences.budgetRange.min?.toString() || ''}
          onChangeText={(text) => {
            const newBudget = { ...profile.preferences.budgetRange, min: parseInt(text) || 0 };
            updateProfile('preferences', 'budgetRange', newBudget);
          }}
        />
        <Text style={styles.budgetSeparator}>to</Text>
        <TextInput
          style={[styles.input, styles.budgetInput]}
          placeholder="Max"
          keyboardType="numeric"
          value={profile.preferences.budgetRange.max?.toString() || ''}
          onChangeText={(text) => {
            const newBudget = { ...profile.preferences.budgetRange, max: parseInt(text) || 100 };
            updateProfile('preferences', 'budgetRange', newBudget);
          }}
        />
      </View>

      <Text style={styles.label}>Important certifications</Text>
      <View style={styles.optionGrid}>
        {['Organic', 'Cruelty-free', 'Vegan', 'Natural'].map(cert => (
          <TouchableOpacity
            key={cert}
            style={[
              styles.certOption,
              profile.preferences.certificationPreferences.includes(cert.toLowerCase().replace('-', '_')) && styles.selectedOption
            ]}
            onPress={() => toggleArrayItem('preferences', 'certificationPreferences', cert.toLowerCase().replace('-', '_'))}
          >
            <Text style={styles.optionText}>{cert}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep6 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Join Our Community</Text>
      <Text style={styles.subtitle}>Connect with people who share your beauty journey</Text>
      
      <View style={styles.communityCard}>
        <Text style={styles.communityTitle}>🌟 Find Your Beauty Tribe</Text>
        <Text style={styles.communityText}>Match with users who have similar skin type, hair type, and beauty goals</Text>
      </View>

      <Text style={styles.label}>Community preferences</Text>
      <TouchableOpacity
        style={[styles.toggleOption, profile.community.isPublic && styles.selectedToggle]}
        onPress={() => updateProfile('community', 'isPublic', !profile.community.isPublic)}
      >
        <Text style={styles.toggleText}>Make my profile public</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.toggleOption, profile.community.allowMatching && styles.selectedToggle]}
        onPress={() => updateProfile('community', 'allowMatching', !profile.community.allowMatching)}
      >
        <Text style={styles.toggleText}>Allow community matching</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.toggleOption, profile.community.shareRoutines && styles.selectedToggle]}
        onPress={() => updateProfile('community', 'shareRoutines', !profile.community.shareRoutines)}
      >
        <Text style={styles.toggleText}>Share my beauty routines</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => navigation.navigate('LanguageSettings')}
      >
        <Text style={styles.languageButtonText}>🌍 Language Settings</Text>
      </TouchableOpacity>

      <View style={styles.premiumCard}>
        <Text style={styles.premiumTitle}>✨ Upgrade to Premium</Text>
        <Text style={styles.premiumPrice}>$9.99/month</Text>
        <Text style={styles.premiumFeatures}>• Advanced AI recommendations{'\n'}• Unlimited routine sharing{'\n'}• Expert consultations{'\n'}• Product discounts</Text>
        <TouchableOpacity style={styles.premiumButton}>
          <Text style={styles.premiumButtonText}>Start Free Trial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getSkinTypeDescription = (type) => {
    const descriptions = {
      dry: 'Tight, flaky, rough texture',
      oily: 'Shiny, large pores, prone to breakouts',
      combination: 'Oily T-zone, dry cheeks',
      sensitive: 'Easily irritated, reactive',
      normal: 'Balanced, smooth, few imperfections'
    };
    return descriptions[type] || '';
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    else {
      // Save profile and navigate to main app
      console.log('Profile completed:', profile);
      navigation.navigate('Dashboard');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your Profile</Text>
        <Text style={styles.progress}>Step {currentStep} of {totalSteps}</Text>
      </View>

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
      {currentStep === 5 && renderStep5()}
      {currentStep === 6 && renderStep6()}

      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={prevStep}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? 'Complete Profile' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  progress: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 10,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.surface,
    marginBottom: 15,
    color: COLORS.textPrimary,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 80,
    alignItems: 'center',
  },
  skinTypeOption: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  concernOption: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  certOption: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  hairOption: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  optionDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  budgetInput: {
    flex: 1,
    marginBottom: 0,
  },
  budgetSeparator: {
    marginHorizontal: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 0,
  },
  backButton: {
    backgroundColor: COLORS.border,
    padding: 15,
    borderRadius: 8,
    flex: 0.4,
  },
  backButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    flex: 0.55,
  },
  nextButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.surface,
  },
  communityCard: {
    backgroundColor: COLORS.community,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
    marginBottom: 8,
  },
  communityText: {
    fontSize: 14,
    color: COLORS.surface,
    opacity: 0.9,
  },
  toggleOption: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  selectedToggle: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  premiumCard: {
    backgroundColor: COLORS.premium,
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 5,
  },
  premiumPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
    marginBottom: 10,
  },
  premiumFeatures: {
    fontSize: 14,
    color: COLORS.surface,
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.9,
  },
  premiumButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  premiumButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.premium,
  },
  languageButton: {
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
  },
});

export default UserProfileScreen;