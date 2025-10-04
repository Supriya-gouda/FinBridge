// Financial Health Score API Routes
const express = require('express');
const FinancialHealthService = require('../services/financialHealthService');
const router = express.Router();

// Middleware to authenticate user (simplified for demo)
const authenticateUser = (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.query.userId;
  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }
  req.userId = userId;
  next();
};

// Get latest financial health score
router.get('/health-score', authenticateUser, async (req, res) => {
  try {
    const result = await FinancialHealthService.getLatestScore(req.userId);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in GET /health-score:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Calculate and store new financial health score
router.post('/health-score/calculate', authenticateUser, async (req, res) => {
  try {
    const result = await FinancialHealthService.calculateFinancialHealthScore(req.userId);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Financial health score calculated successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in POST /health-score/calculate:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get score history for trend analysis
router.get('/health-score/history', authenticateUser, async (req, res) => {
  try {
    const months = req.query.months ? parseInt(req.query.months) : 6;
    const result = await FinancialHealthService.getScoreHistory(req.userId, months);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        period: `${months} months`,
        count: result.data.length
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in GET /health-score/history:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get detailed score breakdown with recommendations
router.get('/health-score/breakdown', authenticateUser, async (req, res) => {
  try {
    const scoreResult = await FinancialHealthService.getLatestScore(req.userId);
    
    if (scoreResult.success) {
      const breakdown = FinancialHealthService.getScoreBreakdown(scoreResult.data);
      
      res.json({
        success: true,
        data: {
          overall_score: scoreResult.data.overall_score,
          calculated_at: scoreResult.data.calculated_at,
          breakdown: breakdown
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: scoreResult.error
      });
    }
  } catch (error) {
    console.error('Error in GET /health-score/breakdown:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get resilience insights and recommendations
router.get('/resilience/insights', authenticateUser, async (req, res) => {
  try {
    const scoreResult = await FinancialHealthService.getLatestScore(req.userId);
    
    if (!scoreResult.success) {
      return res.status(400).json({
        success: false,
        error: scoreResult.error
      });
    }

    const score = scoreResult.data;
    const insights = {
      overall_resilience: {
        score: score.overall_score,
        level: score.overall_score >= 80 ? 'High' : 
               score.overall_score >= 60 ? 'Medium' : 'Low',
        description: getResilienceDescription(score.overall_score)
      },
      strengths: getStrengths(score),
      improvement_areas: getImprovementAreas(score),
      next_actions: getNextActions(score),
      risk_assessment: getRiskAssessment(score)
    };

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error in GET /resilience/insights:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Helper functions for insights
function getResilienceDescription(score) {
  if (score >= 80) {
    return 'Excellent financial resilience! You\'re well-prepared for financial challenges and opportunities.';
  } else if (score >= 60) {
    return 'Good financial resilience. You have a solid foundation with room for improvement.';
  } else if (score >= 40) {
    return 'Moderate financial resilience. Focus on building stronger financial habits.';
  } else {
    return 'Low financial resilience. Immediate action needed to improve your financial security.';
  }
}

function getStrengths(score) {
  const strengths = [];
  
  if (score.literacy_score >= 70) strengths.push('Strong financial knowledge');
  if (score.savings_score >= 70) strengths.push('Good savings habits');
  if (score.debt_score >= 70) strengths.push('Well-managed debt levels');
  if (score.insurance_score >= 70) strengths.push('Adequate insurance coverage');
  if (score.emergency_fund_score >= 70) strengths.push('Solid emergency preparedness');
  if (score.investment_score >= 70) strengths.push('Active investment portfolio');

  return strengths.length > 0 ? strengths : ['Building financial foundation'];
}

function getImprovementAreas(score) {
  const areas = [];
  
  if (score.literacy_score < 60) areas.push('Financial education');
  if (score.savings_score < 60) areas.push('Savings rate');
  if (score.debt_score < 60) areas.push('Debt management');
  if (score.insurance_score < 60) areas.push('Insurance coverage');
  if (score.emergency_fund_score < 60) areas.push('Emergency fund');
  if (score.investment_score < 60) areas.push('Investment strategy');

  return areas;
}

function getNextActions(score) {
  const actions = [];
  
  // Prioritize based on lowest scores
  const scores = [
    { area: 'emergency_fund', score: score.emergency_fund_score, action: 'Build emergency fund to 6 months expenses' },
    { area: 'debt', score: score.debt_score, action: 'Create debt reduction plan' },
    { area: 'insurance', score: score.insurance_score, action: 'Review and increase insurance coverage' },
    { area: 'savings', score: score.savings_score, action: 'Increase monthly savings rate' },
    { area: 'investment', score: score.investment_score, action: 'Start systematic investment plan' },
    { area: 'literacy', score: score.literacy_score, action: 'Complete financial education modules' }
  ];

  // Get top 3 lowest scoring areas
  scores.sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .forEach(item => actions.push(item.action));

  return actions;
}

function getRiskAssessment(score) {
  const risks = [];
  
  if (score.emergency_fund_score < 40) risks.push('High vulnerability to financial emergencies');
  if (score.debt_score < 40) risks.push('Excessive debt burden');
  if (score.insurance_score < 30) risks.push('Inadequate protection against risks');
  if (score.savings_score < 30) risks.push('Insufficient savings for future goals');

  return {
    level: risks.length >= 3 ? 'High' : risks.length >= 1 ? 'Medium' : 'Low',
    factors: risks
  };
}

module.exports = router;