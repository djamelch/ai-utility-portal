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
  Edit, Trash2, Plus, Search, Eye, Filter, ArrowUpDown, Loader2, Award, ShieldCheck 
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

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
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTools();
  }, []);

  useEffect(() => {
    filterTools();
  }, [searchQuery, tools, sortField, sortDirection]);

  const fetchTools = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tools')
        .select('id, company_name, short_description, pricing, primary_task, updated_at, click_count, is_featured, is_verified')
        .order('company_name');

      if (error) throw error;

      setTools(data || []);
      setFilteredTools(data || []);
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
        tool.company_name.toLowerCase().includes(query) || 
        (tool.short_description && tool.short_description.toLowerCase().includes(query)) ||
        (tool.primary_task && tool.primary_task.toLowerCase().includes(query))
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
      
      const strA = String(fieldA).toLowerCase();
      const strB = String(fieldB).toLowerCase();
      
      return sortDirection === 'asc' 
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
    
    setFilteredTools(result);
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => navigate('/admin/tools/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add New Tool
        </Button>
      </div>

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
                  <TableHead className="hidden md:table-cell">Status</TableHead>
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
                    <TableRow key={tool.id}>
                      <TableCell className="font-medium">{tool.company_name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="line-clamp-1">{tool.short_description || 'N/A'}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{tool.primary_task || 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">{tool.pricing || 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1.5">
                          {tool.is_featured && tool.is_verified ? (
                            <Badge variant="featured" className="flex items-center gap-1.5">
                              <Award className="h-3 w-3" />
                              <ShieldCheck className="h-3 w-3" />
                              <span>Featured & Verified</span>
                            </Badge>
                          ) : (
                            <>
                              {tool.is_featured && (
                                <Badge variant="featured" className="flex items-center gap-1">
                                  <Award className="h-3 w-3" />
                                  <span>Featured</span>
                                </Badge>
                              )}
                              {tool.is_verified && (
                                <Badge variant="verified" className="flex items-center gap-1">
                                  <ShieldCheck className="h-3 w-3" />
                                  <span>Verified</span>
                                </Badge>
                              )}
                            </>
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
