
import { 
  MessageSquare, Image, Code, Database, LineChart, 
  Bookmark, PenTool, Video, Music, Sparkles 
} from "lucide-react";
import { Link } from "react-router-dom";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  color: string;
}

export function CategorySection() {
  const categories: Category[] = [
    { id: "chatbots", name: "AI Chatbots", icon: MessageSquare, count: 45, color: "from-blue-500 to-cyan-300" },
    { id: "image-generation", name: "Image Generation", icon: Image, count: 38, color: "from-pink-500 to-rose-300" },
    { id: "code-assistants", name: "Code Assistants", icon: Code, count: 32, color: "from-indigo-500 to-purple-300" },
    { id: "data-analysis", name: "Data Analysis", icon: Database, count: 29, color: "from-amber-500 to-yellow-300" },
    { id: "writing", name: "Writing & Content", icon: PenTool, count: 41, color: "from-emerald-500 to-green-300" },
    { id: "productivity", name: "Productivity", icon: Sparkles, count: 35, color: "from-violet-500 to-purple-300" },
    { id: "video", name: "Video Creation", icon: Video, count: 26, color: "from-red-500 to-orange-300" },
    { id: "audio", name: "Audio & Music", icon: Music, count: 23, color: "from-sky-500 to-blue-300" },
    { id: "research", name: "Research Tools", icon: Bookmark, count: 21, color: "from-teal-500 to-emerald-300" },
    { id: "marketing", name: "Marketing & SEO", icon: LineChart, count: 30, color: "from-fuchsia-500 to-pink-300" },
  ];

  return (
    <GradientBackground variant="subtle" className="section-padding">
      <div className="container-wide">
        <MotionWrapper animation="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Explore by Category</h2>
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
                    "group-hover:after:opacity-5"
                  )}
                >
                  <div className={cn(
                    "rounded-full p-3 bg-white/80 dark:bg-black/40 text-primary shadow-sm",
                    "group-hover:scale-110 transition-transform duration-300"
                  )}>
                    <category.icon size={24} />
                  </div>
                  <h3 className="mt-4 font-medium text-center group-hover:text-primary transition-colors">{category.name}</h3>
                  <span className="mt-1 text-sm text-muted-foreground">{category.count} tools</span>
                </GlassCard>
              </Link>
            ))}
          </div>
        </MotionWrapper>

        <MotionWrapper animation="fadeIn" delay="delay-300" className="mt-10 text-center">
          <Link 
            to="/tools" 
            className="inline-flex items-center gap-2 text-primary relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            View all categories
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </MotionWrapper>
      </div>
    </GradientBackground>
  );
}

import { ArrowRight } from "lucide-react";
