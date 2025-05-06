
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Zap, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { CheckCircle, ArrowRight, Sparkles, Target } from "lucide-react";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface HeroSearchProps {
  categories: Category[];
  pricingOptions: string[];
}

export function HeroSearch({ categories, pricingOptions }: HeroSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPricing, setSelectedPricing] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    
    if (searchTerm) {
      queryParams.append("search", searchTerm);
    }
    
    if (selectedCategory && selectedCategory !== "all") {
      queryParams.append("category", selectedCategory);
    }
    
    if (selectedPricing && selectedPricing !== "all") {
      queryParams.append("pricing", selectedPricing);
    }
    
    if (sortOrder && sortOrder !== "newest") {
      queryParams.append("sortBy", sortOrder);
    }
    
    if (selectedFeatures.length > 0) {
      queryParams.append("features", selectedFeatures.join(','));
    }
    
    navigate(`/tools?${queryParams.toString()}`);
  };
  
  const handleFeatureToggle = (features: string[]) => {
    setSelectedFeatures(features);
  };
  
  return (
    <MotionWrapper animation="fadeIn" delay="delay-200" className="mt-8 md:mt-12">
      <div className="flex flex-col md:flex-row gap-3 mx-auto max-w-xl">
        <div className="relative flex-1 flex rounded-md border border-input bg-background/80 backdrop-blur-sm shadow-sm overflow-hidden group transition-all duration-300 hover:border-primary/50 hover:shadow-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Search for AI tools..."
            className="flex-1 pl-10 rounded-l-md border-0 focus-visible:ring-0 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          
          <div className="border-l border-input min-w-[140px]">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-0 focus:ring-0 rounded-l-none bg-transparent">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          className="px-6 relative overflow-hidden group" 
          onClick={handleSearch}
        >
          <span className="relative z-10 flex items-center">
            Search
            <Zap size={18} className="ml-2 transition-all group-hover:rotate-12" />
          </span>
          <span className="absolute inset-0 bg-primary-foreground/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></span>
        </Button>
      </div>
      
      <Collapsible 
        open={showAdvancedFilters} 
        onOpenChange={setShowAdvancedFilters}
        className="mt-4 max-w-xl mx-auto transition-all duration-300 ease-in-out"
      >
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full group hover:border-primary/50 transition-all duration-300"
          >
            <Filter size={16} className="mr-2 transition-transform group-hover:rotate-45 duration-300" />
            {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 bg-background/60 backdrop-blur-sm p-4 rounded-lg border border-input animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Pricing</label>
              <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select pricing" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-sm">
                  <SelectItem value="all">All Pricing</SelectItem>
                  {pricingOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-sm">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="top-rated">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Tool Features</label>
            <ToggleGroup type="multiple" value={selectedFeatures} onValueChange={handleFeatureToggle} className="flex flex-wrap gap-2">
              <ToggleGroupItem value="api-access" className="text-xs group">
                <Zap size={12} className="mr-1 group-data-[state=on]:text-primary" /> API Access
              </ToggleGroupItem>
              <ToggleGroupItem value="free-trial" className="text-xs group">
                <CheckCircle size={12} className="mr-1 group-data-[state=on]:text-primary" /> Free Trial
              </ToggleGroupItem>
              <ToggleGroupItem value="no-signup" className="text-xs group">
                <ArrowRight size={12} className="mr-1 group-data-[state=on]:text-primary" /> No Signup
              </ToggleGroupItem>
              <ToggleGroupItem value="mobile-friendly" className="text-xs group">
                <Sparkles size={12} className="mr-1 group-data-[state=on]:text-primary" /> Mobile Friendly
              </ToggleGroupItem>
              <ToggleGroupItem value="browser-extension" className="text-xs group">
                <Target size={12} className="mr-1 group-data-[state=on]:text-primary" /> Browser Extension
              </ToggleGroupItem>
              <ToggleGroupItem value="offline-mode" className="text-xs group">
                <CheckCircle size={12} className="mr-1 group-data-[state=on]:text-primary" /> Offline Mode
              </ToggleGroupItem>
              <ToggleGroupItem value="team-collaboration" className="text-xs group">
                <Sparkles size={12} className="mr-1 group-data-[state=on]:text-primary" /> Team Collaboration
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <Button size="sm" onClick={handleSearch} className="w-full group">
            <span className="relative z-10 flex items-center">
              Apply Filters
              <Filter size={14} className="ml-2 transition-all group-hover:scale-110" />
            </span>
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </MotionWrapper>
  );
}
