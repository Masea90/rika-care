import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { COLORS } from '../shared/colors.js';

const CommunityFeedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const mockPosts = [
    {
      id: 1,
      user: { name: 'Sarah M.', avatar: 'S', isPremium: false, followers: 234 },
      type: 'routine',
      title: 'My Morning Glow Routine ✨',
      content: 'Finally found the perfect combination for my combination skin! This routine has been a game-changer...',
      images: ['routine1.jpg'],
      likes: 47,
      comments: 12,
      shares: 8,
      timeAgo: '2h ago',
      tags: ['morning', 'combination-skin', 'natural'],
      isLiked: false,
      engagement: 'high'
    },
    {
      id: 2,
      user: { name: 'Emma K.', avatar: 'E', isPremium: true, followers: 156 },
      type: 'product_review',
      title: 'Honest Review: Organic Rose Cleanser',
      content: 'After 30 days of testing this cleanser, here are my thoughts... Perfect for sensitive skin!',
      rating: 4.5,
      likes: 23,
      comments: 8,
      shares: 5,
      timeAgo: '4h ago',
      tags: ['review', 'sensitive-skin', 'organic'],
      isLiked: true,
      engagement: 'medium'
    },
    {
      id: 3,
      user: { name: 'Maya L.', avatar: 'M', isPremium: false, followers: 89 },
      type: 'milestone',
      title: '30-Day Streak Achievement! 🎉',
      content: 'Consistency is key! Here\'s what I learned during my 30-day natural skincare journey...',
      likes: 156,
      comments: 34,
      shares: 22,
      timeAgo: '6h ago',
      tags: ['milestone', 'natural', 'journey'],
      isLiked: false,
      engagement: 'viral'
    },
    {
      id: 4,
      user: { name: 'Lisa R.', avatar: 'L', isPremium: true, followers: 445 },
      type: 'tip',
      title: 'DIY Hair Mask for Curly Hair 🌀',
      content: 'Simple 3-ingredient mask that transformed my curls! All natural and budget-friendly...',
      likes: 89,
      comments: 19,
      shares: 31,
      timeAgo: '8h ago',
      tags: ['diy', 'curly-hair', 'budget-friendly'],
      isLiked: true,
      engagement: 'high'
    }
  ];

  useEffect(() => {
    loadFeed();
  }, [filter]);

  const loadFeed = () => {
    // Simulate API call with filter
    setPosts(mockPosts);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadFeed();
      setRefreshing(false);
    }, 1000);
  };

  const toggleLike = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const getEngagementColor = (engagement) => {
    switch(engagement) {
      case 'viral': return COLORS.warning;
      case 'high': return COLORS.success;
      case 'medium': return COLORS.info;
      default: return COLORS.textLight;
    }
  };

  const getPostTypeIcon = (type) => {
    switch(type) {
      case 'routine': return '📝';
      case 'product_review': return '⭐';
      case 'milestone': return '🎉';
      case 'tip': return '💡';
      default: return '📱';
    }
  };

  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['all', 'following', 'trending', 'routines', 'reviews', 'tips'].map(filterType => (
          <TouchableOpacity
            key={filterType}
            style={[styles.filterTab, filter === filterType && styles.activeFilterTab]}
            onPress={() => setFilter(filterType)}
          >
            <Text style={[styles.filterText, filter === filterType && styles.activeFilterText]}>
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPost = (post) => (
    <View key={post.id} style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{post.user.avatar}</Text>
          </View>
          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{post.user.name}</Text>
              {post.user.isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>PRO</Text>
                </View>
              )}
            </View>
            <Text style={styles.postTime}>{post.timeAgo}</Text>
          </View>
        </View>
        
        <View style={styles.postMeta}>
          <View style={[styles.engagementIndicator, { backgroundColor: getEngagementColor(post.engagement) }]} />
          <Text style={styles.postTypeIcon}>{getPostTypeIcon(post.type)}</Text>
        </View>
      </View>

      {/* Post Content */}
      <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: post.id })}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postContent} numberOfLines={3}>{post.content}</Text>
        
        {/* Tags */}
        <View style={styles.tagsContainer}>
          {post.tags.slice(0, 3).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => toggleLike(post.id)}
        >
          <Text style={[styles.actionIcon, post.isLiked && styles.likedIcon]}>
            {post.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('PostDetail', { postId: post.id, focusComments: true })}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.actionIcon}>🔖</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCreatePostPrompt = () => (
    <TouchableOpacity 
      style={styles.createPrompt}
      onPress={() => navigation.navigate('CreatePost')}
    >
      <View style={styles.promptAvatar}>
        <Text style={styles.promptAvatarText}>You</Text>
      </View>
      <Text style={styles.promptText}>Share your beauty journey...</Text>
      <View style={styles.promptActions}>
        <Text style={styles.promptAction}>📝</Text>
        <Text style={styles.promptAction}>📷</Text>
        <Text style={styles.promptAction}>⭐</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderFilterTabs()}
      
      <ScrollView 
        style={styles.feedContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderCreatePostPrompt()}
        
        {posts.map(renderPost)}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: COLORS.background,
  },
  activeFilterTab: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeFilterText: {
    color: COLORS.surface,
  },
  feedContainer: {
    flex: 1,
  },
  createPrompt: {
    backgroundColor: COLORS.surface,
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  promptAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  promptAvatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  promptText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textLight,
  },
  promptActions: {
    flexDirection: 'row',
  },
  promptAction: {
    fontSize: 20,
    marginLeft: 8,
  },
  postCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
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
  postTime: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  postMeta: {
    alignItems: 'center',
  },
  engagementIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  postTypeIcon: {
    fontSize: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
    lineHeight: 24,
  },
  postContent: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  likedIcon: {
    transform: [{ scale: 1.1 }],
  },
  actionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  saveButton: {
    marginLeft: 'auto',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default CommunityFeedScreen;