
import { useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { MotionWrapper } from "@/components/ui/MotionWrapper";

const Tools = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container-wide">
          <MotionWrapper animation="fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">
                AI Tools Directory
              </h1>
              <p className="mt-2 text-muted-foreground">
                Discover the best AI-powered tools for every need
              </p>
            </div>
          </MotionWrapper>
          
          <MotionWrapper animation="fadeIn" delay="delay-200">
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    placeholder="Search for tools..."
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4"
                  />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2"
                >
                  <Filter size={18} />
                  Filters
                </button>
                
                <div className="hidden md:flex items-center gap-3">
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
              </div>
              
              {/* Mobile filters */}
              {showFilters && (
                <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
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
                  
                  <select className="col-span-2 rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Highest Rating</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                </div>
              )}
              
              {/* Active filters */}
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Featured
                  <button aria-label="Remove filter">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </MotionWrapper>
          
          <MotionWrapper animation="fadeIn" delay="delay-300">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">285</span> tools
              </p>
              
              <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <SlidersHorizontal size={16} />
                Advanced filters
              </button>
            </div>
            
            {/* Tools Grid */}
            <ToolGrid />
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-1">
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background hover:bg-secondary/50 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  1
                </button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background hover:bg-secondary/50 transition-colors">
                  2
                </button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background hover:bg-secondary/50 transition-colors">
                  3
                </button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background hover:bg-secondary/50 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tools;
