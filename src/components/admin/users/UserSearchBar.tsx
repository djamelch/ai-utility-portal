
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { 
  CommandDialog, 
  CommandInput, 
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface UserSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  suggestions?: Array<{id: string; email: string}>;
}

export function UserSearchBar({ 
  searchTerm, 
  onSearchChange, 
  suggestions = []
}: UserSearchBarProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Array<{id: string; email: string}>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.length > 1 && suggestions.length > 0) {
      console.log("UserSearchBar: Filtering suggestions for:", inputValue);
      const filtered = suggestions.filter(user => 
        user.email.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      console.log("UserSearchBar: Filtered suggestions:", filtered);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions]);

  // Handle clicks outside the suggestions dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Show dialog on / press
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearchChange(value);
  };

  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelectSuggestion = (value: string) => {
    setInputValue(value);
    onSearchChange(value);
    setShowSuggestions(false);
    setOpen(false);
  };

  return (
    <div className="relative w-64">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users... (Press / to focus)"
          className="pl-8 pr-8"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => {
            if (inputValue.length > 1 && filteredSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowSuggestions(false);
            } else if (e.key === "ArrowDown" && showSuggestions) {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        {inputValue && (
          <button 
            onClick={handleClear}
            className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {/* Real-time suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute left-0 right-0 top-full z-10 mt-1 bg-background border border-input rounded-md shadow-md"
          >
            <ul className="py-1">
              {filteredSuggestions.map((suggestion) => (
                <li 
                  key={suggestion.id} 
                  className="px-3 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                  onClick={() => handleSelectSuggestion(suggestion.email)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {suggestion.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search users..." 
          value={inputValue}
          onValueChange={(value) => {
            setInputValue(value);
            onSearchChange(value);
          }}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion.id}
                  onSelect={() => handleSelectSuggestion(suggestion.email)}
                  className="cursor-pointer"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {suggestion.email}
                </CommandItem>
              ))
            ) : (
              <CommandItem>Start typing to see suggestions</CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
