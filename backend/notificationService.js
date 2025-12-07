const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    this.emailTransporter = this.initializeEmailTransporter();
    this.pushNotifications = this.initializePushNotifications();
  }

  initializeEmailTransporter() {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  initializePushNotifications() {
    // Mock push notification service - integrate with Firebase/OneSignal in production
    return {
      send: (userId, notification) => {
        console.log(`Push notification sent to ${userId}:`, notification);
        return Promise.resolve({ success: true });
      }
    };
  }

  // Routine reminders
  async sendRoutineReminder(user, routineType) {
    const messages = {
      morning: {
        title: '🌅 Good morning, beautiful!',
        body: 'Time for your morning skincare routine. Your skin will thank you!',
        action: 'open_routine_tracker'
      },
      evening: {
        title: '🌙 Evening self-care time',
        body: 'Wind down with your evening routine. You deserve this moment.',
        action: 'open_routine_tracker'
      }
    };

    const notification = messages[routineType];
    
    if (user.notifications.pushEnabled) {
      await this.pushNotifications.send(user._id, notification);
    }

    return { sent: true, type: 'routine_reminder' };
  }

  // Community engagement notifications
  async sendCommunityNotification(user, type, data) {
    const notifications = {
      new_follower: {
        title: '👥 New follower!',
        body: `${data.followerName} started following you`,
        action: 'open_profile'
      },
      post_liked: {
        title: '❤️ Someone loved your post!',
        body: `Your "${data.postTitle}" got a new like`,
        action: 'open_post'
      },
      comment_received: {
        title: '💬 New comment',
        body: `${data.commenterName} commented on your post`,
        action: 'open_post'
      },
      match_found: {
        title: '✨ Perfect match found!',
        body: `We found someone with similar beauty goals as you`,
        action: 'open_community'
      }
    };

    const notification = notifications[type];
    
    if (user.notifications.communityUpdates && notification) {
      await this.pushNotifications.send(user._id, notification);
    }

    return { sent: true, type: 'community_notification' };
  }

  // Product recommendations
  async sendProductRecommendation(user, products) {
    const notification = {
      title: '🛍️ New products just for you!',
      body: `We found ${products.length} products perfect for your ${user.profile.skinProfile.skinType} skin`,
      action: 'open_recommendations',
      data: { productIds: products.map(p => p.id) }
    };

    if (user.notifications.productRecommendations) {
      await this.pushNotifications.send(user._id, notification);
    }

    return { sent: true, type: 'product_recommendation' };
  }

  // Streak celebrations
  async sendStreakCelebration(user, streakDays) {
    const milestones = {
      7: { emoji: '🔥', message: 'One week streak!' },
      14: { emoji: '⭐', message: 'Two weeks strong!' },
      30: { emoji: '🏆', message: 'One month champion!' },
      60: { emoji: '💎', message: 'Beauty routine master!' },
      100: { emoji: '👑', message: 'Skincare royalty!' }
    };

    const milestone = milestones[streakDays];
    if (milestone) {
      const notification = {
        title: `${milestone.emoji} ${milestone.message}`,
        body: `${streakDays} days of consistent beauty care. You're glowing!`,
        action: 'open_achievements'
      };

      await this.pushNotifications.send(user._id, notification);
    }

    return { sent: true, type: 'streak_celebration' };
  }

  // Subscription reminders
  async sendSubscriptionReminder(user, type) {
    const reminders = {
      trial_ending: {
        title: '⏰ Trial ending soon',
        body: 'Your premium trial ends in 3 days. Continue your beauty journey!',
        action: 'upgrade_subscription'
      },
      payment_failed: {
        title: '💳 Payment issue',
        body: 'We couldn\'t process your payment. Update your payment method.',
        action: 'update_payment'
      },
      renewal_success: {
        title: '✅ Subscription renewed',
        body: 'Your premium features are ready! Enjoy advanced recommendations.',
        action: 'explore_premium'
      }
    };

    const notification = reminders[type];
    if (notification) {
      await this.pushNotifications.send(user._id, notification);
    }

    return { sent: true, type: 'subscription_reminder' };
  }

  // Weekly digest email
  async sendWeeklyDigest(user, weeklyData) {
    const emailContent = `
      <h2>Your Weekly Beauty Summary 📊</h2>
      <p>Hi ${user.profile.personalInfo.name},</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>This Week's Achievements</h3>
        <ul>
          <li>🔥 ${weeklyData.routinesCompleted} routines completed</li>
          <li>⭐ ${weeklyData.streakDays} day streak maintained</li>
          <li>👥 ${weeklyData.communityInteractions} community interactions</li>
          <li>🛍️ ${weeklyData.productsViewed} new products discovered</li>
        </ul>
      </div>

      <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Trending in Your Community</h3>
        <p>• ${weeklyData.trendingProducts[0]} is getting amazing reviews</p>
        <p>• ${weeklyData.communityHighlights[0]} shared an inspiring routine</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.APP_URL}/recommendations" 
           style="background: #4A90A4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Discover New Products
        </a>
      </div>
    `;

    if (user.notifications.emailEnabled) {
      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Your Weekly Beauty Journey Summary ✨',
        html: emailContent
      });
    }

    return { sent: true, type: 'weekly_digest' };
  }

  // Smart notification scheduling
  async scheduleSmartNotifications(user) {
    const userTimezone = user.profile.personalInfo.timezone || 'UTC';
    const preferences = user.notifications;

    const schedule = [];

    // Morning routine reminder
    if (preferences.routineReminders) {
      schedule.push({
        type: 'routine_reminder',
        time: '08:00',
        timezone: userTimezone,
        data: { routineType: 'morning' }
      });
    }

    // Evening routine reminder
    if (preferences.routineReminders) {
      schedule.push({
        type: 'routine_reminder',
        time: '20:00',
        timezone: userTimezone,
        data: { routineType: 'evening' }
      });
    }

    // Weekly product recommendations
    if (preferences.productRecommendations) {
      schedule.push({
        type: 'product_recommendation',
        day: 'sunday',
        time: '10:00',
        timezone: userTimezone
      });
    }

    return schedule;
  }

  // Engagement-based notifications
  async sendEngagementNotification(user, engagementLevel) {
    const notifications = {
      low: {
        title: '💕 We miss you!',
        body: 'Your skin misses its routine. Come back for a quick self-care moment.',
        action: 'open_app'
      },
      returning: {
        title: '🌟 Welcome back!',
        body: 'Ready to continue your beauty journey? Check out what\'s new.',
        action: 'open_dashboard'
      },
      highly_engaged: {
        title: '🏆 Beauty enthusiast!',
        body: 'You\'re on fire! Share your routine with the community.',
        action: 'create_post'
      }
    };

    const notification = notifications[engagementLevel];
    if (notification) {
      await this.pushNotifications.send(user._id, notification);
    }

    return { sent: true, type: 'engagement_notification' };
  }
}

module.exports = new NotificationService();