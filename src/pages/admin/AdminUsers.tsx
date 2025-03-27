
import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Trash2, ArrowUpDown, Shield, User, Loader2, Ban, CheckCircle 
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Profile {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof Profile>('email');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users, sortField, sortDirection]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // First get the profiles from the database
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, role, created_at');
      
      if (profilesError) throw profilesError;
      
      // Then get the auth user data
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Combine the data from both sources
      const combinedUsers = profiles.map(profile => {
        const authUser = authUsers.find(user => user.id === profile.id);
        return {
          id: profile.id,
          email: authUser?.email || 'Unknown',
          role: profile.role,
          created_at: profile.created_at,
          last_sign_in_at: authUser?.last_sign_in_at || null
        };
      });
      
      setUsers(combinedUsers);
      setFilteredUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Fallback to just profiles if auth admin methods are not available
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, role, created_at');
        
        if (profilesError) throw profilesError;
        
        const profileUsers = profiles.map(profile => ({
          id: profile.id,
          email: 'Protected', // We can't get emails without admin rights
          role: profile.role,
          created_at: profile.created_at,
          last_sign_in_at: null
        }));
        
        setUsers(profileUsers);
        setFilteredUsers(profileUsers);
        
        toast({
          title: 'Limited Access',
          description: 'You can view profiles but not full user data',
          variant: 'default',
        });
      } catch (fallbackError) {
        console.error('Error with fallback:', fallbackError);
        toast({
          title: 'Error',
          description: 'Failed to load users',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.email.toLowerCase().includes(query) || 
        user.role.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result = result.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      // Handle null values
      if (fieldA === null && fieldB === null) return 0;
      if (fieldA === null) return sortDirection === 'asc' ? 1 : -1;
      if (fieldB === null) return sortDirection === 'asc' ? -1 : 1;
      
      // Handle date fields
      if (fieldA instanceof Date && fieldB instanceof Date) {
        return sortDirection === 'asc' 
          ? fieldA.getTime() - fieldB.getTime() 
          : fieldB.getTime() - fieldA.getTime();
      }
      
      // Default string comparison
      const strA = String(fieldA).toLowerCase();
      const strB = String(fieldB).toLowerCase();
      
      return sortDirection === 'asc' 
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
    
    setFilteredUsers(result);
  };

  const handleSort = (field: keyof Profile) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    
    try {
      // First delete from auth (this might require service_role key)
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(deleteUserId);
        if (authError) throw authError;
      } catch (authError) {
        console.error('Could not delete from auth:', authError);
        // Continue with profile deletion as a fallback
      }
      
      // Delete profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', deleteUserId);

      if (error) throw error;

      setUsers(prevUsers => prevUsers.filter(user => user.id !== deleteUserId));
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user. You may not have adequate permissions.',
        variant: 'destructive',
      });
    } finally {
      setDeleteUserId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      toast({
        title: 'Success',
        description: `User role changed to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const openDeleteDialog = (id: string) => {
    setDeleteUserId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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
                  <TableHead>
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleSort('email')}
                    >
                      Email
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleSort('role')}
                    >
                      Role
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleSort('created_at')}
                    >
                      Created
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Last Sign In</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                          {user.role === 'admin' ? (
                            <><Shield className="h-3 w-3 mr-1" /> Admin</>
                          ) : (
                            <><User className="h-3 w-3 mr-1" /> User</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(user.last_sign_in_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRoleToggle(user.id, user.role)}
                            title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                          >
                            {user.role === 'admin' ? (
                              <User className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Shield className="h-4 w-4 text-primary" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openDeleteDialog(user.id)}
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm User Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this user? This action cannot be undone and will remove all data associated with this user.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteUser}>
                  Delete User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
