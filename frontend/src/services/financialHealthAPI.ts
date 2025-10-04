// Financial Health Service for Frontend
const API_BASE_URL = 'http://localhost:4000/api';

// Type definitions
interface FinancialHealthScore {
  id: string;
  user_id: string;
  overall_score: number;
  literacy_score: number;
  savings_score: number;
  debt_score: number;
  insurance_score: number;
  emergency_fund_score: number;
  investment_score: number;
  calculated_at: string;
  created_at: string;
  breakdown?: ScoreBreakdown;
}

interface ScoreBreakdown {
  literacy: ScoreComponent;
  savings: ScoreComponent;
  debt: ScoreComponent;
  insurance: ScoreComponent;
  emergency_fund: ScoreComponent;
  investment: ScoreComponent;
}

interface ScoreComponent {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'needs_improvement';
  recommendation: string;
}

interface ResilienceInsights {
  overall_resilience: {
    score: number;
    level: 'High' | 'Medium' | 'Low';
    description: string;
  };
  strengths: string[];
  improvement_areas: string[];
  next_actions: string[];
  risk_assessment: {
    level: 'High' | 'Medium' | 'Low';
    factors: string[];
  };
}

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Demo user ID for development (in real app, this would come from auth)
const getDemoUserId = (): string => {
  const localUser = localStorage.getItem('finbridge_user');
  if (localUser) {
    try {
      const parsedUser = JSON.parse(localUser);
      return parsedUser.id;
    } catch (error) {
      console.error('Error parsing local user:', error);
    }
  }
  return 'demo-user-123'; // Fallback demo user ID
};

export class FinancialHealthAPI {
  static async getLatestScore(): Promise<APIResponse<FinancialHealthScore>> {
    try {
      const response = await fetch(`${API_BASE_URL}/health-score`, {
        headers: {
          'X-User-ID': getDemoUserId()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching latest score:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async calculateNewScore(): Promise<APIResponse<FinancialHealthScore>> {
    try {
      const response = await fetch(`${API_BASE_URL}/health-score/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': getDemoUserId()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating new score:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async getScoreHistory(months: number = 6): Promise<APIResponse<FinancialHealthScore[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/health-score/history?months=${months}`, {
        headers: {
          'X-User-ID': getDemoUserId()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching score history:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async getScoreBreakdown(): Promise<APIResponse<{
    overall_score: number;
    calculated_at: string;
    breakdown: ScoreBreakdown;
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/health-score/breakdown`, {
        headers: {
          'X-User-ID': getDemoUserId()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching score breakdown:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async getResilienceInsights(): Promise<APIResponse<ResilienceInsights>> {
    try {
      const response = await fetch(`${API_BASE_URL}/resilience/insights`, {
        headers: {
          'X-User-ID': getDemoUserId()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching resilience insights:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // Helper method to get score status color
  static getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }

  // Helper method to get score status badge variant
  static getScoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  }

  // Helper method to format score status
  static formatScoreStatus(status: string): string {
    switch (status) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      case 'needs_improvement':
        return 'Needs Improvement';
      default:
        return status;
    }
  }

  // Mock data for development (when backend is not available)
  static getMockFinancialHealthScore(): FinancialHealthScore {
    return {
      id: 'mock-score-1',
      user_id: getDemoUserId(),
      overall_score: 72,
      literacy_score: 85,
      savings_score: 65,
      debt_score: 78,
      insurance_score: 45,
      emergency_fund_score: 60,
      investment_score: 70,
      calculated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      breakdown: {
        literacy: {
          score: 85,
          status: 'excellent',
          recommendation: 'Great job! Keep learning about advanced financial topics.'
        },
        savings: {
          score: 65,
          status: 'good',
          recommendation: 'Good savings rate. Try to automate your savings for consistency.'
        },
        debt: {
          score: 78,
          status: 'good',
          recommendation: 'Good debt control. Consider debt consolidation if applicable.'
        },
        insurance: {
          score: 45,
          status: 'needs_improvement',
          recommendation: 'Increase insurance coverage. Aim for 2-5% of income.'
        },
        emergency_fund: {
          score: 60,
          status: 'fair',
          recommendation: 'Build your emergency fund to at least 3 months of expenses.'
        },
        investment: {
          score: 70,
          status: 'good',
          recommendation: 'Good start! Consider increasing SIP amounts gradually.'
        }
      }
    };
  }

  static getMockResilienceInsights(): ResilienceInsights {
    return {
      overall_resilience: {
        score: 72,
        level: 'Medium',
        description: 'Good financial resilience. You have a solid foundation with room for improvement.'
      },
      strengths: [
        'Strong financial knowledge',
        'Good savings habits',
        'Well-managed debt levels'
      ],
      improvement_areas: [
        'Insurance coverage',
        'Emergency fund'
      ],
      next_actions: [
        'Increase insurance coverage to 3-5% of income',
        'Build emergency fund to 6 months expenses',
        'Start systematic investment plan'
      ],
      risk_assessment: {
        level: 'Medium',
        factors: [
          'Inadequate protection against risks'
        ]
      }
    };
  }
}