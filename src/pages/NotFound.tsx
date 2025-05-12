
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <MotionWrapper animation="fadeIn" className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            The page you are looking for doesn't exist or has been moved.
          </AlertDescription>
        </Alert>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft size={16} />
          Return to Homepage
        </Link>
      </MotionWrapper>
    </div>
  );
}

export default NotFound;
