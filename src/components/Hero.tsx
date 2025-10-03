import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Target, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Financial growth and learning" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 gradient-hero opacity-95 animate-gradient" />
        <div className="absolute inset-0 bg-dots-pattern opacity-20" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="inline-flex items-center gap-2 glass-effect text-primary-foreground px-6 py-3 rounded-full text-sm font-medium shadow-lg">
              <Award className="w-4 h-4" />
              Transform Your Financial Future
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            Master Money.<br />
            Build Wealth.<br />
            <span className="bg-gradient-to-r from-success to-warning bg-clip-text text-transparent">
              Live Better.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            FinBridge combines personalized learning, smart simulations, and behavioral insights to transform how you understand and manage money.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <Link to="/auth">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-glow px-8 py-6 text-lg group">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 glass-effect text-primary-foreground hover:bg-white/20 px-8 py-6 text-lg shadow-lg">
              Learn More
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 justify-center pt-8 animate-in fade-in duration-1000 delay-700">
            {[
              { icon: TrendingUp, text: "Personalized Learning" },
              { icon: Target, text: "Smart Simulations" },
              { icon: Award, text: "Gamified Progress" }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 glass-effect text-primary-foreground px-5 py-3 rounded-full shadow-lg hover:shadow-glow transition-all"
              >
                <feature.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
