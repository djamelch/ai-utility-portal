
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { useAuth } from "@/context/AuthContext";
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
  const { user } = useAuth();
  
  useEffect(() => {
    // Auth check can be handled through the AuthContext directly
    // No need for explicit checkAuth call
  }, []);

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
            
            {/* User Dashboard route */}
            <Route path="dashboard" element={<div>Dashboard</div>} />
            
            {/* Admin routes */}
            <Route path="admin" element={<div>Admin Panel</div>} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
