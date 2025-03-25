
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Menu, X, Search, Moon, Sun 
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    // Prevent scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Tools", path: "/tools" },
    { title: "Blog", path: "/blog" },
    { title: "About", path: "/about" }
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
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-gradient">AI Any Tool</span>
        </Link>

        {/* Desktop Menu */}
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
            
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            aria-label="Toggle dark mode"
            onClick={toggleDarkMode}
            className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            aria-label="Toggle menu"
            onClick={toggleMenu}
            className="p-2 text-foreground"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
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
            </ul>
            <div className="mt-auto pt-8 flex flex-col gap-4">
              <Link
                to="/login"
                className="w-full py-3 text-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                onClick={toggleMenu}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full py-3 text-center rounded-full border border-input bg-background hover:bg-accent/10 transition-colors"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
