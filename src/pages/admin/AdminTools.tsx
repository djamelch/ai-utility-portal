import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Edit, Trash2, Plus, Search, Eye, Filter, ArrowUpDown, Loader2, Award, ShieldCheck, Star, StarOff, Shield, X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface Tool {
  id: number;
  company_name: string;
  short_description: string | null;
  pricing: string | null;
  primary_task: string | null;
  updated_at: string | null;
  click_count: number | null;
  is_featured: boolean | null;
  is_verified: boolean | null;
}

export function AdminTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteToolId, setDeleteToolId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof Tool>('company_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [updatingFeatures, setUpdatingFeatures] = useState<Record<number, boolean>>({});
  const [updatingVerified, setUpdatingVerified] = useState<Record<number, boolean>>({});
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTools();
  }, []);

  useEffect(() => {
    filterTools();
  }, [searchQuery, tools, sortField, sortDirection]);

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      // Get company name suggestions
      const companyNameSuggestions = tools
        .filter(tool => tool.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(tool => `Tool: ${tool.company_name}`);

      // Get category suggestions  
      const categories = Array.from(new Set(
        tools
          .map(tool => tool.primary_task)
          .filter(Boolean)
      ));
      
      const categorySuggestions = categories
        .filter(category => category && category.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(category => `Category: ${category}`);

      // Get pricing suggestions
      const pricingOptions = Array.from(new Set(
        tools
          .map(tool => tool.pricing)
          .filter(Boolean)
      ));
      
      const pricingSuggestions = pricingOptions
        .filter(pricing => pricing && pricing.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(pricing => `Pricing: ${pricing}`);

      // Combine and limit suggestions  
      setSearchSuggestions([
        ...companyNameSuggestions.slice(0, 5),
        ...categorySuggestions.slice(0, 3),
        ...pricingSuggestions.slice(0, 2)
      ]);
      
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, tools]);

  // Show dialog on / press
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const fetchTools = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tools')
        .select('id, company_name, short_description, pricing, primary_task, updated_at, click_count, is_featured, is_verified');

      if (error) throw error;

      console.log("Admin tools data:", data);
      const toolsWithFeatures = data || [];

      setTools(toolsWithFeatures);
      setFilteredTools(toolsWithFeatures);
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tools',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTools = () => {
    let result = [...tools];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tool => 
        (tool.company_name && tool.company_name.toLowerCase().includes(query)) || 
        (tool.short_description && tool.short_description.toLowerCase().includes(query)) ||
        (tool.primary_task && tool.primary_task.toLowerCase().includes(query)) ||
        (tool.pricing && tool.pricing.toLowerCase().includes(query))
      );
    }
    
    result = result.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (fieldA === null && fieldB === null) return 0;
      if (fieldA === null) return sortDirection === 'asc' ? 1 : -1;
      if (fieldB === null) return sortDirection === 'asc' ? -1 : 1;
      
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      
      const strA = typeof fieldA === 'string' ? fieldA.toLowerCase() : '';
      const strB = typeof fieldB === 'string' ? fieldB.toLowerCase() : '';
      
      return sortDirection === 'asc' 
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
    
    setFilteredTools(result);
  };

  const handleSelectSuggestion = (value: string) => {
    if (value.startsWith("Tool: ")) {
      setSearchQuery(value.replace("Tool: ", ""));
    } else if (value.startsWith("Category: ")) {
      setSearchQuery(value.replace("Category: ", ""));
    } else if (value.startsWith("Pricing: ")) {
      setSearchQuery(value.replace("Pricing: ", ""));
    } else {
      setSearchQuery(value);
    }
    
    setShowSuggestions(false);
    setCommandOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchSuggestions([]);
  };

  const handleSort = (field: keyof Tool) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const handleDeleteTool = async () => {
    if (!deleteToolId) return;
    
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', deleteToolId);

      if (error) throw error;

      setTools(prevTools => prevTools.filter(tool => tool.id !== deleteToolId));
      toast({
        title: 'Success',
        description: 'Tool deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tool',
        variant: 'destructive',
      });
    } finally {
      setDeleteToolId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (id: number) => {
    setDeleteToolId(id);
    setIsDeleteDialogOpen(true);
  };

  const toggleFeaturedStatus = async (tool: Tool) => {
    try {
      setUpdatingFeatures(prev => ({ ...prev, [tool.id]: true }));
      
      const newStatus = !tool.is_featured;
      
      const { error } = await supabase
        .from('tools')
        .update({ 
          is_featured: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', tool.id);

      if (error) throw error;

      setTools(prevTools => 
        prevTools.map(t => 
          t.id === tool.id ? { ...t, is_featured: newStatus } : t
        )
      );

      toast({
        title: 'Success',
        description: `Tool ${newStatus ? 'marked as featured' : 'removed from featured'}`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update featured status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingFeatures(prev => ({ ...prev, [tool.id]: false }));
    }
  };

  const toggleVerifiedStatus = async (tool: Tool) => {
    try {
      setUpdatingVerified(prev => ({ ...prev, [tool.id]: true }));
      
      const newStatus = !tool.is_verified;
      
      const { error } = await supabase
        .from('tools')
        .update({ 
          is_verified: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', tool.id);

      if (error) throw error;

      setTools(prevTools => 
        prevTools.map(t => 
          t.id === tool.id ? { ...t, is_verified: newStatus } : t
        )
      );

      toast({
        title: 'Success',
        description: `Tool ${newStatus ? 'marked as verified' : 'removed from verified'}`,
      });
    } catch (error) {
      console.error('Error updating verified status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update verified status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingVerified(prev => ({ ...prev, [tool.id]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools... (Press / to focus)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-8"
            onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowSuggestions(false);
              } else if (e.key === "ArrowDown" && showSuggestions) {
                e.preventDefault();
                setCommandOpen(true);
              }
            }}
          />
          {searchQuery && (
            <button 
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {/* Real-time suggestions dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-background border border-input rounded-md shadow-md">
              <ul className="py-1">
                {searchSuggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    className="px-3 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion.startsWith("Category:") ? (
                      <Filter className="mr-2 h-4 w-4 text-primary" />
                    ) : suggestion.startsWith("Pricing:") ? (
                      <Award className="mr-2 h-4 w-4 text-amber-500" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button onClick={() => navigate('/admin/tools/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add New Tool
        </Button>
      </div>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput 
          placeholder="Search tools..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {searchSuggestions.length > 0 ? (
              searchSuggestions.map((suggestion, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleSelectSuggestion(suggestion)}
                  className="cursor-pointer"
                >
                  {suggestion.startsWith("Category:") ? (
                    <Filter className="mr-2 h-4 w-4 text-primary" />
                  ) : suggestion.startsWith("Pricing:") ? (
                    <Award className="mr-2 h-4 w-4 text-amber-500" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  {suggestion}
                </CommandItem>
              ))
            ) : (
              <CommandItem>Start typing to see suggestions</CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleSort('company_name')}
                    >
                      Name
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleSort('primary_task')}
                    >
                      Category
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleSort('pricing')}
                    >
                      Pricing
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort('is_featured')}
                    >
                      Status
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleSort('click_count')}
                    >
                      Clicks
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => (
                    <TableRow 
                      key={tool.id}
                      className={cn(
                        tool.is_featured ? "border-2 border-amber-400 dark:border-amber-500" : "",
                      )}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {tool.is_featured && (
                            <Award className="h-4 w-4 text-amber-500 mr-2 shrink-0" />
                          )}
                          {tool.is_verified && (
                            <ShieldCheck className="h-4 w-4 text-blue-500 mr-2 shrink-0" />
                          )}
                          <span>{tool.company_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="line-clamp-1">{tool.short_description || 'N/A'}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{tool.primary_task || 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">{tool.pricing || 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1.5">
                          {/* Featured Status Badge and Toggle */}
                          {tool.is_featured && (
                            <Badge variant="featured" className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white">
                              <Award className="h-3 w-3 text-white" />
                              <span>Featured</span>
                              <Toggle 
                                size="sm"
                                variant="outline"
                                aria-label="Remove featured status"
                                pressed={true}
                                disabled={updatingFeatures[tool.id]}
                                onPressedChange={() => toggleFeaturedStatus(tool)}
                              >
                                {updatingFeatures[tool.id] ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <StarOff className="h-3 w-3" />
                                )}
                              </Toggle>
                            </Badge>
                          )}
                          {!tool.is_featured && (
                            <Toggle 
                              size="sm"
                              variant="outline"
                              aria-label="Mark as featured"
                              pressed={false}
                              disabled={updatingFeatures[tool.id]}
                              onPressedChange={() => toggleFeaturedStatus(tool)}
                              className="flex items-center gap-1"
                            >
                              {updatingFeatures[tool.id] ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <Star className="h-3 w-3 mr-1" />
                              )}
                              <span>Feature</span>
                            </Toggle>
                          )}
                          
                          {/* Verified Status Badge and Toggle */}
                          {tool.is_verified && (
                            <Badge variant="verified" className="flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Verified</span>
                              <Toggle 
                                size="sm"
                                variant="outline"
                                aria-label="Remove verified status"
                                pressed={true}
                                disabled={updatingVerified[tool.id]}
                                onPressedChange={() => toggleVerifiedStatus(tool)}
                              >
                                {updatingVerified[tool.id] ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Shield className="h-3 w-3" />
                                )}
                              </Toggle>
                            </Badge>
                          )}
                          {!tool.is_verified && (
                            <Toggle 
                              size="sm"
                              variant="outline"
                              aria-label="Mark as verified"
                              pressed={false}
                              disabled={updatingVerified[tool.id]}
                              onPressedChange={() => toggleVerifiedStatus(tool)}
                              className="flex items-center gap-1"
                            >
                              {updatingVerified[tool.id] ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <ShieldCheck className="h-3 w-3 mr-1" />
                              )}
                              <span>Verify</span>
                            </Toggle>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{tool.click_count || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate(`/tool/${tool.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate(`/admin/tools/edit/${tool.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openDeleteDialog(tool.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No tools found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this tool? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteTool}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
