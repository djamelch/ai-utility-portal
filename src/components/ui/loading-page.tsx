
import { MotionWrapper } from "./MotionWrapper";
import { LoadingSpinner } from "./loading-spinner";

export function LoadingPage() {
  return (
    <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
      <MotionWrapper animation="fadeIn">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </MotionWrapper>
    </div>
  );
}
