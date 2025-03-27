
import "@/index.css";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: "AI Utility Portal",
  description: "Discover the best AI tools for your workflow",
  openGraph: {
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AuthProvider>
            <TooltipProvider>
              <main>{children}</main>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
