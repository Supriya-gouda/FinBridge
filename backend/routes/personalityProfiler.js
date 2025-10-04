const express = require('express');
const router = express.Router();
const PersonalityProfilerService = require('../services/personalityProfilerService');

/**
 * POST /api/personality-profiler/assessment
 * Create or update user personality profile based on assessment
 */
router.post('/personality-profiler/assessment', async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const user_id = userId;

    if (!user_id || !answers) {
      return res.status(400).json({
        success: false,
        error: 'user_id and answers are required'
      });
    }

    // Validate answers structure
    const requiredAnswers = [
      'salary_approach',
      'risk_tolerance', 
      'planning_approach',
      'purchase_decision',
      'emergency_fund',
      'investment_knowledge'
    ];

    const missingAnswers = requiredAnswers.filter(key => !answers[key]);
    if (missingAnswers.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required answers: ${missingAnswers.join(', ')}`
      });
    }

    const result = await PersonalityProfilerService.createOrUpdateUserProfile(user_id, { answers });

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('Error in personality assessment:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/personality-profiler/profile/:userId
 * Get user personality profile
 */
router.get('/personality-profiler/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const result = await PersonalityProfilerService.getUserProfile(userId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('Error fetching personality profile:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/personality-profiler/challenges/:userId
 * Get personalized challenges for user
 */
router.get('/personality-profiler/challenges/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const result = await PersonalityProfilerService.getPersonalizedChallenges(userId);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * PUT /api/personality-profiler/challenges/:challengeId/progress
 * Update challenge progress
 */
router.put('/personality-profiler/challenges/:challengeId/progress', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { progress, user_id } = req.body;

    if (!challengeId || progress === undefined || !user_id) {
      return res.status(400).json({
        success: false,
        error: 'challengeId, progress, and user_id are required'
      });
    }

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        error: 'progress must be a number between 0 and 100'
      });
    }

    const result = await PersonalityProfilerService.updateChallengeProgress(challengeId, progress, user_id);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('Error updating challenge progress:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/personality-profiler/challenges/:userId/generate
 * Generate new personalized challenges
 */
router.post('/personality-profiler/challenges/:userId/generate', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    // Get user's personality type first
    const profileResult = await PersonalityProfilerService.getUserProfile(userId);
    if (!profileResult.success) {
      return res.status(404).json({
        success: false,
        error: 'User personality profile not found. Please complete assessment first.'
      });
    }

    const personalityType = profileResult.data.personality_type;
    const result = await PersonalityProfilerService.generatePersonalizedChallenges(userId, personalityType);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('Error generating challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/personality-profiler/insights/:userId
 * Get behavioral insights for user
 */
router.get('/personality-profiler/insights/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const result = await PersonalityProfilerService.getBehavioralInsights(userId);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('Error fetching behavioral insights:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/personality-profiler/types
 * Get all available personality types and their characteristics
 */
router.get('/personality-profiler/types', (req, res) => {
  try {
    const PersonalityTypes = require('../services/personalityProfilerService');
    
    // This is a workaround to access the PERSONALITY_TYPES constant
    // In a real implementation, you might want to move this to a separate constants file
    const types = {
      'prudent_saver': {
        name: 'The Prudent Saver',
        description: 'You prioritize financial security and long-term stability.',
        traits: ['cautious', 'security-focused', 'long-term-oriented'],
        color: '#10B981'
      },
      'lifestyle_enthusiast': {
        name: 'The Lifestyle Enthusiast',
        description: 'You believe in enjoying life and see money as a tool for experiences.',
        traits: ['experience-focused', 'present-oriented', 'optimistic'],
        color: '#F59E0B'
      },
      'growth_seeker': {
        name: 'The Growth Seeker',
        description: 'You understand money should work for you and actively seek opportunities.',
        traits: ['growth-oriented', 'risk-tolerant', 'research-focused'],
        color: '#3B82F6'
      },
      'balanced_planner': {
        name: 'The Balanced Planner',
        description: 'You take a methodical approach to finances, balancing all aspects.',
        traits: ['methodical', 'balanced', 'goal-oriented'],
        color: '#8B5CF6'
      },
      'risk_averse': {
        name: 'The Safety-First Investor',
        description: 'You prefer guaranteed returns and prioritize capital preservation.',
        traits: ['conservative', 'safety-focused', 'patient'],
        color: '#64748B'
      }
    };

    res.json({
      success: true,
      data: types
    });

  } catch (error) {
    console.error('Error fetching personality types:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/personality-profiler/health
 * Health check for personality profiler service
 */
router.get('/personality-profiler/health', (req, res) => {
  res.json({
    success: true,
    service: 'Personality Profiler',
    status: 'operational',
    features: [
      'Personality Assessment',
      'Behavioral Insights',
      'Personalized Challenges',
      'Progress Tracking',
      'Recommendation Engine'
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;