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
      attachments: {
        Row: {
          comment_id: string | null
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          id: string
          ticket_id: string
          uploaded_by: string
          url: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          id?: string
          ticket_id: string
          uploaded_by: string
          url: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          ticket_id?: string
          uploaded_by?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      barcode_scans: {
        Row: {
          barcode: string
          device_info: Json | null
          id: string
          item_id: string | null
          location: string | null
          notes: string | null
          quantity: number | null
          scan_type: string
          scanned_at: string
          scanned_by: string
        }
        Insert: {
          barcode: string
          device_info?: Json | null
          id?: string
          item_id?: string | null
          location?: string | null
          notes?: string | null
          quantity?: number | null
          scan_type: string
          scanned_at?: string
          scanned_by: string
        }
        Update: {
          barcode?: string
          device_info?: Json | null
          id?: string
          item_id?: string | null
          location?: string | null
          notes?: string | null
          quantity?: number | null
          scan_type?: string
          scanned_at?: string
          scanned_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "barcode_scans_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barcode_scans_scanned_by_fkey"
            columns: ["scanned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_items: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          item_type: string
          name: string
          sku: string | null
          tax_rate: number | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          item_type: string
          name: string
          sku?: string | null
          tax_rate?: number | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          item_type?: string
          name?: string
          sku?: string | null
          tax_rate?: number | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      billing_settings: {
        Row: {
          auto_numbering: boolean | null
          company_address: string
          company_email: string
          company_name: string
          company_phone: string
          company_website: string | null
          created_at: string | null
          default_currency: string | null
          default_notes: string | null
          default_payment_terms: number | null
          default_tax_rate: number | null
          default_terms: string | null
          id: string
          invoice_prefix: string | null
          invoice_start_number: number | null
          logo_url: string | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          auto_numbering?: boolean | null
          company_address: string
          company_email: string
          company_name: string
          company_phone: string
          company_website?: string | null
          created_at?: string | null
          default_currency?: string | null
          default_notes?: string | null
          default_payment_terms?: number | null
          default_tax_rate?: number | null
          default_terms?: string | null
          id?: string
          invoice_prefix?: string | null
          invoice_start_number?: number | null
          logo_url?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_numbering?: boolean | null
          company_address?: string
          company_email?: string
          company_name?: string
          company_phone?: string
          company_website?: string | null
          created_at?: string | null
          default_currency?: string | null
          default_notes?: string | null
          default_payment_terms?: number | null
          default_tax_rate?: number | null
          default_terms?: string | null
          id?: string
          invoice_prefix?: string | null
          invoice_start_number?: number | null
          logo_url?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      calendar_integrations: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          last_sync: string | null
          name: string
          settings: Json | null
          sync_direction: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_sync?: string | null
          name: string
          settings?: Json | null
          sync_direction?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_sync?: string | null
          name?: string
          settings?: Json | null
          sync_direction?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          attachments: string[] | null
          author_id: string
          content: string
          created_at: string
          id: string
          is_internal: boolean | null
          ticket_id: string
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          ticket_id: string
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          ticket_id?: string
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
          {
            foreignKeyName: "comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_billing_info: {
        Row: {
          billing_address: string
          created_at: string | null
          credit_limit: number | null
          customer_id: string
          id: string
          notes: string | null
          payment_terms: number | null
          preferred_payment_method: string | null
          shipping_address: string | null
          tax_exempt: boolean | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          billing_address: string
          created_at?: string | null
          credit_limit?: number | null
          customer_id: string
          id?: string
          notes?: string | null
          payment_terms?: number | null
          preferred_payment_method?: string | null
          shipping_address?: string | null
          tax_exempt?: boolean | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_address?: string
          created_at?: string | null
          credit_limit?: number | null
          customer_id?: string
          id?: string
          notes?: string | null
          payment_terms?: number | null
          preferred_payment_method?: string | null
          shipping_address?: string | null
          tax_exempt?: boolean | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_billing_info_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          company: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_attachments: {
        Row: {
          event_id: string
          id: string
          name: string
          size: number | null
          type: string | null
          uploaded_at: string | null
          url: string
        }
        Insert: {
          event_id: string
          id?: string
          name: string
          size?: number | null
          type?: string | null
          uploaded_at?: string | null
          url: string
        }
        Update: {
          event_id?: string
          id?: string
          name?: string
          size?: number | null
          type?: string | null
          uploaded_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attachments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "schedule_events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_reminders: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          reminder_time: string
          reminder_type: string
          sent: boolean | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          reminder_time: string
          reminder_type?: string
          sent?: boolean | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          reminder_time?: string
          reminder_type?: string
          sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "event_reminders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "schedule_events"
            referencedColumns: ["id"]
          },
        ]
      }
      generators: {
        Row: {
          created_at: string
          customer_id: string | null
          fuel_type: string | null
          id: string
          installation_date: string | null
          last_maintenance_date: string | null
          location: string | null
          manufacturer: string | null
          model: string
          next_maintenance_date: string | null
          notes: string | null
          power_output: number
          project_id: string | null
          serial_number: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          fuel_type?: string | null
          id?: string
          installation_date?: string | null
          last_maintenance_date?: string | null
          location?: string | null
          manufacturer?: string | null
          model: string
          next_maintenance_date?: string | null
          notes?: string | null
          power_output: number
          project_id?: string | null
          serial_number: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          fuel_type?: string | null
          id?: string
          installation_date?: string | null
          last_maintenance_date?: string | null
          location?: string | null
          manufacturer?: string | null
          model?: string
          next_maintenance_date?: string | null
          notes?: string | null
          power_output?: number
          project_id?: string | null
          serial_number?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generators_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_active: boolean | null
          is_read: boolean | null
          item_id: string
          message: string
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_read?: boolean | null
          item_id: string
          message: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_read?: boolean | null
          item_id?: string
          message?: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_alerts_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          barcode: string | null
          category_id: string | null
          condition: string | null
          created_at: string
          created_by: string | null
          description: string | null
          dimensions: string | null
          documents: string[] | null
          id: string
          image_url: string | null
          last_audit: string | null
          last_restocked: string | null
          location: string | null
          manufacturer: string | null
          max_quantity: number | null
          metadata: Json | null
          min_quantity: number
          model: string | null
          name: string
          part_number: string | null
          quantity: number
          shelf_location: string | null
          sku: string | null
          status: string
          supplier_id: string | null
          tags: string[] | null
          unit_cost: number | null
          unit_price: number | null
          updated_at: string
          updated_by: string | null
          warranty_period: number | null
          weight: number | null
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          condition?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          dimensions?: string | null
          documents?: string[] | null
          id?: string
          image_url?: string | null
          last_audit?: string | null
          last_restocked?: string | null
          location?: string | null
          manufacturer?: string | null
          max_quantity?: number | null
          metadata?: Json | null
          min_quantity?: number
          model?: string | null
          name: string
          part_number?: string | null
          quantity?: number
          shelf_location?: string | null
          sku?: string | null
          status?: string
          supplier_id?: string | null
          tags?: string[] | null
          unit_cost?: number | null
          unit_price?: number | null
          updated_at?: string
          updated_by?: string | null
          warranty_period?: number | null
          weight?: number | null
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          condition?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          dimensions?: string | null
          documents?: string[] | null
          id?: string
          image_url?: string | null
          last_audit?: string | null
          last_restocked?: string | null
          location?: string | null
          manufacturer?: string | null
          max_quantity?: number | null
          metadata?: Json | null
          min_quantity?: number
          model?: string | null
          name?: string
          part_number?: string | null
          quantity?: number
          shelf_location?: string | null
          sku?: string | null
          status?: string
          supplier_id?: string | null
          tags?: string[] | null
          unit_cost?: number | null
          unit_price?: number | null
          updated_at?: string
          updated_by?: string | null
          warranty_period?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "inventory_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_line_items: {
        Row: {
          created_at: string | null
          description: string
          discount_amount: number
          discount_rate: number | null
          id: string
          invoice_id: string
          item_id: string | null
          item_type: string
          notes: string | null
          quantity: number
          tax_amount: number
          tax_rate: number | null
          total_amount: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          discount_amount?: number
          discount_rate?: number | null
          id?: string
          invoice_id: string
          item_id?: string | null
          item_type: string
          notes?: string | null
          quantity?: number
          tax_amount?: number
          tax_rate?: number | null
          total_amount: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          discount_amount?: number
          discount_rate?: number | null
          id?: string
          invoice_id?: string
          item_id?: string | null
          item_type?: string
          notes?: string | null
          quantity?: number
          tax_amount?: number
          tax_rate?: number | null
          total_amount?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "billing_items"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          css_styles: string | null
          description: string | null
          footer_html: string | null
          header_html: string | null
          id: string
          is_active: boolean | null
          name: string
          template_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          css_styles?: string | null
          description?: string | null
          footer_html?: string | null
          header_html?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          template_type?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          css_styles?: string | null
          description?: string | null
          footer_html?: string | null
          header_html?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          template_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_paid: number
          balance_due: number
          created_at: string | null
          created_by: string | null
          currency: string | null
          customer_address: string
          customer_email: string
          customer_id: string
          customer_name: string
          discount_amount: number
          discount_rate: number | null
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          metadata: Json | null
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          payment_terms: number | null
          project_id: string | null
          project_name: string | null
          reference: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number | null
          terms: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number
          balance_due?: number
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          customer_address: string
          customer_email: string
          customer_id: string
          customer_name: string
          discount_amount?: number
          discount_rate?: number | null
          due_date: string
          id?: string
          invoice_number: string
          issue_date: string
          metadata?: Json | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_terms?: number | null
          project_id?: string | null
          project_name?: string | null
          reference?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number | null
          terms?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number
          balance_due?: number
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          customer_address?: string
          customer_email?: string
          customer_id?: string
          customer_name?: string
          discount_amount?: number
          discount_rate?: number | null
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          metadata?: Json | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_terms?: number | null
          project_id?: string | null
          project_name?: string | null
          reference?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number | null
          terms?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          assigned_to: string | null
          completed_date: string | null
          created_at: string
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          id: string
          metadata: Json | null
          order_index: number | null
          priority: string | null
          progress_percentage: number | null
          project_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          order_index?: number | null
          priority?: string | null
          progress_percentage?: number | null
          project_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          order_index?: number | null
          priority?: string | null
          progress_percentage?: number | null
          project_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          reference: string | null
          status: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date: string
          payment_method: string
          reference?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          reference?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_active: string | null
          phone: string | null
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          last_active?: string | null
          phone?: string | null
          role: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          last_active?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      project_attachments: {
        Row: {
          comment_id: string | null
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          note_id: string | null
          project_id: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          note_id?: string | null
          project_id: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          note_id?: string | null
          project_id?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_attachments_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "project_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_attachments_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "project_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_attachments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_audit_log: {
        Row: {
          action: string
          created_at: string
          field_name: string | null
          id: string
          metadata: Json | null
          new_value: string | null
          old_value: string | null
          project_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          field_name?: string | null
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          project_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          field_name?: string | null
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          project_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_audit_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          is_internal: boolean
          parent_id: string | null
          project_id: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_internal?: boolean
          parent_id?: string | null
          project_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          parent_id?: string | null
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "project_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_notes: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          is_internal: boolean
          project_id: string
          type: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_internal?: boolean
          project_id: string
          type?: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          project_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_status_rules: {
        Row: {
          allowed_roles: string[]
          created_at: string
          from_status: string
          id: string
          metadata: Json | null
          notification_template: string | null
          requires_approval: boolean | null
          to_status: string
        }
        Insert: {
          allowed_roles: string[]
          created_at?: string
          from_status: string
          id?: string
          metadata?: Json | null
          notification_template?: string | null
          requires_approval?: boolean | null
          to_status: string
        }
        Update: {
          allowed_roles?: string[]
          created_at?: string
          from_status?: string
          id?: string
          metadata?: Json | null
          notification_template?: string | null
          requires_approval?: boolean | null
          to_status?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          address: string | null
          assigned_to: string[] | null
          budget: number | null
          created_at: string | null
          customer_id: string | null
          description: string | null
          end_date: string | null
          generator_id: string | null
          generator_status: string | null
          has_generator: boolean | null
          id: string
          metadata: Json | null
          name: string
          owner_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          assigned_to?: string[] | null
          budget?: number | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          generator_id?: string | null
          generator_status?: string | null
          has_generator?: boolean | null
          id?: string
          metadata?: Json | null
          name: string
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          assigned_to?: string[] | null
          budget?: number | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          generator_id?: string | null
          generator_status?: string | null
          has_generator?: boolean | null
          id?: string
          metadata?: Json | null
          name?: string
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_generator_id_fkey"
            columns: ["generator_id"]
            isOneToOne: false
            referencedRelation: "generators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          item_description: string | null
          item_id: string | null
          item_name: string
          notes: string | null
          purchase_order_id: string
          quantity: number
          received_quantity: number | null
          total_cost: number
          unit_cost: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_description?: string | null
          item_id?: string | null
          item_name: string
          notes?: string | null
          purchase_order_id: string
          quantity: number
          received_quantity?: number | null
          total_cost: number
          unit_cost: number
        }
        Update: {
          created_at?: string
          id?: string
          item_description?: string | null
          item_id?: string | null
          item_name?: string
          notes?: string | null
          purchase_order_id?: string
          quantity?: number
          received_quantity?: number | null
          total_cost?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          created_by: string | null
          delivery_date: string | null
          expected_delivery: string | null
          id: string
          notes: string | null
          order_date: string
          po_number: string
          shipping_amount: number | null
          status: string
          subtotal: number | null
          supplier_id: string
          tax_amount: number | null
          terms: string | null
          total_amount: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          delivery_date?: string | null
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          order_date: string
          po_number: string
          shipping_amount?: number | null
          status?: string
          subtotal?: number | null
          supplier_id: string
          tax_amount?: number | null
          terms?: string | null
          total_amount?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          delivery_date?: string | null
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          po_number?: string
          shipping_amount?: number | null
          status?: string
          subtotal?: number | null
          supplier_id?: string
          tax_amount?: number | null
          terms?: string | null
          total_amount?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_conflicts: {
        Row: {
          conflict_type: string
          conflicting_events: string[]
          created_at: string | null
          event_id: string
          id: string
          message: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
        }
        Insert: {
          conflict_type: string
          conflicting_events: string[]
          created_at?: string | null
          event_id: string
          id?: string
          message: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
        }
        Update: {
          conflict_type?: string
          conflicting_events?: string[]
          created_at?: string | null
          event_id?: string
          id?: string
          message?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_conflicts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "schedule_events"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_events: {
        Row: {
          all_day: boolean | null
          color: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          description: string | null
          end_time: string
          event_type: string
          external_calendar_id: string | null
          id: string
          location: string | null
          notes: string | null
          priority: string
          project_id: string | null
          recurring_pattern: Json | null
          start_time: string
          status: string
          sync_status: string | null
          technician_ids: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          all_day?: boolean | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          end_time: string
          event_type?: string
          external_calendar_id?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          priority?: string
          project_id?: string | null
          recurring_pattern?: Json | null
          start_time: string
          status?: string
          sync_status?: string | null
          technician_ids?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          all_day?: boolean | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          end_time?: string
          event_type?: string
          external_calendar_id?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          priority?: string
          project_id?: string | null
          recurring_pattern?: Json | null
          start_time?: string
          status?: string
          sync_status?: string | null
          technician_ids?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string
          created_by: string
          id: string
          item_id: string
          location_from: string | null
          location_to: string | null
          movement_type: string
          new_quantity: number
          notes: string | null
          previous_quantity: number
          quantity: number
          reference_id: string | null
          reference_type: string | null
          total_value: number | null
          unit_cost: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          item_id: string
          location_from?: string | null
          location_to?: string | null
          movement_type: string
          new_quantity: number
          notes?: string | null
          previous_quantity: number
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          total_value?: number | null
          unit_cost?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          item_id?: string
          location_from?: string | null
          location_to?: string | null
          movement_type?: string
          new_quantity?: number
          notes?: string | null
          previous_quantity?: number
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          total_value?: number | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          rating: number | null
          terms: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          rating?: number | null
          terms?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          rating?: number | null
          terms?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          client_id: string | null
          created_at: string | null
          description: string | null
          id: string
          priority: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          custom_fields: Json | null
          customer_id: string
          description: string
          due_date: string | null
          estimated_time: string | null
          id: string
          metadata: Json | null
          priority: string
          resolution: string | null
          status: string
          tags: string[] | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string
          custom_fields?: Json | null
          customer_id: string
          description: string
          due_date?: string | null
          estimated_time?: string | null
          id?: string
          metadata?: Json | null
          priority: string
          resolution?: string | null
          status: string
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          custom_fields?: Json | null
          customer_id?: string
          description?: string
          due_date?: string | null
          estimated_time?: string | null
          id?: string
          metadata?: Json | null
          priority?: string
          resolution?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_project_progress: {
        Args: { project_uuid: string }
        Returns: {
          total_milestones: number
          completed_milestones: number
          in_progress_milestones: number
          delayed_milestones: number
          overall_progress: number
        }[]
      }
      generate_sku: {
        Args: { category_name: string; item_name: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
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
