import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, AlertTriangle, Lightbulb, TrendingDown, CheckCircle, Eye } from "lucide-react";
import { toast } from "sonner";

interface MistakeCase {
  id: string;
  title: string;
  category: "credit" | "investing" | "budgeting" | "insurance" | "loans";
  severity: "low" | "medium" | "high";
  persona: {
    name: string;
    age: number;
    profession: string;
    income: string;
  };
  scenario: {
    situation: string;
    decision: string;
    outcome: string;
    financialImpact: string;
  };
  analysis: {
    mistakes: string[];
    redFlags: string[];
    betterApproach: string[];
  };
  lessons: string[];
  preventionTips: string[];
  relatedConcepts: string[];
  completed: boolean;
}

const mistakeCases: MistakeCase[] = [
  {
    id: "credit-card-trap",
    title: "The Credit Card Debt Spiral",
    category: "credit",
    severity: "high",
    persona: {
      name: "Priya",
      age: 26,
      profession: "Software Developer",
      income: "₹8 LPA"
    },
    scenario: {
      situation: "Priya got her first credit card with a ₹2 lakh limit. She started using it for everyday purchases and some big-ticket items like a laptop and vacation.",
      decision: "She only paid the minimum amount due each month (₹2,000-3,000) thinking it was sufficient, while her spending continued to increase.",
      outcome: "Within 18 months, her debt grew to ₹1.8 lakhs. The interest charges alone became ₹25,000+ per month.",
      financialImpact: "Total interest paid: ₹4.5 lakhs over 3 years. Credit score dropped to 580."
    },
    analysis: {
      mistakes: [
        "Paying only minimum amount due",
        "Using credit card for lifestyle inflation",
        "Not tracking total outstanding balance",
        "Treating credit limit as free money"
      ],
      redFlags: [
        "Monthly interest charges increasing",
        "Only paying minimum due consistently",
        "Credit utilization above 50%",
        "Using credit for basic necessities"
      ],
      betterApproach: [
        "Pay full outstanding amount monthly",
        "Keep credit utilization below 30%",
        "Use credit card only for planned purchases",
        "Set up automatic full payment"
      ]
    },
    lessons: [
      "Credit cards charge 30-45% annual interest on unpaid balances",
      "Minimum payment mostly goes toward interest, not principal",
      "High credit utilization negatively impacts credit score",
      "Credit card debt compounds quickly and can spiral out of control"
    ],
    preventionTips: [
      "Set a strict monthly limit on credit card usage",
      "Always pay the full statement amount",
      "Use credit cards only for emergencies or planned purchases",
      "Monitor your credit utilization ratio monthly"
    ],
    relatedConcepts: ["Credit Score", "Interest Compounding", "Debt Management", "Emergency Fund"],
    completed: false
  },
  {
    id: "investment-fomo",
    title: "FOMO Investing in Crypto Bubble",
    category: "investing",
    severity: "high",
    persona: {
      name: "Rohit",
      age: 29,
      profession: "Marketing Manager",
      income: "₹12 LPA"
    },
    scenario: {
      situation: "During the 2021 crypto boom, Rohit saw friends making huge profits. Stories of 1000% returns were everywhere on social media.",
      decision: "He liquidated his fixed deposits (₹5 lakhs) and borrowed ₹2 lakhs from friends to invest in various cryptocurrencies without research.",
      outcome: "When the crypto market crashed in 2022, his portfolio lost 85% of its value. He was left with ₹1 lakh from his ₹7 lakh investment.",
      financialImpact: "Lost ₹6 lakhs and still owes ₹2 lakhs to friends. No emergency fund left."
    },
    analysis: {
      mistakes: [
        "Investing based on FOMO instead of research",
        "Putting all money in high-risk assets",
        "Borrowing money to invest",
        "Liquidating safe investments for speculation"
      ],
      redFlags: [
        "Everyone talking about easy money",
        "Promises of unrealistic returns",
        "Lack of understanding of the investment",
        "Pressure to invest quickly"
      ],
      betterApproach: [
        "Diversify investments across asset classes",
        "Invest only disposable income",
        "Research thoroughly before investing",
        "Start with small amounts in high-risk investments"
      ]
    },
    lessons: [
      "High returns always come with high risks",
      "FOMO leads to poor investment decisions",
      "Never invest borrowed money in volatile assets",
      "Diversification is crucial for long-term wealth building"
    ],
    preventionTips: [
      "Follow the 80-20 rule: 80% safe investments, 20% high-risk",
      "Never invest money you can't afford to lose",
      "Research any investment for at least a month before committing",
      "Avoid social media investment advice"
    ],
    relatedConcepts: ["Risk Management", "Asset Allocation", "Market Volatility", "Due Diligence"],
    completed: false
  },
  {
    id: "lifestyle-inflation",
    title: "The Lifestyle Inflation Trap",
    category: "budgeting",
    severity: "medium", 
    persona: {
      name: "Ankit",
      age: 31,
      profession: "Consultant",
      income: "₹15 LPA"
    },
    scenario: {
      situation: "Ankit got promoted with a 40% salary hike. He moved to a bigger apartment, bought a car on EMI, and started dining out frequently.",
      decision: "He increased his lifestyle expenses to match his new income, assuming he could save later when he earned even more.",
      outcome: "Despite earning 40% more, his savings actually decreased. New EMIs and lifestyle costs consumed the entire raise.",
      financialImpact: "Monthly savings dropped from ₹15,000 to ₹5,000. No progress on financial goals."
    },
    analysis: {
      mistakes: [
        "Increasing expenses immediately with income rise",
        "Taking on long-term commitments (EMIs) casually",
        "Not maintaining or increasing savings rate",
        "Postponing financial goals for lifestyle"
      ],
      redFlags: [
        "Savings rate decreasing despite higher income",
        "New EMIs reducing disposable income",
        "Justifying expenses as 'deserved'",
        "No emergency fund growth"
      ],
      betterApproach: [
        "Increase savings rate with income increases",
        "Live below your means consistently",
        "Automate savings before lifestyle upgrades",
        "Set financial goals independent of lifestyle"
      ]
    },
    lessons: [
      "Lifestyle inflation is the enemy of wealth building",
      "Saving rate matters more than absolute income",
      "Small consistent increases in expenses compound over time",
      "Financial discipline becomes harder with higher income"
    ],
    preventionTips: [
      "Automate 50% of any salary increase to savings",
      "Wait 6 months before making lifestyle changes after a raise",
      "Track your savings rate, not just savings amount",
      "Set and stick to a maximum lifestyle budget"
    ],
    relatedConcepts: ["Savings Rate", "Lifestyle Inflation", "Financial Discipline", "Goal Setting"],
    completed: false
  },
  {
    id: "insurance-gap",
    title: "The Insurance Coverage Gap",
    category: "insurance",
    severity: "high",
    persona: {
      name: "Meera",
      age: 34,
      profession: "Teacher", 
      income: "₹6 LPA"
    },
    scenario: {
      situation: "Meera had basic health insurance from her employer (₹2 lakh coverage) and thought it was sufficient for her family of four.",
      decision: "She didn't purchase additional health or life insurance, preferring to save money and invest in mutual funds instead.",
      outcome: "When her husband needed emergency heart surgery, the medical bills were ₹8 lakhs. Insurance covered only ₹2 lakhs.",
      financialImpact: "Had to liquidate all investments (₹4 lakhs) and borrow ₹2 lakhs for treatment."
    },
    analysis: {
      mistakes: [
        "Relying only on employer-provided insurance",
        "Underestimating healthcare inflation",
        "Not having adequate life insurance",
        "Considering insurance as expense instead of protection"
      ],
      redFlags: [
        "Healthcare costs rising annually",
        "Family depending on single income",
        "No life insurance for primary earner",
        "Medical inflation outpacing general inflation"
      ],
      betterApproach: [
        "Calculate insurance needs independently",
        "Get family health insurance (₹10+ lakh coverage)",
        "Term life insurance for 10-15x annual income",
        "Regular review and increase of coverage"
      ]
    },
    lessons: [
      "Employer insurance is often insufficient for families",
      "Healthcare costs can wipe out years of savings",
      "Insurance is protection, not investment",
      "Adequate coverage is crucial before wealth building"
    ],
    preventionTips: [
      "Get health insurance equal to 10x your annual income",
      "Term life insurance for 10-15x annual income",
      "Review insurance coverage annually",
      "Don't mix insurance with investment products"
    ],
    relatedConcepts: ["Risk Management", "Healthcare Inflation", "Life Insurance", "Family Financial Planning"],
    completed: false
  }
];

