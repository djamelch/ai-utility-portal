
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
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
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  placeholder = "Search for AI tools...",
  onSearch,
  redirectToTools = true,
  initialValue = "",
  className = "",
  showIcon = true,
  buttonText = "Search",
  size = "md"
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(initialValue);
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
  const handleSearch = (term: string = searchTerm) => {
    if (onSearch) {
      onSearch(term);
    } else if (redirectToTools && term.trim()) {
      navigate(`/tools?search=${encodeURIComponent(term.trim())}`);
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

  // Determine size classes
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10", 
    lg: "h-12 text-lg"
  };
  
  const inputSizeClass = sizeClasses[size];
  
  const buttonSizeClass = {
    sm: "h-8 px-3",
    md: "h-10 px-4",
    lg: "h-12 px-6"
  }[size];

  return (
    <div className={`relative ${className}`}>
      <div className="flex w-full items-center">
        <div className="relative flex-grow">
          <Input
            ref={setInputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 1 && setShowSuggestions(true)}
            onKeyDown={handleKeyPress}
            className={`pr-10 ${inputSizeClass} ${showIcon ? 'pl-10' : ''}`}
          />
          
          {showIcon && (
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          )}
        </div>
        
        {buttonText !== null && (
          <Button 
            onClick={() => handleSearch()} 
            className={`ml-2 ${buttonSizeClass}`}
            disabled={!searchTerm.trim()}
          >
            {buttonText || "Search"}
          </Button>
        )}
      </div>
      
      {showSuggestions && (
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
