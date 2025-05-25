
import { Search, Tag as TagIcon, Zap, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  // Group suggestions by type
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "category":
        return <TagIcon className="h-4 w-4 text-primary" />;
      case "pricing":
        return <Zap className="h-4 w-4 text-amber-500" />;
      case "tool":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSectionTitle = (type: string) => {
    switch (type) {
      case "category":
        return "Categories";
      case "pricing":
        return "Pricing Options";
      case "tool":
        return "Popular Tools";
      default:
        return "Suggestions";
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "category":
        return <TagIcon className="h-4 w-4 text-primary" />;
      case "pricing":
        return <Zap className="h-4 w-4 text-amber-500" />;
      case "tool":
        return <Search className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div 
      className={`absolute left-0 right-0 top-full z-50 mt-2 bg-background/98 backdrop-blur-md border border-input rounded-lg shadow-xl animate-in fade-in-50 slide-in-from-top-2 duration-200 ${className}`}
    >
      <div className="py-2 max-h-[400px] overflow-y-auto">
        {Object.entries(groupedSuggestions).map(([type, typeSuggestions], groupIndex) => (
          <div key={type}>
            {groupIndex > 0 && <Separator className="my-2" />}
            
            {/* Section Header */}
            <div className="px-3 py-2 flex items-center gap-2">
              {getSectionIcon(type)}
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {getSectionTitle(type)}
              </span>
              <Badge variant="secondary" className="text-xs">
                {typeSuggestions.length}
              </Badge>
            </div>
            
            {/* Suggestions List */}
            <div className="space-y-1 px-1">
              {typeSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full px-3 py-2.5 hover:bg-accent/80 cursor-pointer text-sm flex items-center gap-3 transition-all duration-150 rounded-md group"
                  onClick={() => onSelectSuggestion(suggestion)}
                >
                  <div className="flex-shrink-0">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  
                  <div className="flex-grow text-left">
                    <span className="group-hover:text-primary transition-colors">
                      {suggestion.text}
                    </span>
                  </div>
                  
                  {suggestion.type === "category" && (
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="text-xs">
                        Browse
                      </Badge>
                    </div>
                  )}
                  
                  {suggestion.type === "tool" && (
                    <div className="flex-shrink-0">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {/* Footer */}
        <div className="px-3 py-2 mt-2 border-t border-input/50">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Search className="h-3 w-3" />
            Press Enter to search or click any suggestion
          </p>
        </div>
      </div>
    </div>
  );
}
