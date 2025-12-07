import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../shared/colors.js';
import { recommendationEngine } from '../shared/recommendationEngine.js';

const ProductRecommendationsScreen = ({ navigation, userProfile }) => {
  const [recommendations, setRecommendations] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [userProfile]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const dailyRecs = recommendationEngine.generateDailyRecommendations(userProfile);
      setRecommendations(dailyRecs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { 
      productId: product.id,
      matchScore: product.matchScore,
      matchReasons: product.matchReasons 
    });
  };

  const handleAddToWishlist = (productId) => {
    // Add to wishlist logic
    console.log('Added to wishlist:', productId);
  };

  const renderFeaturedProduct = () => {
    const featured = recommendations.featured;
    if (!featured) return null;

    return (
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>✨ Perfect Match for You</Text>
        <TouchableOpacity 
          style={styles.featuredCard}
          onPress={() => handleProductPress(featured)}
        >
          <View style={styles.featuredContent}>
            <View style={styles.featuredInfo}>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{Math.round(featured.matchScore)}% Match</Text>
              </View>
              <Text style={styles.featuredTitle}>{featured.name}</Text>
              <Text style={styles.featuredBrand}>{featured.brand}</Text>
              <Text style={styles.featuredPrice}>${featured.price}</Text>
              
              <View style={styles.reasonsContainer}>
                {featured.matchReasons?.slice(0, 2).map((reason, index) => (
                  <Text key={index} style={styles.reasonText}>• {reason}</Text>
                ))}
              </View>
            </View>
            
            <View style={styles.featuredActions}>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.wishlistButton}
                onPress={() => handleAddToWishlist(featured.id)}
              >
                <Text style={styles.wishlistIcon}>🤍</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderProductCard = (product, showMatchScore = true) => (
    <TouchableOpacity 
      key={product.id}
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
    >
      <View style={styles.productImagePlaceholder}>
        <Text style={styles.productEmoji}>
          {product.category === 'cleanser' ? '🧴' :
           product.category === 'serum' ? '💧' :
           product.category === 'sunscreen' ? '☀️' :
           product.category === 'hair_styling' ? '💇‍♀️' : '✨'}
        </Text>
      </View>
      
      <View style={styles.productInfo}>
        {showMatchScore && (
          <View style={styles.matchIndicator}>
            <Text style={styles.matchScore}>{Math.round(product.matchScore)}%</Text>
          </View>
        )}
        
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productBrand}>{product.brand}</Text>
        
        <View style={styles.ratingRow}>
          <Text style={styles.rating}>⭐ {product.rating}</Text>
          <Text style={styles.reviews}>({product.reviews})</Text>
        </View>
        
        <Text style={styles.price}>${product.price}</Text>
        
        {product.matchReasons && (
          <Text style={styles.matchReason} numberOfLines={1}>
            {product.matchReasons[0]}
          </Text>
        )}
        
        {product.trendingReason && (
          <Text style={styles.trendingBadge}>🔥 {product.trendingReason}</Text>
        )}
        
        {product.socialProof && (
          <Text style={styles.socialProof}>👥 {product.socialProof}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHorizontalSection = (title, products, showViewAll = true) => {
    if (!products || products.length === 0) return null;

    return (
      <View style={styles.horizontalSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {showViewAll && (
            <TouchableOpacity onPress={() => navigation.navigate('ProductCategory', { category: title })}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {products.map(product => (
            <View key={product.id} style={styles.horizontalCard}>
              {renderProductCard(product)}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderQuickFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['all', 'skincare', 'haircare', 'trending', 'budget'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, selectedCategory === filter && styles.activeFilter]}
            onPress={() => setSelectedCategory(filter)}
          >
            <Text style={[styles.filterText, selectedCategory === filter && styles.activeFilterText]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPersonalizedInsights = () => (
    <View style={styles.insightsCard}>
      <Text style={styles.insightsTitle}>💡 Your Beauty Insights</Text>
      <Text style={styles.insightsText}>
        Based on your {userProfile?.skinProfile?.skinType} skin and {userProfile?.hairProfile?.hairType} hair, 
        we found {recommendations.trending?.length || 0} trending products perfect for you!
      </Text>
      <TouchableOpacity style={styles.insightsButton}>
        <Text style={styles.insightsButtonText}>Learn More</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Finding your perfect matches... ✨</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderQuickFilters()}
      {renderFeaturedProduct()}
      {renderPersonalizedInsights()}
      {renderHorizontalSection('🔥 Trending Now', recommendations.trending)}
      {renderHorizontalSection('👥 Users Like You Love', recommendations.similarUsers)}
      {renderHorizontalSection('🌿 Seasonal Picks', recommendations.seasonal)}
      {renderHorizontalSection('💰 Budget-Friendly', recommendations.budgetPicks)}
      
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  filtersContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeFilterText: {
    color: COLORS.surface,
  },
  featuredSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  featuredCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  featuredContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredInfo: {
    flex: 1,
  },
  matchBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  matchText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  featuredBrand: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  featuredPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  reasonsContainer: {
    marginBottom: 16,
  },
  reasonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  featuredActions: {
    alignItems: 'flex-end',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.surface,
  },
  wishlistButton: {
    padding: 8,
  },
  wishlistIcon: {
    fontSize: 20,
  },
  insightsCard: {
    backgroundColor: COLORS.accent,
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  insightsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  insightsButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  insightsButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.surface,
  },
  horizontalSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  horizontalScroll: {
    paddingLeft: 16,
  },
  horizontalCard: {
    width: 200,
    marginRight: 12,
  },
  productCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productImagePlaceholder: {
    height: 120,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productEmoji: {
    fontSize: 32,
  },
  productInfo: {
    flex: 1,
  },
  matchIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.success,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  matchScore: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 6,
  },
  matchReason: {
    fontSize: 11,
    color: COLORS.success,
    fontStyle: 'italic',
  },
  trendingBadge: {
    fontSize: 11,
    color: COLORS.warning,
    fontWeight: '500',
  },
  socialProof: {
    fontSize: 11,
    color: COLORS.community,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ProductRecommendationsScreen;