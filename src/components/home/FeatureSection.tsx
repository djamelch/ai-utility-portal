
import { CheckCircle, Star, Zap, ShieldCheck } from "lucide-react";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientBackground } from "@/components/ui/GradientBackground";

export function FeatureSection() {
  const features = [
    {
      icon: Star,
      title: "Curated Selection",
      description: "Every tool is carefully reviewed and selected based on quality, ease of use, and value."
    },
    {
      icon: Zap,
      title: "Weekly Updates",
      description: "We continuously add new tools and update existing ones to ensure you have access to the latest innovations."
    },
    {
      icon: CheckCircle,
      title: "Reliable Reviews",
      description: "Authentic reviews from real users to help you make informed decisions about each tool."
    },
    {
      icon: ShieldCheck,
      title: "Privacy Focused",
      description: "We prioritize your privacy and only recommend tools that maintain high security standards."
    }
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="curved-divider bg-white dark:bg-background absolute top-0 left-0 right-0 z-10"></div>
      
      <GradientBackground variant="accent" className="section-padding py-16 relative">
        <div className="container-wide relative z-20">
          <MotionWrapper animation="fadeIn">
            <div className="text-center mb-12">
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2 block">Our Promise</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient">
                  Why Choose
                </span> AI Tools Directory
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                We help professionals and teams find the right AI solutions faster, making confident decisions backed by expert and user reviews
              </p>
            </div>
          </MotionWrapper>

          <MotionWrapper animation="fadeIn" delay="delay-200">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <GlassCard
                  key={index}
                  animation={index % 2 === 0 ? "slideUp" : "fadeIn"}
                  className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-all duration-300"
                  glowEffect
                  hoverEffect
                >
                  <div className="rounded-full p-3 bg-primary/10 text-primary mb-4 shadow-inner">
                    <feature.icon size={24} className="animate-float" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              ))}
            </div>
          </MotionWrapper>
        </div>
      </GradientBackground>
      
      <div className="wave-divider bg-white dark:bg-background absolute bottom-0 left-0 right-0 z-10"></div>
    </div>
  );
}
