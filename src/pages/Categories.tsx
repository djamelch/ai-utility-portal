
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { MainNav } from "@/components/layout/MainNav";
import { siteConfig } from "@/config/site";
import { Category } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedSearch } from "@/components/search/EnhancedSearch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Folder, Search, ArrowUpDown, FolderTree, Layers, Code, Palette, MessageSquare, Database, Cpu, Briefcase, Globe, Image, Video, Headphones, FileText, Users, Zap, Bot } from "lucide-react";

type SortOption = "count-desc" | "count-asc" | "alpha-asc" | "alpha-desc";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("count-desc");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data: categoryData, error } = await supabase
          .rpc('get_primary_task_counts');

        if (error) {
          console.error("Error fetching categories:", error);
        }

        if (categoryData) {
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

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
  };

  const sortCategories = (cats: Category[]): Category[] => {
    return [...cats].sort((a, b) => {
      switch (sortOption) {
        case "count-desc":
          return b.count - a.count;
        case "count-asc":
          return a.count - b.count;
        case "alpha-asc":
          return a.name.localeCompare(b.name);
        case "alpha-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  };

  const filteredCategories = sortCategories(
    categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Get an icon for a category based on its name
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    
    if (name.includes('code') || name.includes('programming') || name.includes('development')) return <Code className="h-8 w-8 text-blue-500 mb-2" />;
    if (name.includes('design') || name.includes('ui') || name.includes('graphic')) return <Palette className="h-8 w-8 text-purple-500 mb-2" />;
    if (name.includes('chat') || name.includes('conversation') || name.includes('communication')) return <MessageSquare className="h-8 w-8 text-green-500 mb-2" />;
    if (name.includes('data') || name.includes('analytics') || name.includes('database')) return <Database className="h-8 w-8 text-orange-500 mb-2" />;
    if (name.includes('ai') || name.includes('machine learning') || name.includes('ml')) return <Bot className="h-8 w-8 text-red-500 mb-2" />;
    if (name.includes('productivity') || name.includes('automation')) return <Zap className="h-8 w-8 text-yellow-500 mb-2" />;
    if (name.includes('business') || name.includes('finance') || name.includes('sales')) return <Briefcase className="h-8 w-8 text-indigo-500 mb-2" />;
    if (name.includes('web') || name.includes('internet') || name.includes('browser')) return <Globe className="h-8 w-8 text-cyan-500 mb-2" />;
    if (name.includes('image') || name.includes('photo') || name.includes('picture')) return <Image className="h-8 w-8 text-pink-500 mb-2" />;
    if (name.includes('video') || name.includes('media') || name.includes('movie')) return <Video className="h-8 w-8 text-red-400 mb-2" />;
    if (name.includes('audio') || name.includes('music') || name.includes('sound')) return <Headphones className="h-8 w-8 text-purple-400 mb-2" />;
    if (name.includes('text') || name.includes('writing') || name.includes('content')) return <FileText className="h-8 w-8 text-gray-500 mb-2" />;
    if (name.includes('social') || name.includes('team') || name.includes('collaboration')) return <Users className="h-8 w-8 text-blue-400 mb-2" />;
    if (name.includes('process') || name.includes('workflow')) return <Cpu className="h-8 w-8 text-emerald-500 mb-2" />;
    
    // Default icon
    return <Folder className="h-8 w-8 text-primary mb-2" />;
  };

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

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-6">
            <div className="relative w-full max-w-md">
              <EnhancedSearch 
                placeholder="Search categories..." 
                redirectToTools={false}
                onSearch={(term) => setSearch(term)}
                buttonText={null}
                size="md"
                variant="default"
              />
            </div>

            <div className="flex items-center">
              <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm mr-2">Sort by:</span>
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count-desc">Most Tools</SelectItem>
                  <SelectItem value="count-asc">Fewest Tools</SelectItem>
                  <SelectItem value="alpha-asc">A-Z</SelectItem>
                  <SelectItem value="alpha-desc">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-[60%]" />
                    <Skeleton className="h-3 w-[40%] mt-2" />
                  </CardContent>
                </Card>
              ))
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <Link
                  to={`/tools?category=${category.slug}`}
                  key={category.id}
                >
                  <Card className="transition-all duration-200 hover:bg-accent/50 hover:shadow-md hover:scale-105">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      {getCategoryIcon(category.name)}
                      <h2 className="text-lg font-semibold">{category.name}</h2>
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {category.description || `Browse ${category.name} tools`}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {category.count} tools
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-6">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
