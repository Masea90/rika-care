import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../shared/colors.js';

const RoutineTrackerScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [routines, setRoutines] = useState({});
  const [streakAnimation] = useState(new Animated.Value(1));
  const [completionRate, setCompletionRate] = useState(0);

  const routineSteps = {
    morning: [
      { id: 1, name: 'Gentle Cleanser', completed: false, time: '2 min', points: 10 },
      { id: 2, name: 'Vitamin C Serum', completed: false, time: '1 min', points: 15 },
      { id: 3, name: 'Moisturizer', completed: false, time: '2 min', points: 10 },
      { id: 4, name: 'Sunscreen SPF 30+', completed: false, time: '2 min', points: 20 }
    ],
    evening: [
      { id: 5, name: 'Oil Cleanser', completed: false, time: '3 min', points: 15 },
      { id: 6, name: 'Gentle Cleanser', completed: false, time: '2 min', points: 10 },
      { id: 7, name: 'Hydrating Toner', completed: false, time: '1 min', points: 10 },
      { id: 8, name: 'Night Moisturizer', completed: false, time: '2 min', points: 15 }
    ]
  };

  const [todayRoutines, setTodayRoutines] = useState(routineSteps);

  useEffect(() => {
    calculateCompletionRate();
  }, [todayRoutines]);

  const calculateCompletionRate = () => {
    const allSteps = [...todayRoutines.morning, ...todayRoutines.evening];
    const completedSteps = allSteps.filter(step => step.completed).length;
    const rate = (completedSteps / allSteps.length) * 100;
    setCompletionRate(rate);
  };

  const toggleStep = (routineType, stepId) => {
    setTodayRoutines(prev => ({
      ...prev,
      [routineType]: prev[routineType].map(step =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    }));

    // Animate completion
    Animated.sequence([
      Animated.timing(streakAnimation, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(streakAnimation, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();
  };

  const getTotalPoints = () => {
    const allSteps = [...todayRoutines.morning, ...todayRoutines.evening];
    return allSteps.filter(step => step.completed).reduce((sum, step) => sum + step.points, 0);
  };

  const getStreakDays = () => 7; // Mock streak

  const renderProgressHeader = () => (
    <View style={styles.progressHeader}>
      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Today's Progress</Text>
        <View style={styles.progressCircle}>
          <Text style={styles.progressPercentage}>{Math.round(completionRate)}%</Text>
          <Text style={styles.progressLabel}>Complete</Text>
        </View>
        <View style={styles.progressStats}>
          <View style={styles.statItem}>
            <Animated.Text style={[styles.statNumber, { transform: [{ scale: streakAnimation }] }]}>
              {getStreakDays()}
            </Animated.Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getTotalPoints()}</Text>
            <Text style={styles.statLabel}>Points Today</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderRoutineSection = (routineType, title, icon) => {
    const steps = todayRoutines[routineType];
    const completedSteps = steps.filter(step => step.completed).length;
    const totalSteps = steps.length;
    const sectionProgress = (completedSteps / totalSteps) * 100;

    return (
      <View style={styles.routineSection}>
        <View style={styles.routineHeader}>
          <View style={styles.routineTitleRow}>
            <Text style={styles.routineIcon}>{icon}</Text>
            <Text style={styles.routineTitle}>{title}</Text>
          </View>
          <View style={styles.routineProgress}>
            <Text style={styles.routineProgressText}>{completedSteps}/{totalSteps}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${sectionProgress}%` }]} />
            </View>
          </View>
        </View>

        {steps.map(step => (
          <TouchableOpacity
            key={step.id}
            style={[styles.stepItem, step.completed && styles.completedStep]}
            onPress={() => toggleStep(routineType, step.id)}
          >
            <View style={styles.stepContent}>
              <View style={[styles.checkbox, step.completed && styles.checkedBox]}>
                {step.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepName, step.completed && styles.completedStepName]}>
                  {step.name}
                </Text>
                <Text style={styles.stepTime}>{step.time}</Text>
              </View>
            </View>
            <View style={styles.stepPoints}>
              <Text style={styles.pointsText}>+{step.points}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMotivationalTips = () => (
    <View style={styles.tipsSection}>
      <Text style={styles.tipsTitle}>💡 Today's Tip</Text>
      <View style={styles.tipCard}>
        <Text style={styles.tipText}>
          Consistency beats perfection! Even completing 50% of your routine is better than skipping entirely.
        </Text>
        <TouchableOpacity style={styles.tipButton}>
          <Text style={styles.tipButtonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('CustomizeRoutine')}
      >
        <Text style={styles.actionIcon}>⚙️</Text>
        <Text style={styles.actionText}>Customize</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('RoutineHistory')}
      >
        <Text style={styles.actionIcon}>📊</Text>
        <Text style={styles.actionText}>History</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('ShareRoutine')}
      >
        <Text style={styles.actionIcon}>📤</Text>
        <Text style={styles.actionText}>Share</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('SetReminders')}
      >
        <Text style={styles.actionIcon}>⏰</Text>
        <Text style={styles.actionText}>Reminders</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCompletionCelebration = () => {
    if (completionRate === 100) {
      return (
        <View style={styles.celebrationCard}>
          <Text style={styles.celebrationIcon}>🎉</Text>
          <Text style={styles.celebrationTitle}>Perfect Day!</Text>
          <Text style={styles.celebrationText}>
            You completed your entire routine! Your skin will thank you.
          </Text>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => navigation.navigate('ShareAchievement')}
          >
            <Text style={styles.shareButtonText}>Share Achievement</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderProgressHeader()}
      {renderCompletionCelebration()}
      {renderRoutineSection('morning', 'Morning Routine', '🌅')}
      {renderRoutineSection('evening', 'Evening Routine', '🌙')}
      {renderMotivationalTips()}
      {renderQuickActions()}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  progressHeader: {
    padding: 16,
  },
  progressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressPercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.surface,
    opacity: 0.9,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  routineSection: {
    backgroundColor: COLORS.surface,
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
  },
  routineHeader: {
    marginBottom: 16,
  },
  routineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routineIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  routineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  routineProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routineProgressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 12,
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.divider,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 3,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  completedStep: {
    backgroundColor: COLORS.accent,
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepInfo: {
    flex: 1,
  },
  stepName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  completedStepName: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  stepTime: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  stepPoints: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.surface,
  },
  tipsSection: {
    margin: 16,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  tipCard: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  tipButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tipButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.surface,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  celebrationCard: {
    backgroundColor: COLORS.success,
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  celebrationIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  celebrationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 8,
  },
  celebrationText: {
    fontSize: 14,
    color: COLORS.surface,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
  },
  shareButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default RoutineTrackerScreen;