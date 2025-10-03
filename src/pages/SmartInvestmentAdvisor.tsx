import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, Shield, Target, AlertCircle, CheckCircle, Play, Star } from "lucide-react";
import { toast } from "sonner";

interface InvestmentStep {
  id: string;
  title: string;
  description: string;
  priority: number;
  amount: string;
  timeframe: string;
  riskLevel: "low" | "medium" | "high";
  completed: boolean;
  status: "not-started" | "in-progress" | "completed";
  details: {
    rationale: string;
    expectedReturn: string;
    keyPoints: string[];
    products: InvestmentProduct[];
  };
}

interface InvestmentProduct {
  name: string;
  type: string;
  expectedReturn: string;
  riskLevel: string;
  minInvestment: string;
  description: string;
  rating: number;
}

interface MarketTrend {
  asset: string;
  trend: "up" | "down" | "stable";
  change: string;
  recommendation: "buy" | "sell" | "hold";
  reasoning: string;
}

const SmartInvestmentAdvisor = () => {
  const navigate = useNavigate();
  
  const [investmentSteps, setInvestmentSteps] = useState<InvestmentStep[]>([
    {
      id: "emergency-fund",
      title: "Build Emergency Fund",
      description: "Create a safety net before investing",
      priority: 1,
      amount: "₹1,50,000",
      timeframe: "3-6 months",
      riskLevel: "low",
      completed: false,
      status: "in-progress",
      details: {
        rationale: "An emergency fund is crucial before any investment. It should cover 6 months of expenses and be easily accessible.",
        expectedReturn: "4-6% annually",
        keyPoints: [
          "Keep in liquid savings account or fixed deposit",
          "Should cover 6 months of living expenses",
          "Easily accessible without penalties",
          "Separate from investment funds"
        ],
        products: [
          {
            name: "High-Yield Savings Account",
            type: "Savings",
            expectedReturn: "4-5%",
            riskLevel: "Very Low",
            minInvestment: "₹1,000",
            description: "FDIC insured savings with good interest rates",
            rating: 4
          },
          {
            name: "Liquid Mutual Funds",
            type: "Debt Fund",
            expectedReturn: "5-6%",
            riskLevel: "Low",
            minInvestment: "₹5,000",
            description: "Better returns than savings, instant redemption",
            rating: 4
          }
        ]
      }
    },
    {
      id: "insurance",
      title: "Adequate Insurance Coverage",
      description: "Protect your wealth before growing it",
      priority: 2,
      amount: "₹15,000/year",
      timeframe: "Immediate",
      riskLevel: "low",
      completed: false,
      status: "not-started",
      details: {
        rationale: "Insurance protects your family and investments from unforeseen circumstances. Essential foundation of financial planning.",
        expectedReturn: "Protection value",
        keyPoints: [
          "Term life insurance: 10-15x annual income",
          "Health insurance: ₹10+ lakh family floater",
          "Avoid mixing insurance with investment",
          "Review coverage annually"
        ],
        products: [
          {
            name: "Term Life Insurance",
            type: "Insurance",
            expectedReturn: "Protection",
            riskLevel: "None",
            minInvestment: "₹8,000/year",
            description: "Pure protection, high coverage at low cost",
            rating: 5
          },
          {
            name: "Family Health Insurance",
            type: "Insurance",
            expectedReturn: "Protection",
            riskLevel: "None",
            minInvestment: "₹15,000/year",
            description: "Comprehensive health coverage for family",
            rating: 5
          }
        ]
      }
    },
    {
      id: "debt-funds",
      title: "Conservative Debt Investments",
      description: "Start with low-risk, stable returns",
      priority: 3,
      amount: "₹50,000",
      timeframe: "1-3 years",
      riskLevel: "low",
      completed: false,
      status: "not-started",
      details: {
        rationale: "Debt funds provide better returns than FD with moderate risk. Good for conservative investors and short-term goals.",
        expectedReturn: "7-9% annually",
        keyPoints: [
          "Better than fixed deposits",
          "Tax efficient after 3 years",
          "Lower volatility than equity",
          "Good for short to medium term goals"
        ],
        products: [
          {
            name: "Corporate Bond Funds",
            type: "Debt Fund",
            expectedReturn: "8-9%",
            riskLevel: "Low-Medium",
            minInvestment: "₹5,000",
            description: "Invests in high-grade corporate bonds",
            rating: 4
          },
          {
            name: "Banking & PSU Funds",
            type: "Debt Fund",
            expectedReturn: "7-8%",
            riskLevel: "Low",
            minInvestment: "₹5,000",
            description: "Conservative debt fund with stable returns",
            rating: 4
          }
        ]
      }
    },
    {
      id: "large-cap-equity",
      title: "Large Cap Equity Funds",
      description: "Begin equity journey with stable companies",
      priority: 4,
      amount: "₹10,000/month",
      timeframe: "5+ years",
      riskLevel: "medium",
      completed: false,
      status: "not-started",
      details: {
        rationale: "Large cap funds invest in established companies with lower volatility. Good starting point for equity investments.",
        expectedReturn: "10-12% annually",
        keyPoints: [
          "Invest in top 100 companies by market cap",
          "Lower volatility than mid/small cap",
          "Good for beginners in equity",
          "Ideal for long-term wealth creation"
        ],
        products: [
          {
            name: "HDFC Top 100 Fund",
            type: "Large Cap Fund",
            expectedReturn: "11-13%",
            riskLevel: "Medium",
            minInvestment: "₹5,000",
            description: "Consistent performer in large cap category",
            rating: 4
          },
          {
            name: "ICICI Pru Bluechip Fund",
            type: "Large Cap Fund",
            expectedReturn: "10-12%",
            riskLevel: "Medium",
            minInvestment: "₹5,000",
            description: "Well-diversified large cap fund",
            rating: 4
          }
        ]
      }
    },
    {
      id: "diversified-equity",
      title: "Diversified Equity Portfolio",
      description: "Expand to mid-cap and international funds",
      priority: 5,
      amount: "₹15,000/month",
      timeframe: "7+ years",
      riskLevel: "high",
      completed: false,
      status: "not-started",
      details: {
        rationale: "After building comfort with large caps, diversify across market caps and geographies for higher growth potential.",
        expectedReturn: "12-15% annually",
        keyPoints: [
          "Add mid-cap and small-cap exposure",
          "International diversification",
          "Sector-specific opportunities",
          "Higher risk, higher return potential"
        ],
        products: [
          {
            name: "Mid Cap Growth Funds",
            type: "Mid Cap Fund",
            expectedReturn: "13-16%",
            riskLevel: "High",
            minInvestment: "₹5,000",
            description: "Growth potential of mid-size companies",
            rating: 4
          },
          {
            name: "International Funds",
            type: "International Fund",
            expectedReturn: "10-14%",
            riskLevel: "Medium-High",
            minInvestment: "₹5,000",
            description: "Global diversification opportunities",
            rating: 4
          }
        ]
      }
    },
    {
      id: "advanced-options",
      title: "Advanced Investment Options",
      description: "Explore direct equity, REITs, and alternatives",
      priority: 6,
      amount: "₹25,000/month",
      timeframe: "10+ years",
      riskLevel: "high",
      completed: false,
      status: "not-started",
      details: {
        rationale: "For experienced investors comfortable with higher risk and having substantial portfolio base.",
        expectedReturn: "15-20% annually",
        keyPoints: [
          "Direct stock investments",
          "Real Estate Investment Trusts (REITs)",
          "Gold and commodity exposure",
          "Only after building substantial base"
        ],
        products: [
          {
            name: "Blue Chip Stocks",
            type: "Direct Equity",
            expectedReturn: "15-20%",
            riskLevel: "High",
            minInvestment: "₹10,000",
            description: "Direct investment in quality companies",
            rating: 3
          },
          {
            name: "REITs",
            type: "Real Estate",
            expectedReturn: "12-15%",
            riskLevel: "Medium-High",
            minInvestment: "₹15,000",
            description: "Real estate exposure without direct ownership",
            rating: 4
          }
        ]
      }
    }
  ]);

  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([
    {
      asset: "Large Cap Stocks",
      trend: "up",
      change: "+2.3%",
      recommendation: "buy",
      reasoning: "Strong Q2 earnings and improved market sentiment"
    },
    {
      asset: "Mid Cap Funds",
      trend: "stable",
      change: "+0.8%",
      recommendation: "hold",
      reasoning: "Consolidation phase, wait for better entry points"
    },
    {
      asset: "Gold",
      trend: "down",
      change: "-1.5%",
      recommendation: "buy",
      reasoning: "Good buying opportunity as prices have corrected"
    },
    {
      asset: "Debt Funds",
      trend: "up",
      change: "+0.5%",
      recommendation: "hold",
      reasoning: "Stable returns, good for conservative portfolios"
    }
  ]);

  const completedSteps = investmentSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / investmentSteps.length) * 100;
  const currentStep = investmentSteps.find(step => step.status === "in-progress") || investmentSteps[0];

  const completeStep = (stepId: string) => {
    setInvestmentSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, completed: true, status: "completed" as const }
        : step
    ));
    toast.success("Step completed! Moving to next milestone.");
  };

  const startStep = (stepId: string) => {
    setInvestmentSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: "in-progress" as const }
        : step
    ));
    toast.success("Step started! Check recommended products.");
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "high": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return "📈";
      case "down": return "📉";
      case "stable": return "➡️";
      default: return "📊";
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "buy": return "text-green-600 bg-green-100";
      case "sell": return "text-red-600 bg-red-100";
      case "hold": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

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
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Smart Investment Advisor</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <Card className="p-6 mb-8 gradient-hero relative overflow-hidden shadow-glow">
          <div className="absolute inset-0 bg-dots-pattern opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-primary-foreground">Investment Journey Progress</h2>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-foreground">{completedSteps}/6</div>
                <div className="text-sm text-primary-foreground/90">Steps Completed</div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-2" />
            <p className="text-sm text-primary-foreground/90">
              Follow the stepwise roadmap to build a strong investment portfolio
            </p>
          </div>
        </Card>

        <Tabs defaultValue="roadmap" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roadmap">Investment Roadmap</TabsTrigger>
            <TabsTrigger value="products">Try Before You Buy</TabsTrigger>
            <TabsTrigger value="trends">Market Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap" className="space-y-6">
            {investmentSteps.map((step, index) => (
              <Card key={step.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-100' : step.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : step.status === 'in-progress' ? (
                        <Play className="w-6 h-6 text-blue-600" />
                      ) : (
                        <span className="font-bold text-gray-600">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{step.title}</h3>
                        <Badge variant="outline" className={getRiskColor(step.riskLevel)}>
                          {step.riskLevel} risk
                        </Badge>
                        <Badge variant="outline">Priority {step.priority}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{step.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span><strong>Amount:</strong> {step.amount}</span>
                        <span><strong>Timeframe:</strong> {step.timeframe}</span>
                        <span><strong>Expected Return:</strong> {step.details.expectedReturn}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!step.completed && step.status === 'not-started' && (
                      <Button onClick={() => startStep(step.id)} variant="outline">
                        Start Step
                      </Button>
                    )}
                    {step.status === 'in-progress' && (
                      <Button onClick={() => completeStep(step.id)} className="gradient-success">
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Why This Step?</h4>
                    <p className="text-sm text-muted-foreground">{step.details.rationale}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Key Points</h4>
                    <ul className="space-y-2">
                      {step.details.keyPoints.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Recommended Products</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {step.details.products.map((product, productIndex) => (
                        <Card key={productIndex} className="p-4 bg-card/50">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium">{product.name}</h5>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <Badge variant="outline" className="mb-2">{product.type}</Badge>
                          <p className="text-xs text-muted-foreground mb-3">{product.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Expected Return:</span>
                              <p className="font-medium text-green-600">{product.expectedReturn}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Min Investment:</span>
                              <p className="font-medium">{product.minInvestment}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center">
                <Play className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Try Before You Buy Simulator</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Practice investing in a risk-free environment. Test different investment strategies and see 
                how they would perform over time without using real money.
              </p>
              <Badge variant="secondary" className="mb-4">Coming Soon</Badge>
              <p className="text-sm text-muted-foreground">
                This advanced simulation will let you practice with virtual money before investing real funds.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/financial-simulator")}
              >
                Use Basic Simulator
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-6">Market Trends & Opportunities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketTrends.map((trend, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getTrendIcon(trend.trend)}</span>
                        <div>
                          <h4 className="font-semibold">{trend.asset}</h4>
                          <p className="text-sm text-muted-foreground">Change: {trend.change}</p>
                        </div>
                      </div>
                      <Badge className={getRecommendationColor(trend.recommendation)}>
                        {trend.recommendation.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{trend.reasoning}</p>
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      Learn More
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Personalized Alerts */}
            <Card className="p-6">
              <h4 className="text-lg font-bold mb-4">Personalized Investment Alerts</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <AlertCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">SIP Opportunity</p>
                    <p className="text-sm text-green-600">Markets are down 3% - Great time for your monthly SIP</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Target className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Goal Alert</p>
                    <p className="text-sm text-blue-600">You're 65% towards your emergency fund goal!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <Shield className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800">Portfolio Rebalancing</p>
                    <p className="text-sm text-orange-600">Consider rebalancing - Equity allocation is 75% (target: 70%)</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SmartInvestmentAdvisor;