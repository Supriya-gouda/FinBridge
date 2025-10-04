// Smart Alerts Service for Frontend
const API_BASE_URL = 'http://localhost:4000/api';

// Type definitions
interface AlertOptions {
  enabled?: boolean;
  type?: string;
  priority?: string;
  unreadOnly?: boolean;
  limit?: number;
}

interface AlertData {
  type: string;
  title: string;
  description: string;
  amount?: number;
  dueDate?: string;
  priority?: string;
  enabled?: boolean;
  frequency?: string;
}

interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
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

export class SmartAlertsAPI {
  static async createAlert(alertData: AlertData): Promise<APIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': getDemoUserId()
        },
        body: JSON.stringify(alertData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating alert:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async getUserAlerts(options: AlertOptions = {}): Promise<APIResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('userId', getDemoUserId());
      
      if (options.enabled !== undefined) queryParams.append('enabled', String(options.enabled));
      if (options.type) queryParams.append('type', options.type);
      if (options.priority) queryParams.append('priority', options.priority);
      if (options.unreadOnly) queryParams.append('unreadOnly', 'true');
      if (options.limit) queryParams.append('limit', String(options.limit));

      const response = await fetch(`${API_BASE_URL}/alerts?${queryParams}`, {
        headers: {
          'X-User-ID': getDemoUserId()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async getUpcomingAlerts(): Promise<APIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/upcoming`, {
        headers: {
          'X-User-ID': getDemoUserId()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching upcoming alerts:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async markAlertAsRead(alertId: string): Promise<APIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/read`, {
        method: 'PATCH',
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
      console.error('Error marking alert as read:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async updateAlert(alertId: string, updates: Partial<AlertData>): Promise<APIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': getDemoUserId()
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating alert:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async deleteAlert(alertId: string): Promise<APIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${alertId}`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': getDemoUserId()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting alert:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async generateAutomaticAlerts(): Promise<APIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/generate`, {
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
      console.error('Error generating automatic alerts:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async getAlertSettings(): Promise<APIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/settings`, {
        headers: {
          'X-User-ID': getDemoUserId()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching alert settings:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async updateAlertSettings(settings: Record<string, unknown>): Promise<APIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': getDemoUserId()
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating alert settings:', error);
      return { success: false, error: (error as Error).message };
    }
  }
}