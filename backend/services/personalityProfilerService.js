const supabase = require('../models/database').supabase;

/**
 * Personality Profiler Service
 * Handles user personality assessment, profile management, and behavioral insights
 */

// Personality types and their characteristics
const PERSONALITY_TYPES = {
  'prudent_saver': {
    name: 'The Prudent Saver',
    description: 'You prioritize financial security and long-term stability. You\'re naturally cautious with money and prefer guaranteed returns.',
    traits: ['cautious', 'security-focused', 'long-term-oriented'],
    strengths: ['Excellent at building emergency funds', 'Natural budgeting skills', 'Low debt tendency'],
    challenges: ['May miss growth opportunities', 'Could be too conservative with investments'],
    recommendations: ['Explore balanced mutual funds', 'Set up automated investing', 'Learn about inflation protection'],
    color: '#10B981' // green
  },
  'lifestyle_enthusiast': {
    name: 'The Lifestyle Enthusiast',
    description: 'You believe in enjoying life and see money as a tool for experiences and happiness.',
    traits: ['experience-focused', 'present-oriented', 'optimistic'],
    strengths: ['Good at enjoying life', 'Often career-focused for income growth', 'Values experiences'],
    challenges: ['May struggle with long-term savings', 'Impulse spending tendencies'],
    recommendations: ['Automate savings first', 'Use the 50/30/20 rule', 'Set up separate fun money accounts'],
    color: '#F59E0B' // amber
  },
  'growth_seeker': {
    name: 'The Growth Seeker',
    description: 'You understand money should work for you and actively seek investment opportunities.',
    traits: ['growth-oriented', 'risk-tolerant', 'research-focused'],
    strengths: ['Future-oriented thinking', 'Comfortable with market research', 'Growth mindset'],
    challenges: ['May take excessive risks', 'Could neglect emergency funds'],
    recommendations: ['Diversify your portfolio', 'Don\'t forget emergency savings', 'Regular portfolio reviews'],
    color: '#3B82F6' // blue
  },
  'balanced_planner': {
    name: 'The Balanced Planner',
    description: 'You take a methodical approach to finances, balancing saving, spending, and investing.',
    traits: ['methodical', 'balanced', 'goal-oriented'],
    strengths: ['Good at creating financial plans', 'Balanced approach to risk', 'Goal-focused'],
    challenges: ['May over-analyze decisions', 'Could be slow to act on opportunities'],
    recommendations: ['Set clear financial milestones', 'Automate regular reviews', 'Consider robo-advisors'],
    color: '#8B5CF6' // purple
  },
  'risk_averse': {
    name: 'The Safety-First Investor',
    description: 'You prefer guaranteed returns and prioritize capital preservation over high growth.',
    traits: ['conservative', 'safety-focused', 'patient'],
    strengths: ['Low risk of major losses', 'Consistent saving habits', 'Patient investor'],
    challenges: ['Returns may not beat inflation', 'Overly cautious approach'],
    recommendations: ['Consider balanced funds', 'Learn about SIPs', 'Gradual risk increase'],
    color: '#64748B' // slate
  }
};

// Challenge templates based on personality types
const PERSONALITY_CHALLENGES = {
  'prudent_saver': [
    {
      title: '30-Day Investment Challenge',
      description: 'Start small with a balanced mutual fund SIP',
      target_amount: 1000,
      duration_days: 30,
      difficulty: 'beginner'
    },
    {
      title: 'Emergency Fund Booster',
      description: 'Increase emergency fund by 10%',
      target_amount: 5000,
      duration_days: 60,
      difficulty: 'intermediate'
    }
  ],
  'lifestyle_enthusiast': [
    {
      title: 'Automated Savings Challenge',
      description: 'Set up automatic transfers to save 20% of income',
      target_amount: 10000,
      duration_days: 30,
      difficulty: 'beginner'
    },
    {
      title: 'Fun Fund Management',
      description: 'Allocate entertainment budget without compromising savings',
      target_amount: 5000,
      duration_days: 30,
      difficulty: 'intermediate'
    }
  ],
  'growth_seeker': [
    {
      title: 'Portfolio Diversification',
      description: 'Spread investments across 5 different asset classes',
      target_amount: 25000,
      duration_days: 45,
      difficulty: 'advanced'
    },
    {
      title: 'Risk Assessment Challenge',
      description: 'Complete risk profiling and adjust portfolio accordingly',
      target_amount: 0,
      duration_days: 14,
      difficulty: 'intermediate'
    }
  ],
  'balanced_planner': [
    {
      title: 'Financial Plan Review',
      description: 'Create or update comprehensive 5-year financial plan',
      target_amount: 0,
      duration_days: 21,
      difficulty: 'intermediate'
    },
    {
      title: 'Goal-Based Investing',
      description: 'Allocate investments based on specific financial goals',
      target_amount: 15000,
      duration_days: 30,
      difficulty: 'advanced'
    }
  ],
  'risk_averse': [
    {
      title: 'Conservative Portfolio Builder',
      description: 'Start with debt funds and gradually add equity exposure',
      target_amount: 5000,
      duration_days: 60,
      difficulty: 'beginner'
    },
    {
      title: 'Inflation Protection Plan',
      description: 'Learn about and invest in inflation-protected securities',
      target_amount: 10000,
      duration_days: 45,
      difficulty: 'intermediate'
    }
  ]
};

class PersonalityProfilerService {
  /**
   * Calculate personality type based on assessment answers
   */
  static calculatePersonalityType(answers) {
    const scores = {
      'prudent_saver': 0,
      'lifestyle_enthusiast': 0,
      'growth_seeker': 0,
      'balanced_planner': 0,
      'risk_averse': 0
    };

    // Question 1: Salary approach
    switch (answers.salary_approach) {
      case 'save_immediately':
        scores.prudent_saver += 3;
        scores.balanced_planner += 1;
        break;
      case 'buy_wanted_item':
        scores.lifestyle_enthusiast += 3;
        break;
      case 'invest_opportunity':
        scores.growth_seeker += 3;
        break;
      case 'review_budget':
        scores.balanced_planner += 3;
        scores.prudent_saver += 1;
        break;
    }

    // Question 2: Risk tolerance
    switch (answers.risk_tolerance) {
      case 'guaranteed_returns':
        scores.risk_averse += 3;
        scores.prudent_saver += 2;
        break;
      case 'calculated_risks':
        scores.balanced_planner += 3;
        scores.growth_seeker += 1;
        break;
      case 'high_risk_reward':
        scores.growth_seeker += 3;
        break;
      case 'risk_anxious':
        scores.risk_averse += 3;
        break;
    }

    // Question 3: Planning approach
    switch (answers.planning_approach) {
      case 'detailed_longterm':
        scores.balanced_planner += 3;
        scores.prudent_saver += 1;
        break;
      case 'basic_monthly':
        scores.balanced_planner += 2;
        scores.lifestyle_enthusiast += 1;
        break;
      case 'reactive_approach':
        scores.lifestyle_enthusiast += 2;
        break;
      case 'planning_overwhelming':
        scores.risk_averse += 2;
        scores.lifestyle_enthusiast += 1;
        break;
    }

    // Question 4: Purchase decisions
    switch (answers.purchase_decision) {
      case 'extensive_research':
        scores.balanced_planner += 3;
        scores.prudent_saver += 1;
        break;
      case 'gut_feeling':
        scores.lifestyle_enthusiast += 3;
        break;
      case 'sleep_on_it':
        scores.prudent_saver += 2;
        scores.risk_averse += 2;
        break;
      case 'best_deal':
        scores.prudent_saver += 2;
        scores.balanced_planner += 1;
        break;
    }

    // Question 5: Emergency fund status
    switch (answers.emergency_fund) {
      case 'six_plus_months':
        scores.prudent_saver += 3;
        scores.balanced_planner += 2;
        break;
      case 'one_to_three_months':
        scores.balanced_planner += 2;
        scores.prudent_saver += 1;
        break;
      case 'less_than_month':
        scores.lifestyle_enthusiast += 2;
        scores.growth_seeker += 1;
        break;
      case 'no_emergency_fund':
        scores.lifestyle_enthusiast += 3;
        break;
    }

    // Question 6: Investment knowledge
    switch (answers.investment_knowledge) {
      case 'very_knowledgeable':
        scores.growth_seeker += 3;
        scores.balanced_planner += 1;
        break;
      case 'some_knowledge':
        scores.balanced_planner += 2;
        scores.growth_seeker += 1;
        break;
      case 'basic_knowledge':
        scores.prudent_saver += 2;
        scores.risk_averse += 1;
        break;
      case 'no_knowledge':
        scores.risk_averse += 3;
        break;
    }

    // Find the personality type with highest score
    const dominantPersonality = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[0][0];

    return {
      personality_type: dominantPersonality,
      scores: scores,
      confidence_level: Math.max(...Object.values(scores)) / 18 * 100 // Max possible score is 18
    };
  }

