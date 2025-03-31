
import React from 'react';
import { Loader2 } from 'lucide-react';

export function UserListSkeleton() {
  return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
