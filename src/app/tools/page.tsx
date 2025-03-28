
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolGrid } from "@/components/tools/ToolGrid";

export default function Tools() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">All AI Tools</h1>
          <ToolGrid queryType="featured" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
