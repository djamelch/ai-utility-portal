
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchSuggestions, SearchSuggestion } from "@/hooks/useSearchSuggestions";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch?: (searchTerm: string) => void;
  redirectToTools?: boolean;
  initialValue?: string;
  className?: string;
  showIcon?: boolean;
  buttonText?: string | null;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "header" | "hero";
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  placeholder = "Search for AI tools...",
  onSearch,
  redirectToTools = true,
  initialValue = "",
  className = "",
  showIcon = true,
  buttonText = "Search",
  size = "md",
  variant = "default"
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string; count: number }[]>([]);
  const [pricingOptions, setPricingOptions] = useState<string[]>([]);
  
  // Fetch categories and pricing options for suggestions
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.rpc('get_primary_task_counts');
      
      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }
      
      if (data) {
        const formattedCategories = data.map((item: any) => ({
          id: item.primary_task,
          name: item.primary_task,
          count: item.count || 0
        }));
        
        setCategories(formattedCategories);
      }
    };
    
    const fetchPricingOptions = async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("pricing")
        .not('pricing', 'is', null);
        
      if (error) {
        console.error("Error fetching pricing options:", error);
        return;
      }
      
      if (data) {
        const uniquePricingOptions = [
          ...new Set(data.map((tool) => tool.pricing)),
        ].filter(Boolean) as string[];
        
        setPricingOptions(uniquePricingOptions);
      }
    };
    
    fetchCategories();
    fetchPricingOptions();
  }, []);

  // Using our custom hook for search suggestions
  const {
    showSuggestions,
    setShowSuggestions,
    suggestions,
    setInputRef,
    setSuggestionsRef
  } = useSearchSuggestions({
    searchTerm,
    categories,
    pricingOptions,
    minChars: 1
  });

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "category") {
      navigate(`/tools?category=${suggestion.value}`);
    } else if (suggestion.type === "pricing") {
      navigate(`/tools?pricing=${suggestion.value}`);
    } else {
      setSearchTerm(suggestion.value);
      handleSearch(suggestion.value);
    }
    setShowSuggestions(false);
  };

  // Handle search submission
  const handleSearch = async (term: string = searchTerm) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    
    try {
      if (onSearch) {
        onSearch(term);
      } else if (redirectToTools) {
        navigate(`/tools?search=${encodeURIComponent(term.trim())}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      handleSearch();
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Clear search
  const handleClear = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  // Determine size and variant classes
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10", 
    lg: "h-12 text-lg"
  };
  
  const inputSizeClass = sizeClasses[size];
  
  const buttonSizeClass = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-12 px-6 text-lg"
  }[size];

  const containerClasses = {
    default: "bg-background border border-input rounded-md shadow-sm",
    header: "bg-background/95 backdrop-blur-sm border border-input/50 rounded-md shadow-sm",
    hero: "bg-background/80 backdrop-blur-sm border border-input shadow-lg rounded-lg"
  }[variant];

  const inputClasses = {
    default: "border-0 focus-visible:ring-0 bg-transparent",
    header: "border-0 focus-visible:ring-0 bg-transparent text-sm",
    hero: "border-0 focus-visible:ring-0 bg-transparent font-medium"
  }[variant];

  return (
    <div className={`relative ${className}`}>
      <div className={`flex w-full items-center overflow-hidden transition-all duration-200 hover:shadow-md ${containerClasses}`}>
        <div className="relative flex-grow">
          <Input
            ref={setInputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 1 && setShowSuggestions(true)}
            onKeyDown={handleKeyPress}
            className={`${inputClasses} ${inputSizeClass} ${showIcon ? 'pl-10' : 'pl-3'} ${searchTerm && !isLoading ? 'pr-8' : 'pr-3'}`}
            disabled={isLoading}
          />
          
          {showIcon && (
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          )}

          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}

          {searchTerm && !isLoading && (
            <button 
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {buttonText !== null && (
          <Button 
            onClick={() => handleSearch()} 
            className={`ml-2 ${buttonSizeClass}`}
            disabled={!searchTerm.trim() || isLoading}
            variant={variant === "hero" ? "default" : "secondary"}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              buttonText || "Search"
            )}
          </Button>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div ref={setSuggestionsRef}>
          <SearchSuggestions 
            suggestions={suggestions}
            onSelectSuggestion={handleSelectSuggestion}
          />
        </div>
      )}
    </div>
  );
};
