import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../shared/colors.js';

const SkinAnalysisScreen = ({ navigation, onAnalysisComplete }) => {
  const [analysisMethod, setAnalysisMethod] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analysisResult, setAnalysisResult] = useState(null);

  const skinQuestions = [
    {
      id: 'morning_feel',
      question: 'How does your skin feel in the morning?',
      options: [
        { value: 'tight_dry', text: 'Tight and dry', points: { dry: 3, sensitive: 1 } },
        { value: 'comfortable', text: 'Comfortable and balanced', points: { normal: 3 } },
        { value: 'oily_shiny', text: 'Oily and shiny', points: { oily: 3 } },
        { value: 'mixed', text: 'Oily T-zone, dry cheeks', points: { combination: 3 } }
      ]
    },
    {
      id: 'pore_size',
      question: 'How would you describe your pores?',
      options: [
        { value: 'barely_visible', text: 'Barely visible', points: { dry: 2, normal: 1 } },
        { value: 'small_fine', text: 'Small and fine', points: { normal: 2, sensitive: 1 } },
        { value: 'visible_tzone', text: 'Visible in T-zone only', points: { combination: 3 } },
        { value: 'large_visible', text: 'Large and visible', points: { oily: 3 } }
      ]
    },
    {
      id: 'breakout_frequency',
      question: 'How often do you experience breakouts?',
      options: [
        { value: 'never', text: 'Never or very rarely', points: { normal: 2, dry: 1 } },
        { value: 'occasionally', text: 'Occasionally', points: { combination: 2, normal: 1 } },
        { value: 'regularly', text: 'Regularly', points: { oily: 3, combination: 1 } },
        { value: 'frequently', text: 'Frequently', points: { oily: 3 } }
      ]
    },
    {
      id: 'product_reaction',
      question: 'How does your skin react to new products?',
      options: [
        { value: 'no_reaction', text: 'No reaction, tolerates well', points: { normal: 2, oily: 1 } },
        { value: 'occasional_reaction', text: 'Occasional mild reaction', points: { combination: 2 } },
        { value: 'frequent_reaction', text: 'Frequent reactions or irritation', points: { sensitive: 3 } },
        { value: 'severe_reaction', text: 'Severe reactions, very careful', points: { sensitive: 3 } }
      ]
    },
    {
      id: 'sun_reaction',
      question: 'How does your skin react to sun exposure?',
      options: [
        { value: 'tans_easily', text: 'Tans easily, rarely burns', points: { normal: 1, oily: 1 } },
        { value: 'tans_sometimes', text: 'Sometimes tans, sometimes burns', points: { combination: 1 } },
        { value: 'burns_easily', text: 'Burns easily, tans slowly', points: { sensitive: 2, dry: 1 } },
        { value: 'always_burns', text: 'Always burns, never tans', points: { sensitive: 3 } }
      ]
    }
  ];

  const hairQuestions = [
    {
      id: 'hair_pattern',
      question: 'Look at your hair when it\'s clean and air-dried. What pattern do you see?',
      options: [
        { value: 'straight', text: 'Straight with no curl or wave', points: { straight: 3 } },
        { value: 'slight_wave', text: 'Slight wave or loose curls', points: { wavy: 3 } },
        { value: 'defined_curls', text: 'Defined curls that spiral', points: { curly: 3 } },
        { value: 'tight_coils', text: 'Tight coils or zigzag pattern', points: { coily: 3 } }
      ]
    },
    {
      id: 'hair_thickness',
      question: 'Take a single strand of hair. How thick does it feel?',
      options: [
        { value: 'very_thin', text: 'Very thin, hard to feel', points: { fine: 3 } },
        { value: 'medium_feel', text: 'Medium thickness', points: { medium: 3 } },
        { value: 'thick_coarse', text: 'Thick and coarse', points: { thick: 3 } }
      ]
    },
    {
      id: 'hair_behavior',
      question: 'How does your hair behave in humidity?',
      options: [
        { value: 'stays_same', text: 'Stays the same', points: { straight: 1, fine: 1 } },
        { value: 'slight_frizz', text: 'Gets slightly frizzy', points: { wavy: 2 } },
        { value: 'very_frizzy', text: 'Gets very frizzy and expands', points: { curly: 2, thick: 1 } },
        { value: 'shrinks_coils', text: 'Shrinks and coils tighter', points: { coily: 3 } }
      ]
    }
  ];

  const analyzeAnswers = (questions, answers) => {
    const scores = {};
    
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option && option.points) {
          Object.entries(option.points).forEach(([type, points]) => {
            scores[type] = (scores[type] || 0) + points;
          });
        }
      }
    });

    const sortedScores = Object.entries(scores).sort(([,a], [,b]) => b - a);
    return sortedScores.length > 0 ? sortedScores[0][0] : null;
  };

  const handleQuestionAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    if (analysisMethod === 'skin') {
      if (currentQuestion < skinQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const skinType = analyzeAnswers(skinQuestions, newAnswers);
        setAnalysisResult({ type: 'skin', result: skinType });
      }
    } else if (analysisMethod === 'hair') {
      if (currentQuestion < hairQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const hairType = analyzeAnswers(hairQuestions, newAnswers);
        setAnalysisResult({ type: 'hair', result: hairType });
      }
    }
  };

  const startAnalysis = (method) => {
    setAnalysisMethod(method);
    setCurrentQuestion(0);
    setAnswers({});
    setAnalysisResult(null);
  };

  const handleSelfieAnalysis = () => {
    Alert.alert(
      'Camera Analysis',
      'This feature uses AI to analyze your skin from a selfie. Make sure you have good lighting and a clean face.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Selfie', onPress: () => navigation.navigate('CameraAnalysis') }
      ]
    );
  };

  const renderMethodSelection = () => (
    <View style={styles.methodContainer}>
      <Text style={styles.title}>Discover Your Skin & Hair Type</Text>
      <Text style={styles.subtitle}>Choose how you'd like to analyze your characteristics</Text>

      <TouchableOpacity style={styles.methodCard} onPress={() => startAnalysis('skin')}>
        <Text style={styles.methodIcon}>🔍</Text>
        <Text style={styles.methodTitle}>Skin Type Quiz</Text>
        <Text style={styles.methodDescription}>Answer 5 questions about your skin behavior</Text>
        <Text style={styles.methodTime}>⏱️ 2 minutes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.methodCard} onPress={() => startAnalysis('hair')}>
        <Text style={styles.methodIcon}>💇‍♀️</Text>
        <Text style={styles.methodTitle}>Hair Type Analysis</Text>
        <Text style={styles.methodDescription}>Identify your hair pattern and texture</Text>
        <Text style={styles.methodTime}>⏱️ 1 minute</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.methodCard} onPress={handleSelfieAnalysis}>
        <Text style={styles.methodIcon}>📸</Text>
        <Text style={styles.methodTitle}>AI Selfie Analysis</Text>
        <Text style={styles.methodDescription}>Let AI analyze your skin from a photo</Text>
        <Text style={styles.methodTime}>⏱️ 30 seconds</Text>
      </TouchableOpacity>

      <View style={styles.disclaimerCard}>
        <Text style={styles.disclaimerTitle}>⚕️ Medical Disclaimer</Text>
        <Text style={styles.disclaimerText}>
          This analysis is for cosmetic guidance only. For skin conditions, allergies, or medical concerns, please consult a dermatologist.
        </Text>
      </View>
    </View>
  );

  const renderQuestion = () => {
    const questions = analysisMethod === 'skin' ? skinQuestions : hairQuestions;
    const question = questions[currentQuestion];

    return (
      <View style={styles.questionContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentQuestion + 1) / questions.length) * 100}%` }]} />
          </View>
        </View>

        <Text style={styles.questionTitle}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map(option => (
            <TouchableOpacity
              key={option.value}
              style={styles.optionButton}
              onPress={() => handleQuestionAnswer(question.id, option.value)}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (currentQuestion > 0) {
              setCurrentQuestion(currentQuestion - 1);
            } else {
              setAnalysisMethod(null);
            }
          }}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderResult = () => {
    const getResultInfo = () => {
      if (analysisResult.type === 'skin') {
        const skinInfo = {
          dry: {
            title: 'Dry Skin',
            description: 'Your skin tends to feel tight and may appear flaky. It needs extra hydration and gentle care.',
            tips: ['Use cream-based cleansers', 'Apply moisturizer twice daily', 'Avoid harsh scrubs']
          },
          oily: {
            title: 'Oily Skin',
            description: 'Your skin produces excess oil, especially in the T-zone. Focus on oil control and pore care.',
            tips: ['Use gel-based cleansers', 'Look for non-comedogenic products', 'Use clay masks weekly']
          },
          combination: {
            title: 'Combination Skin',
            description: 'Your T-zone is oily while cheeks are normal to dry. You need targeted care for different areas.',
            tips: ['Use different products for T-zone and cheeks', 'Gentle cleansing', 'Lightweight moisturizers']
          },
          sensitive: {
            title: 'Sensitive Skin',
            description: 'Your skin reacts easily to products and environmental factors. Gentle, fragrance-free products are best.',
            tips: ['Patch test new products', 'Avoid fragrances and alcohol', 'Use mineral sunscreen']
          },
          normal: {
            title: 'Normal Skin',
            description: 'Your skin is well-balanced with few concerns. Maintain this with consistent, gentle care.',
            tips: ['Maintain current routine', 'Use broad-spectrum SPF', 'Stay hydrated']
          }
        };
        return skinInfo[analysisResult.result] || skinInfo.normal;
      } else {
        const hairInfo = {
          straight: { title: 'Straight Hair', description: 'Your hair has no natural curl pattern.' },
          wavy: { title: 'Wavy Hair', description: 'Your hair has a loose S-pattern wave.' },
          curly: { title: 'Curly Hair', description: 'Your hair forms defined spiral curls.' },
          coily: { title: 'Coily Hair', description: 'Your hair has tight coils or zigzag patterns.' },
          fine: { title: 'Fine Hair Texture', description: 'Your hair strands are thin in diameter.' },
          medium: { title: 'Medium Hair Texture', description: 'Your hair has average thickness.' },
          thick: { title: 'Thick Hair Texture', description: 'Your hair strands are coarse and thick.' }
        };
        return hairInfo[analysisResult.result] || hairInfo.straight;
      }
    };

    const resultInfo = getResultInfo();

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>✨ Analysis Complete!</Text>
        
        <View style={styles.resultCard}>
          <Text style={styles.resultType}>{resultInfo.title}</Text>
          <Text style={styles.resultDescription}>{resultInfo.description}</Text>
          
          {resultInfo.tips && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 Care Tips:</Text>
              {resultInfo.tips.map((tip, index) => (
                <Text key={index} style={styles.tipItem}>• {tip}</Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => {
              onAnalysisComplete(analysisResult.type, analysisResult.result);
              navigation.goBack();
            }}
          >
            <Text style={styles.saveButtonText}>Save to Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.retakeButton}
            onPress={() => setAnalysisResult(null)}
          >
            <Text style={styles.retakeButtonText}>Retake Analysis</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.recommendationsButton}
          onPress={() => navigation.navigate('PersonalizedRecommendations', { 
            analysisResult: analysisResult.result 
          })}
        >
          <Text style={styles.recommendationsButtonText}>See Product Recommendations</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {!analysisMethod && !analysisResult && renderMethodSelection()}
      {analysisMethod && !analysisResult && renderQuestion()}
      {analysisResult && renderResult()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  methodContainer: {
    padding: 20,
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
    marginBottom: 30,
  },
  methodCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  methodIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  methodDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  methodTime: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  disclaimerCard: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  questionContainer: {
    padding: 20,
  },
  progressHeader: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.divider,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  resultContainer: {
    padding: 20,
  },
  resultTitle: {
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
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  resultType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  resultDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  tipsContainer: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
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
  recommendationsButton: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    padding: 16,
  },
  recommendationsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
    textAlign: 'center',
  },
});

export default SkinAnalysisScreen;