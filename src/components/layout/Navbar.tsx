
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Menu, X, Search, Moon, Sun, User, LogOut, Shield, LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  // Generate search suggestions based on input
  useEffect(() => {
    if (searchTerm.length > 1) {
      console.log("Navbar: Generating suggestions for:", searchTerm);
      
      // Sample tool suggestions (in a real app, you would fetch these from the database)
      const toolSuggestions = [
        "ChatGPT", "Midjourney", "Jasper", "Dall-E", "GitHub Copilot", 
        "Notion AI", "Otter.ai", "Synthesia", "RunwayML", "Murf.ai"
      ].filter(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(tool => `${tool}`);
      
      // Sample category suggestions
      const categorySuggestions = [
        "Text Generation", "Image Generation", "Audio Processing", "Video Creation", 
        "Content Writing", "Code Generation", "Data Analysis"
      ].filter(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(cat => `${cat} Tools`);
      
      // Combine and limit suggestions
      const allSuggestions = [
        ...toolSuggestions.slice(0, 3),
        ...categorySuggestions.slice(0, 2)
      ];
      
      console.log("Navbar: All suggestions:", allSuggestions);
      setSearchSuggestions(allSuggestions);
      
      // Only show suggestions when we have something to show
      setShowSuggestions(allSuggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Handle clicks outside the suggestions dropdown to close it
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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (searchTerm.trim()) {
      navigate(`/tools?search=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
      setIsCommandOpen(false);
    }
  };

  const handleSelectSuggestion = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(false);
    
    // If it ends with "Tools", then it's a category search
    if (value.endsWith(" Tools")) {
      const category = value.replace(" Tools", "");
      navigate(`/tools?category=${encodeURIComponent(category)}`);
    } else {
      navigate(`/tools?search=${encodeURIComponent(value)}`);
    }
    
    setIsSearchOpen(false);
    setIsCommandOpen(false);
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Tools", path: "/tools" },
    { title: "Blog", path: "/blog" },
    { title: "Submit Tool", path: "/submit-tool", isButton: true }
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-3 glass" : "py-5 bg-transparent",
        className
      )}
    >
      <nav className="container-wide flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold group">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:animate-logo-bounce">
              A
            </div>
            <span className="ml-2 bg-gradient-to-r from-purple-600 via-pink-600 to-primary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              AI Any<span className="font-extrabold">Tool</span>
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.title}>
                {link.isButton ? (
                  <Link to={link.path}>
                    <Button variant="default" size="sm" className="rounded-full group relative overflow-hidden">
                      <span className="relative z-10">{link.title}</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Button>
                  </Link>
                ) : (
                  <Link 
                    to={link.path} 
                    className="font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
                  >
                    {link.title}
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-4">
            <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
              <CommandInput 
                placeholder="Search AI tools..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((suggestion, index) => (
                      <CommandItem
                        key={index}
                        onSelect={() => handleSelectSuggestion(suggestion)}
                        className="cursor-pointer"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        {suggestion}
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem>Start typing to see suggestions</CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </CommandDialog>

            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <button 
                  aria-label="Search" 
                  className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsCommandOpen(true)}
                >
                  <Search size={20} />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Search AI Tools</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSearch} className="flex items-center space-x-2 mt-4 relative">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      type="text"
                      placeholder="Search AI Tools..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => {
                        if (searchTerm.length > 1 && searchSuggestions.length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                        if (e.key === "Escape") setShowSuggestions(false);
                      }}
                      ref={searchInputRef}
                      autoFocus
                    />
                    
                    {/* Real-time suggestions dropdown */}
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div 
                        ref={suggestionsRef}
                        className="absolute left-0 right-0 top-full z-20 mt-1 bg-background border border-input rounded-md shadow-md"
                      >
                        <ul className="py-1">
                          {searchSuggestions.map((suggestion, index) => (
                            <li 
                              key={index} 
                              className="px-3 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                              onClick={() => handleSelectSuggestion(suggestion)}
                            >
                              <Search className="mr-2 h-4 w-4" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <Button type="submit">Search</Button>
                </form>
              </DialogContent>
            </Dialog>
            
            <button
              aria-label="Toggle dark mode"
              onClick={toggleDarkMode}
              className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {isDarkMode ? 
                <Sun size={20} className="group-hover:rotate-45 transition-transform duration-300" /> : 
                <Moon size={20} className="group-hover:-rotate-45 transition-transform duration-300" />
              }
              <span className="absolute inset-0 rounded-full bg-foreground/5 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full relative group overflow-hidden">
                    {isAdmin ? (
                      <Shield size={20} className="text-primary z-10 relative group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <User size={20} className="z-10 relative group-hover:scale-110 transition-transform duration-300" />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-popover z-50 shadow-md dark:bg-gray-800 animate-in fade-in-80 slide-in-from-top-5"
                >
                  <DropdownMenuLabel>
                    {isAdmin ? 'Admin Account' : 'User Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link 
                to="/auth" 
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <button 
                aria-label="Search" 
                className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search size={20} />
              </button>
            </DialogTrigger>
            <DialogContent className="w-[95%] sm:max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Search AI Tools</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="text"
                    placeholder="Search AI Tools..."
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">Search</Button>
              </form>
            </DialogContent>
          </Dialog>

          <button
            aria-label="Toggle dark mode"
            onClick={toggleDarkMode}
            className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            {isDarkMode ? 
              <Sun size={20} className="group-hover:rotate-45 transition-transform duration-300" /> : 
              <Moon size={20} className="group-hover:-rotate-45 transition-transform duration-300" />
            }
            <span className="absolute inset-0 rounded-full bg-foreground/5 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
          </button>
          
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Toggle menu"
                className="p-2 text-foreground"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] pt-12 pb-0 px-0 border-r">
              <div className="flex flex-col h-full">
                <div className="px-6">
                  <Link to="/" className="flex items-center gap-2 text-xl font-bold mb-8">
                    <span className="text-gradient">AI Any Tool</span>
                  </Link>
                </div>
                
                <nav className="flex-1">
                  <ul className="flex flex-col gap-2 px-2">
                    {navLinks.map((link) => (
                      <li key={link.title}>
                        <SheetClose asChild>
                          <Link
                            to={link.path}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            {link.title}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                    
                    {user && (
                      <li>
                        <SheetClose asChild>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <LayoutDashboard className="h-5 w-5" />
                            <span>Dashboard</span>
                          </Link>
                        </SheetClose>
                      </li>
                    )}
                    
                    {user && isAdmin && (
                      <li>
                        <SheetClose asChild>
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <Shield className="h-5 w-5" />
                            <span>Admin Panel</span>
                          </Link>
                        </SheetClose>
                      </li>
                    )}
                  </ul>
                </nav>
                
                <div className="mt-auto p-6 border-t">
                  {user ? (
                    <SheetClose asChild>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </Button>
                    </SheetClose>
                  ) : (
                    <SheetClose asChild>
                      <Link
                        to="/auth"
                        className="flex justify-center items-center w-full py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        Sign In
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {isMenuOpen && (
          <div className="fixed inset-0 top-[60px] z-50 flex flex-col bg-background p-6 md:hidden animate-fadeIn">
            <ul className="flex flex-col gap-6 pt-8">
              {navLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    to={link.path}
                    className="text-xl font-medium"
                    onClick={toggleMenu}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
              {user && (
                <li>
                  <Link
                    to="/dashboard"
                    className="text-xl font-medium flex items-center gap-2"
                    onClick={toggleMenu}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </li>
              )}
              {user && isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="text-xl font-medium flex items-center gap-2"
                    onClick={toggleMenu}
                  >
                    <Shield className="h-5 w-5" />
                    <span>Admin Panel</span>
                  </Link>
                </li>
              )}
            </ul>
            <div className="mt-auto pt-8 flex flex-col gap-4">
              {user ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    handleSignOut();
                    toggleMenu();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="w-full py-3 text-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
