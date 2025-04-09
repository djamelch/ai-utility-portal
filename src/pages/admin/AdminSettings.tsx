import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Check, Save, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function AdminSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedLogo = localStorage.getItem('site-logo');
    const savedFavicon = localStorage.getItem('site-favicon');
    
    if (savedLogo) {
      setLogoPreview(savedLogo);
    }
    
    if (savedFavicon) {
      setFaviconPreview(savedFavicon);
    }
  }, []);

  const generalForm = useForm({
    defaultValues: {
      siteName: 'AI Tools Directory',
      siteDescription: 'Directory of the best AI tools on the market',
      toolsPerPage: '12',
      enableFeaturedTools: true,
      enableVerifiedTools: true,
    },
  });

  const securityForm = useForm({
    defaultValues: {
      requireEmailVerification: true,
      allowUserSignup: true,
      autoApproveReviews: false,
    },
  });

  const handleSaveGeneral = async (data: any) => {
    setIsLoading(true);
    try {
      console.log('Saving general settings:', data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Settings saved',
        description: 'General settings have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSecurity = async (data: any) => {
    setIsLoading(true);
    try {
      console.log('Saving security settings:', data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Settings saved',
        description: 'Security settings have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFaviconFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = async () => {
    setIsLoading(true);
    try {
      if (logoPreview) {
        localStorage.setItem('site-logo', logoPreview);
        console.log('Logo saved to localStorage');
      }
      
      if (faviconPreview) {
        localStorage.setItem('site-favicon', faviconPreview);
        console.log('Favicon saved to localStorage');
        
        window.location.reload();
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: 'Branding updated',
        description: 'Logo and favicon have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving branding:', error);
      toast({
        title: 'Error',
        description: 'Failed to update branding. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Admin Settings</h2>
        <p className="text-muted-foreground">
          Configure your website settings and manage user permissions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security & Permissions</TabsTrigger>
          <TabsTrigger value="branding">Logo & Favicon</TabsTrigger>
          <TabsTrigger value="tools">Tool Management</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic website settings and appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form
                  id="general-settings-form"
                  onSubmit={generalForm.handleSubmit(handleSaveGeneral)}
                  className="space-y-4"
                >
                  <FormField
                    control={generalForm.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your website shown in the browser tab
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Used for SEO and site metadata
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="toolsPerPage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tools Per Page</FormLabel>
                        <FormControl>
                          <Input type="number" min="4" max="48" {...field} />
                        </FormControl>
                        <FormDescription>
                          Number of tools to display per page in listings
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="enableFeaturedTools"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Featured Tools
                          </FormLabel>
                          <FormDescription>
                            Enable featured tools section on homepage
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="enableVerifiedTools"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Verified Tools
                          </FormLabel>
                          <FormDescription>
                            Show verification badges on verified tools
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                form="general-settings-form"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security & Permissions</CardTitle>
              <CardDescription>
                Configure user access and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form
                  id="security-settings-form"
                  onSubmit={securityForm.handleSubmit(handleSaveSecurity)}
                  className="space-y-4"
                >
                  <FormField
                    control={securityForm.control}
                    name="requireEmailVerification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Verification
                          </FormLabel>
                          <FormDescription>
                            Require users to verify their email address
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="allowUserSignup"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Public Signup
                          </FormLabel>
                          <FormDescription>
                            Allow new users to register accounts
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="autoApproveReviews"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Auto-Approve Reviews
                          </FormLabel>
                          <FormDescription>
                            Automatically publish user reviews without approval
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                form="security-settings-form"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo & Favicon</CardTitle>
              <CardDescription>
                Update your website's logo and favicon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-medium">Website Logo</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a new logo for your website. Recommended size: 200x50 pixels.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          {logoPreview ? (
                            <img 
                              src={logoPreview} 
                              alt="Logo Preview" 
                              className="max-h-20 max-w-full object-contain" 
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <ImageIcon className="h-8 w-8" />
                              <span className="text-sm">Click to upload logo</span>
                            </div>
                          )}
                        </div>
                      </label>
                      <input
                        id="logo-upload"
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={handleLogoChange}
                      />
                    </div>
                    
                    {logoPreview && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setLogoPreview(null);
                          setLogoFile(null);
                          localStorage.removeItem('site-logo');
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-medium">Website Favicon</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a new favicon for your website. Recommended size: 32x32 or 64x64 pixels (PNG format).
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label htmlFor="favicon-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          {faviconPreview ? (
                            <div className="flex flex-col items-center gap-2">
                              <img 
                                src={faviconPreview} 
                                alt="Favicon Preview" 
                                className="h-16 w-16 object-contain" 
                              />
                              <span className="text-xs text-muted-foreground">
                                {faviconFile?.name}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <ImageIcon className="h-8 w-8" />
                              <span className="text-sm">Click to upload favicon</span>
                            </div>
                          )}
                        </div>
                      </label>
                      <input
                        id="favicon-upload"
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg"
                        onChange={handleFaviconChange}
                      />
                    </div>
                    
                    {faviconPreview && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setFaviconPreview(null);
                          setFaviconFile(null);
                          localStorage.removeItem('site-favicon');
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveBranding}
                disabled={isLoading || (!logoFile && !faviconFile)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tool Management Settings</CardTitle>
              <CardDescription>
                Configure how tools are managed and displayed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-yellow-800 dark:text-yellow-400">
                        Tool Management
                      </h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
                        To manage your tools, please use the Tools tab in the admin dashboard where you can add, edit, and delete tools.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                  <div className="flex gap-2">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-green-800 dark:text-green-400">
                        Admin Features Available
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-500 mt-1">
                        You can manage tools, users, and settings from the respective tabs in this dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
