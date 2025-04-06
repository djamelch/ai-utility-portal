
import { SEOHead } from '@/components/seo/SEOHead';
import { Hero } from '@/components/home/Hero';
import { FeatureSection } from '@/components/home/FeatureSection';
import { CategorySection } from '@/components/home/CategorySection';
import { ToolsSection } from '@/components/home/ToolsSection';

export function Index() {
  return (
    <>
      <SEOHead
        title="AI Tools Directory - Find the Best AI Tools"
        description="Discover and compare the best AI tools for your business and personal needs. Our curated directory helps you find the right AI solution quickly."
      />
      <div className="container px-4 mx-auto">
        <Hero />
        <FeatureSection />
        <ToolsSection 
          title="Featured Tools"
          description="Discover our handpicked selection of the best AI tools" 
          viewAllLink="/tools?filter=featured"
          queryType="featured"
        />
        <CategorySection />
      </div>
    </>
  );
}
