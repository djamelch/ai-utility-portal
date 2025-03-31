
import React from 'react';
import { ShieldAlert, MailCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserRoleBadgeProps {
  isAdmin: boolean;
  className?: string;
  variant?: 'default' | 'small' | 'large';
}

export function UserRoleBadge({ 
  isAdmin, 
  className,
  variant = 'default' 
}: UserRoleBadgeProps) {
  const sizeClasses = {
    small: {
      icon: 'h-3 w-3',
      text: 'text-xs',
      container: 'py-0.5 px-1.5'
    },
    default: {
      icon: 'h-4 w-4',
      text: 'text-sm',
      container: 'py-1 px-2'
    },
    large: {
      icon: 'h-5 w-5',
      text: 'text-base',
      container: 'py-1.5 px-3'
    }
  };
  
  const sizes = sizeClasses[variant];
  
  if (isAdmin) {
    return (
      <div className={cn(
        "flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30", 
        sizes.container,
        className
      )}>
        <ShieldAlert className={cn("text-purple-600 dark:text-purple-400 mr-1", sizes.icon)} />
        <span className={cn("font-medium text-purple-600 dark:text-purple-400", sizes.text)}>Admin</span>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "flex items-center rounded-full bg-gray-100 dark:bg-gray-800", 
      sizes.container,
      className
    )}>
      <MailCheck className={cn("text-gray-500 dark:text-gray-400 mr-1", sizes.icon)} />
      <span className={cn("text-gray-500 dark:text-gray-400", sizes.text)}>User</span>
    </div>
  );
}
