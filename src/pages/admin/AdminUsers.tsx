import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserSearchBar } from '@/components/admin/users/UserSearchBar';
import { UserTable } from '@/components/admin/users/UserTable';
import { UserListSkeleton } from '@/components/admin/users/UserListSkeleton';
import { toast } from 'sonner';

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Get all users from the auth.users table through profiles to avoid admin permission issues
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, role, created_at');
      
      if (profilesError) throw profilesError;
      
      // For each profile, get the user data from the auth.users table if possible
      // Otherwise use profile data
      const usersPromises = profiles?.map(async (profile) => {
        // Get user data from auth.users if available (only works for the current user)
        const { data: authData } = await supabase.auth.getUser(profile.id);
        
        return {
          id: profile.id,
          email: authData?.user?.email || 'No email available',
          created_at: profile.created_at,
          last_sign_in_at: authData?.user?.last_sign_in_at || null,
          is_admin: profile.role === 'admin'
        };
      }) || [];
      
      const mappedUsers = await Promise.all(usersPromises);
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. You may not have admin privileges.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteUser = async (userToDelete: User) => {
    try {
      // Update the profile to set it as inactive rather than deleting
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'inactive' })
        .eq('id', userToDelete.id);
      
      if (error) throw error;
      
      // Update the local state
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      toast.success(`User ${userToDelete.email} has been removed.`);
    } catch (error: any) {
      console.error('Error removing user:', error);
      toast.error(`Failed to remove user: ${error.message || 'Unknown error'}`);
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
      
      toast.success(`User ${userToToggleAdmin.email} is ${newAdminStatus ? 'now' : 'no longer'} an admin.`);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(`Failed to update user: ${error.message || 'Unknown error'}`);
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
