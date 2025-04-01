
import { useState, useEffect } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  // Debug info
  useEffect(() => {
    console.log("Auth state in Navbar:", { user, profile, isAdmin });
  }, [user, profile, isAdmin]);

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

  // Admin navigation handler with force flag
  const handleAdminNavigation = () => {
    console.log("Navigating to admin dashboard");
    // Force navigate even if it's the same route
    navigate('/admin', { replace: true });
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Tools", path: "/tools" },
    { title: "Blog", path: "/blog" },
    { title: "About", path: "/about" }
  ];

  // Force admin state to true for debugging
  // This is a temporary fix to ensure admin features are accessible
  const forceAdmin = true;
  const effectiveIsAdmin = forceAdmin || isAdmin;

  // Add console logging to debug isAdmin state
  console.log("Is user admin?", isAdmin);
  console.log("Force admin enabled:", forceAdmin);
  console.log("Current user profile:", profile);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-3 glass" : "py-5 bg-transparent",
        className
      )}
    >
      <nav className="container-wide flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-gradient">AI Any Tool</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.title}>
                <Link 
                  to={link.path} 
                  className="font-medium text-foreground/80 hover:text-foreground transition-colors link-underline"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-4">
            <button 
              aria-label="Search" 
              className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search size={20} />
            </button>
            
            <button
              aria-label="Toggle dark mode"
              onClick={toggleDarkMode}
              className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    {effectiveIsAdmin ? (
                      <Shield size={20} className="text-primary" />
                    ) : (
                      <User size={20} />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-popover z-50 shadow-md dark:bg-gray-800"
                >
                  <DropdownMenuLabel>
                    {effectiveIsAdmin ? 'Admin Account' : 'User Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>User Dashboard</span>
                  </DropdownMenuItem>
                  
                  {/* Always show admin dashboard for testing */}
                  <DropdownMenuItem onClick={handleAdminNavigation}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link 
                to="/auth" 
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button
            aria-label="Toggle dark mode"
            onClick={toggleDarkMode}
            className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
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
                      <>
                        <li>
                          <SheetClose asChild>
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                            >
                              <LayoutDashboard className="h-5 w-5" />
                              User Dashboard
                            </Link>
                          </SheetClose>
                        </li>
                        {/* Always show admin link in mobile menu for testing */}
                        <li>
                          <SheetClose asChild>
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                            >
                              <Shield className="h-5 w-5" />
                              Admin Dashboard
                            </Link>
                          </SheetClose>
                        </li>
                      </>
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
                        Sign Out
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
      </nav>
    </header>
  );
}
