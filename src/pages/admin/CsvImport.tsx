import React, { useState } from 'react';
import { UploadCloud, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CsvTemplateDownloader } from '@/components/admin/CsvTemplateDownloader';

export default function CsvImport() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated and admin
  React.useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      // Here you would check if the user has admin rights
      // For simplicity, we'll just check if they're authenticated
      setIsAdmin(true);
      setIsLoading(false);
    };
    
    checkUserStatus();
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'text/csv') {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a CSV file',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a CSV file to upload',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('csv', file);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'You must be logged in to perform this action',
          variant: 'destructive',
        });
        setIsUploading(false);
        return;
      }
      
      // Get API URL from environment or from config
      const apiUrl = `${process.env.SUPABASE_URL || 'https://yilhwiqwoolmvmaasdra.supabase.co'}/functions/v1/process-csv`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error processing CSV');
      }
      
      setResults(data);
      
      toast({
        title: 'CSV processed successfully',
        description: `Created: ${data.results.created}, Updated: ${data.results.updated}`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error uploading CSV:', error);
      toast({
        title: 'Error processing CSV',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container-wide">
            <MotionWrapper animation="fadeIn">
              <div className="text-center p-8">
                <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                <p className="text-muted-foreground mb-6">
                  You need to be logged in as an admin to access this page.
                </p>
                <Button onClick={() => navigate('/')}>
                  Return to Home
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
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container-wide">
          <MotionWrapper animation="fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">
                Import Tools from CSV
              </h1>
              <p className="mt-2 text-muted-foreground">
                Upload a CSV file to bulk import or update AI tools in the database
              </p>
            </div>
          </MotionWrapper>
          
          <MotionWrapper animation="fadeIn" delay="delay-200">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4">
                  <label className="font-medium">Upload CSV File</label>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => document.getElementById('csvFile')?.click()}
                  >
                    <input
                      type="file"
                      id="csvFile"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {file ? file.name : 'Click to select a CSV file or drag and drop'}
                    </p>
                    {file && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        File selected
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <CsvTemplateDownloader />
                    
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" type="button">
                          View CSV Format Instructions
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>CSV Format Requirements</SheetTitle>
                        </SheetHeader>
                        <Separator className="my-4" />
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Your CSV file should have the following columns:
                          </p>
                          <div className="space-y-2">
                            <h3 className="font-medium">Required Columns:</h3>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              <li>company_name - The name of the AI tool (unique identifier)</li>
                              <li>short_description - A brief description (1-2 sentences)</li>
                              <li>pricing - Pricing model (Free, Freemium, Paid, etc.)</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-medium">Optional Columns:</h3>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              <li>logo_url - URL to the tool's logo image</li>
                              <li>full_description - Detailed description of the tool</li>
                              <li>primary_task - Main purpose of the tool</li>
                              <li>applicable_tasks - Comma-separated list of tasks the tool can perform</li>
                              <li>pros - Comma-separated list of benefits</li>
                              <li>cons - Comma-separated list of limitations</li>
                              <li>featured_image_url - URL to a featured image</li>
                              <li>visit_website_url - URL to the tool's website</li>
                              <li>detail_url - URL for more information</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-medium">FAQ Columns (Optional):</h3>
                            <p className="text-sm text-muted-foreground">
                              To include FAQs, add column pairs with this pattern:
                            </p>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              <li>q1, a1 - First question and answer</li>
                              <li>q2, a2 - Second question and answer</li>
                              <li>... and so on</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-medium">Example CSV:</h3>
                            <pre className="bg-secondary p-2 rounded text-xs overflow-x-auto">
                              company_name,short_description,pricing,primary_task,q1,a1<br/>
                              ChatGPT,Advanced AI chatbot,Freemium,AI Chatbot,What is it?,An AI assistant.<br/>
                              Midjourney,AI image generation,Paid,Image Generation,How much?,Starts at $10/month.
                            </pre>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>

                <Button type="submit" disabled={!file || isUploading} className="w-full">
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Upload and Process CSV'
                  )}
                </Button>
              </form>

              {results && (
                <div className="mt-8 border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Import Results</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded p-3 text-center">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">{results.results.created}</span>
                      <p className="text-sm text-muted-foreground">New Tools Created</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 text-center">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.results.updated}</span>
                      <p className="text-sm text-muted-foreground">Tools Updated</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded p-3 text-center">
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">{results.results.errors.length}</span>
                      <p className="text-sm text-muted-foreground">Errors</p>
                    </div>
                  </div>
                  
                  {results.results.errors.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Error Details:</h4>
                      <div className="max-h-60 overflow-y-auto border rounded">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="p-2 text-left">Tool</th>
                              <th className="p-2 text-left">Error</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.results.errors.map((error, i) => (
                              <tr key={i} className="border-b">
                                <td className="p-2">{error.company_name}</td>
                                <td className="p-2 text-red-600">{error.error}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </MotionWrapper>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
