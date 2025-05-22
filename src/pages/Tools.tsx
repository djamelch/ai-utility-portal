import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
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
        query = query.eq("category", category);
      }

      if (pricing !== "all") {
        query = query.eq("pricing", pricing);
      }

      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      if (sortOrder === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (sortOrder === "popular") {
        query = query.order("likes", { ascending: false });
      } else if (sortOrder === "top-rated") {
        query = query.order("rating", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching tools:", error);
        setLoading(false);
        return [];
      }

      setLoading(false);
      return data || [];
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
      const { data: toolsData, error: toolsError } = await supabase
        .from("tools")
        .select("category");

      if (toolsError) {
        console.error("Error fetching tools for categories:", toolsError);
        return;
      }

      const categoryCountMap: { [key: string]: number } = {};
      toolsData.forEach((tool) => {
        const category = tool.category;
        categoryCountMap[category] = (categoryCountMap[category] || 0) + 1;
      });

      const categoriesWithCount = Object.keys(categoryCountMap).map(
        (category) => {
          const categoryWithCount = {
            name: category,
            count: categoryCountMap[category] || 0
          };
          return categoryWithCount;
        }
      );

      setCategories(categoriesWithCount);
    };

    const fetchPricingOptions = async () => {
      const { data: toolsData, error: toolsError } = await supabase
        .from("tools")
        .select("pricing");

      if (toolsError) {
        console.error("Error fetching tools for pricing options:", toolsError);
        return;
      }

      const uniquePricingOptions = [
        ...new Set(toolsData.map((tool) => tool.pricing)),
      ];
      setPricingOptions(uniquePricingOptions);
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

  const getPricingCount = (pricing: string) => {
    return tools.filter((tool) => tool.pricing === pricing).length;
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
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tools;
