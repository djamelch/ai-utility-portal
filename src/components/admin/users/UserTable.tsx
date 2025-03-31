
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserRoleBadge } from './UserRoleBadge';
import { UserActionButtons } from './UserActionButtons';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
}

interface UserTableProps {
  users: User[];
  onToggleAdmin: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function UserTable({ users, onToggleAdmin, onDeleteUser }: UserTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
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
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
              <TableCell>
                <UserRoleBadge isAdmin={user.is_admin} />
              </TableCell>
              <TableCell className="text-right">
                <UserActionButtons 
                  user={user} 
                  onToggleAdmin={onToggleAdmin} 
                  onDeleteUser={onDeleteUser} 
                />
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
  );
}
