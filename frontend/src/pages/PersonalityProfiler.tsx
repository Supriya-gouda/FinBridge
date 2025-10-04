import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Brain, TrendingUp, Target, CheckCircle, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PersonalityProfilerAPI, { AssessmentAnswers, PersonalityProfile, PersonalityChallenge } from "@/services/personalityProfilerAPI";

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; description?: string }[];
}

const questions: Question[] = [
  {
    id: "salary_approach",
    question: "When you receive your monthly salary, what's your first instinct?",
    options: [
      { value: "save_immediately", label: "Save at least 30% immediately", description: "Security-focused approach" },
      { value: "buy_wanted_item", label: "Buy something I've been wanting", description: "Lifestyle-focused spending" },
      { value: "invest_opportunity", label: "Look for investment opportunities", description: "Growth-oriented mindset" },
      { value: "review_budget", label: "Review and update my budget", description: "Planning-focused approach" }
    ]
  },
  {
    id: "risk_tolerance",
    question: "How do you feel about taking financial risks?",
    options: [
      { value: "guaranteed_returns", label: "I prefer guaranteed returns, even if small", description: "Conservative approach" },
      { value: "calculated_risks", label: "I take calculated risks after research", description: "Balanced risk management" },
      { value: "high_risk_reward", label: "High risk, high reward excites me", description: "Aggressive growth strategy" },
      { value: "risk_anxious", label: "Financial risks make me anxious", description: "Risk-averse mindset" }
    ]
  },
  {
    id: "planning_approach",
    question: "What's your approach to financial planning?",
    options: [
      { value: "detailed_longterm", label: "I have detailed 5-10 year financial plans", description: "Strategic long-term planning" },
      { value: "basic_monthly", label: "I do basic budgeting monthly", description: "Regular but simple planning" },
      { value: "reactive_approach", label: "I deal with money issues as they come", description: "Reactive financial management" },
      { value: "planning_overwhelming", label: "I find financial planning overwhelming", description: "Planning avoidance" }
    ]
  },
  {
    id: "purchase_decision",
    question: "When making a big purchase, you typically:",
    options: [
      { value: "extensive_research", label: "Research extensively and compare options", description: "Analytical decision-making" },
      { value: "gut_feeling", label: "Go with what feels right in the moment", description: "Intuitive purchasing" },
      { value: "sleep_on_it", label: "Sleep on it and think for days/weeks", description: "Deliberate consideration" },
      { value: "best_deal", label: "Focus on getting the best deal", description: "Value-focused shopping" }
    ]
  },
  {
    id: "emergency_fund",
    question: "Your emergency fund status:",
    options: [
      { value: "six_plus_months", label: "6+ months of expenses saved", description: "Well-prepared financially" },
      { value: "one_to_three_months", label: "1-3 months of expenses saved", description: "Basic emergency preparation" },
      { value: "less_than_month", label: "Less than 1 month saved", description: "Limited emergency buffer" },
      { value: "no_emergency_fund", label: "What emergency fund?", description: "No emergency preparation" }
    ]
  },
  {
    id: "investment_knowledge",
    question: "How would you rate your investment knowledge?",
    options: [
      { value: "very_knowledgeable", label: "Very knowledgeable - I understand complex products", description: "Advanced investor" },
      { value: "some_knowledge", label: "Some knowledge - I know the basics", description: "Intermediate understanding" },
      { value: "basic_knowledge", label: "Basic knowledge - I'm learning", description: "Beginner level" },
      { value: "no_knowledge", label: "No knowledge - investments confuse me", description: "New to investing" }
    ]
  }
];

