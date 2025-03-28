
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingIndicator } from "./LoadingIndicator";

interface PageLoadingWrapperProps {
  children: React.ReactNode;
  isLoading: boolean;
  loadingText?: string;
}

export function PageLoadingWrapper({ 
  children, 
  isLoading, 
  loadingText 
}: PageLoadingWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      {isLoading ? (
        <main className="flex-1 flex items-center justify-center">
          <LoadingIndicator size={36} text={loadingText} />
        </main>
      ) : (
        children
      )}
      
      <Footer />
    </div>
  );
}
