import { Card } from "@/components/ui/card";
import { UserPlus, Brain, BookOpen, Target, TrendingUp, Award } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up & Profile",
    description: "Create your account and complete a quick financial personality assessment",
    step: "1"
  },
  {
    icon: Brain,
    title: "Discover Your Money Mindset",
    description: "Get personalized insights about your spending, saving, and risk-taking patterns",
    step: "2"
  },
  {
    icon: BookOpen,
    title: "Learn at Your Pace",
    description: "Access bite-sized lessons tailored to your knowledge level and goals",
    step: "3"
  },
  {
    icon: Target,
    title: "Practice with Simulators",
    description: "Test your decisions in realistic scenarios without real-world risks",
    step: "4"
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Monitor your financial health score and see measurable improvements",
    step: "5"
  },
  {
    icon: Award,
    title: "Achieve & Grow",
    description: "Unlock achievements, compete in challenges, and build lasting habits",
    step: "6"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-muted/20 relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Journey to
            <span className="bg-gradient-to-r from-success to-primary bg-clip-text text-transparent"> Financial Freedom</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            A simple, proven path from learning to action
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="p-6 relative overflow-hidden group card-hover bg-card/80 backdrop-blur-sm border-border/50"
              >
                {/* Animated Number Background */}
                <div className="absolute top-4 right-4 text-7xl font-bold text-muted/5 group-hover:text-primary/10 transition-all duration-300 group-hover:scale-110">
                  {step.step}
                </div>
                
                {/* Gradient Accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-lg group-hover:shadow-glow group-hover:scale-110">
                    <step.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
