
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolCard, Tool } from '@/components/tools/ToolCard';

export default function ToolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    const fetchTool = async () => {
      setLoading(true);
      setNotFound(false);
      
      try {
        let query = supabase.from('tools').select('*');
        
        // Check if the slug is a number (tool ID) or a string (slug)
        if (slug && !isNaN(Number(slug))) {
          // If it's a number, query by ID
          query = query.eq('id', parseInt(slug, 10));
        } else if (slug) {
          // If it's a string, query by slug
          query = query.eq('slug', slug);
          // Also handle slugs with numeric suffixes like "tool-name-1"
          if (slug.includes('-')) {
            const parts = slug.split('-');
            const possibleId = parts[parts.length - 1];
            if (!isNaN(Number(possibleId))) {
              console.log('Trying with possible ID from slug:', possibleId);
              // Try again with the ID if no results
              const { data: slugData } = await query.maybeSingle();
              if (!slugData) {
                query = supabase.from('tools').select('*').eq('id', parseInt(possibleId, 10));
              }
            }
          }
        }
        
        const { data, error } = await query.maybeSingle();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          console.error('Tool not found with slug/id:', slug);
          setNotFound(true);
          return;
        }
        
        console.log('Tool data:', data);
        
        // Transform database tool to Tool interface format
        const transformedTool: Tool = {
          id: data.id,
          name: data.company_name || "", // Use company_name instead of name
          description: data.short_description || "",
          logo: data.logo_url || "",
          category: data.primary_task || "",
          rating: 4, // Default rating
          reviewCount: 0, // Default review count
          pricing: data.pricing || "",
          url: data.visit_website_url || data.detail_url || "",
          slug: data.slug || "",
          // Additional properties
          isFeatured: false,
          isNew: new Date(data.created_at || "").getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        };
        
        setTool(transformedTool);
      } catch (error) {
        console.error('Error fetching tool:', error);
        toast({
          title: 'Error fetching tool',
          description: 'Failed to load tool details',
          variant: 'destructive',
        });
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTool();
  }, [slug, toast]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-24">
          <div className="container-wide">
            <MotionWrapper animation="fadeIn">
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold mb-4">Tool Not Found</h1>
                <p className="text-muted-foreground mb-8">
                  The tool you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate('/tools')}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Tools
                </Button>
              </div>
            </MotionWrapper>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-24">
        <div className="container-wide">
          <MotionWrapper animation="fadeIn">
            <Button 
              variant="ghost" 
              className="mb-6"
              onClick={() => navigate('/tools')}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Button>
            
            <div className="max-w-2xl mx-auto">
              {tool && <ToolCard tool={tool} className="h-full" />}
            </div>
          </MotionWrapper>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
