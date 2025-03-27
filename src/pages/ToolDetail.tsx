
import { useParams } from "react-router-dom";
import { 
  ArrowUpRight, Star, BookOpen, DollarSign, Tag, 
  Calendar, CheckCircle, XCircle, MessageCircle, Globe 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Tool } from "@/components/tools/ToolCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ToolDetailType extends Omit<Tool, 'pricing'> {
  longDescription: string;
  pros: string[];
  cons: string[];
  features: string[];
  pricing: {
    model: string;
    details: string[];
  };
  lastUpdated: string;
  website: string;
  faqs: { question: string; answer: string; }[];
  alternatives: string[];
  detail_url?: string; // Add detail_url property
}

const fallbackToolDetails: { [key: string]: ToolDetailType } = {
  "chatgpt": {
    id: "chatgpt",
    name: "ChatGPT",
    description: "Advanced AI chatbot that can engage in conversational dialogue and provide detailed responses.",
    longDescription: "ChatGPT is an AI-powered conversational agent developed by OpenAI. It's designed to understand and generate human-like text based on the input it receives. ChatGPT can answer questions, create content, assist with coding, explain complex concepts, and engage in meaningful conversations across a wide variety of topics. Its capabilities are based on a large language model that's been trained on diverse internet text, making it knowledgeable about many subjects.",
    logo: "https://via.placeholder.com/200",
    category: "AI Chatbots",
    rating: 4.8,
    reviewCount: 1250,
    pricing: {
      model: "Freemium",
      details: [
        "Free tier: Basic features with some usage limits",
        "ChatGPT Plus: $20/month with priority access and advanced features",
        "Team and enterprise plans available for organizations"
      ]
    },
    url: "https://chat.openai.com",
    website: "https://chat.openai.com",
    detail_url: "https://chat.openai.com", // Added detail_url
    isFeatured: true,
    pros: [
      "Highly versatile and can handle a wide range of queries",
      "Free tier available with good functionality",
      "Excellent at generating creative content and explanations",
      "Regular updates and improvements to the model"
    ],
    cons: [
      "Premium tier required for advanced features and faster response times",
      "May occasionally produce incorrect information",
      "Limited by training data cutoff date",
      "No built-in internet browsing capabilities in the basic version"
    ],
    features: [
      "Natural language understanding and generation",
      "Code assistance and debugging",
      "Content creation and brainstorming",
      "Language translation and explanation",
      "Custom instructions and memory"
    ],
    lastUpdated: "June 2023",
    faqs: [
      {
        question: "Is ChatGPT free to use?",
        answer: "Yes, ChatGPT offers a free tier with basic functionality. However, there's also a premium subscription (ChatGPT Plus) that provides additional benefits like faster response times, priority access during peak times, and access to more advanced features."
      },
      {
        question: "Can ChatGPT write code?",
        answer: "Yes, ChatGPT can help write, explain, and debug code across many programming languages. It can provide sample code snippets, help troubleshoot issues, and explain programming concepts."
      },
      {
        question: "Is ChatGPT suitable for business use?",
        answer: "OpenAI offers specific plans for business and enterprise use of ChatGPT with additional privacy, security, and administrative features suited for professional environments."
      }
    ],
    alternatives: ["claude", "bard", "llama"]
  }
};

