import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LogOut, TrendingUp, Target, Award, BookOpen, Brain, Bell, Users } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

const LOCAL_AUTH_KEY = "finbridge_user";

interface LocalUser {
  id: string;
  email: string;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | LocalUser | null>(null);
  const [isLocalAuth, setIsLocalAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      // First priority: Check for active Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log("Found active Supabase session:", session.user.id);
        setUser(session.user);
        setIsLocalAuth(false);
        // Clear any local auth since we have a real session
        localStorage.removeItem(LOCAL_AUTH_KEY);
        return;
      }
      
      // Second priority: Check for local auth (fallback only)
      const localUser = localStorage.getItem(LOCAL_AUTH_KEY);
      if (localUser) {
        try {
          const parsedUser = JSON.parse(localUser);
          console.log("Using local auth fallback for:", parsedUser.email);
          setUser(parsedUser);
          setIsLocalAuth(true);
          return;
        } catch (error) {
          console.error("Error parsing local user:", error);
          localStorage.removeItem(LOCAL_AUTH_KEY);
        }
      }
      
      // No authentication found - redirect to auth page
      console.log("No authentication found - redirecting to auth");
      navigate("/auth");
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          setIsLocalAuth(false);
          // Clear local auth when we have a real session
          localStorage.removeItem(LOCAL_AUTH_KEY);
        } else {
          // Session ended - check for local auth fallback
          const localUser = localStorage.getItem(LOCAL_AUTH_KEY);
          if (localUser) {
            try {
              const parsedUser = JSON.parse(localUser);
              setUser(parsedUser);
              setIsLocalAuth(true);
            } catch (error) {
              console.error("Error parsing local user:", error);
              localStorage.removeItem(LOCAL_AUTH_KEY);
              navigate("/auth");
            }
          } else {
            navigate("/auth");
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    if (isLocalAuth) {
      localStorage.removeItem(LOCAL_AUTH_KEY);
      toast.success("Signed out successfully");
      navigate("/");
    } else {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">FinBridge</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">{user.email}</p>
            {isLocalAuth && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Demo Mode
              </span>
            )}
          </div>
        </div>

        {/* Financial Health Score */}
        <Card className="p-6 mb-8 gradient-hero relative overflow-hidden shadow-glow">
          <div className="absolute inset-0 bg-dots-pattern opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-primary-foreground">Financial Health Score</h3>
              <div className="text-4xl font-bold text-primary-foreground">72</div>
            </div>
            <Progress value={72} className="h-3 mb-2" />
            <p className="text-sm text-primary-foreground/90">
              You're doing great! Complete more lessons to improve your score.
            </p>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg gradient-success flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">1,250</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg gradient-secondary flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
                <p className="text-2xl font-bold">12/24</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goals Set</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </Card>
        </div>

        {/* New Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 gradient-primary relative overflow-hidden shadow-primary card-hover">
            <div className="absolute inset-0 bg-dots-pattern opacity-10" />
            <div className="relative z-10">
              <Brain className="w-8 h-8 text-white mb-3 drop-shadow-lg" />
              <h3 className="text-lg font-bold text-white mb-2">Personality Profiler</h3>
              <p className="text-white/90 text-sm mb-4">Discover your financial mindset and get personalized recommendations</p>
              <Button 
                variant="secondary" 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                onClick={() => navigate("/personality-profiler")}
              >
                Take Assessment
              </Button>
            </div>
          </Card>

          <Card className="p-6 gradient-secondary relative overflow-hidden shadow-secondary card-hover">
            <div className="absolute inset-0 bg-dots-pattern opacity-10" />
            <div className="relative z-10">
              <BookOpen className="w-8 h-8 text-white mb-3 drop-shadow-lg" />
              <h3 className="text-lg font-bold text-white mb-2">Micro-Learning</h3>
              <p className="text-white/90 text-sm mb-4">Bite-sized lessons with quizzes and actionable tasks</p>
              <Button 
                variant="secondary" 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                onClick={() => navigate("/micro-learning")}
              >
                Start Learning
              </Button>
            </div>
          </Card>

          <Card className="p-6 gradient-success relative overflow-hidden shadow-success card-hover">
            <div className="absolute inset-0 bg-dots-pattern opacity-10" />
            <div className="relative z-10">
              <Award className="w-8 h-8 text-white mb-3 drop-shadow-lg" />
              <h3 className="text-lg font-bold text-white mb-2">Mistake Mirror</h3>
              <p className="text-white/90 text-sm mb-4">Learn from real-life financial mistakes through case studies</p>
              <Button 
                variant="secondary" 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                onClick={() => navigate("/mistake-mirror")}
              >
                Explore Cases
              </Button>
            </div>
          </Card>

          <Card className="p-6 gradient-info relative overflow-hidden shadow-primary card-hover">
            <div className="absolute inset-0 bg-dots-pattern opacity-10" />
            <div className="relative z-10">
              <TrendingUp className="w-8 h-8 text-white mb-3 drop-shadow-lg" />
              <h3 className="text-lg font-bold text-white mb-2">Financial Simulator</h3>
              <p className="text-white/90 text-sm mb-4">Practice financial decisions risk-free with SIP, EMI, and goal calculators</p>
              <Button 
                variant="secondary" 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                onClick={() => navigate("/financial-simulator")}
              >
                Try Simulator
              </Button>
            </div>
          </Card>

          <Card className="p-6 gradient-warning relative overflow-hidden shadow-secondary card-hover">
            <div className="absolute inset-0 bg-dots-pattern opacity-10" />
            <div className="relative z-10">
              <Bell className="w-8 h-8 text-white mb-3 drop-shadow-lg" />
              <h3 className="text-lg font-bold text-white mb-2">Smart Alerts</h3>
              <p className="text-white/90 text-sm mb-4">Get personalized alerts and predictive nudges for better financial decisions</p>
              <Button 
                variant="secondary" 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                onClick={() => navigate("/smart-alerts")}
              >
                Manage Alerts
              </Button>
            </div>
          </Card>

          <Card className="p-6 gradient-success relative overflow-hidden shadow-success card-hover">
            <div className="absolute inset-0 bg-dots-pattern opacity-10" />
            <div className="relative z-10">
              <TrendingUp className="w-8 h-8 text-white mb-3 drop-shadow-lg" />
              <h3 className="text-lg font-bold text-white mb-2">Investment Advisor</h3>
              <p className="text-white/90 text-sm mb-4">Get step-by-step investment guidance with personalized recommendations</p>
              <Button 
                variant="secondary" 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                onClick={() => navigate("/investment-advisor")}
              >
                Get Advice
              </Button>
            </div>
          </Card>

          <Card className="p-6 gradient-secondary relative overflow-hidden shadow-secondary card-hover">
            <div className="absolute inset-0 bg-dots-pattern opacity-10" />
            <div className="relative z-10">
              <Target className="w-8 h-8 text-white mb-3 drop-shadow-lg" />
              <h3 className="text-lg font-bold text-white mb-2">Goal Planner</h3>
              <p className="text-white/90 text-sm mb-4">Plan major life events and track your financial goals with precision</p>
              <Button 
                variant="secondary" 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                onClick={() => navigate("/goal-planner")}
              >
                Plan Goals
              </Button>
            </div>
          </Card>

          <Card className="p-6 gradient-primary relative overflow-hidden shadow-primary card-hover">
            <div className="absolute inset-0 bg-dots-pattern opacity-10" />
            <div className="relative z-10">
              <Users className="w-8 h-8 text-white mb-3 drop-shadow-lg" />
              <h3 className="text-lg font-bold text-white mb-2">Crowd Wisdom</h3>
              <p className="text-white/90 text-sm mb-4">Compare your financial habits with the community anonymously</p>
              <Button 
                variant="secondary" 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                onClick={() => navigate("/crowd-wisdom")}
              >
                Compare Now
              </Button>
            </div>
          </Card>
        </div>

        {/* Learning Path */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Continue Learning
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-1">Understanding EMIs</h4>
                <Progress value={60} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">60% complete</p>
              </div>
              <Button 
                className="w-full gradient-primary"
                onClick={() => navigate("/micro-learning")}
              >
                Continue Lesson
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-success" />
              Active Challenges
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <h4 className="font-semibold mb-1">7-Day Savings Streak</h4>
                <p className="text-sm text-muted-foreground mb-2">Track expenses daily for 7 days</p>
                <div className="flex items-center gap-2">
                  <Progress value={71} className="h-2 flex-1" />
                  <span className="text-sm font-medium">5/7</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
