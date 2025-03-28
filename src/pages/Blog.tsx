import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Link } from "react-router-dom";

const Blog = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "The Future of AI in Marketing",
      date: "August 28, 2023",
      description:
        "Explore how artificial intelligence is revolutionizing marketing strategies and creating new opportunities for businesses.",
      imageUrl:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWklMjB0ZWNofGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      title: "Top 5 AI Tools for Content Creation",
      date: "September 5, 2023",
      description:
        "Discover the best AI-powered tools that can help you generate high-quality content quickly and efficiently.",
      imageUrl:
        "https://images.unsplash.com/photo-1518770660439-464ef52689bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGVjaCUyMGdhZGdldHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 3,
      title: "How AI is Transforming the Healthcare Industry",
      date: "September 12, 2023",
      description:
        "Learn about the innovative ways AI is being used to improve patient care, streamline processes, and accelerate medical research.",
      imageUrl:
        "https://images.unsplash.com/photo-1532938314630-e96fbb9c35a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhlYWx0aCUyMHRlY2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time or actual data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageWrapper isLoading={isLoading}>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-secondary/30 dark:bg-transparent py-16">
            <div className="container-tight">
              <MotionWrapper animation="fadeIn">
                <h1 className="text-4xl md:text-5xl font-bold text-center">
                  AI Blog
                </h1>
                <p className="text-muted-foreground text-center mt-4 max-w-2xl mx-auto">
                  Stay up-to-date with the latest news, trends, and insights in
                  the world of artificial intelligence.
                </p>
              </MotionWrapper>
            </div>
          </section>

          {/* Blog Posts Section */}
          <section className="section-padding">
            <div className="container-tight">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <MotionWrapper
                    key={post.id}
                    animation="slideUp"
                    className="w-full"
                  >
                    <Link
                      to={`/blog/${post.id}`}
                      className="block rounded-xl border border-border/40 bg-background shadow-md overflow-hidden transition-shadow hover:shadow-lg"
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-2">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                          {post.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {post.date}
                        </p>
                      </div>
                    </Link>
                  </MotionWrapper>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </PageWrapper>
  );
};

export default Blog;
