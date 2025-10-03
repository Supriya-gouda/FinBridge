import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Brain, CheckCircle, Play, Award, Target } from "lucide-react";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  content: {
    sections: LessonSection[];
    quiz: Quiz;
    actionableTask: ActionableTask;
  };
  completed: boolean;
  score?: number;
}

interface LessonSection {
  type: "text" | "image" | "video" | "interactive";
  title: string;
  content: string;
  keyPoints?: string[];
}

interface Quiz {
  questions: QuizQuestion[];
  passingScore: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ActionableTask {
  title: string;
  description: string;
  steps: string[];
  reward: number;
}

const lessons: Lesson[] = [
  {
    id: "budgeting-basics",
    title: "Budgeting Fundamentals",
    description: "Master the 50/30/20 rule and create your first budget",
    duration: "5 min",
    difficulty: "beginner",
    category: "Budgeting",
    completed: false,
    content: {
      sections: [
        {
          type: "text",
          title: "What is Budgeting?",
          content: "Budgeting is the process of creating a plan for how you'll spend your money. It helps you ensure you have enough money for things you need and want while building savings for the future.",
          keyPoints: [
            "Track your income and expenses",
            "Prioritize needs over wants", 
            "Plan for unexpected expenses",
            "Review and adjust regularly"
          ]
        },
        {
          type: "text",
          title: "The 50/30/20 Rule",
          content: "This simple rule divides your after-tax income into three categories: 50% for needs (rent, utilities, groceries), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment.",
          keyPoints: [
            "50% - Essential needs (housing, food, utilities)",
            "30% - Wants and lifestyle (entertainment, hobbies)",
            "20% - Savings and debt payments"
          ]
        }
      ],
      quiz: {
        passingScore: 80,
        questions: [
          {
            id: "q1",
            question: "According to the 50/30/20 rule, what percentage should go to savings?",
            options: ["10%", "15%", "20%", "25%"],
            correctAnswer: 2,
            explanation: "The 50/30/20 rule allocates 20% of after-tax income to savings and debt repayment."
          },
          {
            id: "q2", 
            question: "Which expense category does 'rent' fall under in the 50/30/20 rule?",
            options: ["Wants (30%)", "Needs (50%)", "Savings (20%)", "None of the above"],
            correctAnswer: 1,
            explanation: "Rent is an essential expense and falls under the 'Needs' category (50%)."
          },
          {
            id: "q3",
            question: "What's the main benefit of budgeting?",
            options: ["Making more money", "Controlling spending", "Getting promotions", "Avoiding taxes"],
            correctAnswer: 1,
            explanation: "Budgeting helps you control spending, prioritize goals, and ensure you live within your means."
          }
        ]
      },
      actionableTask: {
        title: "Create Your First Budget",
        description: "Apply the 50/30/20 rule to your monthly income",
        steps: [
          "Calculate your monthly after-tax income",
          "List all your essential expenses (needs)",
          "Identify your discretionary spending (wants)", 
          "Determine how much you can save (20%)",
          "Use a budgeting app or spreadsheet to track"
        ],
        reward: 100
      }
    }
  },
  {
    id: "emergency-fund",
    title: "Building Emergency Funds", 
    description: "Learn why emergency funds are crucial and how to build one",
    duration: "7 min",
    difficulty: "beginner",
    category: "Savings",
    completed: false,
    content: {
      sections: [
        {
          type: "text",
          title: "Why Emergency Funds Matter",
          content: "An emergency fund is money set aside to cover unexpected expenses like medical bills, car repairs, or job loss. It prevents you from going into debt during tough times.",
          keyPoints: [
            "Covers unexpected expenses",
            "Prevents debt accumulation",
            "Provides peace of mind",
            "Should be easily accessible"
          ]
        },
        {
          type: "text", 
          title: "How Much Should You Save?",
          content: "Financial experts recommend saving 3-6 months of living expenses. Start small with ₹1,000, then work towards one month of expenses, then gradually build to the full amount.",
          keyPoints: [
            "Start with ₹1,000 as initial goal",
            "Build to 1 month of expenses",
            "Aim for 3-6 months ultimately",
            "Keep in a separate, accessible account"
          ]
        }
      ],
      quiz: {
        passingScore: 75,
        questions: [
          {
            id: "q1",
            question: "How many months of expenses should an emergency fund ideally cover?",
            options: ["1-2 months", "3-6 months", "8-12 months", "2 years"],
            correctAnswer: 1,
            explanation: "Most experts recommend 3-6 months of living expenses for a complete emergency fund."
          },
          {
            id: "q2",
            question: "What's a good initial emergency fund goal for beginners?",
            options: ["₹500", "₹1,000", "₹10,000", "₹50,000"],
            correctAnswer: 1,
            explanation: "₹1,000 is a great starting point that can cover many small emergencies."
          }
        ]
      },
      actionableTask: {
        title: "Start Your Emergency Fund",
        description: "Open a separate savings account and make your first deposit",
        steps: [
          "Open a separate savings account for emergencies",
          "Calculate your monthly essential expenses",
          "Set a goal (start with ₹1,000 or 1 month expenses)",
          "Make your first deposit today",
          "Set up automatic monthly transfers"
        ],
        reward: 150
      }
    }
  },
  {
    id: "sip-investing",
    title: "SIP Investment Basics",
    description: "Understand Systematic Investment Plans and start investing",
    duration: "8 min", 
    difficulty: "intermediate",
    category: "Investing",
    completed: false,
    content: {
      sections: [
        {
          type: "text",
          title: "What is SIP?",
          content: "Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in mutual funds. It's a disciplined approach that leverages rupee cost averaging and compound growth.",
          keyPoints: [
            "Regular fixed investments",
            "Rupee cost averaging benefits",
            "Compound growth over time",
            "Disciplined investing approach"
          ]
        },
        {
          type: "text",
          title: "Benefits of SIP",
          content: "SIP reduces the impact of market volatility through rupee cost averaging. When markets are high, you buy fewer units; when markets are low, you buy more units. Over time, this averages out your cost.",
          keyPoints: [
            "Reduces market timing risk",
            "Instills discipline",
            "Power of compounding",
            "Affordable starting amounts (₹500+)"
          ]
        }
      ],
      quiz: {
        passingScore: 80,
        questions: [
          {
            id: "q1",
            question: "What is the main benefit of rupee cost averaging in SIP?",
            options: ["Higher returns", "Reduced volatility impact", "Tax benefits", "Guaranteed profits"],
            correctAnswer: 1,
            explanation: "Rupee cost averaging helps reduce the impact of market volatility by averaging your purchase cost over time."
          },
          {
            id: "q2",
            question: "What's the minimum amount typically required to start a SIP?",
            options: ["₹100", "₹500", "₹1,000", "₹5,000"],
            correctAnswer: 1,
            explanation: "Most mutual funds allow SIP investments starting from ₹500 per month."
          }
        ]
      },
      actionableTask: {
        title: "Start Your First SIP",
        description: "Research and invest in your first SIP",
        steps: [
          "Complete your KYC (Know Your Customer) process",
          "Research large-cap or balanced mutual funds",
          "Choose a fund with good 5-year track record",
          "Start with ₹1,000-2,000 monthly SIP",
          "Set up auto-debit for consistency"
        ],
        reward: 200
      }
    }
  }
];

const MicroLearning = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [lessonsData, setLessonsData] = useState(lessons);
  const navigate = useNavigate();

