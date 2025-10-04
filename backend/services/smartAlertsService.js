// Smart Alerts Service Layer
const { supabase } = require('../models/database');

class SmartAlertsService {
  // Create a new alert
  static async createAlert(userId, alertData) {
    try {
      const { data, error } = await supabase
        .from('smart_alerts')
        .insert([{
          user_id: userId,
          alert_type: alertData.type,
          title: alertData.title,
          description: alertData.description,
          amount: alertData.amount || null,
          due_date: alertData.dueDate || null,
          priority: alertData.priority || 'medium',
          enabled: alertData.enabled !== undefined ? alertData.enabled : true,
          frequency: alertData.frequency || 'monthly'
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating alert:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all alerts for a user
  static async getUserAlerts(userId, options = {}) {
    try {
      let query = supabase
        .from('smart_alerts')
        .select('*')
        .eq('user_id', userId);

      // Add filters
      if (options.enabled !== undefined) {
        query = query.eq('enabled', options.enabled);
      }
      if (options.alertType) {
        query = query.eq('alert_type', options.alertType);
      }
      if (options.priority) {
        query = query.eq('priority', options.priority);
      }
      if (options.unreadOnly) {
        query = query.eq('is_read', false);
      }

      // Add ordering
      query = query.order('created_at', { ascending: false });

      // Add limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching user alerts:', error);
      return { success: false, error: error.message };
    }
  }

  // Mark alert as read
  static async markAlertAsRead(alertId, userId) {
    try {
      const { data, error } = await supabase
        .from('smart_alerts')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', alertId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error marking alert as read:', error);
      return { success: false, error: error.message };
    }
  }

  // Update alert
  static async updateAlert(alertId, userId, updates) {
    try {
      const { data, error } = await supabase
        .from('smart_alerts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', alertId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating alert:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete alert
  static async deleteAlert(alertId, userId) {
    try {
      const { data, error } = await supabase
        .from('smart_alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error deleting alert:', error);
      return { success: false, error: error.message };
    }
  }

  // Get upcoming alerts (next 7 days)
  static async getUpcomingAlerts(userId) {
    try {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const { data, error } = await supabase
        .from('smart_alerts')
        .select('*')
        .eq('user_id', userId)
        .eq('enabled', true)
        .not('due_date', 'is', null)
        .lte('due_date', nextWeek.toISOString().split('T')[0])
        .gte('due_date', new Date().toISOString().split('T')[0])
        .order('due_date', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching upcoming alerts:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate automatic alerts based on user data
  static async generateAutomaticAlerts(userId) {
    try {
      // Get user's transactions, goals, and settings
      const [transactionsResult, goalsResult, settingsResult] = await Promise.all([
        this.getUserTransactions(userId),
        this.getUserGoals(userId),
        this.getUserAlertSettings(userId)
      ]);

      if (!transactionsResult.success || !goalsResult.success || !settingsResult.success) {
        throw new Error('Failed to fetch user data for automatic alerts');
      }

      const transactions = transactionsResult.data;
      const goals = goalsResult.data;
      const settings = settingsResult.data;

      const alertsToCreate = [];

      // Generate budget alerts
      if (settings.budget_alerts) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyExpenses = transactions
          .filter(t => {
            const tDate = new Date(t.transaction_date);
            return t.transaction_type === 'expense' && 
                   tDate.getMonth() === currentMonth && 
                   tDate.getFullYear() === currentYear;
          })
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        if (monthlyExpenses > (settings.budget_limit * 0.8)) {
          alertsToCreate.push({
            type: 'budget',
            title: 'Budget Alert',
            description: `You've spent ₹${monthlyExpenses.toLocaleString()} (${Math.round(monthlyExpenses/settings.budget_limit*100)}%) of your monthly budget`,
            priority: monthlyExpenses > settings.budget_limit ? 'high' : 'medium',
            enabled: true,
            frequency: 'monthly'
          });
        }
      }

      // Generate goal progress alerts
      if (settings.goal_progress) {
        goals.forEach(goal => {
          const progress = (goal.current_amount / goal.target_amount) * 100;
          const daysToTarget = goal.target_date ? 
            Math.ceil((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;

          if (progress >= 80 && progress < 100) {
            alertsToCreate.push({
              type: 'goal',
              title: `${goal.goal_name} - Almost There!`,
              description: `You're ${Math.round(progress)}% towards your ${goal.goal_name} goal. Just ₹${(goal.target_amount - goal.current_amount).toLocaleString()} more to go!`,
              amount: goal.target_amount - goal.current_amount,
              priority: 'medium',
              enabled: true,
              frequency: 'weekly'
            });
          }

          if (daysToTarget && daysToTarget <= 30 && progress < 50) {
            alertsToCreate.push({
              type: 'goal',
              title: `${goal.goal_name} - Time Running Out`,
              description: `Only ${daysToTarget} days left to reach your ${goal.goal_name} goal. Consider increasing your contributions.`,
              priority: 'high',
              enabled: true,
              frequency: 'weekly'
            });
          }
        });
      }

      // Generate emergency fund alerts
      if (settings.emergency_fund_low) {
        const emergencyFundGoal = goals.find(g => g.goal_type === 'emergency_fund');
        if (emergencyFundGoal && emergencyFundGoal.current_amount < (settings.emergency_fund_target * 0.5)) {
          alertsToCreate.push({
            type: 'emergency',
            title: 'Emergency Fund Low',
            description: `Your emergency fund is below 50% of your target. Consider boosting your savings.`,
            amount: settings.emergency_fund_target - emergencyFundGoal.current_amount,
            priority: 'high',
            enabled: true,
            frequency: 'monthly'
          });
        }
      }

      // Create all generated alerts
      const results = [];
      for (const alertData of alertsToCreate) {
        const result = await this.createAlert(userId, alertData);
        results.push(result);
      }

      return { success: true, data: results };
    } catch (error) {
      console.error('Error generating automatic alerts:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper methods to fetch related data
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

  static async getUserAlertSettings(userId) {
    try {
      const { data, error } = await supabase
        .from('alert_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching user alert settings:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user alert settings
  static async updateAlertSettings(userId, settings) {
    try {
      const { data, error } = await supabase
        .from('alert_settings')
        .upsert({
          user_id: userId,
          ...settings,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating alert settings:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = SmartAlertsService;