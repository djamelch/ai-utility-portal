
export interface Tool {
  id: string | number;
  name: string;
  description: string;
  logo: string;
  category: string;
  rating: number;
  reviewCount: number;
  pricing: string;
  url: string;
  slug?: string;
  isFeatured?: boolean;
  isNew?: boolean;
}
