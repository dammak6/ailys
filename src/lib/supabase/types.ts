export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          auth_user_id: string | null;
          email: string;
          full_name: string;
          role: "super_admin" | "admin" | "editor" | "atelier";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          email: string;
          full_name: string;
          role?: "super_admin" | "admin" | "editor" | "atelier";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          email?: string;
          full_name?: string;
          role?: "super_admin" | "admin" | "editor" | "atelier";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          gender: "femme" | "homme" | "enfant" | "famille";
          tagline: string | null;
          description: string | null;
          hero_image_url: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          gender: "femme" | "homme" | "enfant" | "famille";
          tagline?: string | null;
          description?: string | null;
          hero_image_url?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          gender?: "femme" | "homme" | "enfant" | "famille";
          tagline?: string | null;
          description?: string | null;
          hero_image_url?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      sizes: {
        Row: {
          id: string;
          name: string;
          code: string;
          gender: "femme" | "homme" | "enfant" | "universel";
          display_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          gender: "femme" | "homme" | "enfant" | "universel";
          display_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          gender?: "femme" | "homme" | "enfant" | "universel";
          display_order?: number;
        };
      };
      colors: {
        Row: {
          id: string;
          name: string;
          hex: string;
          display_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          hex: string;
          display_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          hex?: string;
          display_order?: number;
        };
      };
      collections: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          story: string | null;
          hero_desktop_image: string;
          hero_mobile_image: string | null;
          focal_point_x: number;
          focal_point_y: number;
          is_capsule: boolean;
          is_published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          story?: string | null;
          hero_desktop_image: string;
          hero_mobile_image?: string | null;
          focal_point_x?: number;
          focal_point_y?: number;
          is_capsule?: boolean;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          subtitle?: string | null;
          description?: string | null;
          story?: string | null;
          hero_desktop_image?: string;
          hero_mobile_image?: string | null;
          focal_point_x?: number;
          focal_point_y?: number;
          is_capsule?: boolean;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          subtitle: string | null;
          description: string | null;
          price: number;
          sale_price: number | null;
          category_id: string | null;
          primary_collection_id: string | null;
          sub_category: string | null;
          materials: string | null;
          care: string | null;
          fit: string | null;
          is_published: boolean;
          is_featured: boolean;
          is_new: boolean;
          is_capsule: boolean;
          is_sold_out: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          subtitle?: string | null;
          description?: string | null;
          price: number;
          sale_price?: number | null;
          category_id?: string | null;
          primary_collection_id?: string | null;
          sub_category?: string | null;
          materials?: string | null;
          care?: string | null;
          fit?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          is_new?: boolean;
          is_capsule?: boolean;
          is_sold_out?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          subtitle?: string | null;
          description?: string | null;
          price?: number;
          sale_price?: number | null;
          category_id?: string | null;
          primary_collection_id?: string | null;
          sub_category?: string | null;
          materials?: string | null;
          care?: string | null;
          fit?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          is_new?: boolean;
          is_capsule?: boolean;
          is_sold_out?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      collection_products: {
        Row: {
          collection_id: string;
          product_id: string;
          display_order: number;
        };
        Insert: {
          collection_id: string;
          product_id: string;
          display_order?: number;
        };
        Update: {
          collection_id?: string;
          product_id?: string;
          display_order?: number;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          is_primary: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          is_primary?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          alt_text?: string | null;
          is_primary?: boolean;
          display_order?: number;
          created_at?: string;
        };
      };
      promotions: {
        Row: {
          id: string;
          code: string;
          name: string;
          discount_type: "percentage" | "fixed_amount";
          discount_value: number;
          applies_to: "all" | "collection" | "product";
          target_id: string | null;
          start_date: string | null;
          end_date: string | null;
          is_active: boolean;
          banner_label: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          discount_type: "percentage" | "fixed_amount";
          discount_value: number;
          applies_to: "all" | "collection" | "product";
          target_id?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_active?: boolean;
          banner_label?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          discount_type?: "percentage" | "fixed_amount";
          discount_value?: number;
          applies_to?: "all" | "collection" | "product";
          target_id?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_active?: boolean;
          banner_label?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_code: string;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string;
          alt_phone: string | null;
          governorate: string;
          city: string;
          address: string;
          notes: string | null;
          subtotal: number;
          shipping_fee: number;
          total: number;
          payment_method: "COD";
          status: "nouveau" | "confirme" | "en_preparation" | "en_livraison" | "livre" | "annule";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_code?: string;
          customer_name: string;
          customer_email?: string | null;
          customer_phone: string;
          alt_phone?: string | null;
          governorate: string;
          city: string;
          address: string;
          notes?: string | null;
          subtotal: number;
          shipping_fee?: number;
          total: number;
          payment_method?: "COD";
          status?: "nouveau" | "confirme" | "en_preparation" | "en_livraison" | "livre" | "annule";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_code?: string;
          customer_name?: string;
          customer_email?: string | null;
          customer_phone?: string;
          alt_phone?: string | null;
          governorate?: string;
          city?: string;
          address?: string;
          notes?: string | null;
          subtotal?: number;
          shipping_fee?: number;
          total?: number;
          payment_method?: "COD";
          status?: "nouveau" | "confirme" | "en_preparation" | "en_livraison" | "livre" | "annule";
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          size: string;
          color: string;
          unit_price: number;
          quantity: number;
          total_price: number;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          size: string;
          color: string;
          unit_price: number;
          quantity: number;
          total_price: number;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          size?: string;
          color?: string;
          unit_price?: number;
          quantity?: number;
          total_price?: number;
          image_url?: string | null;
          created_at?: string;
        };
      };
      returns: {
        Row: {
          id: string;
          request_code: string;
          order_id: string;
          order_code: string;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          type: "echange" | "retour";
          reason: string;
          comments: string | null;
          status: "en_attente" | "approuve" | "recu_inspecte" | "complete" | "refuse";
          tags_intact_confirmed: boolean;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_code?: string;
          order_id: string;
          order_code: string;
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          type: "echange" | "retour";
          reason: string;
          comments?: string | null;
          status?: "en_attente" | "approuve" | "recu_inspecte" | "complete" | "refuse";
          tags_intact_confirmed?: boolean;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_code?: string;
          order_id?: string;
          order_code?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          type?: "echange" | "retour";
          reason?: string;
          comments?: string | null;
          status?: "en_attente" | "approuve" | "recu_inspecte" | "complete" | "refuse";
          tags_intact_confirmed?: boolean;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      return_items: {
        Row: {
          id: string;
          return_id: string;
          order_item_id: string | null;
          product_name: string;
          quantity: number;
          requested_exchange_size: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          return_id: string;
          order_item_id?: string | null;
          product_name: string;
          quantity: number;
          requested_exchange_size?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          return_id?: string;
          order_item_id?: string | null;
          product_name?: string;
          quantity?: number;
          requested_exchange_size?: string | null;
          created_at?: string;
        };
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          title: string | null;
          subtitle: string | null;
          display_order: number;
          is_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          title?: string | null;
          subtitle?: string | null;
          display_order?: number;
          is_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          title?: string | null;
          subtitle?: string | null;
          display_order?: number;
          is_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      homepage_content: {
        Row: {
          id: string;
          section_id: string;
          content_key: string;
          content_value: string | null;
          desktop_image_url: string | null;
          mobile_image_url: string | null;
          focal_point_x: number;
          focal_point_y: number;
          metadata: Json | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          content_key: string;
          content_value?: string | null;
          desktop_image_url?: string | null;
          mobile_image_url?: string | null;
          focal_point_x?: number;
          focal_point_y?: number;
          metadata?: Json | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          content_key?: string;
          content_value?: string | null;
          desktop_image_url?: string | null;
          mobile_image_url?: string | null;
          focal_point_x?: number;
          focal_point_y?: number;
          metadata?: Json | null;
          updated_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          filename: string;
          original_name: string;
          mime_type: string;
          size_bytes: number;
          width: number | null;
          height: number | null;
          public_url: string;
          bucket_name: string;
          alt_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          filename: string;
          original_name: string;
          mime_type: string;
          size_bytes: number;
          width?: number | null;
          height?: number | null;
          public_url: string;
          bucket_name?: string;
          alt_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          filename?: string;
          original_name?: string;
          mime_type?: string;
          size_bytes?: number;
          width?: number | null;
          height?: number | null;
          public_url?: string;
          bucket_name?: string;
          alt_text?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
