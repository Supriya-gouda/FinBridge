// Financial Health Score Service
const { supabase } = require('../models/database');

class FinancialHealthService {
  // Calculate comprehensive financial health score
  static async calculateFinancialHealthScore(userId) {
    try {
      // Fetch all required data
      const [transactionsResult, goalsResult, userProgressResult] = await Promise.all([
        this.getUserTransactions(userId),
        this.getUserGoals(userId),
        this.getUserProgress(userId)
      ]);

      if (!transactionsResult.success || !goalsResult.success || !userProgressResult.success) {
        throw new Error('Failed to fetch user data for score calculation');
      }

      const transactions = transactionsResult.data;
      const goals = goalsResult.data;
      const userProgress = userProgressResult.data;

      // Calculate individual component scores
      const literacyScore = this.calculateLiteracyScore(userProgress);
      const savingsScore = this.calculateSavingsScore(transactions, goals);
      const debtScore = this.calculateDebtScore(transactions);
      const insuranceScore = this.calculateInsuranceScore(transactions);
      const emergencyFundScore = this.calculateEmergencyFundScore(goals, transactions);
      const investmentScore = this.calculateInvestmentScore(transactions);

      // Calculate weighted overall score
      const overallScore = Math.round(
        (literacyScore * 0.20) +      // 20% weight
        (savingsScore * 0.20) +       // 20% weight
        (debtScore * 0.15) +          // 15% weight
        (insuranceScore * 0.10) +     // 10% weight
        (emergencyFundScore * 0.20) + // 20% weight
        (investmentScore * 0.15)      // 15% weight
      );

      const scoreData = {
        user_id: userId,
        overall_score: overallScore,
        literacy_score: literacyScore,
        savings_score: savingsScore,
        debt_score: debtScore,
        insurance_score: insuranceScore,
        emergency_fund_score: emergencyFundScore,
        investment_score: investmentScore,
        calculated_at: new Date().toISOString()
      };

      // Store the calculated score
      const { data, error } = await supabase
        .from('resilience_scores')
        .insert([scoreData])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: { ...scoreData, breakdown: this.getScoreBreakdown(scoreData) } };
    } catch (error) {
      console.error('Error calculating financial health score:', error);
      return { success: false, error: error.message };
    }
  }

  // Get latest financial health score for user
  static async getLatestScore(userId) {
    try {
      const { data, error } = await supabase
        .from('resilience_scores')
        .select('*')
        .eq('user_id', userId)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found

      if (!data) {
        // No score exists, calculate one
        return await this.calculateFinancialHealthScore(userId);
      }

      return { 
        success: true, 
        data: { 
          ...data, 
          breakdown: this.getScoreBreakdown(data) 
        } 
      };
    } catch (error) {
      console.error('Error fetching latest score:', error);
      return { success: false, error: error.message };
    }
  }

  // Get score history for trend analysis
  static async getScoreHistory(userId, months = 6) {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const { data, error } = await supabase
        .from('resilience_scores')
        .select('*')
        .eq('user_id', userId)
        .gte('calculated_at', startDate.toISOString())
        .order('calculated_at', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching score history:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate literacy score based on completed lessons and progress
  static calculateLiteracyScore(userProgress) {
    if (!userProgress || userProgress.length === 0) return 0;

    const totalLessons = 24; // Assume 24 lessons total across all modules
    const completedLessons = userProgress.filter(p => p.progress_status === 'completed').length;

    const averageScore = userProgress.reduce(
      (sum, p) => sum + (p.score || 0), 0
    ) / userProgress.length;

    // Combine lesson completion and average score
    const completionScore = (completedLessons / totalLessons) * 60; // 60% weight for completed lessons
    const performanceScore = (averageScore / 100) * 40; // 40% weight for average score

    return Math.min(100, Math.round(completionScore + performanceScore));
  }

  // Calculate savings score based on savings rate and consistency
  static calculateSavingsScore(transactions, goals) {
    if (!transactions || transactions.length === 0) return 0;

    // Calculate last 3 months data
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentTransactions = transactions.filter(
      t => new Date(t.transaction_date) >= threeMonthsAgo
    );

    const totalIncome = recentTransactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalSavings = recentTransactions
      .filter(t => t.transaction_type === 'savings')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    if (totalIncome === 0) return 0;

    const savingsRate = (totalSavings / totalIncome) * 100;
    
    // Score based on savings rate
    let score = 0;
    if (savingsRate >= 20) score = 100;
    else if (savingsRate >= 15) score = 80;
    else if (savingsRate >= 10) score = 60;
    else if (savingsRate >= 5) score = 40;
    else score = 20;

    // Bonus for having active savings goals
    const activeSavingsGoals = goals.filter(g => 
      g.status === 'active' && ['emergency_fund', 'vacation', 'house'].includes(g.goal_type)
    ).length;

    score += Math.min(20, activeSavingsGoals * 5); // Up to 20 bonus points

    return Math.min(100, score);
  }

  // Calculate debt score (higher is better - less debt relative to income)
  static calculateDebtScore(transactions) {
    if (!transactions || transactions.length === 0) return 100; // No data = assume no debt

    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const recentTransactions = transactions.filter(
      t => new Date(t.transaction_date) >= lastYear
    );

    const totalIncome = recentTransactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Consider EMI payments and credit card payments as debt servicing
    const debtPayments = recentTransactions
      .filter(t => 
        t.category && (
          t.category.toLowerCase().includes('emi') ||
          t.category.toLowerCase().includes('loan') ||
          t.category.toLowerCase().includes('credit card')
        )
      )
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    if (totalIncome === 0) return 50; // Neutral score if no income data

    const debtToIncomeRatio = (debtPayments / totalIncome) * 100;

    // Score based on debt-to-income ratio
    if (debtToIncomeRatio === 0) return 100;
    if (debtToIncomeRatio <= 10) return 90;
    if (debtToIncomeRatio <= 20) return 75;
    if (debtToIncomeRatio <= 30) return 60;
    if (debtToIncomeRatio <= 40) return 40;
    return 20;
  }

  // Calculate insurance score based on insurance payments
  static calculateInsuranceScore(transactions) {
    if (!transactions || transactions.length === 0) return 0;

    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const insurancePayments = transactions
      .filter(t => 
        new Date(t.transaction_date) >= lastYear &&
        t.category && 
        t.category.toLowerCase().includes('insurance')
      )
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalIncome = transactions
      .filter(t => 
        new Date(t.transaction_date) >= lastYear &&
        t.transaction_type === 'income'
      )
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    if (totalIncome === 0) return 0;

    const insuranceToIncomeRatio = (insurancePayments / totalIncome) * 100;

    // Score based on insurance spending (ideal 2-5% of income)
    if (insuranceToIncomeRatio >= 2 && insuranceToIncomeRatio <= 5) return 100;
    if (insuranceToIncomeRatio >= 1 && insuranceToIncomeRatio < 2) return 70;
    if (insuranceToIncomeRatio > 5 && insuranceToIncomeRatio <= 8) return 80;
    if (insuranceToIncomeRatio > 0 && insuranceToIncomeRatio < 1) return 50;
    if (insuranceToIncomeRatio > 8) return 60;
    return 0; // No insurance = 0 score
  }

  // Calculate emergency fund score
  static calculateEmergencyFundScore(goals, transactions) {
    const emergencyFundGoal = goals.find(g => g.goal_type === 'emergency_fund');
    
    if (!emergencyFundGoal) return 0; // No emergency fund goal = 0 score

    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const monthlyExpenses = transactions
      .filter(t => 
        new Date(t.transaction_date) >= lastYear &&
        t.transaction_type === 'expense'
      )
      .reduce((sum, t) => sum + parseFloat(t.amount), 0) / 12;

    const idealEmergencyFund = monthlyExpenses * 6; // 6 months of expenses
    const currentAmount = parseFloat(emergencyFundGoal.current_amount);

    if (idealEmergencyFund === 0) return 50; // Neutral if no expense data

    const ratio = currentAmount / idealEmergencyFund;

    if (ratio >= 1) return 100; // 6+ months covered
    if (ratio >= 0.75) return 85; // 4.5+ months covered
    if (ratio >= 0.5) return 70; // 3+ months covered
    if (ratio >= 0.25) return 50; // 1.5+ months covered
    if (ratio > 0) return 25; // Some emergency fund
    return 0; // No emergency fund
  }

  // Calculate investment score
  static calculateInvestmentScore(transactions) {
    if (!transactions || transactions.length === 0) return 0;

    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const recentTransactions = transactions.filter(
      t => new Date(t.transaction_date) >= lastYear
    );

    const totalIncome = recentTransactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const investmentAmount = recentTransactions
      .filter(t => t.transaction_type === 'investment')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    if (totalIncome === 0) return 0;

    const investmentRate = (investmentAmount / totalIncome) * 100;

    // Score based on investment rate
    if (investmentRate >= 15) return 100;
    if (investmentRate >= 10) return 80;
    if (investmentRate >= 5) return 60;
    if (investmentRate >= 2) return 40;
    if (investmentRate > 0) return 20;
    return 0;
  }

  // Get score breakdown and recommendations
  static getScoreBreakdown(scoreData) {
    const breakdown = {
      literacy: {
        score: scoreData.literacy_score,
        status: this.getScoreStatus(scoreData.literacy_score),
        recommendation: this.getLiteracyRecommendation(scoreData.literacy_score)
      },
      savings: {
        score: scoreData.savings_score,
        status: this.getScoreStatus(scoreData.savings_score),
        recommendation: this.getSavingsRecommendation(scoreData.savings_score)
      },
      debt: {
        score: scoreData.debt_score,
        status: this.getScoreStatus(scoreData.debt_score),
        recommendation: this.getDebtRecommendation(scoreData.debt_score)
      },
      insurance: {
        score: scoreData.insurance_score,
        status: this.getScoreStatus(scoreData.insurance_score),
        recommendation: this.getInsuranceRecommendation(scoreData.insurance_score)
      },
      emergency_fund: {
        score: scoreData.emergency_fund_score,
        status: this.getScoreStatus(scoreData.emergency_fund_score),
        recommendation: this.getEmergencyFundRecommendation(scoreData.emergency_fund_score)
      },
      investment: {
        score: scoreData.investment_score,
        status: this.getScoreStatus(scoreData.investment_score),
        recommendation: this.getInvestmentRecommendation(scoreData.investment_score)
      }
    };

    return breakdown;
  }

  static getScoreStatus(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'needs_improvement';
  }

  // Recommendation methods
  static getLiteracyRecommendation(score) {
    if (score >= 80) return 'Great job! Keep learning about advanced financial topics.';
    if (score >= 60) return 'Good progress! Focus on completing more advanced modules.';
    if (score >= 40) return 'You\'re on the right track. Try to complete more lessons regularly.';
    return 'Start with basic financial literacy modules to build your foundation.';
  }

  static getSavingsRecommendation(score) {
    if (score >= 80) return 'Excellent savings habits! Consider increasing investments.';
    if (score >= 60) return 'Good savings rate. Try to automate your savings for consistency.';
    if (score >= 40) return 'Increase your savings rate. Aim for at least 10% of income.';
    return 'Start with small amounts. Even 5% savings can make a big difference.';
  }

  static getDebtRecommendation(score) {
    if (score >= 80) return 'Great debt management! Keep maintaining low debt levels.';
    if (score >= 60) return 'Good debt control. Consider debt consolidation if applicable.';
    if (score >= 40) return 'Focus on reducing debt-to-income ratio below 30%.';
    return 'Urgent: Create a debt reduction plan and avoid new debt.';
  }

  static getInsuranceRecommendation(score) {
    if (score >= 80) return 'Well protected! Review coverage annually for adequacy.';
    if (score >= 60) return 'Good coverage. Consider term life and health insurance.';
    if (score >= 40) return 'Increase insurance coverage. Aim for 2-5% of income.';
    return 'Critical: Get basic health and term life insurance immediately.';
  }

  static getEmergencyFundRecommendation(score) {
    if (score >= 80) return 'Excellent emergency preparedness! You\'re well protected.';
    if (score >= 60) return 'Good emergency fund. Try to reach 6 months of expenses.';
    if (score >= 40) return 'Build your emergency fund to at least 3 months of expenses.';
    return 'Start building an emergency fund immediately. Start with ₹10,000.';
  }

  static getInvestmentRecommendation(score) {
    if (score >= 80) return 'Excellent investment habits! Diversify across asset classes.';
    if (score >= 60) return 'Good start! Consider increasing SIP amounts gradually.';
    if (score >= 40) return 'Start systematic investment plans (SIPs) for long-term wealth.';
    return 'Begin with mutual funds SIP after building emergency fund.';
  }

  // Helper methods to fetch data
  static async getUserTransactions(userId) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      return { success: false, error: error.message };
    }
  }

  static async getUserGoals(userId) {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching user goals:', error);
      return { success: false, error: error.message };
    }
  }

  static async getUserProgress(userId) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = FinancialHealthService;