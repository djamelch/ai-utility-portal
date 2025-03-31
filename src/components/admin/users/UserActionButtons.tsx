
import React from 'react';
import { Button } from '@/components/ui/button';
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

interface User {
  id: string;
  email: string;
  is_admin: boolean;
}

interface UserActionButtonsProps {
  user: User;
  onToggleAdmin: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function UserActionButtons({ user, onToggleAdmin, onDeleteUser }: UserActionButtonsProps) {
  return (
    <div className="space-x-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
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
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onToggleAdmin(user)}>
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
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onDeleteUser(user)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