const MistakeMirror = () => {
  const [selectedCase, setSelectedCase] = useState<MistakeCase | null>(null);
  const [currentStep, setCurrentStep] = useState<"scenario" | "analysis" | "lessons">("scenario");
  const [casesData, setCasesData] = useState(mistakeCases);
  const navigate = useNavigate();

  const openCase = (mistakeCase: MistakeCase) => {
    setSelectedCase(mistakeCase);
    setCurrentStep("scenario");
  };

  const nextStep = () => {
    if (currentStep === "scenario") {
      setCurrentStep("analysis");
    } else if (currentStep === "analysis") {
      setCurrentStep("lessons");
    }
  };

  const completeCase = () => {
    if (!selectedCase) return;
    
    setCasesData(prev => 
      prev.map(case_ => 
        case_.id === selectedCase.id 
          ? { ...case_, completed: true }
          : case_
      )
    );
    
    toast.success("Case study completed! You've learned from this mistake.");
    setSelectedCase(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "default";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "credit": return "💳";
      case "investing": return "📈";
      case "budgeting": return "💰";
      case "insurance": return "🛡️";
      case "loans": return "🏦";
      default: return "📊";
    }
  };

  const completedCases = casesData.filter(case_ => case_.completed).length;
  const progressPercentage = (completedCases / casesData.length) * 100;

  if (selectedCase) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedCase(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cases
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentStep === "scenario" ? "bg-primary" : "bg-muted"}`} />
                <div className={`w-3 h-3 rounded-full ${currentStep === "analysis" ? "bg-primary" : "bg-muted"}`} />
                <div className={`w-3 h-3 rounded-full ${currentStep === "lessons" ? "bg-primary" : "bg-muted"}`} />
              </div>
              <span className="text-sm text-muted-foreground capitalize">{currentStep}</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{getCategoryIcon(selectedCase.category)}</span>
                <Badge variant={getSeverityColor(selectedCase.severity)}>
                  {selectedCase.severity.toUpperCase()} IMPACT
                </Badge>
                <Badge variant="outline">{selectedCase.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{selectedCase.title}</h1>
            </div>

            {/* Persona Card */}
            <Card className="p-6 mb-8 bg-muted/30">
              <h3 className="font-semibold mb-3">Meet {selectedCase.persona.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">{selectedCase.persona.age}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Profession</p>
                  <p className="font-medium">{selectedCase.persona.profession}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Income</p>
                  <p className="font-medium">{selectedCase.persona.income}</p>
                </div>
              </div>
            </Card>

            {/* Content based on current step */}
            {currentStep === "scenario" && (
              <Card className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl font-bold">The Scenario</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-blue-600">Situation</h3>
                    <p className="text-muted-foreground leading-relaxed">{selectedCase.scenario.situation}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-orange-600">The Decision</h3>
                    <p className="text-muted-foreground leading-relaxed">{selectedCase.scenario.decision}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-red-600">The Outcome</h3>
                    <p className="text-muted-foreground leading-relaxed">{selectedCase.scenario.outcome}</p>
                  </div>

                  <Card className="p-4 bg-red-50 border-red-200">
                    <h3 className="font-semibold mb-2 text-red-700">Financial Impact</h3>
                    <p className="text-red-600 font-medium">{selectedCase.scenario.financialImpact}</p>
                  </Card>
                </div>

                <div className="text-center mt-8">
                  <Button onClick={nextStep} className="gradient-primary px-8">
                    Analyze the Mistakes
                    <TrendingDown className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === "analysis" && (
              <Card className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Eye className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Analysis & Better Approach</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4 text-red-600">Key Mistakes Made</h3>
                    <ul className="space-y-3">
                      {selectedCase.analysis.mistakes.map((mistake, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                          <span className="text-sm">{mistake}</span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="font-semibold mb-4 mt-6 text-orange-600">Red Flags to Watch</h3>
                    <ul className="space-y-3">
                      {selectedCase.analysis.redFlags.map((flag, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                          <span className="text-sm">{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 text-green-600">Better Approach</h3>
                    <ul className="space-y-3">
                      {selectedCase.analysis.betterApproach.map((approach, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{approach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <Button onClick={nextStep} className="gradient-primary px-8">
                    Learn the Lessons
                    <Lightbulb className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === "lessons" && (
              <Card className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold">Key Lessons & Prevention</h2>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold mb-4 text-blue-600">Key Lessons Learned</h3>
                    <div className="grid gap-4">
                      {selectedCase.lessons.map((lesson, index) => (
                        <Card key={index} className="p-4 bg-blue-50 border-blue-200">
                          <p className="text-blue-800">{lesson}</p>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 text-green-600">Prevention Tips</h3>
                    <div className="grid gap-3">
                      {selectedCase.preventionTips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                          <span className="text-green-800">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Related Concepts to Learn More</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.relatedConcepts.map((concept, index) => (
                        <Badge key={index} variant="outline">{concept}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <Button onClick={completeCase} className="gradient-success px-8">
                    Complete Case Study
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Mistake Mirror</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <Card className="p-6 mb-8 gradient-hero relative overflow-hidden shadow-glow">
          <div className="absolute inset-0 bg-dots-pattern opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-primary-foreground">Learning from Mistakes</h2>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-foreground">{completedCases}/{casesData.length}</div>
                <div className="text-sm text-primary-foreground/90">Cases Analyzed</div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-2" />
            <p className="text-sm text-primary-foreground/90">
              Learn from real financial mistakes to avoid them in your journey
            </p>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-3">What is Mistake Mirror?</h3>
          <p className="text-muted-foreground mb-4">
            Learn from real-life financial mistakes through interactive case studies. Each story shows how small decisions 
            can lead to big financial problems, and more importantly, how to avoid them.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Real Scenarios</Badge>
            <Badge variant="outline">Root Cause Analysis</Badge>
            <Badge variant="outline">Prevention Strategies</Badge>
            <Badge variant="outline">Actionable Insights</Badge>
          </div>
        </Card>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {casesData.map((mistakeCase) => (
            <Card key={mistakeCase.id} className="p-6 card-hover relative overflow-hidden group">
              {mistakeCase.completed && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              )}
              
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{getCategoryIcon(mistakeCase.category)}</span>
                  <Badge variant={getSeverityColor(mistakeCase.severity)}>
                    {mistakeCase.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{mistakeCase.category}</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">{mistakeCase.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {mistakeCase.persona.name}, {mistakeCase.persona.age} • {mistakeCase.persona.profession}
                </p>
                <p className="text-sm text-muted-foreground">
                  {mistakeCase.scenario.situation.substring(0, 120)}...
                </p>
              </div>
              
              <Button 
                onClick={() => openCase(mistakeCase)} 
                className="w-full gradient-secondary"
                disabled={mistakeCase.completed}
              >
                {mistakeCase.completed ? 'Completed' : 'Analyze Case'}
                <Eye className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MistakeMirror;