const PersonalityProfiler = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<PersonalityProfile | null>(null);
  const [challenges, setChallenges] = useState<PersonalityChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user already has a profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      try {
        const profileResult = await PersonalityProfilerAPI.getUserProfile();
        if (profileResult.success && profileResult.data) {
          setResult(profileResult.data);
          // Load challenges for existing profile
          loadChallenges();
        }
      } catch (error) {
        console.log('No existing profile found');
      }
    };

    checkExistingProfile();
  }, []);

  const loadChallenges = async () => {
    setIsLoadingChallenges(true);
    try {
      const challengesResult = await PersonalityProfilerAPI.getPersonalizedChallenges();
      if (challengesResult.success && challengesResult.data) {
        setChallenges(challengesResult.data);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setIsLoadingChallenges(false);
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeAssessment = async () => {
    setIsLoading(true);
    try {
      const assessmentAnswers: AssessmentAnswers = {
        salary_approach: answers.salary_approach,
        risk_tolerance: answers.risk_tolerance,
        planning_approach: answers.planning_approach,
        purchase_decision: answers.purchase_decision,
        emergency_fund: answers.emergency_fund,
        investment_knowledge: answers.investment_knowledge
      };

      const result = await PersonalityProfilerAPI.completeAssessment(assessmentAnswers);
      
      if (result.success && result.data) {
        setResult(result.data);
        toast({
          title: "Assessment Complete!",
          description: `You are ${result.data.personality_details.name}`,
        });
        
        // Load personalized challenges
        loadChallenges();
      } else {
        throw new Error(result.error || 'Assessment failed');
      }
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast({
        title: "Assessment Error",
        description: "There was an issue processing your assessment. Using demo data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateChallengeProgress = async (challengeId: string, progress: number) => {
    try {
      const result = await PersonalityProfilerAPI.updateChallengeProgress(challengeId, progress);
      if (result.success) {
        // Update local state
        setChallenges(prev => prev.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, progress, status: progress >= 100 ? 'completed' : 'in_progress' }
            : challenge
        ));
        
        toast({
          title: "Progress Updated",
          description: `Challenge progress: ${progress}%`,
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update challenge progress",
        variant: "destructive",
      });
    }
  };

  const retakeAssessment = () => {
    setResult(null);
    setCurrentQuestion(0);
    setAnswers({});
    setChallenges([]);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestion];

  if (result) {
    const insights = result.personality_details;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
        <div className="absolute inset-0 bg-dots-pattern opacity-5"></div>
        
        <header className="border-b bg-card/80 backdrop-blur-sm relative z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Personality Results</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 relative z-10">
          {/* Personality Result Card */}
          <Card 
            className="max-w-4xl mx-auto p-8 mb-8 relative overflow-hidden shadow-glow"
            style={{ background: `linear-gradient(135deg, ${insights.color}20, ${insights.color}10)` }}
          >
            <div className="absolute inset-0 bg-dots-pattern opacity-10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="text-center flex-1">
                  <div 
                    className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: insights.color }}
                  >
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{insights.name}</h2>
                  <p className="text-lg text-muted-foreground mb-4">{insights.description}</p>
                  <div className="flex justify-center gap-2">
                    {insights.traits.map((trait, index) => (
                      <Badge key={index} variant="outline" className="capitalize">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Confidence Level</div>
                  <div className="text-2xl font-bold">{Math.round(result.confidence_level)}%</div>
                  <Button variant="outline" size="sm" onClick={retakeAssessment} className="mt-2">
                    Retake Assessment
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 max-w-6xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-success flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Your Strengths
              </h3>
              <ul className="space-y-3">
                {insights.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-orange-500 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Areas to Watch
              </h3>
              <ul className="space-y-3">
                {insights.challenges.map((challenge: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Personalized Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: insights.color }}
                    >
                      {index + 1}
                    </div>
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Personalized Challenges Section */}
          <div className="max-w-6xl mx-auto mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Your Personalized Challenges
              </h3>
              <Button 
                variant="outline" 
                onClick={loadChallenges}
                disabled={isLoadingChallenges}
              >
                {isLoadingChallenges ? 'Loading...' : 'Refresh Challenges'}
              </Button>
            </div>

            {challenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">{challenge.title}</h4>
                        <p className="text-muted-foreground text-sm mb-4">{challenge.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {challenge.duration_days} days
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {challenge.difficulty}
                          </Badge>
                          <Badge 
                            variant={challenge.status === 'completed' ? 'default' : 
                                   challenge.status === 'in_progress' ? 'secondary' : 'outline'}
                          >
                            {challenge.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        {challenge.target_amount > 0 && (
                          <p className="text-sm mb-4">
                            <strong>Target Amount:</strong> ₹{challenge.target_amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                      
                      {challenge.status !== 'completed' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateChallengeProgress(challenge.id, Math.min(100, challenge.progress + 25))}
                          >
                            +25% Progress
                          </Button>
                          {challenge.progress < 100 && (
                            <Button 
                              size="sm" 
                              onClick={() => updateChallengeProgress(challenge.id, 100)}
                              style={{ backgroundColor: insights.color }}
                              className="text-white"
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-lg font-semibold mb-2">No Challenges Available</h4>
                <p className="text-muted-foreground mb-4">
                  Personalized challenges will be generated based on your personality type.
                </p>
                <Button onClick={loadChallenges} disabled={isLoadingChallenges}>
                  {isLoadingChallenges ? 'Generating...' : 'Generate Challenges'}
                </Button>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-12">
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => navigate("/micro-learning")} 
                className="gradient-primary text-lg px-8 py-3"
              >
                Start Personalized Learning
              </Button>
              <Button 
                onClick={() => navigate("/dashboard")} 
                variant="outline"
                className="text-lg px-8 py-3"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <header className="border-b bg-card/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Financial Personality Profiler</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 shadow-sm" />
          </div>

          {/* Question Card */}
          <Card className="p-8 mb-6 shadow-glow bg-card/90 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">{currentQuestionData.question}</h2>
            
            <RadioGroup 
              value={answers[currentQuestionData.id] || ""} 
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {currentQuestionData.options.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    <div className="font-medium mb-1">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button 
              onClick={nextQuestion}
              disabled={!answers[currentQuestionData.id] || isLoading}
              className="gradient-primary"
            >
              {isLoading ? 'Processing...' : 
               currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>

          {/* Question Info */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            This assessment takes about 2-3 minutes and helps us understand your financial personality
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalityProfiler;