
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ToolCardSkeletonProps {
  className?: string;
}

export function ToolCardSkeleton({ className }: ToolCardSkeletonProps) {
  return (
    <div className={cn("h-full flex flex-col rounded-xl border border-border/60 dark:border-accent/10 shadow-md bg-card p-4", className)}>
      <div className="flex items-start gap-3">
        <Skeleton className="h-14 w-14 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>

      <Skeleton className="mt-3 h-12 w-full" />
      
      <div className="mt-3 flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-4" />
        ))}
      </div>

      <div className="mt-auto pt-4 flex items-center gap-2">
        <Skeleton className="flex-1 h-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-16 rounded-lg" />
      </div>
    </div>
  );
}
