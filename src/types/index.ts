
export interface Category {
  id: string | number;
  name: string;
  slug?: string;
  description?: string;
  count: number;
}

export interface Tool {
  id: string | number;
  name?: string;
  company_name?: string;
  description?: string;
  short_description?: string;
  logo?: string;
  logo_url?: string;
  category?: string;
  primary_task?: string;
  rating?: number;
  reviewCount?: number;
  pricing?: string;
  url?: string;
  slug?: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  isNew?: boolean;
  visit_website_url?: string;
  full_description?: string;
  featured_image_url?: string;
  click_count?: number;
  detail_url?: string;
  is_featured?: boolean;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}
