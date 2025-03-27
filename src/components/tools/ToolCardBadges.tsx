
import { FC } from "react";

interface ToolCardBadgesProps {
  isFeatured?: boolean;
  isNew?: boolean;
}

export const ToolCardBadges: FC<ToolCardBadgesProps> = ({ isFeatured, isNew }) => {
  if (!isFeatured && !isNew) return null;
  
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      {isFeatured && (
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          Featured
        </span>
      )}
      {isNew && (
        <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
          New
        </span>
      )}
    </div>
  );
};
