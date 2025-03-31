
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Search, X } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isMobile = useMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  // Close the mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Check if scrolled to add shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle command K for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((isSearchOpen) => !isSearchOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur transition-all",
        isScrolled ? "shadow-sm" : ""
      )}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl md:text-2xl">
              <span className="text-primary">AI</span> Tools
            </span>
          </Link>

          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/tools">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Browse Tools
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {[
                        "Text Generation",
                        "Image Generation",
                        "Audio Processing",
                        "Video Creation",
                        "Data Analysis",
                        "Code Assistant",
                        "Content Writing",
                        "Design Tools",
                      ].map((category) => (
                        <li key={category}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/tools?category=${category.toLowerCase().replace(/\s+/g, "-")}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {category}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/blog">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {user && isAdmin && (
                  <NavigationMenuItem>
                    <Link to="/admin">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Admin Dashboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="mr-2"
          >
            <Search className="h-4 w-4 mr-2" />
            <span className="hidden md:inline-flex">
              Search...
            </span>
            <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <CommandInput placeholder="Search for tools, categories..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Tools">
                <CommandItem onSelect={() => {
                  setIsSearchOpen(false);
                }}>
                  <Link to="/tool/chat-gpt" className="flex items-center w-full">ChatGPT</Link>
                </CommandItem>
                <CommandItem onSelect={() => {
                  setIsSearchOpen(false);
                }}>
                  <Link to="/tool/midjourney" className="flex items-center w-full">Midjourney</Link>
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Categories">
                <CommandItem onSelect={() => {
                  setIsSearchOpen(false);
                }}>
                  <Link to="/tools?category=text-generation" className="flex items-center w-full">Text Generation</Link>
                </CommandItem>
                <CommandItem onSelect={() => {
                  setIsSearchOpen(false);
                }}>
                  <Link to="/tools?category=image-generation" className="flex items-center w-full">Image Generation</Link>
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Pages">
                <CommandItem onSelect={() => {
                  setIsSearchOpen(false);
                }}>
                  <Link to="/tools" className="flex items-center w-full">All Tools</Link>
                </CommandItem>
                <CommandItem onSelect={() => {
                  setIsSearchOpen(false);
                }}>
                  <Link to="/blog" className="flex items-center w-full">Blog</Link>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>

          {!isMobile ? (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button asChild size="sm">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </>
          ) : (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline">
                  {open ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pr-0">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate to different sections of the app.
                  </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-4 py-6">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-lg font-medium hover:bg-accent rounded-l-md"
                  >
                    Home
                  </Link>
                  <Link
                    to="/tools"
                    className="block px-4 py-2 text-lg font-medium hover:bg-accent rounded-l-md"
                  >
                    Browse Tools
                  </Link>
                  <Link
                    to="/blog"
                    className="block px-4 py-2 text-lg font-medium hover:bg-accent rounded-l-md"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/about"
                    className="block px-4 py-2 text-lg font-medium hover:bg-accent rounded-l-md"
                  >
                    About
                  </Link>
                  {user && isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-lg font-medium hover:bg-accent rounded-l-md"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-lg font-medium hover:bg-accent rounded-l-md"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="text-left px-4 py-2 text-lg font-medium hover:bg-accent rounded-l-md"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      className="block px-4 py-2 text-lg font-medium hover:bg-accent rounded-l-md"
                    >
                      Sign In
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
