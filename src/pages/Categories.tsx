
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MainNav } from "@/components/layout/MainNav";
import { siteConfig } from "@/config/site";
import { Category } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // We need to use a function to get categories since there's no categories table
        const { data: categoryData, error } = await supabase
          .rpc('get_primary_task_counts');

        if (error) {
          console.error("Error fetching categories:", error);
        }

        if (categoryData) {
          // Transform the data to match our Category interface
          const formattedCategories: Category[] = categoryData.map((item: any) => {
            return {
              id: item.primary_task,
              name: item.primary_task,
              slug: item.primary_task.toLowerCase().replace(/\s+/g, '-'),
              count: item.count || 0
            };
          });

          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Categories - {siteConfig.name}</title>
        <meta
          name="description"
          content="Explore tools by category to find exactly what you need."
        />
      </Helmet>
      <MainNav />
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <MotionWrapper animation="fadeIn">
          <div className="inline-block max-w-lg">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
              Explore Tools by Category
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground mt-3">
              Dive deep into our curated categories to discover the perfect tool
              for your next project.
            </p>
          </div>

          <div className="relative w-full max-w-md">
            <Input
              type="search"
              placeholder="Search categories..."
              value={search}
              onChange={handleSearch}
              className="pr-10"
            />
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {loading ? (
              // Skeleton loaders while loading
              [...Array(8)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-[60%]" />
                    <Skeleton className="h-3 w-[40%] mt-2" />
                  </CardContent>
                </Card>
              ))
            ) : filteredCategories.length > 0 ? (
              // Display categories if available
              filteredCategories.map((category) => (
                <Link
                  to={`/tools?category=${category.slug}`}
                  key={category.id}
                >
                  <Card className="transition-colors duration-200 hover:bg-secondary">
                    <CardContent className="p-4">
                      <h2 className="text-lg font-semibold">{category.name}</h2>
                      <p className="text-sm text-muted-foreground truncate">
                        {category.description || `Browse ${category.name} tools`}
                      </p>
                      <Badge variant="secondary" className="ml-2">
                        {category.count} tools
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              // Display message if no categories are found
              <div className="col-span-full text-center py-6">
                <p className="text-muted-foreground">
                  No categories found matching your search.
                </p>
              </div>
            )}
          </div>
        </MotionWrapper>
      </section>
    </>
  );
};

export default Categories;
