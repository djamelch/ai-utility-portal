
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Post } from "@/components/blog/Post";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function BlogPost() {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading or fetch actual data
    const timer = setTimeout(() => {
      // This is a placeholder until we implement the actual blog post fetching
      // In a real app, we would fetch from the database using the id param
      setPost({
        id: id,
        title: "How AI Tools Are Transforming the Workplace",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        author: {
          name: "John Doe",
          avatar: null
        },
        publishedAt: "2023-05-15T00:00:00Z",
        category: "AI Trends",
        readingTime: "5 min read",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <PageWrapper isLoading={true}>
        <div className="container max-w-screen-lg mx-auto px-4">
          <MotionWrapper animation="fadeIn">
            <div className="mb-8">
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-10 w-full mb-6" />
            <div className="flex gap-4 mb-8">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </MotionWrapper>
        </div>
      </PageWrapper>
    );
  }

  if (!post) {
    return (
      <PageWrapper>
        <div className="container max-w-screen-lg mx-auto px-4">
          <MotionWrapper animation="fadeIn">
            <div className="text-center py-24">
              <h2 className="text-2xl font-bold">Post Not Found</h2>
              <p className="mt-2 text-muted-foreground">
                Sorry, we couldn't find the blog post you were looking for.
              </p>
              <Button asChild className="mt-4">
                <Link to="/blog">Back to Blog</Link>
              </Button>
            </div>
          </MotionWrapper>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container max-w-screen-lg mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
        
        <Post 
          title={post.title}
          content={post.content}
          author={post.author}
          publishedAt={post.publishedAt}
          category={post.category}
          readingTime={post.readingTime}
          image={post.image}
        />
      </div>
    </PageWrapper>
  );
}
