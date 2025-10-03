import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Brain, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  options: { value: string; label: string; personality: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "When you receive your monthly salary, what's your first instinct?",
    options: [
      { value: "save", label: "Save at least 30% immediately", personality: "saver" },
      { value: "spend", label: "Buy something I've been wanting", personality: "spender" },
      { value: "invest", label: "Look for investment opportunities", personality: "investor" },
      { value: "plan", label: "Review and update my budget", personality: "planner" }
    ]
  },
  {
    id: 2,
    question: "How do you feel about taking financial risks?",
    options: [
      { value: "avoid", label: "I prefer guaranteed returns, even if small", personality: "conservative" }, 
      { value: "calculated", label: "I take calculated risks after research", personality: "balanced" },
      { value: "embrace", label: "High risk, high reward excites me", personality: "aggressive" },
      { value: "scared", label: "Financial risks make me anxious", personality: "risk-averse" }
    ]
  },
  {
    id: 3,
    question: "What's your approach to financial planning?",
    options: [
      { value: "detailed", label: "I have detailed 5-10 year financial plans", personality: "planner" },
      { value: "basic", label: "I do basic budgeting monthly", personality: "casual" },
      { value: "reactive", label: "I deal with money issues as they come", personality: "reactive" },
      { value: "avoid", label: "I find financial planning overwhelming", personality: "avoider" }
    ]
  },
  {
    id: 4,
    question: "When making a big purchase, you typically:",
    options: [
      { value: "research", label: "Research extensively and compare options", personality: "analytical" },
      { value: "impulse", label: "Go with what feels right in the moment", personality: "impulsive" },
      { value: "delay", label: "Sleep on it and think for days/weeks", personality: "deliberate" },
      { value: "negotiate", label: "Focus on getting the best deal", personality: "negotiator" }
    ]
  },
  {
    id: 5,
    question: "Your emergency fund status:",
    options: [
      { value: "full", label: "6+ months of expenses saved", personality: "prepared" },
      { value: "partial", label: "1-3 months of expenses saved", personality: "working" },
      { value: "minimal", label: "Less than 1 month saved", personality: "starter" },
      { value: "none", label: "What emergency fund?", personality: "unprepared" }
    ]
  }
];

const PersonalityProfiler = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [result, setResult] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculatePersonality();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculatePersonality = () => {
    const personalityCount: { [key: string]: number } = {};
    
    Object.values(answers).forEach(answer => {
      const question = questions.find(q => q.options.some(opt => opt.value === answer));
      const option = question?.options.find(opt => opt.value === answer);
      if (option) {
        personalityCount[option.personality] = (personalityCount[option.personality] || 0) + 1;
      }
    });

    const dominantPersonality = Object.entries(personalityCount)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    setResult(dominantPersonality);
    toast.success("Personality analysis complete!");
  };

  const getPersonalityInsights = (personality: string) => {
    const insights: { [key: string]: any } = {
      saver: {
        title: "The Prudent Saver",
        description: "You prioritize financial security and long-term stability. You're naturally cautious with money and prefer guaranteed returns.",
        strengths: ["Excellent at building emergency funds", "Natural budgeting skills", "Low debt tendency"],
        challenges: ["May miss growth opportunities", "Could be too conservative with investments"],
        recommendations: ["Explore balanced mutual funds", "Set up automated investing", "Learn about inflation protection"]
      },
      spender: {
        title: "The Lifestyle Enthusiast", 
        description: "You believe in enjoying life and see money as a tool for experiences and happiness.",
        strengths: ["Good at enjoying life", "Often career-focused for income growth", "Values experiences"],
        challenges: ["May struggle with long-term savings", "Impulse spending tendencies"],
        recommendations: ["Automate savings first", "Use the 50/30/20 rule", "Set up separate fun money accounts"]
      },
      investor: {
        title: "The Growth Seeker",
        description: "You understand money should work for you and actively seek investment opportunities.",
        strengths: ["Future-oriented thinking", "Comfortable with market research", "Growth mindset"],
        challenges: ["May take excessive risks", "Could neglect emergency funds"],
        recommendations: ["Diversify your portfolio", "Don't forget emergency savings", "Regular portfolio reviews"]
      },
      conservative: {
        title: "The Safety-First Investor",
        description: "You prefer guaranteed returns and prioritize capital preservation over high growth.",
        strengths: ["Low risk of major losses", "Consistent saving habits", "Patient investor"],
        challenges: ["Returns may not beat inflation", "Overly cautious approach"],
        recommendations: ["Consider balanced funds", "Learn about SIPs", "Gradual risk increase"]
      }
    };

    return insights[personality] || insights.saver;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestion];

  if (result) {
    const insights = getPersonalityInsights(result);
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

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto p-8 gradient-hero relative overflow-hidden shadow-glow">
            <div className="absolute inset-0 bg-dots-pattern opacity-10" />
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-success flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-primary-foreground mb-2">{insights.title}</h2>
              <p className="text-lg text-primary-foreground/90 mb-8">{insights.description}</p>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 max-w-6xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-success">Your Strengths</h3>
              <ul className="space-y-2">
                {insights.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-orange-500">Areas to Watch</h3>
              <ul className="space-y-2">
                {insights.challenges.map((challenge: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <h3 className="text-xl font-bold mb-4 text-primary">Personalized Recommendations</h3>
              <ul className="space-y-3">
                {insights.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                    <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => navigate("/micro-learning")} 
              className="gradient-primary text-lg px-8 py-3"
            >
              Start Personalized Learning Path
            </Button>
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
              value={answers[currentQuestion] || ""} 
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {currentQuestionData.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    {option.label}
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
              disabled={!answers[currentQuestion]}
              className="gradient-primary"
            >
              {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalityProfiler;