import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Target, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Modern Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 animate-gradient opacity-70" />
        
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern" />
          <div className="absolute top-0 left-0 w-full h-full bg-dots-pattern" />
        </div>
        
        {/* Financial chart lines */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
            <path d="M0 400 Q300 300 600 350 T1200 300" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
            <path d="M0 500 Q200 400 400 450 T800 400 Q1000 350 1200 400" stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none" />
            <path d="M0 600 Q150 500 300 550 T600 500 Q900 450 1200 500" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>

      {/* Enhanced Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/30 rounded-full blur-3xl animate-float animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-500/20 rounded-full blur-3xl animate-float animation-delay-4000" />
        
        {/* Financial Icons Floating */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center animate-float">
          <TrendingUp className="w-8 h-8 text-white/60" />
        </div>
        <div className="absolute bottom-32 left-16 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center animate-float animation-delay-2000">
          <Target className="w-7 h-7 text-white/60" />
        </div>
        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center animate-float animation-delay-4000">
          <Award className="w-6 h-6 text-white/60" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="inline-flex items-center gap-2 glass-effect text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg backdrop-blur-md bg-white/20 border border-white/30">
              <Award className="w-4 h-4" />
              Transform Your Financial Future
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            Master Money.<br />
            Build Wealth.<br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Live Better.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
            FinBridge combines personalized learning, smart simulations, and behavioral insights to transform how you understand and manage money.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 shadow-2xl px-8 py-6 text-lg group font-semibold">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/50 glass-effect text-white hover:bg-white/20 px-8 py-6 text-lg shadow-xl backdrop-blur-sm">
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
                className="flex items-center gap-2 glass-effect text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/30"
              >
                <feature.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent z-10" />
    </section>
  );
};

export default Hero;
