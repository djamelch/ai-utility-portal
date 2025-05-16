import { useState, useEffect } from "react";
import { CalendarDays, Clock, Tag, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  coverImage: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: "top-ai-tools-2023",
    title: "Top 10 AI Tools to Boost Your Productivity in 2023",
    excerpt: "Discover the most innovative AI-powered tools that can help streamline your workflow and increase productivity.",
    category: "Productivity",
    readTime: "6 min read",
    date: "June 12, 2023",
    author: {
      name: "Alex Johnson",
      avatar: "https://via.placeholder.com/40"
    },
    coverImage: "https://via.placeholder.com/600x400",
    featured: true
  },
  {
    id: "ai-image-generation",
    title: "The Evolution of AI Image Generation: From DALL-E to Midjourney",
    excerpt: "Explore the rapid advancement of AI image generation technology and how it's revolutionizing creative industries.",
    category: "Technology",
    readTime: "8 min read",
    date: "May 28, 2023",
    author: {
      name: "Sophia Chen",
      avatar: "https://via.placeholder.com/40"
    },
    coverImage: "https://via.placeholder.com/600x400"
  },
  {
    id: "ai-writing-tools",
    title: "How AI Writing Tools Are Changing Content Creation",
    excerpt: "An in-depth look at how AI-powered writing assistants are transforming the way we create and optimize content.",
    category: "Writing",
    readTime: "5 min read",
    date: "May 15, 2023",
    author: {
      name: "Marcus Williams",
      avatar: "https://via.placeholder.com/40"
    },
    coverImage: "https://via.placeholder.com/600x400"
  },
  {
    id: "future-of-ai",
    title: "The Future of AI: Trends to Watch in the Coming Decade",
    excerpt: "Industry experts share their predictions on how artificial intelligence will evolve and impact various sectors in the next ten years.",
    category: "Insights",
    readTime: "10 min read",
    date: "April 30, 2023",
    author: {
      name: "Elena Rodriguez",
      avatar: "https://via.placeholder.com/40"
    },
    coverImage: "https://via.placeholder.com/600x400"
  },
  {
    id: "ai-code-assistants",
    title: "AI Code Assistants: A Developer's Best Friend or Replacement?",
    excerpt: "Examining the capabilities and limitations of AI coding tools and their impact on the software development profession.",
    category: "Development",
    readTime: "7 min read",
    date: "April 18, 2023",
    author: {
      name: "David Kim",
      avatar: "https://via.placeholder.com/40"
    },
    coverImage: "https://via.placeholder.com/600x400"
  },
  {
    id: "ethical-ai",
    title: "Ethical Considerations in AI Tool Development",
    excerpt: "A discussion on the ethical challenges and responsibilities involved in creating and deploying AI-powered tools.",
    category: "Ethics",
    readTime: "9 min read",
    date: "April 5, 2023",
    author: {
      name: "Olivia Parker",
      avatar: "https://via.placeholder.com/40"
    },
    coverImage: "https://via.placeholder.com/600x400"
  }
];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });
  
  const featuredPost = blogPosts.find(post => post.featured);

  useEffect(() => {
    // Generate search suggestions based on query
    if (searchQuery.length > 0) {
      const suggestions = blogPosts
        .map(post => post.title)
        .filter(title => title.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5);
      
      // Add categories that match
      const matchingCategories = categories
        .filter(category => category.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(category => `Category: ${category}`);
      
      setSearchSuggestions([...suggestions, ...matchingCategories]);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Show dialog on / press
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSelectSuggestion = (value: string) => {
    if (value.startsWith("Category: ")) {
      const category = value.replace("Category: ", "");
      setSelectedCategory(category);
      setSearchQuery("");
    } else {
      setSearchQuery(value);
    }
    setShowSuggestions(false);
    setCommandOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container-wide">
          {/* Blog Header */}
          <MotionWrapper animation="fadeIn">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold">
                AI Any Tool Blog
              </h1>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                The latest insights, guides, and news about AI tools and technology
              </p>
            </div>
          </MotionWrapper>
          
          {/* Search and Filters */}
          <MotionWrapper animation="fadeIn" delay="delay-200">
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search articles... (Press / to focus)"
                  className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setShowSuggestions(false);
                    } else if (e.key === "ArrowDown" && showSuggestions) {
                      e.preventDefault();
                      setCommandOpen(true);
                    }
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery("");
                      setSearchSuggestions([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
                
                {/* Real-time suggestions dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-background border border-input rounded-md shadow-md">
                    <ul className="py-1">
                      {searchSuggestions.map((suggestion, index) => (
                        <li 
                          key={index} 
                          className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          {suggestion.startsWith("Category:") ? (
                            <Tag className="mr-2 h-4 w-4" />
                          ) : (
                            <Search className="mr-2 h-4 w-4" />
                          )}
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <select 
                className="rounded-lg border border-input bg-background px-3 py-2"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </MotionWrapper>
          
          <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
            <CommandInput 
              placeholder="Search articles..." 
              value={searchQuery}
              onValueChange={handleSearchChange}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Articles">
                {searchSuggestions.length > 0 ? (
                  searchSuggestions.map((suggestion, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSelectSuggestion(suggestion)}
                      className="cursor-pointer"
                    >
                      {suggestion.startsWith("Category:") ? (
                        <Tag className="mr-2 h-4 w-4" />
                      ) : (
                        <Search className="mr-2 h-4 w-4" />
                      )}
                      {suggestion}
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem>Start typing to see suggestions</CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </CommandDialog>
          
          {/* Featured Post */}
          {featuredPost && (
            <MotionWrapper animation="fadeIn" delay="delay-300" className="mb-12">
              <div className="rounded-xl overflow-hidden border border-border/40 bg-background hover:shadow-card transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <img 
                      src={featuredPost.coverImage} 
                      alt={featuredPost.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col">
                    <div className="mb-4">
                      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-2">
                        Featured Post
                      </span>
                      <span className="inline-block rounded-full bg-secondary/80 px-3 py-1 text-xs text-foreground/70 ml-2">
                        {featuredPost.category}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2 line-clamp-2">
                      <Link to={`/blog/${featuredPost.id}`} className="hover:text-primary transition-colors">
                        {featuredPost.title}
                      </Link>
                    </h2>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-auto">
                      <img 
                        src={featuredPost.author.avatar} 
                        alt={featuredPost.author.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium">{featuredPost.author.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays size={12} />
                            {featuredPost.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {featuredPost.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          )}
          
          {/* Blog Posts Grid */}
          <MotionWrapper animation="fadeIn" delay="delay-400">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.filter(post => !post.featured).map((post, index) => (
                <div 
                  key={post.id} 
                  className="rounded-xl overflow-hidden border border-border/40 bg-background hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs text-foreground/70">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">
                      <Link to={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium">{post.author.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {post.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="rounded-lg border border-border/40 bg-background p-8 text-center">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
              </div>
            )}
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-1">
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background hover:bg-secondary/50 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  1
                </button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background hover:bg-secondary/50 transition-colors">
                  2
                </button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background hover:bg-secondary/50 transition-colors">
                  3
                </button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background hover:bg-secondary/50 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </MotionWrapper>
          
          {/* Newsletter Section */}
          <MotionWrapper animation="fadeIn" delay="delay-500" className="mt-16">
            <div className="rounded-xl bg-background border border-border/40 p-8 md:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Subscribe to Our Newsletter
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Stay up-to-date with the latest AI tools, trends, and insights. We'll send you a curated digest of the best content straight to your inbox.
              </p>
              <div className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg border border-input bg-background px-4 py-3"
                />
                <button className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </MotionWrapper>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
