
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AdvancedFiltersProps {
  categories: string[];
  pricingOptions: string[];
  onFiltersChange?: (filters: any) => void;
}

export function AdvancedFilters({
  categories,
  pricingOptions,
  onFiltersChange,
}: AdvancedFiltersProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Initialize states with URL parameters
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const [selectedPricing, setSelectedPricing] = useState<string>(
    searchParams.get("pricing") || ""
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") || "featured"
  );
  const [features, setFeatures] = useState<string[]>(
    searchParams.get("features")?.split(",").filter(Boolean) || []
  );
  
  const featureOptions = [
    { id: "api-access", label: "واجهة برمجة التطبيقات" },
    { id: "free-trial", label: "تجربة مجانية" },
    { id: "no-signup", label: "لا يتطلب تسجيل" },
    { id: "mobile-friendly", label: "متوافق مع الجوال" },
    { id: "browser-extension", label: "إضافة متصفح" },
    { id: "offline-mode", label: "وضع عدم الاتصال" },
    { id: "team-collaboration", label: "تعاون فريق" },
  ];
  
  const handleFeatureToggle = (feature: string) => {
    setFeatures((prev) => 
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };
  
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }
    
    if (selectedPricing) {
      params.set("pricing", selectedPricing);
    } else {
      params.delete("pricing");
    }
    
    if (sortBy && sortBy !== "featured") {
      params.set("sortBy", sortBy);
    } else {
      params.delete("sortBy");
    }
    
    if (features.length > 0) {
      params.set("features", features.join(","));
    } else {
      params.delete("features");
    }
    
    navigate(`/tools?${params.toString()}`);
    
    if (onFiltersChange) {
      onFiltersChange({
        category: selectedCategory,
        pricing: selectedPricing,
        sortBy,
        features,
      });
    }
  };
  
  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedPricing("");
    setSortBy("featured");
    setFeatures([]);
    
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("pricing");
    params.delete("sortBy");
    params.delete("features");
    
    const searchQuery = params.get("search");
    if (searchQuery) {
      navigate(`/tools?search=${searchQuery}`);
    } else {
      navigate("/tools");
    }
    
    if (onFiltersChange) {
      onFiltersChange({
        category: "",
        pricing: "",
        sortBy: "featured",
        features: [],
      });
    }
  };
  
  const activeFiltersCount = [
    selectedCategory,
    selectedPricing,
    sortBy !== "featured" ? sortBy : "",
    ...features,
  ].filter(Boolean).length;
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed">
            الفئات
            {selectedCategory && (
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                1
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <div className="p-2">
            {categories.map((category) => (
              <div
                key={category}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                  selectedCategory === category && "bg-accent"
                )}
                onClick={() => setSelectedCategory(category === selectedCategory ? "" : category)}
              >
                <span>{category}</span>
                {selectedCategory === category && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-sm text-muted-foreground p-2">لا توجد فئات متاحة</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed">
            التسعير
            {selectedPricing && (
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                1
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <div className="p-2">
            {pricingOptions.map((price) => (
              <div
                key={price}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                  selectedPricing === price && "bg-accent"
                )}
                onClick={() => setSelectedPricing(price === selectedPricing ? "" : price)}
              >
                <span>{price}</span>
                {selectedPricing === price && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </div>
            ))}
            {pricingOptions.length === 0 && (
              <div className="text-sm text-muted-foreground p-2">لا توجد خيارات تسعير متاحة</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed">
            الميزات
            {features.length > 0 && (
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {features.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0" align="start">
          <div className="p-2 flex flex-col gap-1">
            {featureOptions.map((feature) => (
              <div key={feature.id} className="flex items-center gap-2">
                <Checkbox
                  id={`feature-${feature.id}`}
                  checked={features.includes(feature.id)}
                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                />
                <label
                  htmlFor={`feature-${feature.id}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {feature.label}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="h-8 w-[130px]">
          <SelectValue placeholder="ترتيب حسب" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">مميز</SelectItem>
          <SelectItem value="newest">الأحدث</SelectItem>
          <SelectItem value="popular">الأكثر شعبية</SelectItem>
          <SelectItem value="top-rated">الأعلى تقييمًا</SelectItem>
        </SelectContent>
      </Select>
      
      <Separator orientation="vertical" className="h-8 hidden sm:block" />
      
      <Button size="sm" className="h-8" onClick={applyFilters}>
        تطبيق الفلاتر
      </Button>
      
      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 lg:px-3"
          onClick={clearFilters}
        >
          مسح الفلاتر
        </Button>
      )}
    </div>
  );
}
