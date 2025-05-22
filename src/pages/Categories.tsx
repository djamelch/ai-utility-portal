
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Grid3X3, ListFilter, SortAsc, SortDesc, 
  LayoutGrid, List, FileText, Image, Code, MessageSquare,
  PenTool, Video, Zap, Database, Music, ChevronRight 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { ModernLoadingIndicator } from "@/components/ui/ModernLoadingIndicator";
import { SEOHead } from "@/components/seo/SEOHead";
import { Badge } from "@/components/ui/badge";
import { useSearchSuggestions, SearchSuggestion } from "@/hooks/useSearchSuggestions";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";

interface Category {
  id: string;
  name: string;
  count: number;
  description?: string;
  icon?: string;
}

// Map category names to icons
const getCategoryIcon = (name: string) => {
  const iconMap: Record<string, any> = {
    "Text Generation": FileText,
    "Image Generation": Image,
    "Code Generation": Code,
    "Chat": MessageSquare,
    "Writing": PenTool,
    "Video": Video,
    "Productivity": Zap,
    "Data Analysis": Database,
    "Audio": Music,
    // Add more mappings as needed
  };
  
  // Default to Grid3X3 if no icon is found
  return iconMap[name] || Grid3X3;
};

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"count" | "name">("count");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();
  
  const { 
    showSuggestions, 
    setShowSuggestions,
    suggestions, 
    setInputRef,
    setSuggestionsRef
  } = useSearchSuggestions({
    searchTerm,
    toolSuggestions: [] // No need for tool suggestions here
  });

  // Fetch all categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        // Replace with your actual category fetching logic
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("count", { ascending: false });
        
        if (error) throw error;
        
        // If no data returned from Supabase, use sample data
        if (!data || data.length === 0) {
          return sampleCategories;
        }
        
        return data as Category[];
      } catch (error) {
        console.error("Error fetching categories:", error);
        return sampleCategories;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Filter and sort categories based on search and sort options
  const filteredAndSortedCategories = categories
    .filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "count") {
        return sortOrder === "desc" ? b.count - a.count : a.count - b.count;
      } else {
        return sortOrder === "desc" 
          ? b.name.localeCompare(a.name) 
          : a.name.localeCompare(b.name);
      }
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic if needed
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);
  };

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    navigate(`/tools?category=${categoryId}`);
  };

  return (
    <>
      <SEOHead 
        title="AI Tool Categories - Browse by Type | AI Tools Directory" 
        description="Explore AI tools by category - text generation, image creation, code assistance, and more. Find the perfect AI tool for your specific needs."
        keywords="AI categories, AI tool types, AI tool categories, text generation, image generation, code AI"
      />
      
      <main className="min-h-screen pb-16">
        {/* Hero section with search */}
        <GradientBackground variant="primary" className="py-12 md:py-20" intensity="subtle">
          <div className="container-wide">
            <MotionWrapper animation="fadeIn">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4">
                Browse AI Tools by Category
              </h1>
              <p className="text-muted-foreground text-center md:text-lg max-w-2xl mx-auto mb-8">
                Explore our comprehensive collection of AI tools organized by category to find the perfect solution for your specific needs.
              </p>
              
              {/* Search form */}
              <div className="max-w-xl mx-auto">
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                      type="text"
                      placeholder="Search categories..."
                      className="pl-10 pr-4 py-6 rounded-lg bg-background/80 backdrop-blur-sm border-input shadow-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => {
                        if (searchTerm.length >= 2 && suggestions.length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setShowSuggestions(false);
                      }}
                      ref={(ref) => setInputRef(ref)}
                    />
                    
                    {/* Search suggestions */}
                    {showSuggestions && (
                      <div ref={(ref) => setSuggestionsRef(ref)}>
                        <SearchSuggestions
                          suggestions={suggestions}
                          onSelectSuggestion={handleSelectSuggestion}
                        />
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </MotionWrapper>
          </div>
        </GradientBackground>
        
        {/* Categories content */}
        <div className="container-wide mt-8 md:mt-12">
          {/* Controls and filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold">
              {filteredAndSortedCategories.length} Categories
            </h2>
            
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={(value: "count" | "name") => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-sm">
                  <SelectItem value="count">Sort by Tool Count</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                title={sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
              >
                {sortOrder === "asc" ? <SortAsc size={18} /> : <SortDesc size={18} />}
              </Button>
              
              <div className="flex items-center border border-input rounded-md bg-background/80">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                  title="Grid View"
                >
                  <LayoutGrid size={18} />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                  title="List View"
                >
                  <List size={18} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Categories display */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <ModernLoadingIndicator variant="dots" size="lg" text="Loading categories..." />
            </div>
          ) : filteredAndSortedCategories.length === 0 ? (
            <div className="text-center py-16">
              <Grid3X3 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-medium mb-2">No categories found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {filteredAndSortedCategories.map((category) => {
                const CategoryIcon = getCategoryIcon(category.name);
                return (
                  <MotionWrapper key={category.id} animation="fadeIn">
                    <Card 
                      className="h-full cursor-pointer hover:shadow-md transition-all hover:border-primary/30 group" 
                      onClick={() => handleCategoryClick(category.id, category.name)}
                    >
                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <CategoryIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {category.description || `Explore ${category.name} tools and find the best options for your needs.`}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center pt-2">
                        <Badge variant="outline">
                          {category.count} {category.count === 1 ? "Tool" : "Tools"}
                        </Badge>
                        <ChevronRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                      </CardFooter>
                    </Card>
                  </MotionWrapper>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {filteredAndSortedCategories.map((category) => {
                const CategoryIcon = getCategoryIcon(category.name);
                return (
                  <MotionWrapper key={category.id} animation="fadeIn">
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30 group"
                      onClick={() => handleCategoryClick(category.id, category.name)}
                    >
                      <div className="flex items-center p-4 gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <CategoryIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                            {category.name} 
                            <Badge variant="outline" className="ml-3">
                              {category.count} {category.count === 1 ? "Tool" : "Tools"}
                            </Badge>
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-1 mt-1">
                            {category.description || `Explore ${category.name} tools and find the best options for your needs.`}
                          </p>
                        </div>
                        <ChevronRight size={18} className="text-primary opacity-50 group-hover:opacity-100 transition-opacity transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Card>
                  </MotionWrapper>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// Sample categories data (fallback if Supabase fetch fails)
const sampleCategories: Category[] = [
  { id: "text-generation", name: "Text Generation", count: 45, description: "AI tools that generate human-like text, articles, stories, and other written content." },
  { id: "image-generation", name: "Image Generation", count: 38, description: "Create stunning images, art, and visual content using AI algorithms." },
  { id: "code-generation", name: "Code Generation", count: 24, description: "Tools that help developers write, debug, and optimize code efficiently." },
  { id: "chat", name: "Chat", count: 32, description: "Conversational AI systems for customer support, assistance, and information." },
  { id: "writing", name: "Writing", count: 29, description: "Advanced AI assistants for content creation, copywriting, and editing." },
  { id: "video", name: "Video", count: 18, description: "AI tools for video editing, generation, and enhancement." },
  { id: "productivity", name: "Productivity", count: 41, description: "Tools designed to increase efficiency and streamline workflows." },
  { id: "data-analysis", name: "Data Analysis", count: 22, description: "AI systems for processing, analyzing, and visualizing complex data." },
  { id: "audio", name: "Audio", count: 15, description: "Tools for speech recognition, music generation, and audio processing." },
  { id: "marketing", name: "Marketing", count: 27, description: "AI solutions for marketing automation, analytics, and campaign optimization." },
  { id: "design", name: "Design", count: 23, description: "Creative AI tools for graphic design, UI/UX, and visual content creation." },
  { id: "summarization", name: "Summarization", count: 12, description: "Tools that condense long-form content into concise summaries." },
  { id: "translation", name: "Translation", count: 9, description: "AI-powered language translation and localization tools." },
  { id: "research", name: "Research", count: 14, description: "AI assistants for academic and business research applications." },
  { id: "education", name: "Education", count: 19, description: "Learning tools and platforms enhanced by artificial intelligence." },
  { id: "finance", name: "Finance", count: 11, description: "AI tools for financial analysis, planning, and automation." },
];
