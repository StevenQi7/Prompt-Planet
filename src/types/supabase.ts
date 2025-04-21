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
      profiles: {
        Row: {
          id: string
          username: string | null
          nickname: string | null
          avatar: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          nickname?: string | null
          avatar?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          nickname?: string | null
          avatar?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          usage_guide: string | null
          category_id: string
          author_id: string
          status: string
          view_count: number
          favorite_count: number
          images: string | null
          language: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          usage_guide?: string | null
          category_id: string
          author_id: string
          status?: string
          view_count?: number
          favorite_count?: number
          images?: string | null
          language?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          usage_guide?: string | null
          category_id?: string
          author_id?: string
          status?: string
          view_count?: number
          favorite_count?: number
          images?: string | null
          language?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          display_name: string
          slug: string
          icon: string
          color: string
          count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          slug: string
          icon: string
          color: string
          count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          slug?: string
          icon?: string
          color?: string
          count?: number
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          display_name: string
          slug: string
          color: string
          count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          slug: string
          color: string
          count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          slug?: string
          color?: string
          count?: number
          created_at?: string
          updated_at?: string
        }
      }
      prompt_tags: {
        Row: {
          id: string
          prompt_id: string
          tag_id: string
        }
        Insert: {
          id?: string
          prompt_id: string
          tag_id: string
        }
        Update: {
          id?: string
          prompt_id?: string
          tag_id?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          prompt_id: string
          reviewer_id: string
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          reviewer_id: string
          status: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          reviewer_id?: string
          status?: string
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 