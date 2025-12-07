import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS } from '../shared/colors.js';

const CommunityMatchingScreen = ({ navigation, userProfile }) => {
  const [matches, setMatches] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    skinType: true,
    hairType: true,
    age: false,
    location: false
  });

  // Mock data for demonstration
  const mockMatches = [
    {
      id: 1,
      name: 'Sarah M.',
      age: 28,
      skinType: 'combination',
      hairType: 'curly',
      matchPercentage: 95,
      sharedConcerns: ['acne', 'dryness'],
      routinesShared: 12,
      followers: 234,
      bio: 'Natural beauty enthusiast 🌿 Curly hair journey',
      isPremium: false
    },
    {
      id: 2,
      name: 'Emma K.',
      age: 25,
      skinType: 'combination',
      hairType: 'wavy',
      matchPercentage: 88,
      sharedConcerns: ['oiliness', 'pores'],
      routinesShared: 8,
      followers: 156,
      bio: 'Skincare minimalist | Cruelty-free only',
      isPremium: true
    },
    {
      id: 3,
      name: 'Maya L.',
      age: 32,
      skinType: 'sensitive',
      hairType: 'curly',
      matchPercentage: 82,
      sharedConcerns: ['sensitivity', 'dryness'],
      routinesShared: 15,
      followers: 89,
      bio: 'Sensitive skin solutions & natural remedies',
      isPremium: false
    }
  ];

  useEffect(() => {
    // Simulate API call to get matches
    setMatches(mockMatches);
  }, [selectedFilters]);

  const toggleFilter = (filter) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const followUser = (userId) => {
    setMatches(prev => prev.map(match => 
      match.id === userId 
        ? { ...match, isFollowing: !match.isFollowing }
        : match
    ));
  };

  const renderMatchCard = (match) => (
    <View key={match.id} style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{match.name.charAt(0)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.matchName}>{match.name}</Text>
              {match.isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>PRO</Text>
                </View>
              )}
            </View>
            <Text style={styles.matchAge}>Age {match.age}</Text>
            <Text style={styles.matchBio}>{match.bio}</Text>
          </View>
        </View>
        <View style={styles.matchPercentage}>
          <Text style={styles.percentageText}>{match.matchPercentage}%</Text>
          <Text style={styles.matchLabel}>Match</Text>
        </View>
      </View>

      <View style={styles.characteristicsRow}>
        <View style={styles.characteristic}>
          <Text style={styles.charLabel}>Skin</Text>
          <Text style={styles.charValue}>{match.skinType}</Text>
        </View>
        <View style={styles.characteristic}>
          <Text style={styles.charLabel}>Hair</Text>
          <Text style={styles.charValue}>{match.hairType}</Text>
        </View>
        <View style={styles.characteristic}>
          <Text style={styles.charLabel}>Routines</Text>
          <Text style={styles.charValue}>{match.routinesShared}</Text>
        </View>
        <View style={styles.characteristic}>
          <Text style={styles.charLabel}>Followers</Text>
          <Text style={styles.charValue}>{match.followers}</Text>
        </View>
      </View>

      <View style={styles.sharedConcerns}>
        <Text style={styles.concernsLabel}>Shared concerns:</Text>
        <View style={styles.concernsRow}>
          {match.sharedConcerns.map(concern => (
            <View key={concern} style={styles.concernTag}>
              <Text style={styles.concernText}>{concern}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.followButton, match.isFollowing && styles.followingButton]}
          onPress={() => followUser(match.id)}
        >
          <Text style={[styles.followButtonText, match.isFollowing && styles.followingText]}>
            {match.isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.viewProfileButton}
          onPress={() => navigation.navigate('UserProfile', { userId: match.id })}
        >
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Beauty Tribe</Text>
        <Text style={styles.subtitle}>Connect with people who share your beauty journey</Text>
      </View>

      <View style={styles.filtersSection}>
        <Text style={styles.filtersTitle}>Match by:</Text>
        <View style={styles.filtersRow}>
          {Object.entries(selectedFilters).map(([filter, isSelected]) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, isSelected && styles.selectedFilter]}
              onPress={() => toggleFilter(filter)}
            >
              <Text style={[styles.filterText, isSelected && styles.selectedFilterText]}>
                {filter === 'skinType' ? 'Skin Type' : 
                 filter === 'hairType' ? 'Hair Type' :
                 filter === 'age' ? 'Age Range' : 'Location'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.matchesSection}>
        <Text style={styles.matchesTitle}>Your Matches ({matches.length})</Text>
        {matches.map(renderMatchCard)}
      </View>

      <View style={styles.premiumPromo}>
        <Text style={styles.promoTitle}>🚀 Unlock More Matches</Text>
        <Text style={styles.promoText}>Upgrade to Premium for unlimited matching and advanced filters</Text>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
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
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  filtersSection: {
    padding: 20,
    backgroundColor: COLORS.surface,
    marginTop: 10,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedFilter: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  selectedFilterText: {
    color: COLORS.surface,
  },
  matchesSection: {
    padding: 20,
  },
  matchesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  matchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  profileSection: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  premiumBadge: {
    backgroundColor: COLORS.premium,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  matchAge: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  matchBio: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  matchPercentage: {
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  matchLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  characteristicsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
  },
  characteristic: {
    alignItems: 'center',
  },
  charLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  charValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  sharedConcerns: {
    marginBottom: 15,
  },
  concernsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  concernsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  concernTag: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  concernText: {
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  followButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 0.45,
  },
  followingButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.surface,
    textAlign: 'center',
  },
  followingText: {
    color: COLORS.primary,
  },
  viewProfileButton: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 0.45,
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  premiumPromo: {
    backgroundColor: COLORS.premium,
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 8,
  },
  promoText: {
    fontSize: 14,
    color: COLORS.surface,
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.9,
  },
  upgradeButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.premium,
  },
});

export default CommunityMatchingScreen;