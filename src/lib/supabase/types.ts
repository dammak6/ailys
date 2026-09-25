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
      admin_users: {
        Row: {
          auth_user_id: string | null
          created_at: string
          created_by: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_login_at: string | null
          must_change_password: boolean
          role_id: string
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          must_change_password?: boolean
          role_id: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          must_change_password?: boolean
          role_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          actor_role: string | null
          after_state: Json | null
          before_state: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          actor_role?: string | null
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          actor_role?: string | null
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          gender: string
          hero_image_url: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          slug: string
          tagline: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          gender: string
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          slug: string
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          gender?: string
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          tagline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_products: {
        Row: {
          collection_id: string
          display_order: number
          product_id: string
        }
        Insert: {
          collection_id: string
          display_order?: number
          product_id: string
        }
        Update: {
          collection_id?: string
          display_order?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          hero_desktop_image: string
          hero_mobile_image: string | null
          id: string
          is_capsule: boolean
          is_published: boolean
          slug: string
          story: string | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          hero_desktop_image: string
          hero_mobile_image?: string | null
          id?: string
          is_capsule?: boolean
          is_published?: boolean
          slug: string
          story?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          hero_desktop_image?: string
          hero_mobile_image?: string | null
          id?: string
          is_capsule?: boolean
          is_published?: boolean
          slug?: string
          story?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      colors: {
        Row: {
          display_order: number
          hex: string
          id: string
          name: string
        }
        Insert: {
          display_order?: number
          hex: string
          id?: string
          name: string
        }
        Update: {
          display_order?: number
          hex?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      customer_addresses: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          city: string
          created_at: string
          customer_id: string
          delivery_notes: string | null
          email: string | null
          full_name: string
          governorate: string
          id: string
          is_default: boolean
          phone: string
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          city: string
          created_at?: string
          customer_id: string
          delivery_notes?: string | null
          email?: string | null
          full_name: string
          governorate: string
          id?: string
          is_default?: boolean
          phone: string
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          city?: string
          created_at?: string
          customer_id?: string
          delivery_notes?: string | null
          email?: string | null
          full_name?: string
          governorate?: string
          id?: string
          is_default?: boolean
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_interactions: {
        Row: {
          actor_id: string | null
          channel: string
          created_at: string
          customer_id: string
          id: string
          message: string
          subject: string | null
        }
        Insert: {
          actor_id?: string | null
          channel: string
          created_at?: string
          customer_id: string
          id?: string
          message: string
          subject?: string | null
        }
        Update: {
          actor_id?: string | null
          channel?: string
          created_at?: string
          customer_id?: string
          id?: string
          message?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_interactions_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_interactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          normalized_phone: string
          notes: string | null
          total_orders_count: number
          total_spent: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          normalized_phone: string
          notes?: string | null
          total_orders_count?: number
          total_spent?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          normalized_phone?: string
          notes?: string | null
          total_orders_count?: number
          total_spent?: number
          updated_at?: string
        }
        Relationships: []
      }
      delivery_zones: {
        Row: {
          delivery_fee: number
          governorate: string
          id: string
          is_active: boolean
          max_estimated_hours: number
          min_estimated_hours: number
        }
        Insert: {
          delivery_fee?: number
          governorate: string
          id?: string
          is_active?: boolean
          max_estimated_hours?: number
          min_estimated_hours?: number
        }
        Update: {
          delivery_fee?: number
          governorate?: string
          id?: string
          is_active?: boolean
          max_estimated_hours?: number
          min_estimated_hours?: number
        }
        Relationships: []
      }
      homepage_content: {
        Row: {
          content_key: string
          content_value: string | null
          desktop_image_url: string | null
          focal_point_x: number | null
          focal_point_y: number | null
          id: string
          metadata: Json | null
          mobile_image_url: string | null
          section_id: string
          updated_at: string
        }
        Insert: {
          content_key: string
          content_value?: string | null
          desktop_image_url?: string | null
          focal_point_x?: number | null
          focal_point_y?: number | null
          id?: string
          metadata?: Json | null
          mobile_image_url?: string | null
          section_id: string
          updated_at?: string
        }
        Update: {
          content_key?: string
          content_value?: string | null
          desktop_image_url?: string | null
          focal_point_x?: number | null
          focal_point_y?: number | null
          id?: string
          metadata?: Json | null
          mobile_image_url?: string | null
          section_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "homepage_content_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "homepage_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_sections: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_enabled: boolean
          section_key: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_enabled?: boolean
          section_key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_enabled?: boolean
          section_key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          notes: string | null
          quantity_delta: number
          reason: string
          related_order_id: string | null
          related_return_id: string | null
          variant_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          quantity_delta: number
          reason: string
          related_order_id?: string | null
          related_return_id?: string | null
          variant_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          quantity_delta?: number
          reason?: string
          related_order_id?: string | null
          related_return_id?: string | null
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          bucket_name: string
          created_at: string
          display_name: string | null
          filename: string
          height: number | null
          id: string
          mime_type: string
          original_name: string
          public_url: string
          size_bytes: number
          transform_metadata: Json | null
          usage_locations: string[] | null
          usage_tag: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          bucket_name?: string
          created_at?: string
          display_name?: string | null
          filename: string
          height?: number | null
          id?: string
          mime_type: string
          original_name: string
          public_url: string
          size_bytes: number
          transform_metadata?: Json | null
          usage_locations?: string[] | null
          usage_tag?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          bucket_name?: string
          created_at?: string
          display_name?: string | null
          filename?: string
          height?: number | null
          id?: string
          mime_type?: string
          original_name?: string
          public_url?: string
          size_bytes?: number
          transform_metadata?: Json | null
          usage_locations?: string[] | null
          usage_tag?: string | null
          width?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          channel: string
          created_at: string
          error_message: string | null
          failed_at: string | null
          id: string
          payload: Json
          recipient: string
          sent_at: string | null
          status: string
          template_type: string
        }
        Insert: {
          channel: string
          created_at?: string
          error_message?: string | null
          failed_at?: string | null
          id?: string
          payload?: Json
          recipient: string
          sent_at?: string | null
          status?: string
          template_type: string
        }
        Update: {
          channel?: string
          created_at?: string
          error_message?: string | null
          failed_at?: string | null
          id?: string
          payload?: Json
          recipient?: string
          sent_at?: string | null
          status?: string
          template_type?: string
        }
        Relationships: []
      }
      order_documents: {
        Row: {
          document_number: string
          document_type: string
          finalized_at: string | null
          generated_at: string
          id: string
          is_finalized: boolean
          metadata: Json | null
          order_id: string
          storage_path: string | null
        }
        Insert: {
          document_number: string
          document_type: string
          finalized_at?: string | null
          generated_at?: string
          id?: string
          is_finalized?: boolean
          metadata?: Json | null
          order_id: string
          storage_path?: string | null
        }
        Update: {
          document_number?: string
          document_type?: string
          finalized_at?: string | null
          generated_at?: string
          id?: string
          is_finalized?: boolean
          metadata?: Json | null
          order_id?: string
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_documents_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_edit_history: {
        Row: {
          actor_id: string | null
          actor_role: string
          after_values: Json
          before_values: Json
          changed_fields: string[]
          created_at: string
          id: string
          order_id: string
          reason: string | null
        }
        Insert: {
          actor_id?: string | null
          actor_role: string
          after_values: Json
          before_values: Json
          changed_fields: string[]
          created_at?: string
          id?: string
          order_id: string
          reason?: string | null
        }
        Update: {
          actor_id?: string | null
          actor_role?: string
          after_values?: Json
          before_values?: Json
          changed_fields?: string[]
          created_at?: string
          id?: string
          order_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_edit_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_edit_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          color: string
          created_at: string
          discount: number
          id: string
          image_url: string | null
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          size: string
          sku: string | null
          total_price: number
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          color: string
          created_at?: string
          discount?: number
          id?: string
          image_url?: string | null
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          size: string
          sku?: string | null
          total_price: number
          unit_price: number
          variant_id?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          discount?: number
          id?: string
          image_url?: string | null
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          size?: string
          sku?: string | null
          total_price?: number
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          actor_id: string | null
          actor_role: string
          created_at: string
          id: string
          new_status: string
          note: string | null
          order_id: string
          previous_status: string | null
        }
        Insert: {
          actor_id?: string | null
          actor_role?: string
          created_at?: string
          id?: string
          new_status: string
          note?: string | null
          order_id: string
          previous_status?: string | null
        }
        Update: {
          actor_id?: string | null
          actor_role?: string
          created_at?: string
          id?: string
          new_status?: string
          note?: string | null
          order_id?: string
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          alt_phone: string | null
          city: string
          courier_notes: string | null
          created_at: string
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string
          delivery_notes: string | null
          discount_amount: number
          governorate: string
          id: string
          order_code: string
          payment_method: string
          payment_status: string
          shipping_fee: number
          status: string
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          address: string
          alt_phone?: string | null
          city: string
          courier_notes?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          delivery_notes?: string | null
          discount_amount?: number
          governorate: string
          id?: string
          order_code?: string
          payment_method?: string
          payment_status?: string
          shipping_fee?: number
          status?: string
          subtotal: number
          total: number
          updated_at?: string
        }
        Update: {
          address?: string
          alt_phone?: string | null
          city?: string
          courier_notes?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_notes?: string | null
          discount_amount?: number
          governorate?: string
          id?: string
          order_code?: string
          payment_method?: string
          payment_status?: string
          shipping_fee?: number
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          category: string
          code: string
          created_at: string
          description: string | null
          id: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          description?: string | null
          id?: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          crop_metadata: Json | null
          display_order: number
          focal_point_x: number | null
          focal_point_y: number | null
          id: string
          image_url: string
          is_primary: boolean
          product_id: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          crop_metadata?: Json | null
          display_order?: number
          focal_point_x?: number | null
          focal_point_y?: number | null
          id?: string
          image_url: string
          is_primary?: boolean
          product_id: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          crop_metadata?: Json | null
          display_order?: number
          focal_point_x?: number | null
          focal_point_y?: number | null
          id?: string
          image_url?: string
          is_primary?: boolean
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_recommendations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          product_id: string
          recommended_product_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          product_id: string
          recommended_product_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          product_id?: string
          recommended_product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_recommendations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_recommendations_recommended_product_id_fkey"
            columns: ["recommended_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_sizes: {
        Row: {
          id: string
          is_available: boolean
          product_id: string
          size_id: string
        }
        Insert: {
          id?: string
          is_available?: boolean
          product_id: string
          size_id: string
        }
        Update: {
          id?: string
          is_available?: boolean
          product_id?: string
          size_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_sizes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sizes_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "sizes"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tag_links: {
        Row: {
          product_id: string
          tag_id: string
        }
        Insert: {
          product_id: string
          tag_id: string
        }
        Update: {
          product_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tag_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tag_links_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "product_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          color_id: string
          created_at: string
          id: string
          is_active: boolean
          low_stock_threshold: number
          price_override: number | null
          product_id: string
          size_id: string
          sku: string
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          color_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          low_stock_threshold?: number
          price_override?: number | null
          product_id: string
          size_id: string
          sku: string
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          color_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          low_stock_threshold?: number
          price_override?: number | null
          product_id?: string
          size_id?: string
          sku?: string
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "sizes"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          care: string | null
          category_id: string | null
          created_at: string
          description: string | null
          fit: string | null
          id: string
          is_capsule: boolean
          is_featured: boolean
          is_new: boolean
          is_published: boolean
          is_sold_out_manual_override: boolean
          materials: string | null
          name: string
          price: number
          sale_price: number | null
          seo_metadata: Json | null
          slug: string
          sub_category: string | null
          subtitle: string | null
          updated_at: string
        }
        Insert: {
          care?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          fit?: string | null
          id?: string
          is_capsule?: boolean
          is_featured?: boolean
          is_new?: boolean
          is_published?: boolean
          is_sold_out_manual_override?: boolean
          materials?: string | null
          name: string
          price: number
          sale_price?: number | null
          seo_metadata?: Json | null
          slug: string
          sub_category?: string | null
          subtitle?: string | null
          updated_at?: string
        }
        Update: {
          care?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          fit?: string | null
          id?: string
          is_capsule?: boolean
          is_featured?: boolean
          is_new?: boolean
          is_published?: boolean
          is_sold_out_manual_override?: boolean
          materials?: string | null
          name?: string
          price?: number
          sale_price?: number | null
          seo_metadata?: Json | null
          slug?: string
          sub_category?: string | null
          subtitle?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_usages: {
        Row: {
          created_at: string
          customer_id: string | null
          discount_applied: number
          id: string
          order_id: string
          promotion_id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          discount_applied: number
          id?: string
          order_id: string
          promotion_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          discount_applied?: number
          id?: string
          order_id?: string
          promotion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_usages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_usages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_usages_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          end_date: string | null
          id: string
          is_active: boolean
          max_discount_amount: number | null
          min_order_amount: number | null
          per_customer_limit: number | null
          start_date: string | null
          usage_limit: number | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          max_discount_amount?: number | null
          min_order_amount?: number | null
          per_customer_limit?: number | null
          start_date?: string | null
          usage_limit?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          max_discount_amount?: number | null
          min_order_amount?: number | null
          per_customer_limit?: number | null
          start_date?: string | null
          usage_limit?: number | null
        }
        Relationships: []
      }
      restock_requests: {
        Row: {
          admin_notes: string | null
          color_id: string | null
          color_name: string | null
          contact_info: string
          contact_type: string
          created_at: string
          id: string
          notified_at: string | null
          preferred_channel: string
          product_id: string
          product_name: string
          resolved_at: string | null
          size_id: string | null
          size_name: string | null
          status: string
          variant_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          color_id?: string | null
          color_name?: string | null
          contact_info: string
          contact_type: string
          created_at?: string
          id?: string
          notified_at?: string | null
          preferred_channel?: string
          product_id: string
          product_name: string
          resolved_at?: string | null
          size_id?: string | null
          size_name?: string | null
          status?: string
          variant_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          color_id?: string | null
          color_name?: string | null
          contact_info?: string
          contact_type?: string
          created_at?: string
          id?: string
          notified_at?: string | null
          preferred_channel?: string
          product_id?: string
          product_name?: string
          resolved_at?: string | null
          size_id?: string | null
          size_name?: string | null
          status?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restock_requests_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restock_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restock_requests_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "sizes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restock_requests_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      return_items: {
        Row: {
          condition_status: string | null
          created_at: string
          id: string
          order_item_id: string | null
          product_name: string
          quantity: number
          requested_exchange_color: string | null
          requested_exchange_size: string | null
          return_id: string
        }
        Insert: {
          condition_status?: string | null
          created_at?: string
          id?: string
          order_item_id?: string | null
          product_name: string
          quantity: number
          requested_exchange_color?: string | null
          requested_exchange_size?: string | null
          return_id: string
        }
        Update: {
          condition_status?: string | null
          created_at?: string
          id?: string
          order_item_id?: string | null
          product_name?: string
          quantity?: number
          requested_exchange_color?: string | null
          requested_exchange_size?: string | null
          return_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "return_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
        ]
      }
      return_status_history: {
        Row: {
          actor_id: string | null
          actor_role: string
          created_at: string
          id: string
          new_status: string
          note: string | null
          previous_status: string | null
          return_id: string
        }
        Insert: {
          actor_id?: string | null
          actor_role?: string
          created_at?: string
          id?: string
          new_status: string
          note?: string | null
          previous_status?: string | null
          return_id: string
        }
        Update: {
          actor_id?: string | null
          actor_role?: string
          created_at?: string
          id?: string
          new_status?: string
          note?: string | null
          previous_status?: string | null
          return_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "return_status_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_status_history_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          admin_notes: string | null
          comments: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: string
          inspection_notes: string | null
          order_code: string
          order_id: string | null
          reason: string
          request_code: string
          status: string
          tags_intact_confirmed: boolean
          type: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          comments?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          inspection_notes?: string | null
          order_code: string
          order_id?: string | null
          reason: string
          request_code?: string
          status?: string
          tags_intact_confirmed?: boolean
          type: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          comments?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          inspection_notes?: string | null
          order_code?: string
          order_id?: string | null
          reason?: string
          request_code?: string
          status?: string
          tags_intact_confirmed?: boolean
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          is_public: boolean
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          is_public?: boolean
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          is_public?: boolean
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      size_guide_rows: {
        Row: {
          chest_max_cm: number | null
          chest_min_cm: number | null
          display_order: number
          hips_max_cm: number | null
          hips_min_cm: number | null
          id: string
          size_code: string
          size_guide_id: string
          waist_max_cm: number | null
          waist_min_cm: number | null
        }
        Insert: {
          chest_max_cm?: number | null
          chest_min_cm?: number | null
          display_order?: number
          hips_max_cm?: number | null
          hips_min_cm?: number | null
          id?: string
          size_code: string
          size_guide_id: string
          waist_max_cm?: number | null
          waist_min_cm?: number | null
        }
        Update: {
          chest_max_cm?: number | null
          chest_min_cm?: number | null
          display_order?: number
          hips_max_cm?: number | null
          hips_min_cm?: number | null
          id?: string
          size_code?: string
          size_guide_id?: string
          waist_max_cm?: number | null
          waist_min_cm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "size_guide_rows_size_guide_id_fkey"
            columns: ["size_guide_id"]
            isOneToOne: false
            referencedRelation: "size_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      size_guides: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          how_to_measure: string | null
          id: string
          product_id: string | null
          title: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          how_to_measure?: string | null
          id?: string
          product_id?: string | null
          title: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          how_to_measure?: string | null
          id?: string
          product_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "size_guides_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "size_guides_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      sizes: {
        Row: {
          code: string
          display_order: number
          gender: string
          id: string
          name: string
        }
        Insert: {
          code: string
          display_order?: number
          gender: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          display_order?: number
          gender?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          color_id: string | null
          created_at: string
          id: string
          product_id: string
          size_id: string | null
          wishlist_id: string
        }
        Insert: {
          color_id?: string | null
          created_at?: string
          id?: string
          product_id: string
          size_id?: string | null
          wishlist_id: string
        }
        Update: {
          color_id?: string | null
          created_at?: string
          id?: string
          product_id?: string
          size_id?: string | null
          wishlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "sizes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_wishlist_id_fkey"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "wishlists"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          customer_id: string | null
          guest_token: string | null
          id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          guest_token?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          guest_token?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_checkout: {
        Args: {
          p_address: string
          p_alt_phone?: string
          p_city: string
          p_customer_email?: string
          p_customer_name: string
          p_governorate: string
          p_items: Json
          p_notes?: string
          p_phone: string
        }
        Returns: Json
      }
      generate_order_code: { Args: never; Returns: string }
      generate_return_code: { Args: never; Returns: string }
      get_admin_profile: {
        Args: never
        Returns: {
          admin_id: string
          email: string
          full_name: string
          is_active: boolean
          role_name: string
        }[]
      }
      get_executive_analytics: { Args: never; Returns: Json }
      is_admin: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      normalize_tunisian_phone: {
        Args: { phone_input: string }
        Returns: string
      }
      submit_return_request: {
        Args: {
          p_comments?: string
          p_items: Json
          p_order_code: string
          p_phone: string
          p_reason: string
          p_tags_intact?: boolean
          p_type: string
        }
        Returns: Json
      }
      track_order: {
        Args: { p_order_code: string; p_phone: string }
        Returns: Json
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
