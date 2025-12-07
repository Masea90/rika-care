import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../shared/colors.js';

const CameraAnalysisScreen = ({ navigation, onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  // Mock AI analysis - in real app, this would call an AI service
  const analyzeImage = async (imageUri) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis result
    const mockResult = {
      skinType: 'combination',
      confidence: 0.87,
      skinConcerns: ['oiliness', 'pores'],
      skinTone: 'medium',
      recommendations: [
        'Your T-zone shows signs of oiliness',
        'Visible pores detected in nose area',
        'Overall skin appears healthy'
      ],
      safetyNote: 'Analysis is for cosmetic guidance only. Consult a dermatologist for medical concerns.'
    };
    
    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  const takeSelfie = () => {
    // Mock camera capture - in real app, this would use camera API
    Alert.alert(
      'Camera Instructions',
      '• Face the camera directly\n• Ensure good lighting\n• Remove makeup if possible\n• Keep face centered',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Take Photo', 
          onPress: () => {
            // Simulate photo capture
            const mockImageUri = 'mock_selfie.jpg';
            setCapturedImage(mockImageUri);
            analyzeImage(mockImageUri);
          }
        }
      ]
    );
  };

  const renderCameraInterface = () => (
    <View style={styles.cameraContainer}>
      <Text style={styles.title}>AI Skin Analysis</Text>
      <Text style={styles.subtitle}>Take a selfie for instant skin type detection</Text>

      <View style={styles.cameraFrame}>
        <View style={styles.faceOutline}>
          <Text style={styles.faceIcon}>👤</Text>
        </View>
        <Text style={styles.instructionText}>Position your face in the circle</Text>
      </View>

      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>📋 For Best Results:</Text>
        <Text style={styles.instructionItem}>✓ Clean, makeup-free face</Text>
        <Text style={styles.instructionItem}>✓ Good natural lighting</Text>
        <Text style={styles.instructionItem}>✓ Face camera directly</Text>
        <Text style={styles.instructionItem}>✓ Neutral expression</Text>
      </View>

      <TouchableOpacity style={styles.captureButton} onPress={takeSelfie}>
        <Text style={styles.captureButtonText}>📸 Take Selfie</Text>
      </TouchableOpacity>

      <View style={styles.aiInfoCard}>
        <Text style={styles.aiInfoTitle}>🤖 AI Technology</Text>
        <Text style={styles.aiInfoText}>
          Our AI analyzes skin texture, pores, oiliness, and tone to determine your skin type with 85%+ accuracy.
        </Text>
      </View>
    </View>
  );

  const renderAnalyzing = () => (
    <View style={styles.analyzingContainer}>
      <Text style={styles.analyzingTitle}>🔍 Analyzing Your Skin...</Text>
      <View style={styles.loadingAnimation}>
        <Text style={styles.loadingEmoji}>✨</Text>
      </View>
      <Text style={styles.analyzingText}>
        Our AI is examining your skin characteristics
      </Text>
      <View style={styles.analysisSteps}>
        <Text style={styles.stepText}>• Detecting skin type...</Text>
        <Text style={styles.stepText}>• Analyzing pore size...</Text>
        <Text style={styles.stepText}>• Identifying concerns...</Text>
        <Text style={styles.stepText}>• Generating recommendations...</Text>
      </View>
    </View>
  );

  const renderResults = () => (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsTitle}>✨ Analysis Complete!</Text>
      
      <View style={styles.resultCard}>
        <View style={styles.confidenceHeader}>
          <Text style={styles.skinTypeResult}>{analysisResult.skinType.toUpperCase()} SKIN</Text>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>{Math.round(analysisResult.confidence * 100)}% confident</Text>
          </View>
        </View>

        <View style={styles.concernsSection}>
          <Text style={styles.concernsTitle}>Detected Characteristics:</Text>
          {analysisResult.skinConcerns.map((concern, index) => (
            <Text key={index} style={styles.concernItem}>• {concern}</Text>
          ))}
        </View>

        <View style={styles.recommendationsSection}>
          <Text style={styles.recommendationsTitle}>AI Observations:</Text>
          {analysisResult.recommendations.map((rec, index) => (
            <Text key={index} style={styles.recommendationItem}>• {rec}</Text>
          ))}
        </View>
      </View>

      <View style={styles.safetyCard}>
        <Text style={styles.safetyTitle}>⚕️ Important Note</Text>
        <Text style={styles.safetyText}>{analysisResult.safetyNote}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => {
            onAnalysisComplete('skin', analysisResult.skinType);
            navigation.goBack();
          }}
        >
          <Text style={styles.saveButtonText}>Save to Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.retakeButton}
          onPress={() => {
            setAnalysisResult(null);
            setCapturedImage(null);
          }}
        >
          <Text style={styles.retakeButtonText}>Retake Photo</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.productsButton}
        onPress={() => navigation.navigate('PersonalizedRecommendations', { 
          skinType: analysisResult.skinType,
          concerns: analysisResult.skinConcerns 
        })}
      >
        <Text style={styles.productsButtonText}>Get Product Recommendations</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {!capturedImage && !isAnalyzing && !analysisResult && renderCameraInterface()}
      {isAnalyzing && renderAnalyzing()}
      {analysisResult && renderResults()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  cameraContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  cameraFrame: {
    alignItems: 'center',
    marginBottom: 30,
  },
  faceOutline: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  faceIcon: {
    fontSize: 80,
    opacity: 0.3,
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  instructionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  captureButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.surface,
  },
  aiInfoCard: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
  },
  aiInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  aiInfoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  analyzingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingAnimation: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loadingEmoji: {
    fontSize: 40,
  },
  analyzingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  analysisSteps: {
    alignItems: 'flex-start',
  },
  stepText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  skinTypeResult: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  confidenceBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  concernsSection: {
    marginBottom: 20,
  },
  concernsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  concernItem: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  recommendationsSection: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  recommendationItem: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  safetyCard: {
    backgroundColor: COLORS.warning,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.surface,
    marginBottom: 8,
  },
  safetyText: {
    fontSize: 12,
    color: COLORS.surface,
    lineHeight: 18,
    opacity: 0.9,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    flex: 0.48,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
    textAlign: 'center',
  },
  retakeButton: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    flex: 0.48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  productsButton: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    padding: 16,
  },
  productsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
    textAlign: 'center',
  },
});

export default CameraAnalysisScreen;