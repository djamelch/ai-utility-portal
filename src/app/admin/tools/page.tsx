
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { AdminTools } from '@/pages/admin/AdminTools';

export default function AdminToolsPage() {
  return (
    <RequireAuth requireAdmin={true}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-screen-xl mx-auto px-4">
            <MotionWrapper animation="fadeIn">
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Manage Tools
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Add, edit, or remove AI tools from the database
                  </p>
                </div>
              </div>
            </MotionWrapper>
            
            <MotionWrapper animation="fadeIn" delay="delay-200">
              <AdminTools />
            </MotionWrapper>
          </div>
        </main>
        <Footer />
      </div>
    </RequireAuth>
  );
}
