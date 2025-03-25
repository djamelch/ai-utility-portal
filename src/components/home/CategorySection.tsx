
import { 
  MessageSquare, Image, Code, Database, LineChart, 
  Bookmark, PenTool, Video, Music, Sparkles 
} from "lucide-react";
import { Link } from "react-router-dom";
import { MotionWrapper } from "@/components/ui/MotionWrapper";

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
}

export function CategorySection() {
  const categories: Category[] = [
    { id: "chatbots", name: "AI Chatbots", icon: MessageSquare, count: 45 },
    { id: "image-generation", name: "Image Generation", icon: Image, count: 38 },
    { id: "code-assistants", name: "Code Assistants", icon: Code, count: 32 },
    { id: "data-analysis", name: "Data Analysis", icon: Database, count: 29 },
    { id: "writing", name: "Writing & Content", icon: PenTool, count: 41 },
    { id: "productivity", name: "Productivity", icon: Sparkles, count: 35 },
    { id: "video", name: "Video Creation", icon: Video, count: 26 },
    { id: "audio", name: "Audio & Music", icon: Music, count: 23 },
    { id: "research", name: "Research Tools", icon: Bookmark, count: 21 },
    { id: "marketing", name: "Marketing & SEO", icon: LineChart, count: 30 },
  ];

  return (
    <section className="section-padding bg-secondary/30 dark:bg-transparent">
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
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/tools?category=${category.id}`}
                className="flex flex-col items-center p-6 rounded-xl bg-background border border-border/40 hover:shadow-card hover:-translate-y-1 transition-all duration-300"
              >
                <div className="rounded-full p-3 bg-primary/10 text-primary">
                  <category.icon size={24} />
                </div>
                <h3 className="mt-4 font-medium text-center">{category.name}</h3>
                <span className="mt-1 text-sm text-muted-foreground">{category.count} tools</span>
              </Link>
            ))}
          </div>
        </MotionWrapper>

        <MotionWrapper animation="fadeIn" delay="delay-300" className="mt-10 text-center">
          <Link 
            to="/tools" 
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            View all categories
            <ArrowRight size={16} />
          </Link>
        </MotionWrapper>
      </div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
