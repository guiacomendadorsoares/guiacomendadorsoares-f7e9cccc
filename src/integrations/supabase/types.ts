export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      asaas_webhook_events: {
        Row: {
          event: string
          event_id: string | null
          id: string
          payload: Json
          processed_at: string
        }
        Insert: {
          event: string
          event_id?: string | null
          id?: string
          payload: Json
          processed_at?: string
        }
        Update: {
          event?: string
          event_id?: string | null
          id?: string
          payload?: Json
          processed_at?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          active: boolean
          created_at: string
          cta: string
          eyebrow: string
          href: string | null
          id: string
          media_type: string
          media_url: string
          poster_url: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          cta?: string
          eyebrow?: string
          href?: string | null
          id?: string
          media_type?: string
          media_url: string
          poster_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          cta?: string
          eyebrow?: string
          href?: string | null
          id?: string
          media_type?: string
          media_url?: string
          poster_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      broadcasts: {
        Row: {
          active: boolean
          body: string | null
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          image_url: string | null
          link: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          body?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          body?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          address: string
          approved_at: string | null
          approved_by: string | null
          banner_url: string | null
          category: string
          category_label: string
          cover_url: string | null
          created_at: string
          description: string | null
          email: string | null
          featured: boolean
          gallery: Json
          gallery_urls: string[]
          hours: Json
          id: string
          instagram: string | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          main_category: string | null
          name: string
          owner_id: string | null
          phone: string | null
          rejection_reason: string | null
          slug: string | null
          status: Database["public"]["Enums"]["content_status"]
          subcategory: string | null
          submitted_by: string | null
          updated_at: string
          verified: boolean
          whatsapp: string | null
        }
        Insert: {
          address: string
          approved_at?: string | null
          approved_by?: string | null
          banner_url?: string | null
          category: string
          category_label: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          featured?: boolean
          gallery?: Json
          gallery_urls?: string[]
          hours?: Json
          id?: string
          instagram?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          main_category?: string | null
          name: string
          owner_id?: string | null
          phone?: string | null
          rejection_reason?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subcategory?: string | null
          submitted_by?: string | null
          updated_at?: string
          verified?: boolean
          whatsapp?: string | null
        }
        Update: {
          address?: string
          approved_at?: string | null
          approved_by?: string | null
          banner_url?: string | null
          category?: string
          category_label?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          featured?: boolean
          gallery?: Json
          gallery_urls?: string[]
          hours?: Json
          id?: string
          instagram?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          main_category?: string | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          rejection_reason?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          subcategory?: string | null
          submitted_by?: string | null
          updated_at?: string
          verified?: boolean
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          approved: boolean
          author_id: string | null
          author_name: string | null
          content: string
          created_at: string
          id: string
          target_id: string
          target_type: Database["public"]["Enums"]["comment_target"]
          updated_at: string
        }
        Insert: {
          approved?: boolean
          author_id?: string | null
          author_name?: string | null
          content: string
          created_at?: string
          id?: string
          target_id: string
          target_type: Database["public"]["Enums"]["comment_target"]
          updated_at?: string
        }
        Update: {
          approved?: boolean
          author_id?: string | null
          author_name?: string | null
          content?: string
          created_at?: string
          id?: string
          target_id?: string
          target_type?: Database["public"]["Enums"]["comment_target"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          id: string
          redeemed_at: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          id?: string
          redeemed_at?: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          id?: string
          redeemed_at?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          created_by: string | null
          days: number
          expires_at: string | null
          id: string
          max_uses: number
          plan_slug: string
          updated_at: string
          used_count: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          created_by?: string | null
          days: number
          expires_at?: string | null
          id?: string
          max_uses?: number
          plan_slug: string
          updated_at?: string
          used_count?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          created_by?: string | null
          days?: number
          expires_at?: string | null
          id?: string
          max_uses?: number
          plan_slug?: string
          updated_at?: string
          used_count?: number
        }
        Relationships: []
      }
      curiosities: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          body: string
          cover_url: string | null
          created_at: string
          id: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["content_status"]
          submitted_by: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          body: string
          cover_url?: string | null
          created_at?: string
          id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          body?: string
          cover_url?: string | null
          created_at?: string
          id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          active: boolean
          approved_at: string | null
          approved_by: string | null
          business_id: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          is_free: boolean
          latitude: number | null
          location: string | null
          longitude: number | null
          price: number | null
          rejection_reason: string | null
          starts_at: string
          status: Database["public"]["Enums"]["content_status"]
          submitted_by: string | null
          summary: string | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          active?: boolean
          approved_at?: string | null
          approved_by?: string | null
          business_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_free?: boolean
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          price?: number | null
          rejection_reason?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          active?: boolean
          approved_at?: string | null
          approved_by?: string | null
          business_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_free?: boolean
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          price?: number | null
          rejection_reason?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          active: boolean
          apply_url: string | null
          approved_at: string | null
          approved_by: string | null
          business_id: string | null
          company: string
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          location: string
          posted_at: string
          rejection_reason: string | null
          salary: string | null
          status: Database["public"]["Enums"]["content_status"]
          submitted_by: string | null
          title: string
          type: Database["public"]["Enums"]["job_type"]
          updated_at: string
          urgent: boolean
          whatsapp: string | null
        }
        Insert: {
          active?: boolean
          apply_url?: string | null
          approved_at?: string | null
          approved_by?: string | null
          business_id?: string | null
          company: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          location: string
          posted_at?: string
          rejection_reason?: string | null
          salary?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          title: string
          type: Database["public"]["Enums"]["job_type"]
          updated_at?: string
          urgent?: boolean
          whatsapp?: string | null
        }
        Update: {
          active?: boolean
          apply_url?: string | null
          approved_at?: string | null
          approved_by?: string | null
          business_id?: string | null
          company?: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          location?: string
          posted_at?: string
          rejection_reason?: string | null
          salary?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          title?: string
          type?: Database["public"]["Enums"]["job_type"]
          updated_at?: string
          urgent?: boolean
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          author_id: string | null
          category: Database["public"]["Enums"]["news_category"]
          content: string | null
          cover_url: string | null
          created_at: string
          id: string
          published: boolean
          published_at: string
          rejection_reason: string | null
          slug: string | null
          status: Database["public"]["Enums"]["content_status"]
          submitted_by: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          author_id?: string | null
          category: Database["public"]["Enums"]["news_category"]
          content?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string
          rejection_reason?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          author_id?: string | null
          category?: Database["public"]["Enums"]["news_category"]
          content?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string
          rejection_reason?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      pharmacy_product_categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      pharmacy_products: {
        Row: {
          active_ingredient: string | null
          available: boolean
          brand: string | null
          business_id: string
          category: string | null
          created_at: string
          delivery: boolean
          description: string | null
          id: string
          image_url: string | null
          name: string
          pickup: boolean
          price: number | null
          promo_price: number | null
          updated_at: string
        }
        Insert: {
          active_ingredient?: string | null
          available?: boolean
          brand?: string | null
          business_id: string
          category?: string | null
          created_at?: string
          delivery?: boolean
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          pickup?: boolean
          price?: number | null
          promo_price?: number | null
          updated_at?: string
        }
        Update: {
          active_ingredient?: string | null
          available?: boolean
          brand?: string | null
          business_id?: string
          category?: string | null
          created_at?: string
          delivery?: boolean
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          pickup?: boolean
          price?: number | null
          promo_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacy_search_events: {
        Row: {
          business_id: string | null
          created_at: string
          event_type: string
          id: string
          product_id: string | null
          query: string
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          product_id?: string | null
          query: string
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          product_id?: string | null
          query?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_search_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pharmacy_search_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "pharmacy_products"
            referencedColumns: ["id"]
          },
        ]
      }
      popups: {
        Row: {
          active: boolean
          content: string | null
          created_at: string
          created_by: string | null
          ends_at: string | null
          frequency: string
          id: string
          image_url: string | null
          link_label: string | null
          link_url: string | null
          priority: number
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          content?: string | null
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          frequency?: string
          id?: string
          image_url?: string | null
          link_label?: string | null
          link_url?: string | null
          priority?: number
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          content?: string | null
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          frequency?: string
          id?: string
          image_url?: string | null
          link_label?: string | null
          link_url?: string | null
          priority?: number
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          asaas_customer_id: string | null
          avatar_url: string | null
          bio: string | null
          cpf_cnpj: string | null
          created_at: string
          current_plan: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          asaas_customer_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          current_plan?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          asaas_customer_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          current_plan?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          active: boolean
          address: string
          approved_at: string | null
          approved_by: string | null
          area_m2: number | null
          bathrooms: number | null
          bedrooms: number | null
          business_id: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          featured: boolean
          gallery: Json
          gallery_urls: string[]
          id: string
          kind: Database["public"]["Enums"]["property_kind"]
          latitude: number | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          longitude: number | null
          parking: number | null
          price: number
          price_label: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["content_status"]
          submitted_by: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          active?: boolean
          address: string
          approved_at?: string | null
          approved_by?: string | null
          area_m2?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          business_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          gallery?: Json
          gallery_urls?: string[]
          id?: string
          kind: Database["public"]["Enums"]["property_kind"]
          latitude?: number | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          longitude?: number | null
          parking?: number | null
          price: number
          price_label?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          active?: boolean
          address?: string
          approved_at?: string | null
          approved_by?: string | null
          area_m2?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          business_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          gallery?: Json
          gallery_urls?: string[]
          id?: string
          kind?: Database["public"]["Enums"]["property_kind"]
          latitude?: number | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          longitude?: number | null
          parking?: number | null
          price?: number
          price_label?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          submitted_by?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      public_services: {
        Row: {
          active: boolean
          address: string | null
          category: string
          created_at: string
          description: string | null
          email: string | null
          hours: string | null
          id: string
          image_url: string | null
          is_emergency: boolean
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          phones: string[] | null
          source: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          active?: boolean
          address?: string | null
          category: string
          created_at?: string
          description?: string | null
          email?: string | null
          hours?: string | null
          id?: string
          image_url?: string | null
          is_emergency?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          phones?: string[] | null
          source?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          active?: boolean
          address?: string | null
          category?: string
          created_at?: string
          description?: string | null
          email?: string | null
          hours?: string | null
          id?: string
          image_url?: string | null
          is_emergency?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          phones?: string[] | null
          source?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          author_id: string | null
          author_name: string | null
          business_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          business_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          business_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          business_id: string | null
          category: Database["public"]["Enums"]["restaurant_category"]
          cover_url: string | null
          created_at: string
          featured: boolean
          gallery: Json
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          price_range: number
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          business_id?: string | null
          category: Database["public"]["Enums"]["restaurant_category"]
          cover_url?: string | null
          created_at?: string
          featured?: boolean
          gallery?: Json
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          price_range?: number
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          business_id?: string | null
          category?: Database["public"]["Enums"]["restaurant_category"]
          cover_url?: string | null
          created_at?: string
          featured?: boolean
          gallery?: Json
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          price_range?: number
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          features: Json
          id: string
          name: string
          price: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          name: string
          price?: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          name?: string
          price?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          asaas_customer_id: string | null
          asaas_payment_id: string | null
          asaas_subscription_id: string | null
          billing_type: string | null
          created_at: string
          expires_at: string | null
          id: string
          invoice_url: string | null
          next_due_date: string | null
          plan_id: string
          starts_at: string
          status: string
          updated_at: string
          user_id: string
          value: number | null
        }
        Insert: {
          asaas_customer_id?: string | null
          asaas_payment_id?: string | null
          asaas_subscription_id?: string | null
          billing_type?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          invoice_url?: string | null
          next_due_date?: string | null
          plan_id: string
          starts_at?: string
          status?: string
          updated_at?: string
          user_id: string
          value?: number | null
        }
        Update: {
          asaas_customer_id?: string | null
          asaas_payment_id?: string | null
          asaas_subscription_id?: string | null
          billing_type?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          invoice_url?: string | null
          next_due_date?: string | null
          plan_id?: string
          starts_at?: string
          status?: string
          updated_at?: string
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "editor"
        | "partner"
        | "broker"
        | "influencer"
        | "user"
      comment_target: "business" | "news" | "event"
      content_status: "draft" | "pending" | "approved" | "rejected"
      job_type: "emprego" | "estagio" | "jovem-aprendiz" | "freelancer"
      listing_type: "venda" | "aluguel"
      news_category:
        | "bairro"
        | "seguranca"
        | "transito"
        | "obras"
        | "saude"
        | "educacao"
      property_kind: "casa" | "apartamento" | "terreno" | "comercial"
      restaurant_category:
        | "restaurante"
        | "hamburgueria"
        | "pizzaria"
        | "padaria"
        | "japones"
        | "acai"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "partner", "broker", "influencer", "user"],
      comment_target: ["business", "news", "event"],
      content_status: ["draft", "pending", "approved", "rejected"],
      job_type: ["emprego", "estagio", "jovem-aprendiz", "freelancer"],
      listing_type: ["venda", "aluguel"],
      news_category: [
        "bairro",
        "seguranca",
        "transito",
        "obras",
        "saude",
        "educacao",
      ],
      property_kind: ["casa", "apartamento", "terreno", "comercial"],
      restaurant_category: [
        "restaurante",
        "hamburgueria",
        "pizzaria",
        "padaria",
        "japones",
        "acai",
      ],
    },
  },
} as const
