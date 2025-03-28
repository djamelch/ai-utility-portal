
import { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { supabase } from "@/integrations/supabase/client";
import { PageLoadingWrapper } from "@/components/ui/PageLoadingWrapper";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Tools = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [pricing, setPricing] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Fetch categories and pricing options
  const { 
    data: categories = [], 
    isLoading: isCategoriesLoading, 
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('primary_task')
          .not('primary_task', 'is', null);
        
        if (error) throw error;
        
        // Extract unique categories
        return Array.from(new Set(
          data.map(item => item.primary_task).filter(Boolean)
        ));
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000
  });
  
  const { 
    data: pricingOptions = [], 
    isLoading: isPricingLoading,
    error: pricingError,
    refetch: refetchPricing
  } = useQuery({
    queryKey: ["pricing"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('pricing')
          .not('pricing', 'is', null);
        
        if (error) throw error;
        
        // Extract unique pricing options
        return Array.from(new Set(
          data.map(item => item.pricing).filter(Boolean)
        ));
      } catch (error) {
        console.error('Error fetching pricing options:', error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000
  });

  const isLoading = isCategoriesLoading || isPricingLoading;
  const hasError = categoriesError || pricingError;

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

  const retryFetching = () => {
    refetchCategories();
    refetchPricing();
  };

  return (
    <PageLoadingWrapper isLoading={isLoading && !hasError} loadingText="جاري تحميل دليل الأدوات...">
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container-wide">
            <MotionWrapper animation="fadeIn">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">
                  دليل أدوات الذكاء الاصطناعي
                </h1>
                <p className="mt-2 text-muted-foreground">
                  اكتشف أفضل أدوات الذكاء الاصطناعي لكل احتياجاتك
                </p>
              </div>
            </MotionWrapper>
            
            {hasError ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>خطأ في التحميل</AlertTitle>
                <AlertDescription>
                  حدث خطأ أثناء تحميل بيانات الفلاتر. يرجى المحاولة مرة أخرى لاحقاً.
                  <Button 
                    onClick={retryFetching} 
                    variant="outline" 
                    size="sm" 
                    className="mr-2 mt-2"
                  >
                    إعادة المحاولة
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <MotionWrapper animation="fadeIn" delay="delay-200">
                {/* Search and Filters */}
                <div className="mb-8">
                  <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      <input
                        type="text"
                        placeholder="البحث عن أدوات..."
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
                      الفلاتر
                    </button>
                    
                    <div className="hidden md:flex items-center gap-3">
                      <select 
                        className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">كل الفئات</option>
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
                        <option value="">كل التسعيرات</option>
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
                        <option value="featured">المميزة</option>
                        <option value="newest">الأحدث</option>
                        <option value="popular">الأكثر شعبية</option>
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
                        <option value="">كل الفئات</option>
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
                        <option value="">كل التسعيرات</option>
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
                        <option value="featured">المميزة</option>
                        <option value="newest">الأحدث</option>
                        <option value="popular">الأكثر شعبية</option>
                      </select>
                    </div>
                  )}
                  
                  {/* Active filters */}
                  {hasActiveFilters && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {searchQuery && (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          البحث: {searchQuery}
                          <button aria-label="إزالة الفلتر" onClick={() => setSearchQuery("")}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      {category && (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          الفئة: {category}
                          <button aria-label="إزالة الفلتر" onClick={() => setCategory("")}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      {pricing && (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          التسعير: {pricing}
                          <button aria-label="إزالة الفلتر" onClick={() => setPricing("")}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      {sortBy !== "featured" && (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          الترتيب: {sortBy === "newest" ? "الأحدث" : "الأكثر شعبية"}
                          <button aria-label="إزالة الفلتر" onClick={() => setSortBy("featured")}>
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
                        إزالة جميع الفلاتر
                      </button>
                    </div>
                  )}
                </div>
              </MotionWrapper>
            )}
            
            <MotionWrapper animation="fadeIn" delay="delay-300">
              <div className="mb-6 flex items-center justify-between">
                <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <SlidersHorizontal size={16} />
                  فلاتر متقدمة
                </button>
              </div>
              
              {/* Tools Grid - Update to use the renamed props */}
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
    </PageLoadingWrapper>
  );
};

export default Tools;
