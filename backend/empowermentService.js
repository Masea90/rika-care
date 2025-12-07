class EmpowermentService {
  constructor() {
    this.dailyAffirmations = this.initializeDailyAffirmations();
    this.supportiveMessages = this.initializeSupportiveMessages();
    this.celebrationMessages = this.initializeCelebrationMessages();
    this.motivationalTips = this.initializeMotivationalTips();
  }

  initializeDailyAffirmations() {
    return [
      "🌟 You are absolutely radiant today, beautiful soul",
      "💖 Your natural beauty shines from within - embrace it",
      "✨ You deserve all the love and care you give yourself",
      "🌸 Your skin is telling a story of strength and resilience",
      "💫 You are worthy of feeling confident and beautiful",
      "🦋 Every step in your beauty journey is an act of self-love",
      "🌺 Your unique beauty is a gift to the world",
      "💕 You are enough, exactly as you are right now",
      "🌙 Taking care of yourself is not selfish - it's necessary",
      "⭐ Your glow comes from the love you show yourself",
      "🌻 You are blooming beautifully at your own pace",
      "💎 You are precious and deserving of gentle care",
      "🌈 Your beauty routine is a celebration of YOU",
      "🕊️ Be gentle with yourself - you're doing amazing",
      "🌟 Your confidence is your most beautiful accessory"
    ];
  }

  initializeSupportiveMessages() {
    return {
      skincare_struggles: [
        "💙 Bad skin days don't define your beauty - you're still gorgeous",
        "🤗 Every skin journey has ups and downs - you're not alone",
        "🌱 Healing takes time, and you're being so patient with yourself",
        "💕 Your worth isn't measured by your skin - you're amazing inside and out"
      ],
      routine_missed: [
        "🌸 Tomorrow is a fresh start - no guilt, just grace",
        "💖 Self-compassion is the best skincare ingredient",
        "🦋 One missed day doesn't erase your progress, beautiful",
        "✨ You're human, not perfect - and that's perfectly okay"
      ],
      low_confidence: [
        "👑 You are the queen of your own story - wear your crown",
        "💫 Your beauty is not up for debate - it simply IS",
        "🌟 You have survived 100% of your difficult days - you're stronger than you know",
        "💕 The world needs your unique light - let it shine"
      ],
      community_support: [
        "🤝 Your beauty tribe is here to lift you up",
        "💗 Sharing your journey helps other women feel less alone",
        "🌺 Your vulnerability is your superpower",
        "✨ Together we rise - you're part of something beautiful"
      ]
    };
  }

  initializeCelebrationMessages() {
    return {
      routine_completed: [
        "🎉 You just loved yourself beautifully - well done!",
        "✨ Your future self is thanking you right now",
        "💖 That's how self-love looks in action - gorgeous!",
        "🌟 You're glowing from the inside out today"
      ],
      streak_milestones: {
        3: "🔥 3 days of self-love! You're building something beautiful",
        7: "👑 One week of choosing yourself - you're a queen!",
        14: "💎 Two weeks strong! Your dedication is inspiring",
        30: "🏆 30 days of self-care mastery - you're absolutely incredible!",
        60: "🌟 Two months of loving yourself - you're a true inspiration",
        100: "💫 100 days of self-love! You're a wellness goddess!"
      },
      community_milestones: [
        "💕 Your first post inspired someone today",
        "🌸 You're building connections that matter",
        "✨ Your beauty wisdom is helping others shine"
      ]
    };
  }

  initializeMotivationalTips() {
    return [
      {
        category: "self_love",
        message: "💖 Look in the mirror and say 'I am worthy of love' - because you absolutely are",
        action: "Try this affirmation"
      },
      {
        category: "confidence",
        message: "👑 Stand tall, beautiful - your posture is your power pose",
        action: "Practice confident posture"
      },
      {
        category: "natural_beauty",
        message: "🌿 Your natural beauty is your signature - no one else can wear it like you do",
        action: "Embrace your uniqueness"
      },
      {
        category: "self_care",
        message: "🛁 Self-care isn't selfish - it's how you show up as your best self for the world",
        action: "Schedule 'me time'"
      },
      {
        category: "inner_beauty",
        message: "✨ Your kindness, strength, and spirit make you absolutely radiant",
        action: "Celebrate your inner qualities"
      }
    ];
  }

  // Generate personalized daily affirmation
  getDailyAffirmation(user) {
    const today = new Date().toDateString();
    const userSeed = user._id.toString() + today;
    const index = this.hashString(userSeed) % this.dailyAffirmations.length;
    
    return {
      message: this.dailyAffirmations[index],
      personalizedGreeting: this.getPersonalizedGreeting(user),
      timestamp: new Date(),
      type: 'daily_affirmation'
    };
  }

  // Get personalized greeting based on user data
  getPersonalizedGreeting(user) {
    const name = user.profile?.personalInfo?.name || 'Beautiful';
    const timeOfDay = this.getTimeOfDay();
    
    const greetings = [
      `Good ${timeOfDay}, ${name}! `,
      `Hello gorgeous ${name}! `,
      `Hey beautiful ${name}! `,
      `${name}, you're glowing today! `
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Send supportive message based on user behavior
  async sendSupportiveMessage(user, context) {
    const messages = this.supportiveMessages[context] || this.supportiveMessages.low_confidence;
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    const notification = {
      title: "💕 You're Not Alone",
      body: message,
      type: 'supportive_message',
      context: context,
      timestamp: new Date()
    };

    return this.sendNotification(user, notification);
  }

  // Celebrate user achievements
  async celebrateAchievement(user, achievementType, value = null) {
    let message;
    
    if (achievementType === 'streak' && this.celebrationMessages.streak_milestones[value]) {
      message = this.celebrationMessages.streak_milestones[value];
    } else if (this.celebrationMessages[achievementType]) {
      const messages = this.celebrationMessages[achievementType];
      message = messages[Math.floor(Math.random() * messages.length)];
    }

    if (message) {
      const notification = {
        title: "🎉 Celebration Time!",
        body: message,
        type: 'celebration',
        achievement: achievementType,
        timestamp: new Date()
      };

      return this.sendNotification(user, notification);
    }
  }

  // Send motivational tip
  async sendMotivationalTip(user) {
    const tip = this.motivationalTips[Math.floor(Math.random() * this.motivationalTips.length)];
    
    const notification = {
      title: "💫 Daily Inspiration",
      body: tip.message,
      action: tip.action,
      type: 'motivational_tip',
      category: tip.category,
      timestamp: new Date()
    };

    return this.sendNotification(user, notification);
  }

  // Send evening self-love reminder
  async sendEveningLove(user) {
    const eveningMessages = [
      "🌙 Before you sleep, remember: you did your best today, and that's enough",
      "✨ You are loved, you are worthy, you are enough - sweet dreams, beautiful",
      "💕 Tomorrow is another chance to love yourself - rest well, gorgeous",
      "🌟 Your beauty shines even in your sleep - you're absolutely wonderful",
      "💖 End this day with gratitude for your amazing self - you deserve peace"
    ];

    const message = eveningMessages[Math.floor(Math.random() * eveningMessages.length)];
    
    const notification = {
      title: "🌙 Evening Love",
      body: message,
      type: 'evening_love',
      timestamp: new Date()
    };

    return this.sendNotification(user, notification);
  }

  // Send body positivity message
  async sendBodyPositivityMessage(user) {
    const bodyPositiveMessages = [
      "🌸 Your body is your home - treat it with love and respect",
      "💖 Every curve, every line tells the story of your beautiful life",
      "✨ Your body has carried you through everything - it deserves appreciation",
      "🦋 You are not too much or too little - you are exactly right",
      "🌺 Your body is not an ornament - it's the vehicle for your dreams",
      "💕 Speak to your body like you would to someone you love deeply"
    ];

    const message = bodyPositiveMessages[Math.floor(Math.random() * bodyPositiveMessages.length)];
    
    const notification = {
      title: "💖 Body Love Reminder",
      body: message,
      type: 'body_positivity',
      timestamp: new Date()
    };

    return this.sendNotification(user, notification);
  }

  // Send community encouragement
  async sendCommunityEncouragement(user) {
    const communityMessages = [
      "👭 Your story matters - sharing it helps other women feel less alone",
      "🌟 You have wisdom that could light up someone else's day",
      "💕 The community is stronger because you're part of it",
      "✨ Your vulnerability is a gift to other women on their journey",
      "🤗 Every woman you support comes back to support you - that's sisterhood"
    ];

    const message = communityMessages[Math.floor(Math.random() * communityMessages.length)];
    
    const notification = {
      title: "👥 Community Love",
      body: message,
      type: 'community_encouragement',
      timestamp: new Date()
    };

    return this.sendNotification(user, notification);
  }

  // Smart notification scheduling based on user behavior
  async schedulePersonalizedNotifications(user) {
    const schedule = [];
    const userTimezone = user.profile?.personalInfo?.timezone || 'UTC';
    
    // Morning affirmation (8 AM)
    schedule.push({
      type: 'daily_affirmation',
      time: '08:00',
      timezone: userTimezone,
      frequency: 'daily'
    });

    // Motivational tip (2 PM)
    schedule.push({
      type: 'motivational_tip', 
      time: '14:00',
      timezone: userTimezone,
      frequency: 'daily'
    });

    // Evening love (9 PM)
    schedule.push({
      type: 'evening_love',
      time: '21:00', 
      timezone: userTimezone,
      frequency: 'daily'
    });

    // Body positivity (weekly - Sunday 10 AM)
    schedule.push({
      type: 'body_positivity',
      day: 'sunday',
      time: '10:00',
      timezone: userTimezone,
      frequency: 'weekly'
    });

    // Community encouragement (bi-weekly)
    schedule.push({
      type: 'community_encouragement',
      frequency: 'bi-weekly',
      timezone: userTimezone
    });

    return schedule;
  }

  // Helper methods
  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  async sendNotification(user, notification) {
    // Integration with notification service
    console.log(`Sending empowerment notification to ${user.profile?.personalInfo?.name}:`, notification);
    return { sent: true, notification };
  }

  // Generate weekly empowerment report
  generateWeeklyEmpowermentReport(user, weeklyData) {
    const achievements = [];
    
    if (weeklyData.routinesCompleted >= 5) {
      achievements.push("🏆 You prioritized self-care 5+ times this week!");
    }
    
    if (weeklyData.streakDays >= 7) {
      achievements.push("🔥 You maintained your beautiful routine streak!");
    }
    
    if (weeklyData.communityInteractions >= 3) {
      achievements.push("💕 You spread love in the community!");
    }

    return {
      title: "Your Weekly Glow Report ✨",
      achievements,
      affirmation: "You are growing more beautiful and confident every single day",
      nextWeekGoal: "Continue being the amazing woman you are"
    };
  }
}

module.exports = new EmpowermentService();