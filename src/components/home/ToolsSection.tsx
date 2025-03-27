
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { ToolGrid } from "@/components/tools/ToolGrid";

interface ToolsSectionProps {
  title: string;
  description: string;
  queryType: "featured" | "top-rated" | "recent";
  limit?: number;
}

export function ToolsSection({ 
  title, 
  description, 
  queryType,
  limit = 8 
}: ToolsSectionProps) {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <MotionWrapper animation="fadeIn">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
              <p className="mt-2 text-muted-foreground">
                {description}
              </p>
            </div>
            <Link 
              href="/tools" 
              className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>
        </MotionWrapper>
        
        <ToolGrid queryType={queryType} limit={limit} />
        
        <div className="mt-10 text-center sm:hidden">
          <Link 
            href="/tools" 
            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            View all tools
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
