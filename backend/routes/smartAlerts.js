// Smart Alerts API Routes
const express = require('express');
const SmartAlertsService = require('../services/smartAlertsService');
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

// Create a new alert
router.post('/alerts', authenticateUser, async (req, res) => {
  try {
    const result = await SmartAlertsService.createAlert(req.userId, req.body);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Alert created successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in POST /alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get user alerts with optional filters
router.get('/alerts', authenticateUser, async (req, res) => {
  try {
    const options = {
      enabled: req.query.enabled === 'true' ? true : req.query.enabled === 'false' ? false : undefined,
      alertType: req.query.type,
      priority: req.query.priority,
      unreadOnly: req.query.unreadOnly === 'true',
      limit: req.query.limit ? parseInt(req.query.limit) : undefined
    };

    const result = await SmartAlertsService.getUserAlerts(req.userId, options);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        count: result.data.length
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in GET /alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get upcoming alerts (next 7 days)
router.get('/alerts/upcoming', authenticateUser, async (req, res) => {
  try {
    const result = await SmartAlertsService.getUpcomingAlerts(req.userId);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        count: result.data.length
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in GET /alerts/upcoming:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Mark alert as read
router.patch('/alerts/:alertId/read', authenticateUser, async (req, res) => {
  try {
    const result = await SmartAlertsService.markAlertAsRead(req.params.alertId, req.userId);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Alert marked as read',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in PATCH /alerts/:alertId/read:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update alert
router.patch('/alerts/:alertId', authenticateUser, async (req, res) => {
  try {
    const result = await SmartAlertsService.updateAlert(req.params.alertId, req.userId, req.body);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Alert updated successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in PATCH /alerts/:alertId:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Delete alert
router.delete('/alerts/:alertId', authenticateUser, async (req, res) => {
  try {
    const result = await SmartAlertsService.deleteAlert(req.params.alertId, req.userId);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Alert deleted successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in DELETE /alerts/:alertId:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Generate automatic alerts
router.post('/alerts/generate', authenticateUser, async (req, res) => {
  try {
    const result = await SmartAlertsService.generateAutomaticAlerts(req.userId);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Automatic alerts generated successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in POST /alerts/generate:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get user alert settings
router.get('/alerts/settings', authenticateUser, async (req, res) => {
  try {
    const result = await SmartAlertsService.getUserAlertSettings(req.userId);
    
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
    console.error('Error in GET /alerts/settings:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update user alert settings
router.put('/alerts/settings', authenticateUser, async (req, res) => {
  try {
    const result = await SmartAlertsService.updateAlertSettings(req.userId, req.body);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Alert settings updated successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in PUT /alerts/settings:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;