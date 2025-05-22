import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tool } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { FilterBar } from "@/components/tools/FilterBar";
import { ToolCard } from "@/components/tools/ToolCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

const Tools: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialPricing = searchParams.get("pricing") || "all";
  const initialSortOrder = searchParams.get("sort") || "newest";
  const initialSearchTerm = searchParams.get("search") || "";

  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<
    Array<{ name: string; count: number }>
  >([]);
  const [pricingOptions, setPricingOptions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPricing, setSelectedPricing] = useState(initialPricing);
  const [selectedSortOrder, setSelectedSortOrder] = useState(initialSortOrder);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const fetchTools = useCallback(
    async (
      category: string,
      pricing: string,
      sortOrder: string,
      searchTerm: string
    ) => {
      setLoading(true);
      let query = supabase.from("tools").select("*");

      if (category !== "all") {
        query = query.eq("primary_task", category);
      }

      if (pricing !== "all") {
        query = query.eq("pricing", pricing);
      }

      if (searchTerm) {
        query = query.ilike("company_name", `%${searchTerm}%`);
      }

      if (sortOrder === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (sortOrder === "popular") {
        query = query.order("click_count", { ascending: false });
      } else if (sortOrder === "top-rated") {
        query = query.order("is_featured", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching tools:", error);
        setLoading(false);
        return [];
      }

      // Transform data to match our Tool interface
      const transformedTools: Tool[] = data.map(tool => ({
        id: tool.id,
        name: tool.company_name,
        company_name: tool.company_name,
        description: tool.short_description,
        short_description: tool.short_description,
        logo: tool.logo_url,
        logo_url: tool.logo_url,
        category: tool.primary_task,
        primary_task: tool.primary_task,
        rating: 5, // Default rating since it's not in the DB
        reviewCount: 0, // Default review count since it's not in the DB
        pricing: tool.pricing,
        url: tool.visit_website_url || tool.detail_url || "#",
        visit_website_url: tool.visit_website_url,
        detail_url: tool.detail_url,
        slug: tool.slug,
        isFeatured: Boolean(tool.is_featured),
        isVerified: Boolean(tool.is_verified),
        is_featured: tool.is_featured,
        is_verified: tool.is_verified,
        isNew: new Date(tool.created_at || "").getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
        ...tool
      }));

      setLoading(false);
      return transformedTools;
    },
    []
  );

  useEffect(() => {
    fetchTools(selectedCategory, selectedPricing, selectedSortOrder, searchTerm)
      .then((fetchedTools) => setTools(fetchedTools))
      .catch((error) => console.error("Error in useEffect:", error));
  }, [selectedCategory, selectedPricing, selectedSortOrder, searchTerm, fetchTools]);

  useEffect(() => {
    const fetchCategories = async () => {
      // Use the RPC function we defined earlier
      const { data, error } = await supabase.rpc('get_primary_task_counts');

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      if (data) {
        const formattedCategories = data.map((item: any) => ({
          name: item.primary_task,
          count: item.count || 0
        }));

        setCategories(formattedCategories);
      }
    };

    const fetchPricingOptions = async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("pricing")
        .not('pricing', 'is', null);

      if (error) {
        console.error("Error fetching pricing options:", error);
        return;
      }

      if (data) {
        const uniquePricingOptions = [
          ...new Set(data.map((tool) => tool.pricing)),
        ].filter(Boolean);
        
        setPricingOptions(uniquePricingOptions);
      }
    };

    fetchCategories();
    fetchPricingOptions();
  }, []);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSearchParams({
      category: value,
      pricing: selectedPricing,
      sort: selectedSortOrder,
      search: searchTerm,
    });
  };

  const handlePricingChange = (value: string) => {
    setSelectedPricing(value);
    setSearchParams({
      category: selectedCategory,
      pricing: value,
      sort: selectedSortOrder,
      search: searchTerm,
    });
  };

  const handleSortChange = (value: string) => {
    setSelectedSortOrder(value);
    setSearchParams({
      category: selectedCategory,
      pricing: selectedPricing,
      sort: value,
      search: searchTerm,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setSearchParams({
      category: selectedCategory,
      pricing: selectedPricing,
      sort: selectedSortOrder,
      search: value,
    });
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Explore AI Tools</h1>

      <div className="mb-6 px-4">
        <Input
          placeholder="Search for tools..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full md:w-auto"
        />
      </div>

      <FilterBar
        categories={categories}
        pricingOptions={pricingOptions}
        selectedCategory={selectedCategory}
        selectedPricing={selectedPricing}
        selectedSortOrder={selectedSortOrder}
        onCategoryChange={handleCategoryChange}
        onPricingChange={handlePricingChange}
        onSortChange={handleSortChange}
      />

      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="transition-opacity duration-300 opacity-100"
            >
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tools;
