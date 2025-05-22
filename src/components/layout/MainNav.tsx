
import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "@/config/site";

export function MainNav() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">{siteConfig.name}</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/tools" className="text-muted-foreground hover:text-primary transition">
              All Tools
            </Link>
            <Link to="/categories" className="text-muted-foreground hover:text-primary transition">
              Categories
            </Link>
            <Link to="/blog" className="text-muted-foreground hover:text-primary transition">
              Blog
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
