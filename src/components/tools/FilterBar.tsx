
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { SortAsc, Filter, Zap, Grid3X3 } from "lucide-react";

interface FilterBarProps {
  categories: Array<{ name: string; count: number }>;
  pricingOptions: string[];
  selectedCategory: string;
  selectedPricing: string;
  selectedSortOrder: string;
  onCategoryChange: (value: string) => void;
  onPricingChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function FilterBar({
  categories,
  pricingOptions,
  selectedCategory,
  selectedPricing,
  selectedSortOrder,
  onCategoryChange,
  onPricingChange,
  onSortChange
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-3 px-4 py-3 bg-background/80 backdrop-blur-sm rounded-lg border mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center">
          <Grid3X3 className="mr-2 h-4 w-4 text-primary" />
          <span className="text-sm font-medium mr-2">Category:</span>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center">
          <Zap className="mr-2 h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium mr-2">Pricing:</span>
          <Select value={selectedPricing} onValueChange={onPricingChange}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="All Pricing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pricing</SelectItem>
              {pricingOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center mt-3 md:mt-0">
        <SortAsc className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium mr-2">Sort:</span>
        <Select value={selectedSortOrder} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="top-rated">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
