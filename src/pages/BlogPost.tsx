import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Post } from '@/components/blog/Post';

export default function BlogPost() {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching post:', error);
        } else {
          setPost(data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <PageWrapper isLoading={isLoading}>
      {post && <Post post={post} />}
    </PageWrapper>
  );
}
