
import { useState, useEffect } from "react";
import { Tool, ToolCard } from "./ToolCard";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { supabase } from "@/integrations/supabase/client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";

interface ToolGridProps {
  limit?: number;
  showFilters?: boolean;
  category?: string;
  searchQuery?: string;
  pricing?: string;
  sortBy?: string;
}

export function ToolGrid({ 
  limit, 
  showFilters = false, 
  category,
  searchQuery,
  pricing,
  sortBy = "featured"
}: ToolGridProps) {
  const { toast } = useToast();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = limit || 12;
  
  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      try {
        // Build the query based on filters
        let query = supabase
          .from('tools')
          .select('id, company_name, short_description, logo_url, primary_task, pricing, click_count, slug', { count: 'exact' });
        
        // Apply category filter
        if (category) {
          query = query.eq('primary_task', category);
        }
        
        // Apply pricing filter
        if (pricing) {
          query = query.eq('pricing', pricing);
        }
        
        // Apply search filter if provided
        if (searchQuery && searchQuery.trim() !== '') {
          query = query.or(`company_name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`);
        }
        
        // Apply sorting
        if (sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'popular') {
          query = query.order('click_count', { ascending: false });
        } else {
          // Default sorting for featured tools 
          query = query.order('id', { ascending: true });
        }
        
        // Apply pagination
        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize - 1;
        
        const { data, count, error } = await query
          .range(from, to);
        
        if (error) {
          throw error;
        }
        
        console.log("Tools data from database:", data);
        
        // Map database results to Tool interface
        const toolsData = data.map(item => ({
          id: item.id.toString(),
          name: item.company_name || 'Unnamed Tool',
          description: item.short_description || 'No description available',
          logo: item.logo_url || 'https://via.placeholder.com/80',
          category: item.primary_task || 'Uncategorized',
          rating: 0, // We'll implement ratings later
          reviewCount: 0, // We'll implement review counts later
          pricing: item.pricing || 'Unknown',
          url: `/tool/${item.slug || item.id}`,
          slug: item.slug || `tool-${item.id}`,
          isFeatured: sortBy === 'featured',
          isNew: sortBy === 'newest'
        }));
        
        setTools(toolsData);
        setTotalCount(count || 0);
      } catch (error) {
        console.error('Error fetching tools:', error);
        toast({
          title: 'Error fetching tools',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTools();
  }, [category, searchQuery, pricing, sortBy, currentPage, pageSize, toast]);
  
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const displayTools = tools;

  return (
    <div>
      {showFilters && (
        <div className="mb-6 flex flex-wrap gap-3">
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Categories</option>
            <option value="ai-chatbots">AI Chatbots</option>
            <option value="image-generation">Image Generation</option>
            <option value="code-assistants">Code Assistants</option>
            <option value="data-analysis">Data Analysis</option>
            <option value="writing">Writing</option>
          </select>
          
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="">All Pricing</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
            <option value="subscription">Subscription</option>
          </select>
          
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="rating">Highest Rating</option>
            <option value="reviews">Most Reviews</option>
          </select>
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(limit || 8)].map((_, index) => (
            <div 
              key={index}
              className="rounded-xl border border-border/40 bg-background p-5 animate-pulse h-[300px]"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/80"></div>
                <div className="flex-1">
                  <div className="h-5 w-2/3 rounded bg-secondary/80"></div>
                  <div className="mt-2 h-4 w-1/2 rounded bg-secondary/50"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-secondary/50"></div>
                <div className="h-4 w-5/6 rounded bg-secondary/50"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayTools.map((tool, index) => (
              <MotionWrapper 
                key={tool.id} 
                animation="fadeIn" 
                delay={`delay-${(index % 4) * 100}` as any}
              >
                <ToolCard tool={tool} />
              </MotionWrapper>
            ))}
          </div>
          
          {displayTools.length === 0 && (
            <div className="rounded-lg border border-border/40 bg-background p-8 text-center">
              <p className="text-muted-foreground">No tools found matching your criteria.</p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  // Show current page, first page, last page, and pages around current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={pageNumber === currentPage}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  // Show ellipsis if needed
                  if (
                    (pageNumber === 2 && currentPage > 3) ||
                    (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <span className="flex h-9 w-9 items-center justify-center">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
