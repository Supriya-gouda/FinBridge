import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Target, Calendar, Heart, GraduationCap, Home, Car, Plane, Baby, Clock } from "lucide-react";
import { toast } from "sonner";

interface LifeGoal {
  id: string;
  title: string;
  category: "education" | "wedding" | "home" | "car" | "vacation" | "retirement" | "emergency" | "child";
  targetAmount: number;
  currentSavings: number;
  targetDate: string;
  priority: "high" | "medium" | "low";
  monthlyContribution: number;
  inflationRate: number;
  expectedReturn: number;
  status: "on-track" | "behind" | "ahead" | "completed";
}

interface LifeEvent {
  id: string;
  name: string;
  icon: React.ComponentType<Record<string, unknown>>;
  category: string;
  estimatedCost: string;
  timeline: string;
  description: string;
  considerations: string[];
  financialPlanning: {
    savingsRequired: string;
    monthlyContribution: string;
    timeToStart: string;
    tips: string[];
  };
}

const GoalPlanner = () => {
  const navigate = useNavigate();
  
  const [goals, setGoals] = useState<LifeGoal[]>([
    {
      id: "emergency",
      title: "Emergency Fund",
      category: "emergency",
      targetAmount: 300000,
      currentSavings: 120000,
      targetDate: "2024-12-31",
      priority: "high",
      monthlyContribution: 10000,
      inflationRate: 6,
      expectedReturn: 6,
      status: "on-track"
    },
    {
      id: "wedding",
      title: "Dream Wedding",
      category: "wedding",
      targetAmount: 800000,
      currentSavings: 50000,
      targetDate: "2026-11-15",
      priority: "high",
      monthlyContribution: 20000,
      inflationRate: 8,
      expectedReturn: 8,
      status: "behind"
    },
    {
      id: "home",
      title: "Buy First Home",
      category: "home",
      targetAmount: 2500000,
      currentSavings: 200000,
      targetDate: "2029-06-01",
      priority: "medium",
      monthlyContribution: 25000,
      inflationRate: 7,
      expectedReturn: 10,
      status: "on-track"
    }
  ]);

  type NewGoalState = {
    title: string;
    category: string;
    targetAmount: number;
    targetDate: string;
    priority: LifeGoal['priority'];
    currentSavings: number;
  };

  const [newGoal, setNewGoal] = useState<NewGoalState>({
    title: "",
    category: "",
    targetAmount: 100000,
    targetDate: "",
    priority: "medium",
    currentSavings: 0
  });

  const lifeEvents: LifeEvent[] = [
    {
      id: "wedding",
      name: "Wedding Planning",
      icon: Heart,
      category: "Personal Milestone",
      estimatedCost: "₹5-15 lakhs",
      timeline: "12-18 months planning",
      description: "Plan your dream wedding while maintaining financial discipline",
      considerations: [
        "Venue and catering costs (40-50% of budget)",
        "Photography and videography",
        "Clothing and jewelry",
        "Guest accommodation and transportation"
      ],
      financialPlanning: {
        savingsRequired: "₹8-10 lakhs average",
        monthlyContribution: "₹15,000-25,000",
        timeToStart: "2-3 years before wedding",
        tips: [
          "Create separate wedding fund",
          "Consider seasonal pricing variations",
          "Set priorities and stick to budget",
          "Look for package deals"
        ]
      }
    },
    {
      id: "child-planning",
      name: "Child Planning",
      icon: Baby,
      category: "Family Planning",
      estimatedCost: "₹50-80 lakhs (18 years)",
      timeline: "Lifetime commitment",
      description: "Financial planning for raising a child from birth to independence",
      considerations: [
        "Healthcare and delivery costs",
        "Child education expenses",
        "Childcare and support",
        "Life insurance increase needed"
      ],
      financialPlanning: {
        savingsRequired: "₹20-30 lakhs for education",
        monthlyContribution: "₹8,000-15,000 via SIP",
        timeToStart: "Before conception",
        tips: [
          "Start child education fund early",
          "Increase life insurance coverage",
          "Plan for healthcare costs",
          "Consider child-specific investment plans"
        ]
      }
    },
    {
      id: "home-buying",
      name: "Home Purchase",
      icon: Home,
      category: "Real Estate",
      estimatedCost: "₹30-80 lakhs",
      timeline: "6-12 months process",
      description: "Buying your first home is a major financial milestone",
      considerations: [
        "Down payment (20-25% of property value)",
        "Home loan eligibility and EMI",
        "Registration and legal costs",
        "Interior and moving expenses"
      ],
      financialPlanning: {
        savingsRequired: "₹8-20 lakhs for down payment",
        monthlyContribution: "₹20,000-40,000",
        timeToStart: "3-5 years before purchase",
        tips: [
          "Build credit score above 750",
          "Save for 25% down payment",
          "Factor EMI in monthly budget",
          "Keep emergency fund separate"
        ]
      }
    },
    {
      id: "retirement",
      name: "Retirement Planning",
      icon: Clock,
      category: "Long-term Security",
      estimatedCost: "₹2-5 crores",
      timeline: "20-40 years planning",
      description: "Ensure financial independence post-retirement",
      considerations: [
        "Inflation impact over decades",
        "Healthcare costs in old age",
        "Lifestyle maintenance",
        "Dependency reduction"
      ],
      financialPlanning: {
        savingsRequired: "15-20% of annual income",
        monthlyContribution: "₹15,000-50,000",
        timeToStart: "In your 20s",
        tips: [
          "Start early to leverage compounding",
          "Diversify across asset classes",
          "Increase contribution with salary hikes",
          "Consider EPF, NPS, and PPF"
        ]
      }
    },
    {
      id: "higher-education",
      name: "Higher Education",
      icon: GraduationCap,
      category: "Education",
      estimatedCost: "₹10-50 lakhs",
      timeline: "4-6 years duration",
      description: "Funding higher education for self or children",
      considerations: [
        "Course fees and living expenses",
        "International vs domestic costs",
        "Education loan options",
        "Opportunity cost analysis"
      ],
      financialPlanning: {
        savingsRequired: "₹15-25 lakhs average",
        monthlyContribution: "₹10,000-20,000",
        timeToStart: "5-10 years before",
        tips: [
          "Research education loan options",
          "Consider international study costs",
          "Start dedicated education fund",
          "Factor in currency fluctuations for abroad"
        ]
      }
    }
  ];

  const calculateGoalProgress = (goal: LifeGoal) => {
    const progress = (goal.currentSavings / goal.targetAmount) * 100;
    const monthsRemaining = Math.ceil(
      (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    const requiredMonthly = Math.ceil(
      (goal.targetAmount - goal.currentSavings) / Math.max(monthsRemaining, 1)
    );

    return {
      progress: Math.min(progress, 100),
      monthsRemaining: Math.max(monthsRemaining, 0),
      requiredMonthly,
      isOnTrack: goal.monthlyContribution >= requiredMonthly
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track": return "text-green-600 bg-green-100";
      case "ahead": return "text-blue-600 bg-blue-100";
      case "behind": return "text-red-600 bg-red-100";
      case "completed": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "default";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      education: GraduationCap,
      wedding: Heart,
      home: Home,
      car: Car,
      vacation: Plane,
      retirement: Clock,
      emergency: Target,
      child: Baby
    };
    return icons[category as keyof typeof icons] || Target;
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.category || !newGoal.targetDate) {
      toast.error("Please fill all required fields");
      return;
    }

  const allowedCategories = ["education","wedding","home","car","vacation","retirement","emergency","child"] as const;
  const candidateCat = String(newGoal.category);
  const category = (allowedCategories as readonly string[]).includes(candidateCat) ? (candidateCat as LifeGoal['category']) : 'education';

    const goal: LifeGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      category,
      targetAmount: newGoal.targetAmount,
      currentSavings: newGoal.currentSavings,
      targetDate: newGoal.targetDate,
      priority: newGoal.priority,
      monthlyContribution: 0,
      inflationRate: 6,
      expectedReturn: 8,
      status: "on-track"
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: "",
      category: "",
      targetAmount: 100000,
      targetDate: "",
      priority: "medium",
      currentSavings: 0
    });
    toast.success("Goal added successfully!");
  };

  const updateGoal = (goalId: string, updates: Partial<LifeGoal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
    toast.success("Goal updated!");
  };

  const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentSavings = goals.reduce((sum, goal) => sum + goal.currentSavings, 0);
  const overallProgress = (totalCurrentSavings / totalGoalAmount) * 100;

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
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Goal & Life Event Planner</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overview */}
        <Card className="p-6 mb-8 gradient-hero relative overflow-hidden shadow-glow">
          <div className="absolute inset-0 bg-dots-pattern opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-primary-foreground">Your Financial Goals</h2>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-foreground">{goals.length}</div>
                <div className="text-sm text-primary-foreground/90">Active Goals</div>
              </div>
            </div>
            <Progress value={overallProgress} className="h-3 mb-2" />
            <p className="text-sm text-primary-foreground/90">
              Overall Progress: {overallProgress.toFixed(1)}% • Target: ₹{(totalGoalAmount / 100000).toFixed(1)}L • Saved: ₹{(totalCurrentSavings / 100000).toFixed(1)}L
            </p>
          </div>
        </Card>

        <Tabs defaultValue="my-goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-goals">My Goals</TabsTrigger>
            <TabsTrigger value="life-events">Life Events</TabsTrigger>
            <TabsTrigger value="add-goal">Add New Goal</TabsTrigger>
          </TabsList>

          <TabsContent value="my-goals" className="space-y-6">
            {goals.map((goal) => {
              const IconComponent = getCategoryIcon(goal.category);
              const stats = calculateGoalProgress(goal);
              
              return (
                <Card key={goal.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{goal.title}</h3>
                          <Badge variant={getPriorityColor(goal.priority)}>
                            {goal.priority}
                          </Badge>
                          <Badge className={getStatusColor(goal.status)}>
                            {goal.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Target Amount</p>
                            <p className="font-bold">₹{goal.targetAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Current Savings</p>
                            <p className="font-bold text-green-600">₹{goal.currentSavings.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Target Date</p>
                            <p className="font-bold">{new Date(goal.targetDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Monthly SIP</p>
                            <p className="font-bold">₹{goal.monthlyContribution.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {stats.progress.toFixed(1)}% • {stats.monthsRemaining} months left
                        </span>
                      </div>
                      <Progress value={stats.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="p-3 bg-muted/30">
                        <p className="text-xs text-muted-foreground">Amount Remaining</p>
                        <p className="font-bold">₹{(goal.targetAmount - goal.currentSavings).toLocaleString()}</p>
                      </Card>
                      <Card className="p-3 bg-muted/30">
                        <p className="text-xs text-muted-foreground">Required Monthly</p>
                        <p className={`font-bold ${stats.isOnTrack ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{stats.requiredMonthly.toLocaleString()}
                        </p>
                      </Card>
                      <Card className="p-3 bg-muted/30">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className={`font-bold ${stats.isOnTrack ? 'text-green-600' : 'text-red-600'}`}>
                          {stats.isOnTrack ? 'On Track' : 'Need More'}
                        </p>
                      </Card>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Adjust Target
                      </Button>
                      <Button variant="outline" size="sm">
                        Update Progress
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate("/financial-simulator")}
                      >
                        Simulate
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="life-events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {lifeEvents.map((event) => (
                <Card key={event.id} className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg gradient-secondary flex items-center justify-center">
                      <event.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{event.name}</h3>
                      <Badge variant="outline" className="mb-2">{event.category}</Badge>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground">Estimated Cost</p>
                          <p className="font-medium">{event.estimatedCost}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Timeline</p>
                          <p className="font-medium">{event.timeline}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                    </div>
                  </div>

                  <Tabs defaultValue="planning" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="planning">Financial Planning</TabsTrigger>
                      <TabsTrigger value="considerations">Considerations</TabsTrigger>
                    </TabsList>

                    <TabsContent value="planning" className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Savings Required</p>
                          <p className="font-medium">{event.financialPlanning.savingsRequired}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Monthly SIP</p>
                          <p className="font-medium">{event.financialPlanning.monthlyContribution}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">When to Start</p>
                          <p className="font-medium">{event.financialPlanning.timeToStart}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Planning Tips</p>
                        <ul className="space-y-1">
                          {event.financialPlanning.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="considerations" className="space-y-3">
                      <ul className="space-y-2">
                        {event.considerations.map((consideration, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                            <span>{consideration}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>

                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => {
                      setNewGoal(prev => ({
                        ...prev,
                        title: event.name,
                        category: event.id === 'wedding' ? 'wedding' : 
                                 event.id === 'home-buying' ? 'home' :
                                 event.id === 'higher-education' ? 'education' :
                                 event.id === 'child-planning' ? 'child' : 'retirement'
                      }));
                      toast.success("Goal template loaded! Switch to 'Add New Goal' tab.");
                    }}
                  >
                    Create Goal from Template
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add-goal" className="space-y-6">
            <Card className="p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-6">Add New Financial Goal</h3>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input
                    id="goal-title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Dream Vacation, Car Purchase"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="goal-category">Goal Category</Label>
                  <Select 
                    value={newGoal.category} 
                    onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency Fund</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="home">Home Purchase</SelectItem>
                      <SelectItem value="car">Car Purchase</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="child">Child Planning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Target Amount: ₹{newGoal.targetAmount.toLocaleString()}</Label>
                  <Slider
                    value={[newGoal.targetAmount]}
                    onValueChange={(value) => setNewGoal(prev => ({ ...prev, targetAmount: value[0] }))}
                    max={5000000}
                    min={10000}
                    step={10000}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="target-date">Target Date</Label>
                  <Input
                    id="target-date"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="current-savings">Current Savings</Label>
                  <Input
                    id="current-savings"
                    type="number"
                    value={newGoal.currentSavings}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, currentSavings: Number(e.target.value) }))}
                    placeholder="Amount already saved"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select 
                    value={newGoal.priority} 
                    onValueChange={(value) => {
                      const v = value as unknown;
                      if (v === 'high' || v === 'medium' || v === 'low') {
                        setNewGoal(prev => ({ ...prev, priority: v }));
                      }
                    }}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addGoal} className="w-full gradient-primary">
                  Add Goal
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default GoalPlanner;