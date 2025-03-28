
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tools: {
        Row: {
          id: number
          company_name: string
          short_description: string
          pricing: string
          primary_task: string
          logo_url: string | null
          featured_image_url: string | null
          website_url: string | null
          description: string | null
          click_count: number
          created_at: string
          updated_at: string
          slug: string
        }
        Insert: {
          id?: number
          company_name: string
          short_description: string
          pricing?: string
          primary_task: string
          logo_url?: string | null
          featured_image_url?: string | null
          website_url?: string | null
          description?: string | null
          click_count?: number
          created_at?: string
          updated_at?: string
          slug: string
        }
        Update: {
          id?: number
          company_name?: string
          short_description?: string
          pricing?: string
          primary_task?: string
          logo_url?: string | null
          featured_image_url?: string | null
          website_url?: string | null
          description?: string | null
          click_count?: number
          created_at?: string
          updated_at?: string
          slug?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          tool_id: number
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id: number
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: number
          rating?: number
          comment?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          tool_id: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_tool_click_count: {
        Args: {
          tool_id: number
        }
        Returns: undefined
      }
      calculate_average_rating: {
        Args: {
          tool_id: number
        }
        Returns: number
      }
      get_profile_by_id: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          role: string
          created_at: string
          updated_at: string
        }
      }
      count_profiles: {
        Args: Record<string, never>
        Returns: number
      }
      create_new_profile: {
        Args: {
          user_id: string
          user_role: string
        }
        Returns: undefined
      }
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: string
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
