import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Bell, TrendingUp, CreditCard, Calendar, AlertTriangle, Settings, DollarSign } from "lucide-react";
import { toast } from "sonner";
import alertsService from "@/modules/alerts/alertsService";

interface Alert {
  id: string;
  type: "bill" | "investment" | "goal" | "market" | "emi";
  title: string;
  description: string;
  amount?: number;
  dueDate?: string;
  priority: "high" | "medium" | "low";
  enabled: boolean;
  frequency: "daily" | "weekly" | "monthly";
}

interface AlertSettings {
  billReminders: boolean;
  investmentOpportunities: boolean;
  goalProgress: boolean;
  marketUpdates: boolean;
  emiReminders: boolean;
  budgetAlerts: boolean;
  emergencyFundLow: boolean;
  spendingSpikes: boolean;
}

const SmartAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "bill",
      title: "Credit Card Bill Due",
      description: "Your HDFC credit card bill of ₹12,500 is due in 3 days",
      amount: 12500,
      dueDate: "2025-10-06",
      priority: "high",
      enabled: true,
      frequency: "monthly"
    },
    {
      id: "2",
      type: "investment",
      title: "SIP Due Tomorrow",
      description: "Your monthly SIP of ₹5,000 will be debited tomorrow",
      amount: 5000,
      dueDate: "2025-10-04",
      priority: "medium",
      enabled: true,
      frequency: "monthly"
    },
    {
      id: "3",
      type: "market",
      title: "Gold Price Alert",
      description: "Gold prices have dropped by 2% - Good time to buy",
      priority: "low",
      enabled: true,
      frequency: "daily"
    },
    {
      id: "4",
      type: "goal",
      title: "Emergency Fund Goal",
      description: "You're 80% towards your emergency fund goal. Add ₹10,000 more!",
      amount: 10000,
      priority: "medium",
      enabled: true,
      frequency: "weekly"
    },
    {
      id: "5",
      type: "emi",
      title: "Home Loan EMI Due",
      description: "Your home loan EMI of ₹35,000 is due on 5th October",
      amount: 35000,
      dueDate: "2025-10-05",
      priority: "high",
      enabled: true,
      frequency: "monthly"
    }
  ]);

  const [settings, setSettings] = useState<AlertSettings>({
    billReminders: true,
    investmentOpportunities: true,
    goalProgress: true,
    marketUpdates: true,
    emiReminders: true,
    budgetAlerts: true,
    emergencyFundLow: true,
    spendingSpikes: false
  });

  // Load user alerts from DB if signed in
  useEffect(() => {
    const load = async () => {
      try {
        // supabase is available globally via integrations
        const { data, error } = await (await import('@/integrations/supabase/client')).supabase.auth.getUser();
        if (error) return;
        const userId = data?.user?.id;
        if (!userId) return;
        const dbAlerts = await alertsService.getUserAlerts(userId);
        if (dbAlerts && dbAlerts.length) {
          // helpers to coerce DB values into our Alert types
          const isValidFrequency = (f: unknown): f is Alert['frequency'] => typeof f === 'string' && (f === 'daily' || f === 'weekly' || f === 'monthly');
          const isValidType = (t: unknown): t is Alert['type'] => typeof t === 'string' && ['bill','investment','goal','market','emi'].includes(t);
          const isValidPriority = (p: unknown): p is Alert['priority'] => typeof p === 'string' && ['high','medium','low'].includes(p);

          const mapped: Alert[] = dbAlerts.map(a => {
            const freq = isValidFrequency(a.frequency) ? a.frequency : 'monthly';
            const type = isValidType(a.type) ? a.type : 'investment';
            const priority = isValidPriority(a.priority) ? a.priority : 'low';
            return {
              id: String(a.id),
              type,
              title: a.title ?? 'Alert',
              description: a.description ?? '',
              amount: a.amount ? Number(a.amount) : undefined,
              dueDate: a.due_date ?? undefined,
              priority,
              enabled: a.enabled ?? true,
              frequency: freq
            };
          });
          setAlerts(prev => [...mapped, ...prev]);
        }
      } catch (e) {
        console.warn('Failed to load DB alerts', e);
      }
    };
    load();
  }, []);

  const [budgetLimit, setBudgetLimit] = useState(25000);
  const [emergencyFundTarget, setEmergencyFundTarget] = useState(100000);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bill": return <CreditCard className="w-5 h-5" />;
      case "investment": return <TrendingUp className="w-5 h-5" />;
      case "goal": return <Calendar className="w-5 h-5" />;
      case "market": return <DollarSign className="w-5 h-5" />;
      case "emi": return <AlertTriangle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bill": return "bg-red-100 text-red-600";
      case "investment": return "bg-green-100 text-green-600";
      case "goal": return "bg-blue-100 text-blue-600";
      case "market": return "bg-yellow-100 text-yellow-600";
      case "emi": return "bg-orange-100 text-orange-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const toggleAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
    ));
    toast.success("Alert settings updated");
  };

  const updateSettings = (key: keyof AlertSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success("Settings updated");
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast.success("Alert dismissed");
  };

  const activeAlerts = alerts.filter(alert => alert.enabled);
  const highPriorityCount = activeAlerts.filter(alert => alert.priority === "high").length;

  // Simulate predictive nudges
  const predictiveNudges = [
    {
      title: "Budget Alert",
      description: "You've spent 85% of your monthly budget. Consider reducing discretionary expenses.",
      action: "View Budget"
    },
    {
      title: "Investment Opportunity",
      description: "Based on your risk profile, consider adding Large Cap funds to your portfolio.",
      action: "Explore Funds"
    },
    {
      title: "Spending Pattern",
      description: "Your dining out expenses increased by 40% this month compared to last month.",
      action: "View Expenses"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Smart Alerts</h1>
            {highPriorityCount > 0 && (
              <Badge variant="destructive">{highPriorityCount} urgent</Badge>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overview */}
        <Card className="p-6 mb-8 gradient-hero relative overflow-hidden shadow-glow">
          <div className="absolute inset-0 bg-dots-pattern opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-primary-foreground">Active Alerts</h2>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-foreground">{activeAlerts.length}</div>
                <div className="text-sm text-primary-foreground/90">Total Active</div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/90">
              Stay on top of your finances with personalized alerts and predictive nudges
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Alerts */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Recent Alerts</h3>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className={`p-4 ${!alert.enabled ? 'opacity-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(alert.type)}`}>
                        {getTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge variant={getPriorityColor(alert.priority)}>
                            {alert.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {alert.amount && <span>Amount: ₹{alert.amount.toLocaleString()}</span>}
                          {alert.dueDate && <span>Due: {new Date(alert.dueDate).toLocaleDateString()}</span>}
                          <span>Frequency: {alert.frequency}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={alert.enabled}
                        onCheckedChange={() => toggleAlert(alert.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Settings & Predictive Nudges */}
          <div className="space-y-6">
            {/* Alert Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Alert Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bill-reminders">Bill Reminders</Label>
                  <Switch
                    id="bill-reminders"
                    checked={settings.billReminders}
                    onCheckedChange={(value) => updateSettings("billReminders", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="investment-alerts">Investment Opportunities</Label>
                  <Switch
                    id="investment-alerts"
                    checked={settings.investmentOpportunities}
                    onCheckedChange={(value) => updateSettings("investmentOpportunities", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="goal-progress">Goal Progress</Label>
                  <Switch
                    id="goal-progress"
                    checked={settings.goalProgress}
                    onCheckedChange={(value) => updateSettings("goalProgress", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="market-updates">Market Updates</Label>
                  <Switch
                    id="market-updates"
                    checked={settings.marketUpdates}
                    onCheckedChange={(value) => updateSettings("marketUpdates", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="budget-alerts">Budget Alerts</Label>
                  <Switch
                    id="budget-alerts"
                    checked={settings.budgetAlerts}
                    onCheckedChange={(value) => updateSettings("budgetAlerts", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="spending-spikes">Spending Spikes</Label>
                  <Switch
                    id="spending-spikes"
                    checked={settings.spendingSpikes}
                    onCheckedChange={(value) => updateSettings("spendingSpikes", value)}
                  />
                </div>
              </div>
            </Card>

            {/* Budget Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Budget Thresholds</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget-limit">Monthly Budget Limit</Label>
                  <Input
                    id="budget-limit"
                    type="number"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(Number(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Alert when spending exceeds 80% of this amount
                  </p>
                </div>
                <div>
                  <Label htmlFor="emergency-target">Emergency Fund Target</Label>
                  <Input
                    id="emergency-target"
                    type="number"
                    value={emergencyFundTarget}
                    onChange={(e) => setEmergencyFundTarget(Number(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Alert when fund falls below 50% of target
                  </p>
                </div>
              </div>
            </Card>

            {/* Predictive Nudges */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">AI Insights</h3>
              <div className="space-y-3">
                {predictiveNudges.map((nudge, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">{nudge.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{nudge.description}</p>
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      {nudge.action}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Commitment Automation */}
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-bold mb-4">Commitment Automation</h3>
          <p className="text-muted-foreground mb-6">
            Automate your financial commitments to build discipline and achieve your goals consistently.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="font-semibold mb-2">Auto-Save Round-ups</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Automatically round up purchases and save the spare change
              </p>
              <Switch defaultChecked />
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <h4 className="font-semibold mb-2">Scheduled SIPs</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Automatic monthly investments on your chosen date
              </p>
              <Switch defaultChecked />
            </Card>
            <Card className="p-4 bg-orange-50 border-orange-200">
              <h4 className="font-semibold mb-2">Bill Auto-Pay</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Never miss a payment with automatic bill scheduling
              </p>
              <Switch />
            </Card>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default SmartAlerts;