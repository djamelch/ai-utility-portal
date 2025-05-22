import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useAuth } from "@/context/AuthContext";
import { Dashboard } from "@/pages/Dashboard";
import { AdminPanel } from "@/pages/AdminPanel";
import Index from "@/pages/Index";
import Tools from "@/pages/Tools";
import ToolDetail from "@/pages/ToolDetail";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import About from "@/pages/About";
import SubmitTool from "@/pages/SubmitTool";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/layout/Layout";

// Add the Categories import
import Categories from "./pages/Categories";

function App() {
  const { checkAuth } = useAuth();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="tools" element={<Tools />} />
            <Route path="categories" element={<Categories />} /> {/* Add new Categories route */}
            <Route path="tools/:slug" element={<ToolDetail />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="about" element={<About />} />
            <Route path="submit-tool" element={<SubmitTool />} />
            
            {/* Auth routes */}
            <Route path="auth" element={<Auth />} />
            
            {/* Admin routes */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="admin" element={<AdminPanel />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
