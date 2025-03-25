
import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { MotionWrapper } from "@/components/ui/MotionWrapper";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient"></div>
      
      <div className="container-tight relative z-10">
        <MotionWrapper animation="fadeIn" className="text-center">
          <span className="inline-block rounded-full bg-secondary/80 px-4 py-1.5 text-sm font-medium text-foreground/80">
            Discover 300+ AI tools
          </span>
          
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Find the <span className="text-gradient">perfect AI tool</span> for your next project
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            AI Any Tool helps you discover, compare, and choose the best AI-powered tools for your specific needs
          </p>
        </MotionWrapper>
        
        {/* Search bar */}
        <MotionWrapper animation="fadeIn" delay="delay-200" className="mt-8 md:mt-12">
          <div className="relative flex mx-auto max-w-xl rounded-full border border-input bg-background shadow-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search for AI tools, categories, or use cases..."
              className="flex-1 rounded-full bg-transparent py-3 pl-12 pr-4 text-foreground focus:outline-none"
            />
            <button className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Search
            </button>
          </div>
        </MotionWrapper>
        
        {/* Featured tags */}
        <MotionWrapper animation="fadeIn" delay="delay-300" className="mt-8">
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {["AI Chatbots", "Image Generation", "Text to Speech", "Code Assistants", "Writing"].map((tag) => (
              <Link
                key={tag}
                to={`/tools?category=${tag}`}
                className="rounded-full bg-secondary/50 px-3 py-1 text-sm text-foreground/70 hover:bg-secondary/80 hover:text-foreground transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </MotionWrapper>
        
        {/* Featured metrics */}
        <MotionWrapper animation="fadeIn" delay="delay-400" className="mt-16">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: "300+", label: "AI Tools" },
              { value: "18", label: "Categories" },
              { value: "1000+", label: "Reviews" },
              { value: "Weekly", label: "Updates" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
