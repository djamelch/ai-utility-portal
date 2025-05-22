
import { Search, Tag as TagIcon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchSuggestion {
  type: "tool" | "category" | "pricing";
  text: string;
  value: string;
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelectSuggestion: (suggestion: SearchSuggestion) => void;
  className?: string;
}

export function SearchSuggestions({ 
  suggestions, 
  onSelectSuggestion,
  className = "" 
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div 
      className={`absolute left-0 right-0 top-full z-20 mt-1 bg-background/95 backdrop-blur-sm border border-input rounded-md shadow-lg animate-in fade-in-50 slide-in-from-top-5 duration-200 ${className}`}
    >
      <ul className="py-1 max-h-[350px] overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <li 
            key={index} 
            className="px-3 py-2.5 hover:bg-accent cursor-pointer text-sm flex items-center gap-2 transition-colors"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {suggestion.type === "category" ? (
              <TagIcon className="h-4 w-4 text-primary" />
            ) : suggestion.type === "pricing" ? (
              <Zap className="h-4 w-4 text-amber-500" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
            <span>{suggestion.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
