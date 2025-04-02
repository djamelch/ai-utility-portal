
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageLoadingWrapper } from "@/components/ui/PageLoadingWrapper";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Define the form schema
const toolSubmissionSchema = z.object({
  name: z.string().min(3, { message: "Tool name must be at least 3 characters" }),
  website: z.string().url({ message: "Please enter a valid URL" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  pricing: z.string().min(1, { message: "Please select a pricing model" }),
  contactEmail: z.string().email({ message: "Please provide a valid email address" }),
  additionalInfo: z.string().optional(),
});

type ToolSubmissionFormValues = z.infer<typeof toolSubmissionSchema>;

export default function SubmitTool() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ToolSubmissionFormValues>({
    resolver: zodResolver(toolSubmissionSchema),
    defaultValues: {
      name: "",
      website: "",
      description: "",
      category: "",
      pricing: "",
      contactEmail: user?.email || "",
      additionalInfo: "",
    },
  });

  async function onSubmit(values: ToolSubmissionFormValues) {
    setIsSubmitting(true);
    
    try {
      // Store the submission in the database (note: we'll use tool_submissions table which we'll create later)
      const { error } = await supabase.from("tool_submissions").insert({
        tool_name: values.name,
        website_url: values.website,
        description: values.description,
        category: values.category,
        pricing: values.pricing,
        contact_email: values.contactEmail,
        additional_info: values.additionalInfo,
        user_id: user?.id,
        status: "pending",
      });

      if (error) throw error;
      
      toast({
        title: "Submission successful!",
        description: "Your tool has been submitted for review. We'll get back to you soon.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting tool:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your tool. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const categories = [
    "Content Creation", 
    "Image Generation", 
    "Video Editing", 
    "Audio Processing", 
    "Data Analysis", 
    "Coding Assistant", 
    "Productivity", 
    "Marketing",
    "Research",
    "Customer Support",
    "Other"
  ];
  
  const pricingModels = [
    "Free", 
    "Freemium", 
    "Paid", 
    "Subscription", 
    "One-time Purchase"
  ];

  return (
    <PageLoadingWrapper>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container-wide">
            <div className="mx-auto max-w-3xl">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Submit Your AI Tool</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Have a great AI tool? Submit it for review and get featured on our platform.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tool Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter tool name" {...field} />
                          </FormControl>
                          <FormDescription>The name of your AI tool</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormDescription>Your tool's website address</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe what your tool does and its key features" 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>Provide a detailed description of your tool</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>Choose the most relevant category</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pricing"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pricing Model</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select pricing model" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {pricingModels.map((model) => (
                                  <SelectItem key={model} value={model}>
                                    {model}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>How is your tool priced?</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormDescription>We'll use this to contact you about your submission</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any other information you'd like to share" 
                              className="min-h-[80px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>Pricing details, special features, etc.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Tool"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageLoadingWrapper>
  );
}
