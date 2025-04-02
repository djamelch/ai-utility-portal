
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EnhancedLoadingIndicator } from "./EnhancedLoadingIndicator";

interface PageLoadingWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: "spinner" | "progress" | "dots" | "pulse";
}

export function PageLoadingWrapper({ 
  children, 
  isLoading = false, 
  loadingText = "Loading...",
  variant = "pulse"
}: PageLoadingWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {isLoading ? (
        <main className="flex-1 flex items-center justify-center">
          <EnhancedLoadingIndicator 
            size={48} 
            text={loadingText} 
            variant={variant} 
            className="text-primary"
          />
        </main>
      ) : (
        children
      )}
    </div>
  );
}
