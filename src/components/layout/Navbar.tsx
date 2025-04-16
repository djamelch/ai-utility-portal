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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

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
    }
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
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-gradient">AI Any Tool</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.title}>
                {link.isButton ? (
                  <Link to={link.path}>
                    <Button variant="default" size="sm" className="rounded-full">
                      {link.title}
                    </Button>
                  </Link>
                ) : (
                  <Link 
                    to={link.path} 
                    className="font-medium text-foreground/80 hover:text-foreground transition-colors link-underline"
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-4">
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <button 
                  aria-label="Search" 
                  className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Search size={20} />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>بحث عن أدوات الذكاء الاصطناعي</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSearch} className="flex items-center space-x-2 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      type="text"
                      placeholder="بحث عن أدوات الذكاء الاصطناعي..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <Button type="submit">بحث</Button>
                </form>
              </DialogContent>
            </Dialog>
            
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
                    {isAdmin ? (
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
                    {isAdmin ? 'حساب مشرف' : 'حساب مستخدم'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>لوحة المستخدم</span>
                  </DropdownMenuItem>
                  
                  {/* عرض خيار لوحة تحكم المشرف فقط للمشرفين */}
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>لوحة المشرف</span>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link 
                to="/auth" 
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                تسجيل الدخول
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
                <DialogTitle>بحث عن أدوات الذكاء الاصطناعي</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="text"
                    placeholder="بحث عن أدوات الذكاء الاصطناعي..."
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">بحث</Button>
              </form>
            </DialogContent>
          </Dialog>

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
                      <li>
                        <SheetClose asChild>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <LayoutDashboard className="h-5 w-5" />
                            لوحة المستخدم
                          </Link>
                        </SheetClose>
                      </li>
                    )}
                    
                    {/* عرض خيار لوحة تحكم المشرف فقط للمشرفين */}
                    {user && isAdmin && (
                      <li>
                        <SheetClose asChild>
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <Shield className="h-5 w-5" />
                            لوحة المشرف
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
                        تسجيل الخروج
                      </Button>
                    </SheetClose>
                  ) : (
                    <SheetClose asChild>
                      <Link
                        to="/auth"
                        className="flex justify-center items-center w-full py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        تسجيل الدخول
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
                    لوحة المستخدم
                  </Link>
                </li>
              )}
              {/* عرض خيار لوحة تحكم المشرف فقط للمشرفين */}
              {user && isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="text-xl font-medium flex items-center gap-2"
                    onClick={toggleMenu}
                  >
                    <Shield className="h-5 w-5" />
                    لوحة المشرف
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
                  تسجيل الخروج
                </Button>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="w-full py-3 text-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    onClick={toggleMenu}
                  >
                    تسجيل الدخول
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
