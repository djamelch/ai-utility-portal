
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
  const inputRef = useRef<HTMLInputElement>(null);

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
    setShowSuggestions(value.length > 0);
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
          onFocus={() => setShowSuggestions(inputValue.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
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
