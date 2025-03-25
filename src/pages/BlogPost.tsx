
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  CalendarDays, Clock, ArrowLeft, Heart, 
  MessageSquare, Share2, Bookmark, Twitter, Facebook, Linkedin 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionWrapper } from "@/components/ui/MotionWrapper";

interface BlogPostFull {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    bio: string;
    avatar: string;
  };
  coverImage: string;
  relatedPosts: string[];
}

const blogPostsData: { [key: string]: BlogPostFull } = {
  "top-ai-tools-2023": {
    id: "top-ai-tools-2023",
    title: "Top 10 AI Tools to Boost Your Productivity in 2023",
    excerpt: "Discover the most innovative AI-powered tools that can help streamline your workflow and increase productivity.",
    content: `
      <p>Artificial intelligence is revolutionizing the way we work, offering unprecedented capabilities to automate tasks, generate content, and analyze data. As we progress through 2023, a new generation of AI tools is emerging, designed to make professionals more productive and efficient in their daily tasks.</p>
      
      <p>In this article, we'll explore the top 10 AI tools that are transforming workflows across industries and helping users achieve more in less time.</p>
      
      <h2>1. ChatGPT</h2>
      <p>OpenAI's ChatGPT has rapidly become one of the most versatile AI assistants available. Its natural language processing capabilities allow it to draft emails, write code, generate creative content, answer questions, and more. With the release of GPT-4, its capabilities have expanded to include more complex reasoning and greater accuracy.</p>
      
      <h2>2. GitHub Copilot</h2>
      <p>Developed specifically for programmers, GitHub Copilot acts as an AI pair programmer that suggests code and entire functions in real-time. It integrates seamlessly with popular code editors and understands context from comments and existing code to provide relevant suggestions.</p>
      
      <h2>3. Jasper</h2>
      <p>Jasper (formerly Jarvis) has established itself as a leading AI content creation platform. Its specialized templates help marketers, bloggers, and business professionals create polished, SEO-optimized content quickly. Features include blog post generation, social media content creation, and ad copy writing.</p>
      
      <h2>4. Notion AI</h2>
      <p>Notion's integrated AI assistant enhances the popular productivity app with the ability to summarize notes, improve writing, generate task lists, and draft content based on simple prompts. It's particularly useful for knowledge workers who already use Notion for project management and documentation.</p>
      
      <h2>5. Midjourney</h2>
      <p>For visual creativity, Midjourney generates stunning artwork and imagery based on text descriptions. Designers, marketers, and content creators can quickly produce unique visuals without extensive graphic design skills. The output quality continues to improve with each update.</p>
      
      <h2>6. Otter.ai</h2>
      <p>Otter.ai transcribes meetings and conversations in real-time, allowing teams to focus on discussions rather than taking notes. Its AI can identify different speakers, generate summaries, and extract action items, making it invaluable for remote and hybrid teams.</p>
      
      <h2>7. Grammarly</h2>
      <p>While known for grammar checking, Grammarly's AI has evolved to offer sophisticated writing assistance including tone adjustments, clarity improvements, and engagement suggestions. Its ability to understand context makes it suitable for everything from emails to complex documents.</p>
      
      <h2>8. Beautiful.ai</h2>
      <p>Beautiful.ai uses artificial intelligence to create professional-looking presentations automatically. Users input content, and the AI handles design elements, maintaining visual consistency and applying design best practices without manual adjustment.</p>
      
      <h2>9. Krisp</h2>
      <p>Krisp's AI noise cancellation technology removes background sounds from calls and recordings, ensuring clear communication regardless of environment. It's particularly valuable for remote workers in shared spaces or noisy locations.</p>
      
      <h2>10. Zapier with AI capabilities</h2>
      <p>Zapier's introduction of AI features allows users to create complex automation workflows using natural language instructions. This makes previously technical process automation accessible to non-technical users across an organization.</p>
      
      <h2>Conclusion</h2>
      <p>These AI tools represent just the beginning of how artificial intelligence is transforming productivity across industries. By intelligently incorporating these solutions into your workflow, you can automate routine tasks, enhance creativity, and focus on higher-value work that truly requires human insight.</p>
      
      <p>As AI technology continues to evolve at a rapid pace, we can expect these tools to become even more sophisticated, offering greater personalization and deeper integration with existing systems. The key to maximizing productivity is finding the right combination of AI assistants that complement your specific workflow and requirements.</p>
    `,
    category: "Productivity",
    tags: ["AI", "Productivity", "Tools", "Workflow", "Automation"],
    readTime: "6 min read",
    date: "June 12, 2023",
    author: {
      name: "Alex Johnson",
      role: "AI Productivity Expert",
      bio: "Alex has spent over a decade exploring how technology can enhance human productivity. He writes about AI tools, automation, and the future of work.",
      avatar: "https://via.placeholder.com/100"
    },
    coverImage: "https://via.placeholder.com/1200x600",
    relatedPosts: ["ai-writing-tools", "future-of-ai", "ai-code-assistants"]
  },
  
  // Add more detailed blog posts here
};

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostFull | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  useEffect(() => {
    // In a real app, you would fetch the blog post data based on the ID
    if (id && blogPostsData[id]) {
      setPost(blogPostsData[id]);
    }
    
    // Reset state when changing posts
    setIsLiked(false);
    setIsBookmarked(false);
    setShowShareOptions(false);
    
    // Scroll to top when post changes
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Article Not Found</h1>
            <p className="mt-2 text-muted-foreground">The article you're looking for doesn't exist or has been removed.</p>
            <Link to="/blog" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <article className="container-tight">
          {/* Back Link */}
          <MotionWrapper animation="fadeIn">
            <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </MotionWrapper>
          
          {/* Header */}
          <MotionWrapper animation="fadeIn" delay="delay-100">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block rounded-full bg-secondary/80 px-3 py-1 text-xs text-foreground/70">
                  {post.category}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={14} />
                  {post.readTime}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CalendarDays size={14} />
                  {post.date}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                {post.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-sm text-muted-foreground">{post.author.role}</div>
                </div>
              </div>
            </div>
          </MotionWrapper>
          
          {/* Featured Image */}
          <MotionWrapper animation="fadeIn" delay="delay-200">
            <div className="mb-10 rounded-xl overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          </MotionWrapper>
          
          {/* Content */}
          <MotionWrapper animation="fadeIn" delay="delay-300">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Floating share sidebar on desktop */}
              <div className="hidden lg:block">
                <div className="sticky top-32 flex flex-col space-y-4">
                  <button 
                    onClick={() => setIsLiked(!isLiked)} 
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border border-input hover:bg-secondary/50 transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                  >
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                    <span className="text-xs">Like</span>
                  </button>
                  
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border border-input hover:bg-secondary/50 transition-colors ${isBookmarked ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                    <span className="text-xs">Save</span>
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowShareOptions(!showShareOptions)}
                      className="w-full flex flex-col items-center gap-1 p-3 rounded-lg border border-input hover:bg-secondary/50 transition-colors text-muted-foreground"
                    >
                      <Share2 size={20} />
                      <span className="text-xs">Share</span>
                    </button>
                    
                    {showShareOptions && (
                      <div className="absolute top-full left-0 mt-2 w-10 flex flex-col space-y-3 bg-background rounded-lg border border-input p-3 shadow-md">
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Twitter size={20} />
                        </button>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Facebook size={20} />
                        </button>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Linkedin size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <button className="flex flex-col items-center gap-1 p-3 rounded-lg border border-input hover:bg-secondary/50 transition-colors text-muted-foreground">
                    <MessageSquare size={20} />
                    <span className="text-xs">Comment</span>
                  </button>
                </div>
              </div>
              
              {/* Main content */}
              <div className="lg:col-span-3">
                <div className="prose prose-gray dark:prose-invert max-w-none mb-10" dangerouslySetInnerHTML={{ __html: post.content }} />
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blog?tag=${tag}`}
                      className="rounded-full bg-secondary/50 px-3 py-1 text-xs text-foreground/70 hover:bg-secondary/80 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
                
                {/* Mobile actions */}
                <div className="flex lg:hidden items-center justify-between border-y border-border/40 py-4 mb-8">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsLiked(!isLiked)} 
                      className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                    >
                      <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                      <span>Like</span>
                    </button>
                    <button 
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`flex items-center gap-2 ${isBookmarked ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                      <span>Save</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <button 
                        onClick={() => setShowShareOptions(!showShareOptions)}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <Share2 size={20} />
                        <span>Share</span>
                      </button>
                      
                      {showShareOptions && (
                        <div className="absolute top-full right-0 mt-2 flex space-x-3 bg-background rounded-lg border border-input p-3 shadow-md">
                          <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <Twitter size={20} />
                          </button>
                          <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <Facebook size={20} />
                          </button>
                          <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <Linkedin size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Author Bio */}
                <div className="rounded-xl border border-border/40 bg-background p-6 mb-10">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold mb-1">{post.author.name}</h3>
                      <p className="text-sm text-primary mb-3">{post.author.role}</p>
                      <p className="text-muted-foreground">{post.author.bio}</p>
                      <div className="mt-4 flex items-center gap-3">
                        <a href="#" className="text-muted-foreground hover:text-foreground">
                          <Twitter size={18} />
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-foreground">
                          <Linkedin size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Related Articles */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {post.relatedPosts.slice(0, 2).map((relatedPostId) => {
                      const relatedPost = blogPostsData[relatedPostId];
                      if (!relatedPost) return null;
                      
                      return (
                        <Link 
                          key={relatedPost.id} 
                          to={`/blog/${relatedPost.id}`}
                          className="group rounded-xl overflow-hidden border border-border/40 bg-background hover:shadow-card transition-all duration-300"
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={relatedPost.coverImage} 
                              alt={relatedPost.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-5">
                            <span className="inline-block rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs text-foreground/70 mb-2">
                              {relatedPost.category}
                            </span>
                            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {relatedPost.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {relatedPost.excerpt}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>
          
          {/* Newsletter Section */}
          <MotionWrapper animation="fadeIn" delay="delay-400" className="mt-16">
            <div className="rounded-xl bg-background border border-border/40 p-8 text-center">
              <h2 className="text-2xl font-bold">
                Enjoyed this article?
              </h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                Subscribe to our newsletter for more insights on AI tools and technology.
              </p>
              <div className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg border border-input bg-background px-4 py-2"
                />
                <button className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </MotionWrapper>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
