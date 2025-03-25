
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { MotionWrapper } from "@/components/ui/MotionWrapper";

export function Footer() {
  const year = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Categories", href: "#" },
        { label: "Popular Tools", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Documentation", href: "#" },
        { label: "Support", href: "#" },
        { label: "API", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Press", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms", href: "#" },
        { label: "Privacy", href: "#" },
        { label: "Cookies", href: "#" },
        { label: "Licenses", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
  ];

  return (
    <footer className="border-t border-border/40 bg-secondary/30 dark:bg-transparent">
      <div className="container-wide py-16">
        <MotionWrapper animation="fadeIn">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6">
            {/* Brand & Newsletter */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-block">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gradient">AI Any Tool</span>
                </div>
              </Link>
              <p className="mt-4 max-w-md text-muted-foreground">
                Discover the best AI-powered tools for every need. Our curated collection helps you find the perfect solution for your projects.
              </p>
              
              <div className="mt-6">
                <p className="font-medium mb-2">Join our newsletter</p>
                <div className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm"
                  />
                  <button className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Links */}
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="font-medium text-foreground">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </MotionWrapper>

        {/* Social & Copyright */}
        <MotionWrapper animation="fadeIn" delay="delay-200">
          <div className="mt-16 flex flex-col items-center justify-between border-t border-border/40 pt-8 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © {year} AI Any Tool. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </MotionWrapper>
      </div>
    </footer>
  );
}
