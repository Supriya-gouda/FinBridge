import { TrendingUp, Users, Award, Target } from "lucide-react";

const stats = [
  { icon: Users, value: "10K+", label: "Active Learners" },
  { icon: Award, value: "50K+", label: "Badges Earned" },
  { icon: Target, value: "95%", label: "Goal Achievement" },
  { icon: TrendingUp, value: "3x", label: "Savings Growth" }
];

const Stats = () => {
  return (
    <section className="py-24 gradient-hero relative overflow-hidden animate-gradient">
      {/* Enhanced Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 rounded-full glass-effect flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-glow transition-all group-hover:scale-110">
                <stat.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2 group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-primary-foreground/90 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
