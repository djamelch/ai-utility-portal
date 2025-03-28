
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EnhancedLoadingIndicator } from "./EnhancedLoadingIndicator";

interface PageLoadingWrapperProps {
  children: React.ReactNode;
  isLoading: boolean;
  loadingText?: string;
  variant?: "spinner" | "progress" | "dots" | "pulse";
}

export function PageLoadingWrapper({ 
  children, 
  isLoading, 
  loadingText = "Loading...",
  variant = "pulse"
}: PageLoadingWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      {isLoading ? (
        <main className="flex-1 flex items-center justify-center">
          <EnhancedLoadingIndicator 
            size={36} 
            text={loadingText} 
            variant={variant} 
          />
        </main>
      ) : (
        children
      )}
      
      <Footer />
    </div>
  );
}
