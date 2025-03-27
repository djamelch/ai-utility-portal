
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { isAdmin, isLoading, user } = useAuth();
  const router = useRouter();
  
  // Redirect admin users to the admin dashboard
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth?from=/dashboard');
      } else if (isAdmin) {
        router.push('/admin');
      }
    }
  }, [isAdmin, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via the effect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-screen-xl mx-auto px-4">
          <MotionWrapper animation="fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">
                Your Dashboard
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage your saved tools, reviews, and personal settings
              </p>
            </div>
          </MotionWrapper>
          
          <MotionWrapper animation="fadeIn" delay="delay-200">
            <DashboardTabs />
          </MotionWrapper>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
