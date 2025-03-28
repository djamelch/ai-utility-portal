
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { LoadingPage } from "@/components/ui/loading-page";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface PageWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  animation?: "fadeIn" | "slideUp" | "slideDown" | "scaleIn" | "none";
  delay?: "none" | "delay-100" | "delay-200" | "delay-300" | "delay-400" | "delay-500";
}

export function PageWrapper({ 
  children, 
  isLoading = false, 
  animation = "fadeIn",
  delay = "none"
}: PageWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {isLoading ? (
          <LoadingPage />
        ) : (
          <MotionWrapper animation={animation} delay={delay}>
            {children}
          </MotionWrapper>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
