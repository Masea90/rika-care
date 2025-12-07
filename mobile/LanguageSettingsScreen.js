import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../shared/colors.js';
import { i18n } from '../shared/languages.js';

const LanguageSettingsScreen = ({ navigation, userProfile, onLanguageChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  useEffect(() => {
    loadCurrentLanguage();
  }, []);

  const loadCurrentLanguage = async () => {
    try {
      const authToken = await AsyncStorage.getItem('rikaToken');
      const response = await fetch('http://localhost:3000/api/user/language', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedLanguage(data.language);
        i18n.setLanguage(data.language);
      }
    } catch (error) {
      console.log('Could not load language preference');
    }
  };

  const changeLanguage = async (languageCode) => {
    setLoading(true);
    
    try {
      const authToken = await AsyncStorage.getItem('rikaToken');
      const response = await fetch('http://localhost:3000/api/user/language', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ language: languageCode })
      });
      
      if (response.ok) {
        setSelectedLanguage(languageCode);
        i18n.setLanguage(languageCode);
        
        if (onLanguageChange) {
          onLanguageChange(languageCode);
        }
        
        Alert.alert(
          i18n.t('success'),
          'Language updated successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(i18n.t('error'), 'Failed to update language');
      }
    } catch (error) {
      Alert.alert(i18n.t('error'), 'Language update failed');
    } finally {
      setLoading(false);
    }
  };

  const renderLanguageOption = (language) => (
    <TouchableOpacity
      key={language.code}
      style={[
        styles.languageOption,
        selectedLanguage === language.code && styles.selectedLanguage
      ]}
      onPress={() => changeLanguage(language.code)}
      disabled={loading}
    >
      <View style={styles.languageInfo}>
        <Text style={styles.flag}>{language.flag}</Text>
        <Text style={[
          styles.languageName,
          selectedLanguage === language.code && styles.selectedLanguageName
        ]}>
          {language.name}
        </Text>
      </View>
      {selectedLanguage === language.code && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Language</Text>
        <Text style={styles.subtitle}>Select your preferred language</Text>
      </View>

      <View style={styles.languageList}>
        {languages.map(renderLanguageOption)}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Language changes will be applied immediately
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  languageList: {
    flex: 1,
  },
  languageOption: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLanguage: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.accent,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  selectedLanguageName: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default LanguageSettingsScreen;