  const startLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentSection(0);
    setShowQuiz(false);
    setShowTask(false);
    setQuizAnswers({});
    setQuizScore(null);
  };

  const nextSection = () => {
    if (selectedLesson) {
      if (currentSection < selectedLesson.content.sections.length - 1) {
        setCurrentSection(prev => prev + 1);
      } else {
        setShowQuiz(true);
      }
    }
  };

  const submitQuiz = () => {
    if (!selectedLesson) return;
    
    const quiz = selectedLesson.content.quiz;
    let correct = 0;
    
    quiz.questions.forEach((question, index) => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    
    const score = Math.round((correct / quiz.questions.length) * 100);
    setQuizScore(score);
    
    if (score >= quiz.passingScore) {
      toast.success(`Great job! You scored ${score}%`);
      setTimeout(() => setShowTask(true), 1500);
    } else {
      toast.error(`You scored ${score}%. Try again to pass!`);
    }
  };

  const completeTask = () => {
    if (!selectedLesson) return;
    
    // Update lesson as completed
    setLessonsData(prev => 
      prev.map(lesson => 
        lesson.id === selectedLesson.id 
          ? { ...lesson, completed: true, score: quizScore || 0 }
          : lesson
      )
    );
    
    toast.success(`Lesson completed! You earned ${selectedLesson.content.actionableTask.reward} points!`);
    setSelectedLesson(null);
    setShowTask(false);
  };

  const completedLessons = lessonsData.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedLessons / lessonsData.length) * 100;

  if (selectedLesson) {
    const currentSectionData = selectedLesson.content.sections[currentSection];
    
    if (showTask) {
      return (
        <div className="min-h-screen bg-background">
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setSelectedLesson(null)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lessons
              </Button>
              <h1 className="text-xl font-bold">Actionable Task</h1>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <Card className="max-w-3xl mx-auto p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-success flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{selectedLesson.content.actionableTask.title}</h2>
                <p className="text-muted-foreground">{selectedLesson.content.actionableTask.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold">Steps to Complete:</h3>
                {selectedLesson.content.actionableTask.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Complete this task to earn <span className="font-bold text-primary">{selectedLesson.content.actionableTask.reward} points</span>
                </p>
                <Button onClick={completeTask} className="gradient-primary px-8">
                  Mark Task Complete
                  <Award className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </main>
        </div>
      );
    }
    
    if (showQuiz) {
      return (
        <div className="min-h-screen bg-background">
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setShowQuiz(false)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lesson
              </Button>
              <h1 className="text-xl font-bold">Knowledge Check</h1>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <Card className="max-w-3xl mx-auto p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-secondary flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Quiz: {selectedLesson.title}</h2>
                <p className="text-muted-foreground">
                  Pass with {selectedLesson.content.quiz.passingScore}% to unlock the actionable task
                </p>
              </div>

              <div className="space-y-6">
                {selectedLesson.content.quiz.questions.map((question, qIndex) => (
                  <Card key={question.id} className="p-6">
                    <h3 className="font-semibold mb-4">
                      {qIndex + 1}. {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <Button
                          key={oIndex}
                          variant={quizAnswers[question.id] === oIndex ? "default" : "outline"}
                          className="w-full text-left justify-start"
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [question.id]: oIndex }))}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                    {quizScore !== null && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                {quizScore === null ? (
                  <Button 
                    onClick={submitQuiz} 
                    disabled={Object.keys(quizAnswers).length < selectedLesson.content.quiz.questions.length}
                    className="gradient-primary px-8"
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <div>
                    <p className="text-lg font-semibold mb-4">
                      Your Score: {quizScore}%
                    </p>
                    {quizScore >= selectedLesson.content.quiz.passingScore ? (
                      <Button onClick={() => setShowTask(true)} className="gradient-success px-8">
                        Continue to Task
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={() => { setQuizAnswers({}); setQuizScore(null); }} className="gradient-secondary px-8">
                        Try Again
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedLesson(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lessons
            </Button>
            <div className="flex items-center gap-4">
              <Progress value={((currentSection + 1) / selectedLesson.content.sections.length) * 100} className="w-24 h-2" />
              <span className="text-sm text-muted-foreground">
                {currentSection + 1}/{selectedLesson.content.sections.length}
              </span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto p-8">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-2">{selectedLesson.category}</Badge>
              <h1 className="text-3xl font-bold mb-2">{selectedLesson.title}</h1>
            </div>

            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">{currentSectionData.title}</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">{currentSectionData.content}</p>
              
              {currentSectionData.keyPoints && (
                <div>
                  <h3 className="font-semibold mb-3">Key Points:</h3>
                  <ul className="space-y-2">
                    {currentSectionData.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            <div className="text-center">
              <Button onClick={nextSection} className="gradient-primary px-8">
                {currentSection < selectedLesson.content.sections.length - 1 ? 'Next Section' : 'Take Quiz'}
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-100 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <header className="border-b bg-card/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center shadow-glow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Micro-Learning</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Progress Overview */}
        <Card className="p-6 mb-8 gradient-hero relative overflow-hidden shadow-glow">
          <div className="absolute inset-0 bg-dots-pattern opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-primary-foreground">Learning Progress</h2>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-foreground">{completedLessons}/{lessonsData.length}</div>
                <div className="text-sm text-primary-foreground/90">Lessons Completed</div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-2" />
            <p className="text-sm text-primary-foreground/90">
              {progressPercentage.toFixed(0)}% of your learning journey complete
            </p>
          </div>
        </Card>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessonsData.map((lesson) => (
            <Card key={lesson.id} className="p-6 card-hover relative overflow-hidden group">
              {lesson.completed && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              )}
              
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{lesson.category}</Badge>
                  <Badge variant={lesson.difficulty === 'beginner' ? 'default' : lesson.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
                    {lesson.difficulty}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                <p className="text-muted-foreground mb-4">{lesson.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{lesson.duration}</span>
                  {lesson.completed && lesson.score && (
                    <span className="text-success font-medium">Score: {lesson.score}%</span>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={() => startLesson(lesson)} 
                className="w-full gradient-primary"
                disabled={lesson.completed}
              >
                {lesson.completed ? 'Completed' : 'Start Lesson'}
                <Play className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MicroLearning;