  /**
   * Create or update user personality profile
   */
  static async createOrUpdateUserProfile(userId, profileData) {
    try {
      const assessment_results = this.calculatePersonalityType(profileData.answers);
      
      const profilePayload = {
        user_id: userId,
        personality_type: assessment_results.personality_type,
        assessment_answers: profileData.answers,
        assessment_scores: assessment_results.scores,
        confidence_level: assessment_results.confidence_level,
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('user_personality_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      let result;
      if (existingProfile) {
        // Update existing profile
        profilePayload.updated_at = new Date().toISOString();
        delete profilePayload.created_at;
        
        result = await supabase
          .from('user_personality_profiles')
          .update(profilePayload)
          .eq('user_id', userId)
          .select()
          .single();
      } else {
        // Create new profile
        result = await supabase
          .from('user_personality_profiles')
          .insert(profilePayload)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      // Generate personalized challenges
      await this.generatePersonalizedChallenges(userId, assessment_results.personality_type);

      return {
        success: true,
        data: {
          ...result.data,
          personality_details: PERSONALITY_TYPES[assessment_results.personality_type]
        }
      };

    } catch (error) {
      console.error('Error creating/updating profile:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user personality profile
   */
  static async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_personality_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: {
          ...data,
          personality_details: PERSONALITY_TYPES[data.personality_type]
        }
      };

    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate personalized challenges based on personality type
   */
  static async generatePersonalizedChallenges(userId, personalityType) {
    try {
      const challenges = PERSONALITY_CHALLENGES[personalityType] || [];
      
      // Clear existing challenges for this user
      await supabase
        .from('personality_challenges')
        .delete()
        .eq('user_id', userId)
        .eq('status', 'pending');

      // Insert new challenges
      const challengePromises = challenges.map(challenge => {
        return supabase
          .from('personality_challenges')
          .insert({
            user_id: userId,
            personality_type: personalityType,
            title: challenge.title,
            description: challenge.description,
            target_amount: challenge.target_amount,
            duration_days: challenge.duration_days,
            difficulty: challenge.difficulty,
            status: 'pending',
            progress: 0,
            created_at: new Date().toISOString()
          });
      });

      await Promise.all(challengePromises);

      return {
        success: true,
        challenges_generated: challenges.length
      };

    } catch (error) {
      console.error('Error generating challenges:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get personalized challenges for user
   */
  static async getPersonalizedChallenges(userId) {
    try {
      const { data, error } = await supabase
        .from('personality_challenges')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data || []
      };

    } catch (error) {
      console.error('Error fetching challenges:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update challenge progress
   */
  static async updateChallengeProgress(challengeId, progress, userId) {
    try {
      const { data, error } = await supabase
        .from('personality_challenges')
        .update({
          progress: Math.min(100, Math.max(0, progress)),
          status: progress >= 100 ? 'completed' : 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', challengeId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('Error updating challenge progress:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get behavioral insights based on user progress and personality
   */
  static async getBehavioralInsights(userId) {
    try {
      // Get user profile
      const profileResult = await this.getUserProfile(userId);
      if (!profileResult.success) {
        throw new Error('Profile not found');
      }

      const profile = profileResult.data;

      // Get challenge completion stats
      const { data: challengeStats } = await supabase
        .from('personality_challenges')
        .select('status, difficulty, progress')
        .eq('user_id', userId);

      // Get user's financial behavior from other modules
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('transaction_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      // Calculate insights
      const completedChallenges = challengeStats?.filter(c => c.status === 'completed').length || 0;
      const totalChallenges = challengeStats?.length || 0;
      const avgProgress = challengeStats?.reduce((sum, c) => sum + c.progress, 0) / (challengeStats?.length || 1);

      const insights = {
        personality_alignment: this.calculatePersonalityAlignment(profile, transactions),
        behavioral_trends: this.analyzeBehavioralTrends(transactions, profile.personality_type),
        challenge_performance: {
          completion_rate: totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0,
          average_progress: avgProgress,
          total_challenges: totalChallenges
        },
        recommendations: this.generateBehavioralRecommendations(profile, challengeStats, transactions),
        growth_indicators: this.calculateGrowthIndicators(profile, challengeStats)
      };

      return {
        success: true,
        data: insights
      };

    } catch (error) {
      console.error('Error generating insights:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calculate how well user's behavior aligns with their personality type
   */
  static calculatePersonalityAlignment(profile, transactions) {
    const personalityType = profile.personality_type;
    let alignmentScore = 50; // Base score

    if (!transactions || transactions.length === 0) {
      return { score: alignmentScore, analysis: 'Insufficient transaction data' };
    }

    const totalSpent = transactions.filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalIncome = transactions.filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) * 100 : 0;

    // Adjust score based on personality type
    switch (personalityType) {
      case 'prudent_saver':
        if (savingsRate >= 30) alignmentScore += 30;
        else if (savingsRate >= 20) alignmentScore += 15;
        else alignmentScore -= 20;
        break;
      case 'lifestyle_enthusiast':
        if (savingsRate >= 10 && savingsRate <= 25) alignmentScore += 20;
        if (totalSpent > totalIncome * 0.7) alignmentScore += 10;
        break;
      case 'growth_seeker':
        // Would need investment data to properly assess
        if (savingsRate >= 20) alignmentScore += 20;
        break;
      case 'balanced_planner':
        if (savingsRate >= 20 && savingsRate <= 35) alignmentScore += 25;
        break;
      case 'risk_averse':
        if (savingsRate >= 25) alignmentScore += 25;
        break;
    }

    return {
      score: Math.min(100, Math.max(0, alignmentScore)),
      analysis: `${savingsRate.toFixed(1)}% savings rate ${this.getAlignmentMessage(personalityType, savingsRate)}`
    };
  }

  static getAlignmentMessage(personalityType, savingsRate) {
    const expectations = {
      'prudent_saver': 30,
      'lifestyle_enthusiast': 15,
      'growth_seeker': 20,
      'balanced_planner': 25,
      'risk_averse': 30
    };

    const expected = expectations[personalityType] || 20;
    if (savingsRate >= expected) {
      return 'aligns well with your personality type';
    } else {
      return `is below the ${expected}% typically expected for your personality type`;
    }
  }

  /**
   * Analyze behavioral trends
   */
  static analyzeBehavioralTrends(transactions, personalityType) {
    if (!transactions || transactions.length === 0) {
      return { trend: 'insufficient_data', message: 'Not enough transaction data to analyze trends' };
    }

    // Calculate weekly spending variance
    const weeklySpending = this.groupTransactionsByWeek(transactions);
    const spendingVariance = this.calculateVariance(weeklySpending);

    let trend, message;
    if (spendingVariance < 0.2) {
      trend = 'consistent';
      message = 'Your spending patterns are very consistent, which aligns well with disciplined financial behavior.';
    } else if (spendingVariance < 0.5) {
      trend = 'moderate_variance';
      message = 'Your spending shows moderate variation, which is normal for most people.';
    } else {
      trend = 'high_variance';
      message = 'Your spending patterns vary significantly week to week. Consider budgeting tools for better consistency.';
    }

    return { trend, message, variance: spendingVariance };
  }

  /**
   * Generate behavioral recommendations
   */
  static generateBehavioralRecommendations(profile, challengeStats, transactions) {
    const recommendations = [];
    const personalityType = profile.personality_type;
    const personalityInfo = PERSONALITY_TYPES[personalityType];

    // Add personality-specific recommendations
    recommendations.push(...personalityInfo.recommendations.map(rec => ({
      type: 'personality_based',
      message: rec,
      priority: 'medium'
    })));

    // Challenge-based recommendations
    if (challengeStats && challengeStats.length > 0) {
      const completionRate = challengeStats.filter(c => c.status === 'completed').length / challengeStats.length;
      if (completionRate < 0.3) {
        recommendations.push({
          type: 'challenge_completion',
          message: 'Try breaking down challenges into smaller, daily tasks to improve completion rates.',
          priority: 'high'
        });
      }
    }

    // Transaction-based recommendations
    if (transactions && transactions.length > 0) {
      const hasRegularIncome = transactions.some(t => t.transaction_type === 'income');
      if (!hasRegularIncome) {
        recommendations.push({
          type: 'income_tracking',
          message: 'Start tracking your income to get better financial insights and planning capabilities.',
          priority: 'high'
        });
      }
    }

    return recommendations;
  }

  /**
   * Calculate growth indicators
   */
  static calculateGrowthIndicators(profile, challengeStats) {
    const indicators = {
      learning_progress: 0,
      behavioral_consistency: 0,
      challenge_engagement: 0,
      overall_growth: 0
    };

    // Learning progress (based on assessment confidence and recent activity)
    indicators.learning_progress = Math.min(100, profile.confidence_level + 20);

    // Challenge engagement
    if (challengeStats && challengeStats.length > 0) {
      const avgProgress = challengeStats.reduce((sum, c) => sum + c.progress, 0) / challengeStats.length;
      indicators.challenge_engagement = avgProgress;
    }

    // Behavioral consistency (placeholder - would need more behavioral data)
    indicators.behavioral_consistency = 70;

    // Overall growth score
    indicators.overall_growth = (
      indicators.learning_progress * 0.3 +
      indicators.behavioral_consistency * 0.3 +
      indicators.challenge_engagement * 0.4
    );

    return indicators;
  }

  // Utility methods
  static groupTransactionsByWeek(transactions) {
    const weeks = {};
    transactions.forEach(transaction => {
      const date = new Date(transaction.transaction_date);
      const week = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
      weeks[week] = (weeks[week] || 0) + Math.abs(transaction.amount);
    });
    return Object.values(weeks);
  }

  static calculateVariance(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return variance / (mean || 1); // Coefficient of variation
  }
}

module.exports = PersonalityProfilerService;