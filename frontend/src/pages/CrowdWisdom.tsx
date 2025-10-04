import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, TrendingUp, BarChart3, Award, Target } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

const LOCAL_AUTH_KEY = "finbridge_user";

interface LocalUser {
  id: string;
  email: string;
  created_at: string;
}

interface MetricComparison {
  userValue: number;
  averageValue: number;
  percentileRank: number;
  totalUsers: number;
  metric: string;
}

const FINANCIAL_METRICS = [
  {
    id: "savings_rate",
    name: "Savings Rate (%)",
    description: "Percentage of income saved monthly",
    icon: Target,
    unit: "%"
  },
  {
    id: "debt_ratio",
    name: "Debt-to-Income Ratio (%)", 
    description: "Total debt as percentage of monthly income",
    icon: BarChart3,
    unit: "%"
  },
  {
    id: "emergency_fund_months",
    name: "Emergency Fund (Months)",
    description: "Months of expenses covered by emergency fund",
    icon: Award,
    unit: "months"
  },
  {
    id: "investment_percentage",
    name: "Investment Allocation (%)",
    description: "Percentage of income allocated to investments",
    icon: TrendingUp,
    unit: "%"
  }
];

const CrowdWisdom = () => {
  const [user, setUser] = useState<User | LocalUser | null>(null);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [metricValue, setMetricValue] = useState("");
  const [comparison, setComparison] = useState<MetricComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for Supabase session first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        return;
      }
      
      // Check for local auth fallback
      const localUser = localStorage.getItem(LOCAL_AUTH_KEY);
      if (localUser) {
        try {
          const parsedUser = JSON.parse(localUser);
          setUser(parsedUser);
          return;
        } catch (error) {
          console.error("Error parsing local user:", error);
          localStorage.removeItem(LOCAL_AUTH_KEY);
        }
      }
      
      // No authentication found
      navigate("/auth");
    };

    initializeAuth();
  }, [navigate]);

  const handleSubmitMetric = async () => {
    if (!selectedMetric || !metricValue || !user) {
      toast.error("Please select a metric and enter a value");
      return;
    }

    const value = parseFloat(metricValue);
    if (isNaN(value) || value < 0) {
      toast.error("Please enter a valid positive number");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit metric to backend
      const response = await fetch('http://localhost:4000/api/crowd/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          metric: selectedMetric,
          value: value
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save metric');
      }

      toast.success("Metric saved successfully!");
      
      // Fetch comparison data
      await fetchComparison(selectedMetric);
      
    } catch (error) {
      console.error("Error submitting metric:", error);
      toast.error("Failed to save metric. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchComparison = async (metric: string) => {
    if (!user) return;

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/api/crowd/compare/${user.id}/${metric}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("No comparison data available yet");
          return;
        }
        throw new Error('Failed to fetch comparison');
      }

      const data = await response.json();
      setComparison(data);
      
    } catch (error) {
      console.error("Error fetching comparison:", error);
      toast.error("Failed to load comparison data");
    } finally {
      setIsLoading(false);
    }
  };

  const getPercentileMessage = (percentile: number) => {
    if (percentile >= 90) return "Excellent! You're in the top 10%";
    if (percentile >= 75) return "Great! You're above average";
    if (percentile >= 50) return "Good! You're doing better than half of users";
    if (percentile >= 25) return "Room for improvement, but you're on track";
    return "Consider focusing on this area for improvement";
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 75) return "text-green-600";
    if (percentile >= 50) return "text-blue-600";
    if (percentile >= 25) return "text-yellow-600";
    return "text-red-600";
  };

  const selectedMetricInfo = FINANCIAL_METRICS.find(m => m.id === selectedMetric);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crowd Wisdom Tracker</h1>
              <p className="text-gray-600">Compare your financial habits with the community</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Input Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Share Your Metrics
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="metric-select">Select Financial Metric</Label>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a metric to benchmark" />
                  </SelectTrigger>
                  <SelectContent>
                    {FINANCIAL_METRICS.map((metric) => (
                      <SelectItem key={metric.id} value={metric.id}>
                        <div className="flex items-center gap-2">
                          <metric.icon className="w-4 h-4" />
                          {metric.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedMetricInfo && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedMetricInfo.description}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="metric-value">
                  Your Value {selectedMetricInfo && `(${selectedMetricInfo.unit})`}
                </Label>
                <Input
                  id="metric-value"
                  type="number"
                  placeholder="Enter your value"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>

              <Button 
                onClick={handleSubmitMetric}
                disabled={!selectedMetric || !metricValue || isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSubmitting ? "Saving..." : "Compare with Community"}
              </Button>
            </div>
          </Card>

          {/* Comparison Results */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Your Community Standing
            </h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading comparison...</p>
              </div>
            ) : comparison ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Your Value</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {comparison.userValue}{selectedMetricInfo?.unit}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Community Average</p>
                    <p className="text-2xl font-bold text-gray-700">
                      {comparison.averageValue}{selectedMetricInfo?.unit}
                    </p>
                  </div>
                </div>

                {/* Percentile Rank */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Percentile Rank</span>
                    <Badge variant="secondary" className={getPercentileColor(comparison.percentileRank)}>
                      {comparison.percentileRank}th percentile
                    </Badge>
                  </div>
                  
                  <Progress value={comparison.percentileRank} className="h-3" />
                  
                  <p className={`text-sm ${getPercentileColor(comparison.percentileRank)}`}>
                    {getPercentileMessage(comparison.percentileRank)}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    Compared with {comparison.totalUsers} community members
                  </p>
                </div>

                {/* Performance Indicator */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Community Impact</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {comparison.percentileRank >= 50 
                      ? `You're performing better than ${comparison.percentileRank}% of the community!`
                      : `You have room to improve - ${100 - comparison.percentileRank}% of users are ahead of you.`
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a metric and enter your value to see how you compare with the community</p>
              </div>
            )}
          </Card>
        </div>

        {/* Available Metrics Info */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Available Metrics</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {FINANCIAL_METRICS.map((metric) => (
              <div key={metric.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <metric.icon className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">{metric.name}</h4>
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CrowdWisdom;