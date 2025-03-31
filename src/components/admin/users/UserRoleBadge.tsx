
import React from 'react';
import { ShieldAlert, MailCheck } from 'lucide-react';

interface UserRoleBadgeProps {
  isAdmin: boolean;
}

export function UserRoleBadge({ isAdmin }: UserRoleBadgeProps) {
  if (isAdmin) {
    return (
      <div className="flex items-center">
        <ShieldAlert className="h-4 w-4 text-purple-500 mr-1" />
        <span>Admin</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center">
      <MailCheck className="h-4 w-4 text-gray-500 mr-1" />
      <span>User</span>
    </div>
  );
}
