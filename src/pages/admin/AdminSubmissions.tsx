
import { useState, useEffect } from 'react';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type ToolSubmission = Tables<'tool_submissions'>;

export function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tool_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching tool submissions:', error);
      toast({
        title: 'Failed to load submissions',
        description: 'There was an error loading the tool submissions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveSubmission = async (submission: ToolSubmission) => {
    setProcessingId(submission.id);
    try {
      // First, insert the tool into the tools table
      const { error: toolInsertError } = await supabase
        .from('tools')
        .insert({
          company_name: submission.tool_name,
          short_description: submission.description,
          full_description: submission.description,
          visit_website_url: submission.website_url,
          pricing: submission.pricing,
          primary_task: submission.category,
          // Generate a slug from the tool name
          slug: submission.tool_name.toLowerCase().replace(/\s+/g, '-'),
        });

      if (toolInsertError) throw toolInsertError;

      // Update the submission status to approved
      const { error: updateError } = await supabase
        .from('tool_submissions')
        .update({ status: 'approved' })
        .eq('id', submission.id);

      if (updateError) throw updateError;

      toast({
        title: 'Submission approved',
        description: `${submission.tool_name} has been added to the tools database.`,
      });

      // Refresh the submissions list
      fetchSubmissions();
    } catch (error) {
      console.error('Error approving submission:', error);
      toast({
        title: 'Approval failed',
        description: 'There was an error approving this submission.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const rejectSubmission = async (submission: ToolSubmission) => {
    setProcessingId(submission.id);
    try {
      const { error } = await supabase
        .from('tool_submissions')
        .update({ status: 'rejected' })
        .eq('id', submission.id);

      if (error) throw error;

      toast({
        title: 'Submission rejected',
        description: `${submission.tool_name} has been rejected.`,
      });

      // Refresh the submissions list
      fetchSubmissions();
    } catch (error) {
      console.error('Error rejecting submission:', error);
      toast({
        title: 'Rejection failed',
        description: 'There was an error rejecting this submission.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <MotionWrapper animation="fadeIn">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Tool Submissions</h2>
          <Button onClick={fetchSubmissions} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No tool submissions found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className={submission.status === 'pending' ? 'border-yellow-300' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{submission.tool_name}</CardTitle>
                      <CardDescription>
                        Submitted on {new Date(submission.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(submission.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-1">Description</h3>
                      <p className="text-muted-foreground">{submission.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold mb-1">Category</h3>
                        <p className="text-muted-foreground">{submission.category}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Pricing</h3>
                        <p className="text-muted-foreground">{submission.pricing}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Contact Email</h3>
                        <p className="text-muted-foreground">{submission.contact_email}</p>
                      </div>
                    </div>
                  </div>

                  {submission.additional_info && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-semibold mb-1">Additional Information</h3>
                        <p className="text-muted-foreground">{submission.additional_info}</p>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    asChild 
                    variant="outline"
                  >
                    <a href={submission.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Visit Website
                    </a>
                  </Button>
                  
                  {submission.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => rejectSubmission(submission)}
                        variant="outline"
                        className="border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                        disabled={processingId === submission.id}
                      >
                        {processingId === submission.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                        Reject
                      </Button>
                      <Button
                        onClick={() => approveSubmission(submission)}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={processingId === submission.id}
                      >
                        {processingId === submission.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                        Approve
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MotionWrapper>
  );
}
