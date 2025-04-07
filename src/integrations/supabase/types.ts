export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string
          featured: boolean | null
          id: string
          read_time: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category: string
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt: string
          featured?: boolean | null
          id?: string
          read_time: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string
          featured?: boolean | null
          id?: string
          read_time?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          tool_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          tool_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          tool_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          tool_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          tool_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          tool_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_submissions: {
        Row: {
          additional_info: string | null
          category: string
          contact_email: string
          created_at: string
          description: string
          id: string
          pricing: string
          status: string
          tool_name: string
          updated_at: string
          user_id: string | null
          website_url: string
        }
        Insert: {
          additional_info?: string | null
          category: string
          contact_email: string
          created_at?: string
          description: string
          id?: string
          pricing: string
          status?: string
          tool_name: string
          updated_at?: string
          user_id?: string | null
          website_url: string
        }
        Update: {
          additional_info?: string | null
          category?: string
          contact_email?: string
          created_at?: string
          description?: string
          id?: string
          pricing?: string
          status?: string
          tool_name?: string
          updated_at?: string
          user_id?: string | null
          website_url?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          applicable_tasks: Json[] | null
          click_count: number | null
          company_name: string | null
          cons: Json[] | null
          created_at: string | null
          detail_url: string | null
          faqs: Json | null
          featured_image_url: string | null
          full_description: string | null
          id: number
          is_featured: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          pricing: string | null
          primary_task: string | null
          pros: Json[] | null
          short_description: string | null
          slug: string | null
          updated_at: string | null
          visit_website_url: string | null
        }
        Insert: {
          applicable_tasks?: Json[] | null
          click_count?: number | null
          company_name?: string | null
          cons?: Json[] | null
          created_at?: string | null
          detail_url?: string | null
          faqs?: Json | null
          featured_image_url?: string | null
          full_description?: string | null
          id?: number
          is_featured?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          pricing?: string | null
          primary_task?: string | null
          pros?: Json[] | null
          short_description?: string | null
          slug?: string | null
          updated_at?: string | null
          visit_website_url?: string | null
        }
        Update: {
          applicable_tasks?: Json[] | null
          click_count?: number | null
          company_name?: string | null
          cons?: Json[] | null
          created_at?: string | null
          detail_url?: string | null
          faqs?: Json | null
          featured_image_url?: string | null
          full_description?: string | null
          id?: number
          is_featured?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          pricing?: string | null
          primary_task?: string | null
          pros?: Json[] | null
          short_description?: string | null
          slug?: string | null
          updated_at?: string | null
          visit_website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_average_rating: {
        Args: { tool_id: number }
        Returns: number
      }
      count_profiles: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_new_profile: {
        Args: { user_id: string; user_role: string }
        Returns: undefined
      }
      get_profile_by_id: {
        Args: { user_id: string }
        Returns: {
          created_at: string
          id: string
          role: string
          updated_at: string
        }
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      increment_tool_click_count: {
        Args: { tool_id: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
