import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../shared/colors.js';

const DashboardScreen = ({ navigation, userProfile }) => {
  const [dailyProgress, setDailyProgress] = useState(0);
  const [streakCount, setStreakCount] = useState(7);
  const [todaysTip, setTodaysTip] = useState('');
  const [communityActivity, setCommunityActivity] = useState([]);
  const [personalizedContent, setPersonalizedContent] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate entrance
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Load personalized content
    loadDashboardContent();
  }, []);

  const loadDashboardContent = () => {
    // Simulate personalized content based on user profile
    setTodaysTip("💧 Your combination skin loves gentle cleansing in the morning and deeper care at night!");
    
    setCommunityActivity([
      { id: 1, user: 'Sarah M.', action: 'shared a new routine', time: '2h ago', likes: 12 },
      { id: 2, user: 'Emma K.', action: 'reviewed a product you might like', time: '4h ago', likes: 8 },
      { id: 3, user: 'Maya L.', action: 'achieved a 30-day streak!', time: '6h ago', likes: 24 }
    ]);

    setPersonalizedContent([
      {
        id: 1,
        type: 'routine_suggestion',
        title: 'Morning Glow Routine',
        description: 'Perfect for your combination skin',
        engagement: 'Try it now',
        color: COLORS.success
      },
      {
        id: 2,
        type: 'product_match',
        title: 'New Organic Cleanser',
        description: '95% match for your preferences',
        engagement: 'View details',
        color: COLORS.primary
      },
      {
        id: 3,
        type: 'community_challenge',
        title: '7-Day Hydration Challenge',
        description: '234 people joined today',
        engagement: 'Join now',
        color: COLORS.community
      }
    ]);

    setDailyProgress(65); // Simulate progress
  };

  const renderWelcomeSection = () => (
    <Animated.View style={[styles.welcomeCard, { opacity: fadeAnim }]}>
      <View style={styles.welcomeHeader}>
        <View>
          <Text style={styles.welcomeText}>Good morning! ☀️</Text>
          <Text style={styles.userName}>Hello, {userProfile?.personalInfo?.name || userProfile?.email?.split('@')[0]?.replace(/[._]/g, ' ')?.replace(/\b\w/g, l => l.toUpperCase()) || 'Beautiful'}!</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakNumber}>{streakCount}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>Today's Beauty Journey</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${dailyProgress}%` }]} />
        </View>
        <Text style={styles.progressText}>{dailyProgress}% complete</Text>
      </View>
    </Animated.View>
  );

  const renderTodaysTip = () => (
    <View style={styles.tipCard}>
      <Text style={styles.tipTitle}>💡 Today's Tip</Text>
      <Text style={styles.tipText}>{todaysTip}</Text>
      <TouchableOpacity style={styles.tipButton}>
        <Text style={styles.tipButtonText}>Learn more</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsCard}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('RoutineTracker')}>
          <Text style={styles.actionEmoji}>📝</Text>
          <Text style={styles.actionText}>Log Routine</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('ProductScanner')}>
          <Text style={styles.actionEmoji}>📱</Text>
          <Text style={styles.actionText}>Scan Product</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('CommunityFeed')}>
          <Text style={styles.actionEmoji}>👥</Text>
          <Text style={styles.actionText}>Community</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Recommendations')}>
          <Text style={styles.actionEmoji}>✨</Text>
          <Text style={styles.actionText}>Discover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPersonalizedContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Just for You</Text>
      {personalizedContent.map(item => (
        <TouchableOpacity key={item.id} style={[styles.contentCard, { borderLeftColor: item.color }]}>
          <View style={styles.contentInfo}>
            <Text style={styles.contentTitle}>{item.title}</Text>
            <Text style={styles.contentDescription}>{item.description}</Text>
          </View>
          <View style={[styles.engagementButton, { backgroundColor: item.color }]}>
            <Text style={styles.engagementText}>{item.engagement}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCommunityActivity = () => (
    <View style={styles.communitySection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Community Activity</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CommunityFeed')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      
      {communityActivity.map(activity => (
        <TouchableOpacity key={activity.id} style={styles.activityItem}>
          <View style={styles.activityAvatar}>
            <Text style={styles.activityAvatarText}>{activity.user.charAt(0)}</Text>
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityText}>
              <Text style={styles.activityUser}>{activity.user}</Text> {activity.action}
            </Text>
            <View style={styles.activityMeta}>
              <Text style={styles.activityTime}>{activity.time}</Text>
              <Text style={styles.activityLikes}>❤️ {activity.likes}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFloatingActionButton = () => (
    <TouchableOpacity 
      style={styles.fab}
      onPress={() => navigation.navigate('ShareRoutine')}
    >
      <Text style={styles.fabText}>+</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderWelcomeSection()}
        {renderTodaysTip()}
        {renderQuickActions()}
        {renderPersonalizedContent()}
        {renderCommunityActivity()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {renderFloatingActionButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  streakBadge: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  streakNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  streakLabel: {
    fontSize: 12,
    color: COLORS.surface,
  },
  progressSection: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
  tipCard: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
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
  quickActionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  contentSection: {
    marginBottom: 16,
  },
  contentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  contentDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  engagementButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  engagementText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.surface,
  },
  communitySection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  activityUser: {
    fontWeight: '600',
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  activityLikes: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  bottomSpacing: {
    height: 80,
  },
});

export default DashboardScreen;