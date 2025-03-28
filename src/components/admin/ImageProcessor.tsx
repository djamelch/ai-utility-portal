
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Loader2, Image } from 'lucide-react';

export function ImageProcessor() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tools, setTools] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [processed, setProcessed] = useState(0);

  const fetchTools = async () => {
    setIsProcessing(true);
    try {
      // Get all tools with external image URLs
      const { data, error } = await supabase
        .from('tools')
        .select('id, company_name, logo_url, featured_image_url')
        .or('logo_url.neq.null,featured_image_url.neq.null');
      
      if (error) throw error;
      
      setTools(data || []);
      setTotal(data?.length || 0);
      toast({
        title: 'Ready to process',
        description: `Found ${data?.length || 0} tools with images to process`,
      });
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tools with images',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processImages = async () => {
    if (tools.length === 0) {
      toast({
        title: 'No images to process',
        description: 'Please fetch tools first',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setProcessed(0);
    
    try {
      for (let i = 0; i < tools.length; i++) {
        const tool = tools[i];
        const toolName = tool.company_name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Process logo image if it exists
        if (tool.logo_url && tool.logo_url.startsWith('http')) {
          try {
            const logoResponse = await fetch(tool.logo_url);
            if (!logoResponse.ok) throw new Error(`Failed to fetch logo: ${logoResponse.statusText}`);
            
            const logoBlob = await logoResponse.blob();
            const logoFileName = `${toolName}-logo.${getFileExtension(tool.logo_url) || 'png'}`;
            
            const { data: logoData, error: logoError } = await supabase.storage
              .from('tool-images')
              .upload(`logos/${logoFileName}`, logoBlob, {
                contentType: logoBlob.type,
                upsert: true,
              });
            
            if (logoError) throw logoError;
            
            // Get public URL
            const { data: logoPublicURL } = supabase.storage
              .from('tool-images')
              .getPublicUrl(`logos/${logoFileName}`);
            
            // Update tool with new logo URL
            await supabase
              .from('tools')
              .update({ logo_url: logoPublicURL.publicUrl })
              .eq('id', tool.id);
          } catch (logoErr) {
            console.error(`Error processing logo for ${tool.company_name}:`, logoErr);
          }
        }
        
        // Process featured image if it exists
        if (tool.featured_image_url && tool.featured_image_url.startsWith('http')) {
          try {
            const featuredResponse = await fetch(tool.featured_image_url);
            if (!featuredResponse.ok) throw new Error(`Failed to fetch featured image: ${featuredResponse.statusText}`);
            
            const featuredBlob = await featuredResponse.blob();
            const featuredFileName = `${toolName}-featured.${getFileExtension(tool.featured_image_url) || 'jpg'}`;
            
            const { data: featuredData, error: featuredError } = await supabase.storage
              .from('tool-images')
              .upload(`featured/${featuredFileName}`, featuredBlob, {
                contentType: featuredBlob.type,
                upsert: true,
              });
            
            if (featuredError) throw featuredError;
            
            // Get public URL
            const { data: featuredPublicURL } = supabase.storage
              .from('tool-images')
              .getPublicUrl(`featured/${featuredFileName}`);
            
            // Update tool with new featured image URL
            await supabase
              .from('tools')
              .update({ featured_image_url: featuredPublicURL.publicUrl })
              .eq('id', tool.id);
          } catch (featuredErr) {
            console.error(`Error processing featured image for ${tool.company_name}:`, featuredErr);
          }
        }
        
        setProcessed(i + 1);
        setProgress(Math.round(((i + 1) / tools.length) * 100));
      }
      
      toast({
        title: 'Processing complete',
        description: `Processed images for ${processed} out of ${total} tools`,
      });
    } catch (error) {
      console.error('Error processing images:', error);
      toast({
        title: 'Error',
        description: 'Failed to process some images',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to get file extension from URL
  const getFileExtension = (url: string) => {
    if (!url) return '';
    const segments = url.split('.');
    return segments.length > 1 ? segments.pop()?.split('?')[0].toLowerCase() : '';
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Image Processor</h3>
      <p className="text-sm text-muted-foreground mb-4">
        This tool will download external images from tool records and store them in Supabase Storage.
      </p>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            onClick={fetchTools}
            disabled={isProcessing}
            variant="outline"
          >
            {isProcessing && !total ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching tools...
              </>
            ) : (
              'Fetch Tools with Images'
            )}
          </Button>
          
          <Button
            onClick={processImages}
            disabled={isProcessing || tools.length === 0}
          >
            <Image className="mr-2 h-4 w-4" />
            Process Images
          </Button>
        </div>
        
        {total > 0 && (
          <>
            <div className="flex justify-between text-sm mb-1">
              <span>Processing progress</span>
              <span>{processed} of {total} ({progress}%)</span>
            </div>
            <Progress value={progress} className="w-full" />
          </>
        )}
      </div>
    </Card>
  );
}
