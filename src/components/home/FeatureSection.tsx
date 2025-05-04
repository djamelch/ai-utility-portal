
import { CheckCircle, Star, Zap, ShieldCheck } from "lucide-react";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientBackground } from "@/components/ui/GradientBackground";

export function FeatureSection() {
  const features = [
    {
      icon: Star,
      title: "Curated Selection",
      description: "Every tool is carefully reviewed and selected based on quality, usability, and value."
    },
    {
      icon: Zap,
      title: "Updated Weekly",
      description: "We continuously add new tools and update existing ones to ensure you have access to the latest innovations."
    },
    {
      icon: CheckCircle,
      title: "Verified Reviews",
      description: "Authentic reviews from real users to help you make informed decisions about each tool."
    },
    {
      icon: ShieldCheck,
      title: "Privacy Focused",
      description: "We prioritize your privacy and only recommend tools that maintain high security standards."
    }
  ];

  return (
    <GradientBackground variant="secondary" className="section-padding">
      <div className="container-wide">
        <MotionWrapper animation="fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Why Choose
              </span> AI Any Tool
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              We help professionals and teams find the right AI solutions faster, with confident decision-making backed by expert curation and user reviews
            </p>
          </div>
        </MotionWrapper>

        <MotionWrapper animation="fadeIn" delay="delay-200">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <GlassCard
                key={index}
                animation={index % 2 === 0 ? "slideUp" : "fadeIn"}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="rounded-full p-3 bg-primary/10 text-primary">
                  <feature.icon size={24} className="animate-float" />
                </div>
                <h3 className="mt-4 text-xl font-medium">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </MotionWrapper>
      </div>
    </GradientBackground>
  );
}
