
import { 
  MessageSquare, Image, Code, Database, LineChart, 
  Bookmark, PenTool, Video, Music, Sparkles 
} from "lucide-react";
import { Link } from "react-router-dom";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

export function CategorySection() {
  const categories: Category[] = [
    { 
      id: "chatbots", 
      name: "AI Chatbots", 
      icon: MessageSquare, 
      count: 45, 
      color: "from-blue-500 to-cyan-300",
      gradientFrom: "from-blue-500/10",
      gradientTo: "to-blue-300/5"
    },
    { 
      id: "image-generation", 
      name: "Image Generation", 
      icon: Image, 
      count: 38, 
      color: "from-pink-500 to-rose-300",
      gradientFrom: "from-pink-500/10", 
      gradientTo: "to-rose-300/5"
    },
    { 
      id: "code-assistants", 
      name: "Code Assistants", 
      icon: Code, 
      count: 32, 
      color: "from-indigo-500 to-purple-300",
      gradientFrom: "from-indigo-500/10", 
      gradientTo: "to-purple-300/5"
    },
    { 
      id: "data-analysis", 
      name: "Data Analysis", 
      icon: Database, 
      count: 29, 
      color: "from-amber-500 to-yellow-300",
      gradientFrom: "from-amber-500/10", 
      gradientTo: "to-yellow-300/5"
    },
    { 
      id: "writing", 
      name: "Writing & Content", 
      icon: PenTool, 
      count: 41, 
      color: "from-emerald-500 to-green-300",
      gradientFrom: "from-emerald-500/10", 
      gradientTo: "to-green-300/5"
    },
    { 
      id: "productivity", 
      name: "Productivity", 
      icon: Sparkles, 
      count: 35, 
      color: "from-violet-500 to-purple-300",
      gradientFrom: "from-violet-500/10", 
      gradientTo: "to-purple-300/5"
    },
    { 
      id: "video", 
      name: "Video Creation", 
      icon: Video, 
      count: 26, 
      color: "from-red-500 to-orange-300",
      gradientFrom: "from-red-500/10", 
      gradientTo: "to-orange-300/5"
    },
    { 
      id: "audio", 
      name: "Audio & Music", 
      icon: Music, 
      count: 23, 
      color: "from-sky-500 to-blue-300",
      gradientFrom: "from-sky-500/10", 
      gradientTo: "to-blue-300/5"
    },
    { 
      id: "research", 
      name: "Research Tools", 
      icon: Bookmark, 
      count: 21, 
      color: "from-teal-500 to-emerald-300",
      gradientFrom: "from-teal-500/10", 
      gradientTo: "to-emerald-300/5"
    },
    { 
      id: "marketing", 
      name: "Marketing & SEO", 
      icon: LineChart, 
      count: 30, 
      color: "from-fuchsia-500 to-pink-300",
      gradientFrom: "from-fuchsia-500/10", 
      gradientTo: "to-pink-300/5"
    },
  ];

  return (
    <GradientBackground variant="subtle" className="section-padding" interactive>
      <div className="container-wide">
        <MotionWrapper animation="fadeIn">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary px-4 py-1.5">
              <Sparkles size={14} className="mr-1.5 animate-pulse" />
              Browse by Category
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Find the Perfect Tool for Your Needs
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Browse our comprehensive collection of AI tools organized by category to find exactly what you need
            </p>
          </div>
        </MotionWrapper>

        <MotionWrapper animation="fadeIn" delay="delay-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/tools?category=${category.id}`}
                className="group"
              >
                <GlassCard 
                  animation="none"
                  className={cn(
                    "flex flex-col items-center p-6 relative overflow-hidden",
                    "after:absolute after:inset-0 after:bg-gradient-to-br",
                    `after:${category.color}`,
                    "after:opacity-0 after:-z-10 after:transition-opacity after:duration-300",
                    "group-hover:after:opacity-5",
                    "before:absolute before:inset-0 before:bg-gradient-to-br",
                    `before:${category.gradientFrom} before:${category.gradientTo}`,
                    "before:opacity-0 before:-z-10 before:blur-xl before:scale-150",
                    "before:transition-opacity before:duration-300 group-hover:before:opacity-100"
                  )}
                >
                  <div className={cn(
                    "rounded-full p-3 bg-white/80 dark:bg-black/40 text-primary shadow-sm",
                    "group-hover:scale-110 transition-all duration-500 relative"
                  )}>
                    <category.icon size={24} className="transition-all duration-500 group-hover:rotate-6" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary animate-ping opacity-0 group-hover:opacity-70"></span>
                  </div>
                  <h3 className="mt-4 font-medium text-center group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <span className="mt-1 text-sm text-muted-foreground">
                    {category.count} tools
                  </span>
                  <div className="absolute bottom-2 right-2 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight size={14} className="text-primary" />
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </MotionWrapper>

        <MotionWrapper animation="fadeIn" delay="delay-300" className="mt-10 text-center">
          <Link 
            to="/tools" 
            className="inline-flex items-center gap-2 text-primary relative group after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full"
          >
            View all categories
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </MotionWrapper>
      </div>
    </GradientBackground>
  );
}
