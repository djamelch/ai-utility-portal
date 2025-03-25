
import { useState } from "react";
import { Tool, ToolCard } from "./ToolCard";
import { MotionWrapper } from "@/components/ui/MotionWrapper";

// Sample data for tools
const sampleTools: Tool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "Advanced AI chatbot that can engage in conversational dialogue, answer questions, and provide detailed responses across a wide range of topics.",
    logo: "https://via.placeholder.com/80",
    category: "AI Chatbots",
    rating: 4.8,
    reviewCount: 1250,
    pricing: "Freemium",
    url: "https://chat.openai.com",
    isFeatured: true
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "Text-to-image AI that creates stunning artwork and photorealistic images from text descriptions provided by users.",
    logo: "https://via.placeholder.com/80",
    category: "Image Generation",
    rating: 4.7,
    reviewCount: 952,
    pricing: "Paid",
    url: "https://midjourney.com"
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    description: "AI pair programmer that helps you write code faster with real-time suggestions and auto-completion.",
    logo: "https://via.placeholder.com/80",
    category: "Code Assistants",
    rating: 4.6,
    reviewCount: 837,
    pricing: "Subscription",
    url: "https://github.com/features/copilot"
  },
  {
    id: "jasper-ai",
    name: "Jasper AI",
    description: "AI content platform that helps teams create high-quality content for marketing, sales, and customer support.",
    logo: "https://via.placeholder.com/80",
    category: "Writing",
    rating: 4.5,
    reviewCount: 723,
    pricing: "Paid",
    url: "https://jasper.ai"
  },
  {
    id: "descript",
    name: "Descript",
    description: "All-in-one audio and video editing platform with AI-powered features like transcript-based editing and voice generation.",
    logo: "https://via.placeholder.com/80",
    category: "Video",
    rating: 4.4,
    reviewCount: 591,
    pricing: "Freemium",
    url: "https://descript.com",
    isNew: true
  },
  {
    id: "lobe",
    name: "Lobe",
    description: "Machine learning made simple. Train models with a simple, visual interface without writing code.",
    logo: "https://via.placeholder.com/80",
    category: "Data Analysis",
    rating: 4.3,
    reviewCount: 478,
    pricing: "Free",
    url: "https://lobe.ai"
  },
  {
    id: "krisp",
    name: "Krisp",
    description: "AI-powered noise cancellation app that removes background noise and echo from your calls in real time.",
    logo: "https://via.placeholder.com/80",
    category: "Audio",
    rating: 4.6,
    reviewCount: 612,
    pricing: "Freemium",
    url: "https://krisp.ai"
  },
  {
    id: "copy-ai",
    name: "Copy.ai",
    description: "AI copywriting assistant that generates high-quality marketing copy, product descriptions, and social media content.",
    logo: "https://via.placeholder.com/80",
    category: "Writing",
    rating: 4.2,
    reviewCount: 543,
    pricing: "Freemium",
    url: "https://copy.ai"
  }
];

interface ToolGridProps {
  limit?: number;
  showFilters?: boolean;
  category?: string;
}

export function ToolGrid({ limit, showFilters = false, category }: ToolGridProps) {
  const [tools] = useState<Tool[]>(
    category
      ? sampleTools.filter((tool) => 
          tool.category.toLowerCase() === category.toLowerCase())
      : sampleTools
  );
  
  const displayTools = limit ? tools.slice(0, limit) : tools;

  return (
    <div>
      {showFilters && (
        <div className="mb-6 flex flex-wrap gap-3">
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Categories</option>
            <option value="ai-chatbots">AI Chatbots</option>
            <option value="image-generation">Image Generation</option>
            <option value="code-assistants">Code Assistants</option>
            <option value="data-analysis">Data Analysis</option>
            <option value="writing">Writing</option>
          </select>
          
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Pricing</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
            <option value="subscription">Subscription</option>
          </select>
          
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="rating">Highest Rating</option>
            <option value="reviews">Most Reviews</option>
          </select>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayTools.map((tool, index) => (
          <MotionWrapper 
            key={tool.id} 
            animation="fadeIn" 
            delay={`delay-${(index % 4) * 100}` as any}
          >
            <ToolCard tool={tool} />
          </MotionWrapper>
        ))}
      </div>
      
      {displayTools.length === 0 && (
        <div className="rounded-lg border border-border/40 bg-background p-8 text-center">
          <p className="text-muted-foreground">No tools found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
