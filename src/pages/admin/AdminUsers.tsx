
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Shield, ShieldAlert, MailCheck } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToToggleAdmin, setUserToToggleAdmin] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users from Supabase auth - get the users from auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Fetch profiles to get role information
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, role, created_at');
      
      if (profilesError) throw profilesError;
      
      // Map auth users with profile data
      const mappedUsers: User[] = authUsers?.users.map(user => {
        const profile = profiles?.find(p => p.id === user.id);
        return {
          id: user.id,
          email: user.email || 'No email',
          created_at: user.created_at || new Date().toISOString(),
          last_sign_in_at: user.last_sign_in_at,
          // Check if role in profile is 'admin'
          is_admin: profile?.role === 'admin'
        };
      }) || [];
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users. You may not have admin privileges.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // Delete the user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userToDelete.id);
      
      if (authError) throw authError;
      
      // Profile will be automatically deleted via cascade
      
      // Update the local state
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      toast({
        title: 'Success',
        description: `User ${userToDelete.email} has been deleted.`,
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: `Failed to delete user: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setUserToDelete(null);
    }
  };
  
  const handleToggleAdmin = async () => {
    if (!userToToggleAdmin) return;
    
    try {
      const newAdminStatus = !userToToggleAdmin.is_admin;
      const newRole = newAdminStatus ? 'admin' : 'user';
      
      // Update the user's role in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userToToggleAdmin.id);
      
      if (error) throw error;
      
      // Update the local state
      setUsers(users.map(user => 
        user.id === userToToggleAdmin.id 
          ? { ...user, is_admin: newAdminStatus } 
          : user
      ));
      
      toast({
        title: 'Success',
        description: `User ${userToToggleAdmin.email} is ${newAdminStatus ? 'now' : 'no longer'} an admin.`,
      });
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: `Failed to update user: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setUserToToggleAdmin(null);
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          User Management ({users.length})
        </h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableCaption>A list of all registered users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                <TableCell>
                  {user.is_admin ? (
                    <div className="flex items-center">
                      <ShieldAlert className="h-4 w-4 text-purple-500 mr-1" />
                      <span>Admin</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <MailCheck className="h-4 w-4 text-gray-500 mr-1" />
                      <span>User</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUserToToggleAdmin(user)}
                      >
                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {user.is_admin 
                            ? 'Remove admin privileges?' 
                            : 'Grant admin privileges?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {user.is_admin
                            ? `This will remove admin access from ${user.email}.`
                            : `This will give ${user.email} full admin access to the dashboard.`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setUserToToggleAdmin(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleToggleAdmin}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setUserToDelete(user)}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete user account?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete {user.email}'s account and all associated data.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setUserToDelete(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                No users found matching your search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
