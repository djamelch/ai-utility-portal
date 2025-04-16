
import { useState, useEffect } from 'react';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { useAuth } from '@/context/AuthContext';
import { PageLoadingWrapper } from '@/components/ui/PageLoadingWrapper';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { UserRoleBadge } from '@/components/admin/users/UserRoleBadge';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';

export default function UserDashboard() {
  const { isAdmin, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  // Generate schema data for user profile
  const generateUserSchema = () => {
    if (!user) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "name": user.email || "User",
        "identifier": user.id,
        "url": `https://your-domain.com/dashboard`
      }
    };
  };
  
  return (
    <RequireAuth>
      <SEOHead
        title="User Dashboard - AI Tools Directory"
        description="Manage your account, saved AI tools, and reviews in your personal dashboard."
        keywords="user dashboard, account management, saved tools, AI tools directory"
        canonicalUrl="/dashboard"
        ogType="profile"
        schemaData={generateUserSchema()}
      />
      <PageLoadingWrapper isLoading={isLoading} loadingText="Loading dashboard...">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-screen-xl mx-auto px-4">
            <MotionWrapper animation="fadeIn">
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    User Dashboard
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Manage your account, saved tools, and reviews
                  </p>
                </div>
                
                {isAdmin && (
                  <div className="self-start">
                    <UserRoleBadge isAdmin={true} />
                  </div>
                )}
              </div>
            </MotionWrapper>
            
            <MotionWrapper animation="fadeIn" delay="delay-200">
              <DashboardTabs />
            </MotionWrapper>
          </div>
        </main>
        <Footer />
      </PageLoadingWrapper>
    </RequireAuth>
  );
}
