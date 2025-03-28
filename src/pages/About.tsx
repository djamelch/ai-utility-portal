import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { MotionWrapper } from "@/components/ui/MotionWrapper";

const About = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time or use for actual data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageWrapper isLoading={isLoading}>
      <section className="section-padding">
        <div className="container-tight">
          <MotionWrapper animation="fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">About Us</h1>
              <p className="mt-2 text-muted-foreground">
                Learn more about our mission and team.
              </p>
            </div>
          </MotionWrapper>
          
          <MotionWrapper animation="fadeIn" delay="delay-200">
            <div className="prose dark:prose-invert max-w-none">
              <h2>Our Mission</h2>
              <p>
                We are dedicated to providing a comprehensive and curated collection of AI tools to empower individuals and businesses.
              </p>
              
              <h2>Our Team</h2>
              <p>
                We are a team of AI enthusiasts and experts passionate about making AI accessible to everyone.
              </p>
            </div>
          </MotionWrapper>
        </div>
      </section>
    </PageWrapper>
  );
};

export default About;
