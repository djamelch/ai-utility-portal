
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tool } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { FilterBar } from "@/components/tools/FilterBar";
import { ToolCard } from "@/components/tools/ToolCard";
import { Badge } from "@/components/ui/badge";
import { EnhancedSearch } from "@/components/search/EnhancedSearch";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [totalPages, setTotalPages] = useState(1);

  const fetchTools = useCallback(
    async (
      category: string,
      pricing: string,
      sortOrder: string,
      searchTerm: string,
      page: number = 1
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

      // First get count of all matching items
      const countQuery = query;
      const { count, error: countError } = await countQuery.count();
      
      if (countError) {
        console.error("Error fetching tool count:", countError);
      } else {
        setTotalPages(Math.ceil((count as number) / itemsPerPage));
      }
      
      // Then fetch the page of results
      const startIdx = (page - 1) * itemsPerPage;
      query = query.range(startIdx, startIdx + itemsPerPage - 1);
      
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
    fetchTools(selectedCategory, selectedPricing, selectedSortOrder, searchTerm, currentPage)
      .then((fetchedTools) => setTools(fetchedTools))
      .catch((error) => console.error("Error in useEffect:", error));
  }, [selectedCategory, selectedPricing, selectedSortOrder, searchTerm, currentPage, fetchTools]);

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
    setCurrentPage(1); // Reset to page 1 when filter changes
    setSearchParams({
      category: value,
      pricing: selectedPricing,
      sort: selectedSortOrder,
      search: searchTerm,
    });
  };

  const handlePricingChange = (value: string) => {
    setSelectedPricing(value);
    setCurrentPage(1); // Reset to page 1 when filter changes
    setSearchParams({
      category: selectedCategory,
      pricing: value,
      sort: selectedSortOrder,
      search: searchTerm,
    });
  };

  const handleSortChange = (value: string) => {
    setSelectedSortOrder(value);
    setCurrentPage(1); // Reset to page 1 when filter changes
    setSearchParams({
      category: selectedCategory,
      pricing: selectedPricing,
      sort: value,
      search: searchTerm,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to page 1 when search changes
    setSearchParams({
      category: selectedCategory,
      pricing: selectedPricing,
      sort: selectedSortOrder,
      search: value,
    });
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">All Tools</h1>

      <div className="mb-6 px-4">
        <EnhancedSearch
          placeholder="Search for tools..."
          initialValue={searchTerm}
          onSearch={handleSearchChange}
          redirectToTools={false}
          className="w-full md:max-w-lg mx-auto"
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
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="opacity-0 translate-y-4 animate-fade-in"
                style={{
                  animationFillMode: 'forwards',
                  animationDelay: '0.1s'
                }}
              >
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            isActive={page === currentPage}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    // Show ellipsis for skipped pages
                    else if (
                      page === 2 || 
                      page === totalPages - 1
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <span className="px-2">...</span>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tools;
