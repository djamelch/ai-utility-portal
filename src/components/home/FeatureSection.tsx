
import { CheckCircle, Star, Zap, ShieldCheck } from "lucide-react";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientBackground } from "@/components/ui/GradientBackground";

export function FeatureSection() {
  const features = [
    {
      icon: Star,
      title: "تصنيف مختار",
      description: "كل أداة تمت مراجعتها واختيارها بعناية على أساس الجودة وسهولة الاستخدام والقيمة."
    },
    {
      icon: Zap,
      title: "تحديث أسبوعي",
      description: "نضيف باستمرار أدوات جديدة ونحدث الأدوات الموجودة لضمان وصولك إلى أحدث الابتكارات."
    },
    {
      icon: CheckCircle,
      title: "تقييمات موثوقة",
      description: "مراجعات أصلية من مستخدمين حقيقيين لمساعدتك على اتخاذ قرارات مستنيرة حول كل أداة."
    },
    {
      icon: ShieldCheck,
      title: "تركيز على الخصوصية",
      description: "نحن نعطي الأولوية لخصوصيتك ونوصي فقط بالأدوات التي تحافظ على معايير أمان عالية."
    }
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="curved-divider bg-white dark:bg-background absolute top-0 left-0 right-0 z-10"></div>
      
      <GradientBackground variant="accent" className="section-padding py-16 relative">
        <div className="container-wide relative z-20">
          <MotionWrapper animation="fadeIn">
            <div className="text-center mb-12">
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2 block">وعدنا لكم</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient">
                  لماذا تختار
                </span> أدوات الذكاء الاصطناعي
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                نساعد المحترفين والفرق على العثور على حلول الذكاء الاصطناعي المناسبة بشكل أسرع، مع اتخاذ قرارات واثقة مدعومة بتقييمات الخبراء والمستخدمين
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
