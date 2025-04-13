
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
      
      // Fetch profiles directly - only select columns that exist in the profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, role, created_at, updated_at');
      
      if (profilesError) throw profilesError;
      
      // Since we don't have emails in profiles, we'll use a placeholder or id as email
      const mappedUsers: User[] = profiles?.map(profile => {
        return {
          id: profile.id,
          email: `user-${profile.id.substring(0, 8)}@example.com`, // Placeholder email based on ID
          created_at: profile.created_at || new Date().toISOString(),
          last_sign_in_at: profile.updated_at, // Using updated_at as a proxy for last sign in
          // Check if role in profile is 'admin'
          is_admin: profile.role === 'admin'
        };
      }) || [];
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users. Please check your database permissions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteUser = async (userToDelete: User) => {
    try {
      // We can't directly delete users without admin API privileges
      // Instead, we'll create an edge function or use an alternative approach
      // For now, show a message about this limitation
      toast({
        title: 'Information',
        description: 'User deletion requires additional server-side privileges. Please contact the system administrator.',
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
