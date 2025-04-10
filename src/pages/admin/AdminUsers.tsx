
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserSearchBar } from '@/components/admin/users/UserSearchBar';
import { UserTable } from '@/components/admin/users/UserTable';
import { UserListSkeleton } from '@/components/admin/users/UserListSkeleton';

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
  
  const handleDeleteUser = async (userToDelete: User) => {
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
    }
  };
  
  const handleToggleAdmin = async (userToToggleAdmin: User) => {
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
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <UserListSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          User Management ({users.length})
        </h2>
        <UserSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      <UserTable 
        users={filteredUsers}
        onToggleAdmin={handleToggleAdmin}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}
