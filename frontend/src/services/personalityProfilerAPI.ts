/**
 * Personality Profiler API Service
 * Handles communication with backend personality profiler endpoints
 */

const API_BASE_URL = 'http://localhost:4000/api';

export interface AssessmentAnswers {
  salary_approach: string;
  risk_tolerance: string;
  planning_approach: string;
  purchase_decision: string;
  emergency_fund: string;
  investment_knowledge: string;
}

export interface PersonalityProfile {
  id: string;
  user_id: string;
  personality_type: string;
  assessment_answers: AssessmentAnswers;
  assessment_scores: Record<string, number>;
  confidence_level: number;
  completed_at: string;
  personality_details: {
    name: string;
    description: string;
    traits: string[];
    strengths: string[];
    challenges: string[];
    recommendations: string[];
    color: string;
  };
}

export interface PersonalityChallenge {
  id: string;
  user_id: string;
  personality_type: string;
  title: string;
  description: string;
  target_amount: number;
  duration_days: number;
  difficulty: string;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface BehavioralInsights {
  personality_alignment: {
    score: number;
    analysis: string;
  };
  behavioral_trends: {
    trend: string;
    message: string;
    variance?: number;
  };
  challenge_performance: {
    completion_rate: number;
    average_progress: number;
    total_challenges: number;
  };
  recommendations: Array<{
    type: string;
    message: string;
    priority: string;
  }>;
  growth_indicators: {
    learning_progress: number;
    behavioral_consistency: number;
    challenge_engagement: number;
    overall_growth: number;
  };
}

export interface PersonalityType {
  name: string;
  description: string;
  traits: string[];
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  color: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class PersonalityProfilerAPI {
  private static getUserId(): string {
    // Get user ID from localStorage or session
    const localUser = localStorage.getItem('finbridge_user');
    if (localUser) {
      try {
        const user = JSON.parse(localUser);
        return user.id;
      } catch (error) {
        console.error('Error parsing local user:', error);
      }
    }
    return 'demo-user-123'; // Fallback for demo
  }

  /**
   * Complete personality assessment
   */
  static async completeAssessment(answers: AssessmentAnswers): Promise<APIResponse<PersonalityProfile>> {
    try {
      const userId = this.getUserId();
      
      const response = await fetch(`${API_BASE_URL}/personality-profiler/assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          answers
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Assessment failed');
      }

      return result;
    } catch (error) {
      console.error('Error completing assessment:', error);
      
      // Return mock data for demo purposes
      return {
        success: true,
        data: this.getMockPersonalityProfile(answers)
      };
    }
  }

  /**
   * Get user personality profile
   */
  static async getUserProfile(): Promise<APIResponse<PersonalityProfile>> {
    try {
      const userId = this.getUserId();
      
      const response = await fetch(`${API_BASE_URL}/personality-profiler/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch profile');
      }

      return result;
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // Return mock data for demo
      return {
        success: false,
        error: 'Profile not found. Please complete the assessment first.'
      };
    }
  }

  /**
   * Get personalized challenges
   */
  static async getPersonalizedChallenges(): Promise<APIResponse<PersonalityChallenge[]>> {
    try {
      const userId = this.getUserId();
      
      const response = await fetch(`${API_BASE_URL}/personality-profiler/challenges/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch challenges');
      }

      return result;
    } catch (error) {
      console.error('Error fetching challenges:', error);
      
      // Return mock challenges
      return {
        success: true,
        data: this.getMockChallenges()
      };
    }
  }

  /**
   * Update challenge progress
   */
  static async updateChallengeProgress(challengeId: string, progress: number): Promise<APIResponse<PersonalityChallenge>> {
    try {
      const userId = this.getUserId();
      
      const response = await fetch(`${API_BASE_URL}/personality-profiler/challenges/${challengeId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          progress
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update progress');
      }

      return result;
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update progress'
      };
    }
  }

  /**
   * Generate new personalized challenges
   */
  static async generateNewChallenges(): Promise<APIResponse<{ challenges_generated: number }>> {
    try {
      const userId = this.getUserId();
      
      const response = await fetch(`${API_BASE_URL}/personality-profiler/challenges/${userId}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate challenges');
      }

      return result;
    } catch (error) {
      console.error('Error generating challenges:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate challenges'
      };
    }
  }

  /**
   * Get behavioral insights
   */
  static async getBehavioralInsights(): Promise<APIResponse<BehavioralInsights>> {
    try {
      const userId = this.getUserId();
      
      const response = await fetch(`${API_BASE_URL}/personality-profiler/insights/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch insights');
      }

      return result;
    } catch (error) {
      console.error('Error fetching insights:', error);
      
      // Return mock insights
      return {
        success: true,
        data: this.getMockBehavioralInsights()
      };
    }
  }

  /**
   * Get all personality types
   */
  static async getPersonalityTypes(): Promise<APIResponse<Record<string, PersonalityType>>> {
    try {
      const response = await fetch(`${API_BASE_URL}/personality-profiler/types`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch personality types');
      }

      return result;
    } catch (error) {
      console.error('Error fetching personality types:', error);
      
      // Return mock types
      return {
        success: true,
        data: this.getMockPersonalityTypes()
      };
    }
  }

  // Mock data for demo purposes
  private static getMockPersonalityProfile(answers: AssessmentAnswers): PersonalityProfile {
    // Simple logic to determine personality type based on answers
    let personalityType = 'balanced_planner';
    
    if (answers.salary_approach === 'save_immediately' && answers.risk_tolerance === 'guaranteed_returns') {
      personalityType = 'prudent_saver';
    } else if (answers.salary_approach === 'buy_wanted_item' && answers.planning_approach === 'reactive_approach') {
      personalityType = 'lifestyle_enthusiast';
    } else if (answers.risk_tolerance === 'high_risk_reward' && answers.investment_knowledge === 'very_knowledgeable') {
      personalityType = 'growth_seeker';
    } else if (answers.risk_tolerance === 'risk_anxious' && answers.emergency_fund === 'no_emergency_fund') {
      personalityType = 'risk_averse';
    }

    const personalityDetails = this.getMockPersonalityTypes()[personalityType];

    return {
      id: 'mock-profile-123',
      user_id: this.getUserId(),
      personality_type: personalityType,
      assessment_answers: answers,
      assessment_scores: {
        prudent_saver: personalityType === 'prudent_saver' ? 85 : 20,
        lifestyle_enthusiast: personalityType === 'lifestyle_enthusiast' ? 80 : 15,
        growth_seeker: personalityType === 'growth_seeker' ? 90 : 25,
        balanced_planner: personalityType === 'balanced_planner' ? 85 : 30,
        risk_averse: personalityType === 'risk_averse' ? 85 : 10
      },
      confidence_level: 85,
      completed_at: new Date().toISOString(),
      personality_details: personalityDetails
    };
  }

  private static getMockChallenges(): PersonalityChallenge[] {
    return [
      {
        id: 'challenge-1',
        user_id: this.getUserId(),
        personality_type: 'balanced_planner',
        title: '30-Day Budget Tracking Challenge',
        description: 'Track all your expenses for 30 days to better understand your spending patterns',
        target_amount: 0,
        duration_days: 30,
        difficulty: 'beginner',
        status: 'in_progress',
        progress: 65,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'challenge-2',
        user_id: this.getUserId(),
        personality_type: 'balanced_planner',
        title: 'Emergency Fund Builder',
        description: 'Build an emergency fund worth 3 months of expenses',
        target_amount: 75000,
        duration_days: 90,
        difficulty: 'intermediate',
        status: 'pending',
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private static getMockBehavioralInsights(): BehavioralInsights {
    return {
      personality_alignment: {
        score: 78,
        analysis: '22.5% savings rate aligns well with your balanced planner personality type'
      },
      behavioral_trends: {
        trend: 'consistent',
        message: 'Your spending patterns are very consistent, which aligns well with disciplined financial behavior.',
        variance: 0.15
      },
      challenge_performance: {
        completion_rate: 60,
        average_progress: 65,
        total_challenges: 5
      },
      recommendations: [
        {
          type: 'personality_based',
          message: 'Set clear financial milestones to track your progress',
          priority: 'medium'
        },
        {
          type: 'behavioral',
          message: 'Consider automating more of your savings to maintain consistency',
          priority: 'high'
        }
      ],
      growth_indicators: {
        learning_progress: 80,
        behavioral_consistency: 85,
        challenge_engagement: 65,
        overall_growth: 76
      }
    };
  }

  private static getMockPersonalityTypes(): Record<string, PersonalityType> {
    return {
      'prudent_saver': {
        name: 'The Prudent Saver',
        description: 'You prioritize financial security and long-term stability.',
        traits: ['cautious', 'security-focused', 'long-term-oriented'],
        strengths: ['Excellent at building emergency funds', 'Natural budgeting skills', 'Low debt tendency'],
        challenges: ['May miss growth opportunities', 'Could be too conservative with investments'],
        recommendations: ['Explore balanced mutual funds', 'Set up automated investing', 'Learn about inflation protection'],
        color: '#10B981'
      },
      'lifestyle_enthusiast': {
        name: 'The Lifestyle Enthusiast',
        description: 'You believe in enjoying life and see money as a tool for experiences.',
        traits: ['experience-focused', 'present-oriented', 'optimistic'],
        strengths: ['Good at enjoying life', 'Often career-focused for income growth', 'Values experiences'],
        challenges: ['May struggle with long-term savings', 'Impulse spending tendencies'],
        recommendations: ['Automate savings first', 'Use the 50/30/20 rule', 'Set up separate fun money accounts'],
        color: '#F59E0B'
      },
      'growth_seeker': {
        name: 'The Growth Seeker',
        description: 'You understand money should work for you and actively seek opportunities.',
        traits: ['growth-oriented', 'risk-tolerant', 'research-focused'],
        strengths: ['Future-oriented thinking', 'Comfortable with market research', 'Growth mindset'],
        challenges: ['May take excessive risks', 'Could neglect emergency funds'],
        recommendations: ['Diversify your portfolio', 'Don\'t forget emergency savings', 'Regular portfolio reviews'],
        color: '#3B82F6'
      },
      'balanced_planner': {
        name: 'The Balanced Planner',
        description: 'You take a methodical approach to finances, balancing all aspects.',
        traits: ['methodical', 'balanced', 'goal-oriented'],
        strengths: ['Good at creating financial plans', 'Balanced approach to risk', 'Goal-focused'],
        challenges: ['May over-analyze decisions', 'Could be slow to act on opportunities'],
        recommendations: ['Set clear financial milestones', 'Automate regular reviews', 'Consider robo-advisors'],
        color: '#8B5CF6'
      },
      'risk_averse': {
        name: 'The Safety-First Investor',
        description: 'You prefer guaranteed returns and prioritize capital preservation.',
        traits: ['conservative', 'safety-focused', 'patient'],
        strengths: ['Low risk of major losses', 'Consistent saving habits', 'Patient investor'],
        challenges: ['Returns may not beat inflation', 'Overly cautious approach'],
        recommendations: ['Consider balanced funds', 'Learn about SIPs', 'Gradual risk increase'],
        color: '#64748B'
      }
    };
  }
}

export default PersonalityProfilerAPI;