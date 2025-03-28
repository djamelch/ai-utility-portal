
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { Plus, Search, Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';

export function AdminTools() {
  const [tools, setTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .order('id', { ascending: false });
        
        if (error) throw error;
        
        setTools(data || []);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTools();
  }, []);

  const filteredTools = tools.filter(tool => 
    tool.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTool = () => {
    navigate('/admin/tools/new');
  };

  const handleEditTool = (id) => {
    navigate(`/admin/tools/edit/${id}`);
  };

  const handleDeleteTool = async (id) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        const { error } = await supabase
          .from('tools')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Remove the deleted tool from state
        setTools(tools.filter(tool => tool.id !== id));
      } catch (error) {
        console.error('Error deleting tool:', error);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage AI Tools</CardTitle>
        <Button onClick={handleAddTool}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Tool
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-4 text-center">Loading tools...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No tools found. Try a different search term or add a new tool.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTools.map((tool) => (
                    <TableRow key={tool.id}>
                      <TableCell>{tool.id}</TableCell>
                      <TableCell>{tool.name}</TableCell>
                      <TableCell>{tool.primary_task || '-'}</TableCell>
                      <TableCell>{tool.pricing || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditTool(tool.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" 
                            onClick={() => handleDeleteTool(tool.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
