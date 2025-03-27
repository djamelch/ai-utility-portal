
"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { AdminTools } from '@/pages/admin/AdminTools';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminAnalytics } from '@/pages/admin/AdminAnalytics';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { 
  BarChart, Users, Settings, Database, Loader2 
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const { isAdmin, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Set the active tab based on the current route
  useEffect(() => {
    if (pathname?.includes('/admin/tools')) {
      setActiveTab('tools');
    } else if (pathname === '/admin') {
      setActiveTab('analytics');
    }
  }, [pathname]);

  // Ensure that non-admin users can't access the admin dashboard
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth?from=/admin');
      } else if (!isAdmin) {
        router.push('/dashboard');
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

  if (!user || !isAdmin) {
    return null; // Will redirect via the effect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-screen-xl mx-auto px-4">
          <MotionWrapper animation="fadeIn">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Manage your AI tools database, users, and site settings
                </p>
              </div>
            </div>
          </MotionWrapper>
          
          <MotionWrapper animation="fadeIn" delay="delay-200">
            <Tabs 
              defaultValue="analytics" 
              value={activeTab} 
              onValueChange={(value) => {
                setActiveTab(value);
                if (value === 'analytics') {
                  router.push('/admin');
                } else if (value === 'tools') {
                  router.push('/admin/tools');
                }
              }}
              className="w-full"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="analytics">
                  <BarChart className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="tools">
                  <Database className="h-4 w-4 mr-2" />
                  Tools
                </TabsTrigger>
                <TabsTrigger value="users">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="analytics">
                <AdminAnalytics />
              </TabsContent>
              
              <TabsContent value="tools">
                <AdminTools />
              </TabsContent>
              
              <TabsContent value="users">
                <AdminUsers />
              </TabsContent>
              
              <TabsContent value="settings">
                <AdminSettings />
              </TabsContent>
            </Tabs>
          </MotionWrapper>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
