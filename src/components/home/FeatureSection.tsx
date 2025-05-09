
import { CheckCircle, Star, Zap, ShieldCheck, Award } from "lucide-react";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { FeatureCard } from "@/components/ui/FeatureCard";

export function FeatureSection() {
  const features = [
    {
      icon: <Star size={24} />,
      title: "Curated Selection",
      description: "Every tool is carefully reviewed and selected based on quality, usability, and value."
    },
    {
      icon: <Zap size={24} />,
      title: "Updated Weekly",
      description: "We continuously add new tools and update existing ones to ensure you have access to the latest innovations."
    },
    {
      icon: <CheckCircle size={24} />,
      title: "Verified Reviews",
      description: "Authentic reviews from real users to help you make informed decisions about each tool."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Privacy Focused",
      description: "We prioritize your privacy and only recommend tools that maintain high security standards."
    }
  ];

  return (
    <GradientBackground variant="accent" className="section-padding py-16">
      <div className="container-wide">
        <MotionWrapper animation="fadeIn">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
              <Award size={16} className="mr-1.5" /> Our Promise
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Any Tool</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              We help professionals and teams find the right AI solutions faster, with confident decision-making backed by expert curation and user reviews
            </p>
          </div>
        </MotionWrapper>

        <MotionWrapper animation="fadeIn" delay="delay-200">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                animation={index % 2 === 0 ? "slideUp" : "fadeIn"}
                index={index}
                hoverEffect={true}
                glowEffect={true}
                glowColor="before:from-primary/30 before:to-accent/20"
                iconClassName="bg-gradient-to-br from-primary/20 to-accent/20 text-primary"
              />
            ))}
          </div>
        </MotionWrapper>
      </div>
    </GradientBackground>
  );
}
