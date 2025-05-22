
import { useState, useEffect, useRef } from "react";

export interface SearchSuggestion {
  type: "tool" | "category" | "pricing";
  text: string;
  value: string;
}

interface UseSearchSuggestionsProps {
  searchTerm: string;
  categories?: { id: string; name: string; count: number }[];
  pricingOptions?: string[];
  toolSuggestions?: string[];
  minChars?: number;
}

export function useSearchSuggestions({
  searchTerm,
  categories = [],
  pricingOptions = [],
  toolSuggestions = [
    "ChatGPT", "Midjourney", "Jasper", "Dall-E", "GitHub Copilot", 
    "Notion AI", "Otter.ai", "Synthesia", "RunwayML", "Murf.ai"
  ],
  minChars = 2
}: UseSearchSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  // Generate search suggestions based on input
  useEffect(() => {
    if (searchTerm.length >= minChars) {
      console.log("Generating suggestions for:", searchTerm);
      
      // Generate suggestions based on categories
      const categorySuggestions: SearchSuggestion[] = categories
        .filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(cat => ({
          type: "category",
          text: `${cat.name} (${cat.count})`,
          value: cat.id
        }));
      
      // Generate suggestions based on pricing
      const pricingSuggestions: SearchSuggestion[] = pricingOptions
        .filter(price => price.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(price => ({
          type: "pricing",
          text: `${price}`,
          value: price
        }));
      
      // Generate tool suggestions
      const filteredToolSuggestions: SearchSuggestion[] = toolSuggestions
        .filter(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(tool => ({
          type: "tool",
          text: tool,
          value: tool
        }));
      
      // Combine and limit suggestions
      const allSuggestions = [
        ...filteredToolSuggestions.slice(0, 4),
        ...categorySuggestions.slice(0, 3),
        ...pricingSuggestions.slice(0, 2)
      ];
      
      console.log("All suggestions:", allSuggestions);
      setSuggestions(allSuggestions);
      
      // Only show suggestions when we have something to show
      setShowSuggestions(allSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, categories, pricingOptions, toolSuggestions, minChars]);

  // Setup event handlers for clicks outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) && 
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const setInputRef = (ref: HTMLInputElement | null) => {
    searchInputRef.current = ref;
  };

  const setSuggestionsRef = (ref: HTMLDivElement | null) => {
    suggestionsRef.current = ref;
  };

  return {
    showSuggestions,
    setShowSuggestions,
    suggestions,
    setInputRef,
    setSuggestionsRef,
    searchInputRef,
    suggestionsRef
  };
}
