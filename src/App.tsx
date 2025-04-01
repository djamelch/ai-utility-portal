
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import ToolDetail from "./pages/ToolDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AdminTools } from "./pages/admin/AdminTools";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";
import { AdminSettings } from "./pages/admin/AdminSettings";
import AdminToolEdit from "./pages/admin/AdminToolEdit";
import AdminToolCreate from "./pages/admin/AdminToolCreate";
import CsvImport from "./pages/admin/CsvImport";
import UserDashboard from "./pages/UserDashboard";
import { useState } from "react";

function App() {
  // Create a new QueryClient instance inside the component function
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tools" element={<Tools />} />
              {/* Using the slug format for tool detail pages */}
              <Route path="/tool/:slug" element={<ToolDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* User Dashboard */}
              <Route path="/dashboard" element={
                <RequireAuth>
                  <UserDashboard />
                </RequireAuth>
              } />
              
              {/* Admin Routes - with requireAdmin flag */}
              <Route path="/admin" element={
                <RequireAuth requireAdmin={true}>
                  <AdminDashboard />
                </RequireAuth>
              } />
              <Route path="/admin/tools" element={
                <RequireAuth requireAdmin={true}>
                  <AdminTools />
                </RequireAuth>
              } />
              <Route path="/admin/users" element={
                <RequireAuth requireAdmin={true}>
                  <AdminUsers />
                </RequireAuth>
              } />
              <Route path="/admin/analytics" element={
                <RequireAuth requireAdmin={true}>
                  <AdminAnalytics />
                </RequireAuth>
              } />
              <Route path="/admin/settings" element={
                <RequireAuth requireAdmin={true}>
                  <AdminSettings />
                </RequireAuth>
              } />
              <Route path="/admin/tools/edit/:id" element={
                <RequireAuth requireAdmin={true}>
                  <AdminToolEdit />
                </RequireAuth>
              } />
              <Route path="/admin/tools/new" element={
                <RequireAuth requireAdmin={true}>
                  <AdminToolCreate />
                </RequireAuth>
              } />
              <Route path="/admin/csv-import" element={
                <RequireAuth requireAdmin={true}>
                  <CsvImport />
                </RequireAuth>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
