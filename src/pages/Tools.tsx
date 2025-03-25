
import { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { supabase } from "@/integrations/supabase/client";

const Tools = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [pricing, setPricing] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [categories, setCategories] = useState<string[]>([]);
  const [pricingOptions, setPricingOptions] = useState<string[]>([]);

  useEffect(() => {
    // Fetch available categories
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('primary_task')
          .not('primary_task', 'is', null);
        
        if (error) throw error;
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(
          data.map(item => item.primary_task).filter(Boolean)
        ));
        
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    // Fetch available pricing options
    const fetchPricing = async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('pricing')
          .not('pricing', 'is', null);
        
        if (error) throw error;
        
        // Extract unique pricing options
        const uniquePricing = Array.from(new Set(
          data.map(item => item.pricing).filter(Boolean)
        ));
        
        setPricingOptions(uniquePricing);
      } catch (error) {
        console.error('Error fetching pricing options:', error);
      }
    };
    
    fetchCategories();
    fetchPricing();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via the input change event
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setPricing("");
    setSortBy("featured");
  };

  const hasActiveFilters = searchQuery || category || pricing || sortBy !== "featured";

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
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    placeholder="Search for tools..."
                    className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2"
                >
                  <Filter size={18} />
                  Filters
                </button>
                
                <div className="hidden md:flex items-center gap-3">
                  <select 
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  
                  <select 
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value)}
                  >
                    <option value="">All Pricing</option>
                    {pricingOptions.map((price) => (
                      <option key={price} value={price}>
                        {price}
                      </option>
                    ))}
                  </select>
                  
                  <select 
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </form>
              
              {/* Mobile filters */}
              {showFilters && (
                <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
                  <select 
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  
                  <select 
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value)}
                  >
                    <option value="">All Pricing</option>
                    {pricingOptions.map((price) => (
                      <option key={price} value={price}>
                        {price}
                      </option>
                    ))}
                  </select>
                  
                  <select 
                    className="col-span-2 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              )}
              
              {/* Active filters */}
              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {searchQuery && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Search: {searchQuery}
                      <button aria-label="Remove filter" onClick={() => setSearchQuery("")}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {category && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Category: {category}
                      <button aria-label="Remove filter" onClick={() => setCategory("")}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {pricing && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Pricing: {pricing}
                      <button aria-label="Remove filter" onClick={() => setPricing("")}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {sortBy !== "featured" && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Sort: {sortBy === "newest" ? "Newest" : "Most Popular"}
                      <button aria-label="Remove filter" onClick={() => setSortBy("featured")}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  <button 
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </MotionWrapper>
          
          <MotionWrapper animation="fadeIn" delay="delay-300">
            <div className="mb-6 flex items-center justify-between">
              <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <SlidersHorizontal size={16} />
                Advanced filters
              </button>
            </div>
            
            {/* Tools Grid */}
            <ToolGrid 
              searchQuery={searchQuery}
              category={category}
              pricing={pricing}
              sortBy={sortBy}
            />
          </MotionWrapper>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tools;
