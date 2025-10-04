import { Card } from "@/components/ui/card";
import { Brain, Target, TrendingUp, Award, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Personality Profiler",
    description: "Understand your financial mindset with AI-powered insights that adapt to your behavior patterns.",
    color: "gradient-primary"
  },
  {
    icon: Target,
    title: "Micro-Learning",
    description: "Bite-sized lessons on budgeting, investing, and saving that fit into your daily routine.",
    color: "gradient-secondary"
  },
  {
    icon: TrendingUp,
    title: "Smart Simulators",
    description: "Practice investing and financial decisions in a risk-free environment with real-time feedback.",
    color: "gradient-success"
  },
  {
    icon: Award,
    title: "Gamification",
    description: "Earn points, unlock badges, and compete with challenges that make learning fun and engaging.",
    color: "gradient-primary"
  },
  {
    icon: Shield,
    title: "Financial Health Score",
    description: "Track your comprehensive financial wellness across savings, debt, insurance, and emergency readiness.",
    color: "gradient-secondary"
  },
  {
    icon: Users,
    title: "Crowd Wisdom",
    description: "Benchmark against peers and learn from community insights while staying motivated.",
    color: "gradient-success"
  }
];

const Features = () => {
  return (
    <section className="py-24 relative bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Master Money</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Comprehensive tools designed to transform your financial knowledge into action
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 card-hover border-border/50 bg-card/80 backdrop-blur-sm relative overflow-hidden group"
            >
              {/* Hover Gradient Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 gradient-primary" />
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
