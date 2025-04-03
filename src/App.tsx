
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import { AdminBlogs } from "./pages/admin/AdminBlogs";
import { AdminSubmissions } from "./pages/admin/AdminSubmissions";
import AdminToolEdit from "./pages/admin/AdminToolEdit";
import AdminToolCreate from "./pages/admin/AdminToolCreate";
import AdminBlogEdit from "./pages/admin/AdminBlogEdit";
import AdminBlogCreate from "./pages/admin/AdminBlogCreate";
import CsvImport from "./pages/admin/CsvImport";
import UserDashboard from "./pages/UserDashboard";
import SubmitTool from "./pages/SubmitTool";
import { useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

// Create a layout component for admin routes
const AdminLayout = () => {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-screen-xl mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};

function App() {
  // Create a new QueryClient instance inside the component function
  const [queryClient] = useState(() => new QueryClient());

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
              <Route path="/tool/:slug" element={<ToolDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/submit-tool" element={<SubmitTool />} />
              
              {/* User Dashboard - redirects to admin dashboard if user is admin */}
              <Route path="/dashboard" element={
                <RequireAuth>
                  <UserDashboard />
                </RequireAuth>
              } />
              
              {/* Admin Routes using the AdminLayout wrapper */}
              <Route path="/admin" element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="tools" element={<AdminTools />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="submissions" element={<AdminSubmissions />} />
                <Route path="tools/edit/:id" element={<AdminToolEdit />} />
                <Route path="tools/new" element={<AdminToolCreate />} />
                <Route path="blogs/edit/:id" element={<AdminBlogEdit />} />
                <Route path="blogs/new" element={<AdminBlogCreate />} />
                <Route path="csv-import" element={<CsvImport />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
