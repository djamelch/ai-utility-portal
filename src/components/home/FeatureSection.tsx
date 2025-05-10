
import { CheckCircle, Star, Zap, ShieldCheck } from "lucide-react";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Badge } from "@/components/ui/badge";

export function FeatureSection() {
  const features = [
    {
      icon: Star,
      title: "Curated Selection",
      description: "Every tool is carefully reviewed and selected based on quality, ease of use, and value.",
      color: "text-hostinger-brand bg-hostinger-brand/10"
    },
    {
      icon: Zap,
      title: "Weekly Updates",
      description: "We continuously add new tools and update existing ones to ensure you have access to the latest innovations.",
      color: "text-hostinger-accent bg-hostinger-accent/10"
    },
    {
      icon: CheckCircle,
      title: "Reliable Reviews",
      description: "Authentic reviews from real users to help you make informed decisions about each tool.",
      color: "text-hostinger-success bg-hostinger-success/10"
    },
    {
      icon: ShieldCheck,
      title: "Privacy Focused",
      description: "We prioritize your privacy and only recommend tools that maintain high security standards.",
      color: "text-hostinger-active bg-hostinger-active/10"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="curved-divider bg-white dark:bg-background absolute top-0 left-0 right-0 z-10"></div>
      
      <GradientBackground variant="accent" className="section-padding py-16 relative">
        <div className="container-wide relative z-20">
          <MotionWrapper animation="fadeIn">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-hostinger-international/20 bg-hostinger-international/5 px-4 py-1.5">
                <Star size={14} className="mr-1.5 animate-pulse text-hostinger-international" />
                Our Promise
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-hostinger-brand to-hostinger-accent bg-clip-text text-transparent">
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
                  className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-all duration-300 border-t-2 border-t-hostinger-brand/20"
                  glowEffect
                  hoverEffect
                  glowColor="before:from-hostinger-brand/20 before:to-hostinger-accent/10"
                >
                  <div className={`rounded-full p-3 ${feature.color} mb-4 shadow-inner group-hover:scale-110 transition-all duration-300`}>
                    <feature.icon size={24} className="animate-float" />
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-foreground/90 group-hover:text-hostinger-brand transition-colors">{feature.title}</h3>
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
