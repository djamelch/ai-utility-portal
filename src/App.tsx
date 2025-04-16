
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { AuthProvider } from '@/context/AuthContext';

// Pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import Tools from '@/pages/Tools';
import ToolDetail from '@/pages/ToolDetail';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import UserDashboard from '@/pages/UserDashboard';
import SubmitTool from '@/pages/SubmitTool';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AuthCallback from '@/pages/AuthCallback';

// Import other admin pages
import { AdminTools } from '@/pages/admin/AdminTools';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { AdminBlogs } from '@/pages/admin/AdminBlogs';
import { AdminSubmissions } from '@/pages/admin/AdminSubmissions';
import { AdminNewUser } from '@/pages/admin/AdminNewUser';
import AdminToolCreate from '@/pages/admin/AdminToolCreate';
import AdminToolEdit from '@/pages/admin/AdminToolEdit';
import AdminBlogCreate from '@/pages/admin/AdminBlogCreate';
import AdminBlogEdit from '@/pages/admin/AdminBlogEdit';
import CsvImport from '@/pages/admin/CsvImport';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <Router>
            <Routes>
              {/* مسارات عامة */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tool/:id" element={<ToolDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* مسارات محمية بتسجيل الدخول فقط */}
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <UserDashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/submit-tool" 
                element={
                  <RequireAuth>
                    <SubmitTool />
                  </RequireAuth>
                } 
              />

              {/* مسارات المشرفين - مع requireAdmin=true */}
              <Route 
                path="/admin" 
                element={
                  <RequireAuth requireAdmin={true}>
                    <AdminDashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin/tools" 
                element={
                  <RequireAuth requireAdmin={true}>
                    <AdminDashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <RequireAuth requireAdmin={true}>
                    <AdminDashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <RequireAuth requireAdmin={true}>
                    <AdminDashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin/blogs" 
                element={
                  <RequireAuth requireAdmin={true}>
                    <AdminDashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin/submissions" 
                element={
                  <RequireAuth requireAdmin={true}>
                    <AdminDashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin/newuser" 
                element={
                  <RequireAuth requireAdmin={true}>
                    <AdminDashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin/tools/new" 
                element={
                  <RequireAuth requireAdmin={true}>
                    <AdminToolCreate />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin/tools/edit/:id" 
                element={
                  <RequireAuth requireAdmin={true}>
                    <AdminToolEdit />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin/blogs/new" 
                element={
                  <RequireAuth requireAdmin={true}>
                    <AdminBlogCreate />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin/blogs/edit/:id" 
                element={
                  <RequireAuth requireAdmin={true}>
                    <AdminBlogEdit />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/admin/csv-import" 
                element={
                  <RequireAuth requireAdmin={true}>
                    <CsvImport />
                  </RequireAuth>
                } 
              />

              {/* مسار احتياطي */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
