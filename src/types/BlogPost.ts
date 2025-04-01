
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: string;
  read_time: string;
  featured: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
};
