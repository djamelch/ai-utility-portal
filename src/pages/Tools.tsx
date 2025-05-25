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
      let countQuery = supabase.from("tools").select("*", { count: 'exact', head: true });
      
      if (category !== "all") {
        countQuery = countQuery.eq("primary_task", category);
      }

      if (pricing !== "all") {
        countQuery = countQuery.eq("pricing", pricing);
      }

      if (searchTerm) {
        countQuery = countQuery.ilike("company_name", `%${searchTerm}%`);
      }
      
      const { count, error: countError } = await countQuery;
      
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
    setCurrentPage(1);
    setSearchParams({
      category: value,
      pricing: selectedPricing,
      sort: selectedSortOrder,
      search: searchTerm,
    });
  };

  const handlePricingChange = (value: string) => {
    setSelectedPricing(value);
    setCurrentPage(1);
    setSearchParams({
      category: selectedCategory,
      pricing: value,
      sort: selectedSortOrder,
      search: searchTerm,
    });
  };

  const handleSortChange = (value: string) => {
    setSelectedSortOrder(value);
    setCurrentPage(1);
    setSearchParams({
      category: selectedCategory,
      pricing: selectedPricing,
      sort: value,
      search: searchTerm,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
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
    <div className="container mx-auto py-12 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          All AI Tools
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the perfect AI tool for your needs from our comprehensive collection
        </p>
      </div>

      <div className="mb-8 px-4">
        <EnhancedSearch
          placeholder="Search for AI tools..."
          initialValue={searchTerm}
          onSearch={handleSearchChange}
          redirectToTools={false}
          className="w-full md:max-w-2xl mx-auto"
          size="lg"
          variant="hero"
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
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading amazing AI tools...</p>
          </div>
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tools found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedPricing("all");
                setCurrentPage(1);
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 px-4">
            <p className="text-sm text-muted-foreground text-center">
              Showing {tools.length} of {(currentPage - 1) * itemsPerPage + tools.length} tools
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 mb-12">
            {tools.map((tool, index) => (
              <div
                key={tool.id}
                className="opacity-0 translate-y-4 animate-fade-in"
                style={{
                  animationFillMode: 'forwards',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-accent"}
                    />
                  </PaginationItem>
                  
                  {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                    let pageNumber;
                    if (totalPages <= 7) {
                      pageNumber = i + 1;
                    } else {
                      if (currentPage <= 4) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNumber = totalPages - 6 + i;
                      } else {
                        pageNumber = currentPage - 3 + i;
                      }
                    }
                    
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink 
                          isActive={pageNumber === currentPage}
                          onClick={() => handlePageChange(pageNumber)}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-accent"}
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