const ToolDetail = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [tool, setTool] = useState<ToolDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchToolDetails = async () => {
      if (!id && !slug) return;
      
      try {
        console.log(`Fetching tool with id: ${id} or slug: ${slug}`);
        setLoading(true);
        
        // If we have a slug, search by slug
        if (slug) {
          console.log("Searching by slug:", slug);
          // Try to match by slug directly
          const { data, error } = await supabase
            .from('tools')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();
          
          if (error) {
            console.error("Error fetching by slug:", error);
            throw error;
          }
          
          if (data) {
            console.log('Found tool by exact slug:', data);
            processToolData(data);
            return;
          }
          
          // If we didn't find by exact slug, try a broader search
          console.log("No exact slug match, trying company name search");
          const { data: nameData, error: nameError } = await supabase
            .from('tools')
            .select('*')
            .ilike('company_name', `%${slug.replace(/-/g, ' ')}%`)
            .limit(1);
          
          if (nameError) {
            console.error("Error in company name search:", nameError);
            throw nameError;
          }
          
          if (nameData && nameData.length > 0) {
            console.log('Found tool by company name search:', nameData[0]);
            processToolData(nameData[0]);
            return;
          }
        }
        
        // If we reach here, check by ID
        if (id) {
          console.log("Searching by ID:", id);
          const numericId = parseInt(id, 10);
          
          if (!isNaN(numericId)) {
            const { data, error } = await supabase
              .from('tools')
              .select('*')
              .eq('id', numericId)
              .maybeSingle();
            
            if (error) {
              console.error("Error fetching by ID:", error);
              throw error;
            }
            
            if (data) {
              console.log('Found tool by id:', data);
              processToolData(data);
              return;
            }
          }
        }
        
        // If we got here, check fallback data
        console.log('Tool not found in database, checking fallback data');
        
        if (slug && fallbackToolDetails[slug]) {
          console.log('Using fallback data for slug:', slug);
          setTool(fallbackToolDetails[slug]);
        } else if (id && fallbackToolDetails[id]) {
          console.log('Using fallback data for id:', id);
          setTool(fallbackToolDetails[id]);
        } else {
          console.log('No data found in any source');
          toast({
            title: "Tool Not Found",
            description: "The tool you're looking for doesn't exist or has been removed",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error processing tool data:', error);
        toast({
          title: "Error Loading Tool",
          description: "An error occurred while loading tool details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchToolDetails();
  }, [id, slug, toast]);
  
  // Process the tool data from the database into our ToolDetailType format
  const processToolData = (data: any) => {
    try {
      console.log("Processing tool data:", data);
      
      // Process FAQs
      let parsedFaqs: { question: string; answer: string; }[] = [];
      
      if (data.faqs) {
        try {
          if (Array.isArray(data.faqs)) {
            parsedFaqs = data.faqs.map((faq: any) => ({
              question: faq.question || "Question",
              answer: faq.answer || "No answer provided"
            }));
          } else if (typeof data.faqs === 'object') {
            // Handle q1/a1, q2/a2 format
            const questionKeys = Object.keys(data.faqs).filter(key => key.startsWith('q') && /^q\d+$/.test(key));
            
            questionKeys.forEach(qKey => {
              const num = qKey.substring(1);
              const aKey = `a${num}`;
              
              if (data.faqs[aKey]) {
                parsedFaqs.push({
                  question: data.faqs[qKey],
                  answer: data.faqs[aKey]
                });
              }
            });
            
            // If no structured q/a pairs found, try to convert the object directly
            if (parsedFaqs.length === 0) {
              parsedFaqs = Object.entries(data.faqs).map(([key, value]) => ({
                question: key,
                answer: String(value)
              }));
            }
          }
        } catch (e) {
          console.error('Error parsing FAQs:', e);
          parsedFaqs = [];
        }
      }
      
      // Process pros and cons
      let processPros: string[] = [];
      let processCons: string[] = [];
      
      if (Array.isArray(data.pros)) {
        processPros = data.pros.map((item: any) => String(item));
      }
      
      if (Array.isArray(data.cons)) {
        processCons = data.cons.map((item: any) => String(item));
      }
      
      // Process applicable tasks (features)
      let processFeatures: string[] = [];
      if (Array.isArray(data.applicable_tasks)) {
        processFeatures = data.applicable_tasks.map((item: any) => String(item));
      }
      
      // Create the processed tool object
      const processedTool: ToolDetailType = {
        id: data.id.toString(),
        name: data.company_name || 'Unknown Tool',
        description: data.short_description || '',
        longDescription: data.full_description || data.short_description || '',
        logo: data.logo_url || 'https://via.placeholder.com/200?text=No+Logo',
        category: data.primary_task || 'Uncategorized',
        rating: 0,
        reviewCount: 0,
        pricing: {
          model: data.pricing || 'Unknown',
          details: [data.pricing || 'Pricing details unavailable']
        },
        url: data.visit_website_url || '#',
        website: data.visit_website_url || '#',
        detail_url: data.detail_url || data.visit_website_url || '#', // Added detail_url
        isFeatured: false,
        isNew: false,
        pros: processPros,
        cons: processCons,
        features: processFeatures,
        lastUpdated: data.updated_at ? new Date(data.updated_at).toLocaleDateString() : 'Recently',
        faqs: parsedFaqs,
        alternatives: []
      };
      
      console.log("Processed tool object:", processedTool);
      setTool(processedTool);
    } catch (error) {
      console.error("Error in processToolData:", error);
      throw error;
    }
  };
  
  const handleVisitWebsite = () => {
    try {
      // Prioritize detail_url if available, otherwise fall back to website
      const visitUrl = tool?.detail_url || tool?.website || '#';
      
      if (visitUrl && visitUrl !== '#') {
        const toolId = tool?.id;
        if (toolId && !isNaN(parseInt(toolId.toString()))) {
          // Fix: Use async/await with try/catch
          (async () => {
            try {
              await supabase.rpc('increment_tool_click_count', { tool_id: parseInt(toolId.toString()) });
              console.log('Click count incremented');
            } catch (err) {
              console.error('Error incrementing click count:', err);
            }
          })();
        }
        
        console.log(`Redirecting to external website: ${visitUrl}`);
        window.open(visitUrl, '_blank', 'noopener,noreferrer');
      } else {
        toast({
          title: "Website URL not available",
          description: "This tool doesn't have a website URL defined",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error handling website visit:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading tool details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!tool) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Tool Not Found</h1>
            <p className="mt-2 text-muted-foreground">The tool you're looking for doesn't exist or has been removed.</p>
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
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 overflow-hidden rounded-xl bg-secondary/50">
                    <img 
                      src={tool?.logo} 
                      alt={`${tool?.name} logo`} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=AI+Tool';
                      }}
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl md:text-3xl font-bold">{tool?.name}</h1>
                      {tool?.isFeatured && (
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1 text-sm">
                        <Tag size={14} className="text-muted-foreground" />
                        {tool?.category}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <DollarSign size={14} className="text-muted-foreground" />
                        {tool?.pricing.model}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <Calendar size={14} className="text-muted-foreground" />
                        Updated: {tool?.lastUpdated}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground">{tool?.description}</p>
                
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.round(tool?.rating || 0) ? "fill-brand-400 text-brand-400" : "text-muted-foreground/30"}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{tool?.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({tool?.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-72 flex-shrink-0">
                <div className="rounded-xl border border-border/40 bg-background p-5">
                  <button
                    onClick={handleVisitWebsite}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Visit Website
                    <ArrowUpRight size={16} />
                  </button>
                  
                  <div className="mt-4 space-y-3">
                    <button className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-medium hover:bg-secondary/50 transition-colors">
                      Save to Favorites
                    </button>
                    <button className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-medium hover:bg-secondary/50 transition-colors">
                      Write a Review
                    </button>
                  </div>
                  
                  <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                    <h3 className="font-medium">Share this Tool</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <button className="rounded-full p-2 bg-background hover:bg-secondary transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23 3.01006C22.0424 3.68553 20.9821 4.20217 19.86 4.54006C19.2577 3.84757 18.4573 3.35675 17.567 3.13398C16.6767 2.91122 15.7395 2.96725 14.8821 3.29451C14.0247 3.62177 13.2884 4.20446 12.773 4.96377C12.2575 5.72309 11.9877 6.62239 12 7.54006V8.54006C10.2426 8.58562 8.50127 8.19587 6.93101 7.4055C5.36074 6.61513 4.01032 5.44869 3 4.01006C3 4.01006 -1 13.0101 8 17.0101C5.94053 18.408 3.48716 19.109 1 19.0101C10 24.0101 21 19.0101 21 7.51006C20.9991 7.23151 20.9723 6.95365 20.92 6.68006C21.9406 5.67355 22.6608 4.40277 23 3.01006Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="rounded-full p-2 bg-background hover:bg-secondary transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="rounded-full p-2 bg-background hover:bg-secondary transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="rounded-full p-2 bg-background hover:bg-secondary transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="rounded-full p-2 bg-background hover:bg-secondary transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 12H16M12 8V16M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>
          
          <MotionWrapper animation="fadeIn" delay="delay-200" className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-12">
                <div>
                  <h2 className="text-2xl font-bold mb-4">About {tool.name}</h2>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p>{tool.longDescription}</p>
                  </div>
                </div>
                
                {tool.features && tool.features.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                    <ul className="space-y-2">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle size={20} className="mt-0.5 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {(tool.pros.length > 0 || tool.cons.length > 0) && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Pros & Cons</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {tool.pros.length > 0 && (
                        <div className="rounded-xl border border-border/40 bg-background p-5">
                          <h3 className="font-medium text-green-500 flex items-center gap-2 mb-3">
                            <CheckCircle size={18} />
                            Pros
                          </h3>
                          <ul className="space-y-2">
                            {tool.pros.map((pro, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-500">+</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {tool.cons.length > 0 && (
                        <div className="rounded-xl border border-border/40 bg-background p-5">
                          <h3 className="font-medium text-red-500 flex items-center gap-2 mb-3">
                            <XCircle size={18} />
                            Cons
                          </h3>
                          <ul className="space-y-2">
                            {tool.cons.map((con, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-red-500">-</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div>
                  <h2 className="text-2xl font-bold mb-4">Pricing</h2>
                  <div className="rounded-xl border border-border/40 bg-background p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign size={18} className="text-primary" />
                      <h3 className="font-medium">{tool.pricing.model}</h3>
                    </div>
                    <ul className="space-y-2">
                      {tool.pricing.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span>•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {Array.isArray(tool.faqs) && tool.faqs.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {tool.faqs.map((faq, index) => (
                        <div key={index} className="rounded-xl border border-border/40 bg-background p-5">
                          <h3 className="font-medium mb-2 flex items-start gap-2">
                            <MessageCircle size={18} className="text-primary mt-1" />
                            {faq.question}
                          </h3>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">User Reviews</h2>
                    <button className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors">
                      Write a Review
                    </button>
                  </div>
                  
                  <div className="rounded-xl border border-border/40 bg-background p-6 text-center">
                    <p className="text-muted-foreground">No reviews yet. Be the first to review {tool.name}!</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                {tool.alternatives && tool.alternatives.length > 0 && (
                  <div className="rounded-xl border border-border/40 bg-background p-5">
                    <h3 className="font-medium mb-4">Alternatives to {tool.name}</h3>
                    <ul className="space-y-3">
                      {tool.alternatives.map((alternative, index) => (
                        <li key={index}>
                          <a href={`/tool/${alternative}`} className="flex items-center gap-2 rounded-lg p-2 hover:bg-secondary/50 transition-colors">
                            <div className="h-8 w-8 overflow-hidden rounded-md bg-secondary/50">
                              <img 
                                src={`https://via.placeholder.com/80?text=${alternative.charAt(0).toUpperCase()}`} 
                                alt={`${alternative} logo`} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="font-medium capitalize">{alternative}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="rounded-xl border border-border/40 bg-background p-5">
                  <h3 className="font-medium mb-4">Connect with {tool.name}</h3>
                  
                  <a href={tool.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg p-2 hover:bg-secondary/50 transition-colors">
                    <Globe size={18} className="text-primary" />
                    <span>Official Website</span>
                  </a>
                  
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Have you used {tool.name}? Share your experience and help others make informed decisions.</p>
                    <button className="mt-3 w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                      Write a Review
                    </button>
                  </div>
                </div>
                
                <div className="rounded-xl border border-border/40 bg-background p-5">
                  <h3 className="font-medium mb-4">Report an Issue</h3>
                  <p className="text-sm text-muted-foreground">Found incorrect information about {tool.name}? Let us know and we'll fix it.</p>
                  <button className="mt-3 w-full rounded-lg border border-input bg-background px-4 py-2 font-medium hover:bg-secondary/50 transition-colors">
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ToolDetail;
