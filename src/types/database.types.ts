export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string;
          environment: string;
          expires_at: string | null;
          id: string;
          key_hash: string;
          key_prefix: string;
          last_used_at: string | null;
          name: string;
          rate_limit: number;
          revoked_at: string | null;
          scopes: string[];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          environment?: string;
          expires_at?: string | null;
          id?: string;
          key_hash: string;
          key_prefix: string;
          last_used_at?: string | null;
          name: string;
          rate_limit?: number;
          revoked_at?: string | null;
          scopes?: string[];
          user_id: string;
        };
        Update: {
          created_at?: string;
          environment?: string;
          expires_at?: string | null;
          id?: string;
          key_hash?: string;
          key_prefix?: string;
          last_used_at?: string | null;
          name?: string;
          rate_limit?: number;
          revoked_at?: string | null;
          scopes?: string[];
          user_id?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          actor_role: Database["public"]["Enums"]["app_role"] | null;
          after_data: Json | null;
          before_data: Json | null;
          created_at: string;
          entity_id: string | null;
          entity_type: string | null;
          id: string;
          ip_address: string | null;
          user_agent: string | null;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          actor_role?: Database["public"]["Enums"]["app_role"] | null;
          after_data?: Json | null;
          before_data?: Json | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          actor_role?: Database["public"]["Enums"]["app_role"] | null;
          after_data?: Json | null;
          before_data?: Json | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Relationships: [];
      };
      beneficiaries: {
        Row: {
          alias: string;
          bill_code: string | null;
          created_at: string;
          id: string;
          identifier: string;
          metadata: Json | null;
          network: string | null;
          type: Database["public"]["Enums"]["tx_type"];
          user_id: string;
        };
        Insert: {
          alias: string;
          bill_code?: string | null;
          created_at?: string;
          id?: string;
          identifier: string;
          metadata?: Json | null;
          network?: string | null;
          type: Database["public"]["Enums"]["tx_type"];
          user_id: string;
        };
        Update: {
          alias?: string;
          bill_code?: string | null;
          created_at?: string;
          id?: string;
          identifier?: string;
          metadata?: Json | null;
          network?: string | null;
          type?: Database["public"]["Enums"]["tx_type"];
          user_id?: string;
        };
        Relationships: [];
      };
      bills: {
        Row: {
          category: string;
          code: string;
          created_at: string;
          id: string;
          is_active: boolean;
          logo_url: string | null;
          max_amount: number | null;
          metadata: Json | null;
          min_amount: number | null;
          name: string;
          provider: string | null;
          updated_at: string;
        };
        Insert: {
          category: string;
          code: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          logo_url?: string | null;
          max_amount?: number | null;
          metadata?: Json | null;
          min_amount?: number | null;
          name: string;
          provider?: string | null;
          updated_at?: string;
        };
        Update: {
          category?: string;
          code?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          logo_url?: string | null;
          max_amount?: number | null;
          metadata?: Json | null;
          min_amount?: number | null;
          name?: string;
          provider?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      cashback: {
        Row: {
          amount: number;
          created_at: string;
          credited: boolean;
          id: string;
          reason: string | null;
          transaction_id: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          credited?: boolean;
          id?: string;
          reason?: string | null;
          transaction_id?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          credited?: boolean;
          id?: string;
          reason?: string | null;
          transaction_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cashback_transaction_id_fkey";
            columns: ["transaction_id"];
            isOneToOne: false;
            referencedRelation: "transactions";
            referencedColumns: ["id"];
          },
        ];
      };
      commission_structures: {
        Row: {
          cap_amount: number | null;
          created_at: string;
          effective_from: string | null;
          effective_to: string | null;
          flat_amount: number;
          id: string;
          is_active: boolean;
          network: string | null;
          rate_percent: number;
          role: Database["public"]["Enums"]["app_role"];
          service: Database["public"]["Enums"]["tx_type"];
          tier: Database["public"]["Enums"]["agent_tier"] | null;
          updated_at: string;
        };
        Insert: {
          cap_amount?: number | null;
          created_at?: string;
          effective_from?: string | null;
          effective_to?: string | null;
          flat_amount?: number;
          id?: string;
          is_active?: boolean;
          network?: string | null;
          rate_percent?: number;
          role?: Database["public"]["Enums"]["app_role"];
          service: Database["public"]["Enums"]["tx_type"];
          tier?: Database["public"]["Enums"]["agent_tier"] | null;
          updated_at?: string;
        };
        Update: {
          cap_amount?: number | null;
          created_at?: string;
          effective_from?: string | null;
          effective_to?: string | null;
          flat_amount?: number;
          id?: string;
          is_active?: boolean;
          network?: string | null;
          rate_percent?: number;
          role?: Database["public"]["Enums"]["app_role"];
          service?: Database["public"]["Enums"]["tx_type"];
          tier?: Database["public"]["Enums"]["agent_tier"] | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      fraud_logs: {
        Row: {
          action: Database["public"]["Enums"]["fraud_action"];
          created_at: string;
          description: string | null;
          device_id: string | null;
          id: string;
          ip_address: string | null;
          metadata: Json | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          risk_score: number;
          rule_code: string;
          transaction_id: string | null;
          user_id: string | null;
        };
        Insert: {
          action?: Database["public"]["Enums"]["fraud_action"];
          created_at?: string;
          description?: string | null;
          device_id?: string | null;
          id?: string;
          ip_address?: string | null;
          metadata?: Json | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          risk_score?: number;
          rule_code: string;
          transaction_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: Database["public"]["Enums"]["fraud_action"];
          created_at?: string;
          description?: string | null;
          device_id?: string | null;
          id?: string;
          ip_address?: string | null;
          metadata?: Json | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          risk_score?: number;
          rule_code?: string;
          transaction_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fraud_logs_transaction_id_fkey";
            columns: ["transaction_id"];
            isOneToOne: false;
            referencedRelation: "transactions";
            referencedColumns: ["id"];
          },
        ];
      };
      kyc: {
        Row: {
          bvn: string | null;
          created_at: string;
          document_number: string | null;
          document_type: string | null;
          document_url: string | null;
          id: string;
          match_score: number | null;
          nin: string | null;
          rejection_reason: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          selfie_url: string | null;
          status: Database["public"]["Enums"]["kyc_status"];
          tier: Database["public"]["Enums"]["kyc_tier"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          bvn?: string | null;
          created_at?: string;
          document_number?: string | null;
          document_type?: string | null;
          document_url?: string | null;
          id?: string;
          match_score?: number | null;
          nin?: string | null;
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          selfie_url?: string | null;
          status?: Database["public"]["Enums"]["kyc_status"];
          tier?: Database["public"]["Enums"]["kyc_tier"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          bvn?: string | null;
          created_at?: string;
          document_number?: string | null;
          document_type?: string | null;
          document_url?: string | null;
          id?: string;
          match_score?: number | null;
          nin?: string | null;
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          selfie_url?: string | null;
          status?: Database["public"]["Enums"]["kyc_status"];
          tier?: Database["public"]["Enums"]["kyc_tier"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          body: string | null;
          category: string | null;
          channel: string | null;
          created_at: string;
          id: string;
          metadata: Json | null;
          read_at: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          category?: string | null;
          channel?: string | null;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          read_at?: string | null;
          title: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          category?: string | null;
          channel?: string | null;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          read_at?: string | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      permissions: {
        Row: {
          code: string;
          created_at: string;
          description: string | null;
          id: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          description?: string | null;
          id?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      pricing_change_requests: {
        Row: {
          batch_id: string | null;
          created_at: string;
          current_snapshot: Json;
          id: string;
          proposed_changes: Json;
          reason: string | null;
          requested_by: string;
          review_note: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          service_id: string;
          status: Database["public"]["Enums"]["price_request_status"];
        };
        Insert: {
          batch_id?: string | null;
          created_at?: string;
          current_snapshot: Json;
          id?: string;
          proposed_changes: Json;
          reason?: string | null;
          requested_by: string;
          review_note?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          service_id: string;
          status?: Database["public"]["Enums"]["price_request_status"];
        };
        Update: {
          batch_id?: string | null;
          created_at?: string;
          current_snapshot?: Json;
          id?: string;
          proposed_changes?: Json;
          reason?: string | null;
          requested_by?: string;
          review_note?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          service_id?: string;
          status?: Database["public"]["Enums"]["price_request_status"];
        };
        Relationships: [
          {
            foreignKeyName: "pricing_change_requests_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "service_products";
            referencedColumns: ["id"];
          },
        ];
      };
      pricing_history: {
        Row: {
          change_reason: string | null;
          changed_by: string | null;
          created_at: string;
          field: string;
          id: string;
          ip_address: string | null;
          new_value: Json | null;
          old_value: Json | null;
          service_id: string | null;
        };
        Insert: {
          change_reason?: string | null;
          changed_by?: string | null;
          created_at?: string;
          field: string;
          id?: string;
          ip_address?: string | null;
          new_value?: Json | null;
          old_value?: Json | null;
          service_id?: string | null;
        };
        Update: {
          change_reason?: string | null;
          changed_by?: string | null;
          created_at?: string;
          field?: string;
          id?: string;
          ip_address?: string | null;
          new_value?: Json | null;
          old_value?: Json | null;
          service_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "pricing_history_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "service_products";
            referencedColumns: ["id"];
          },
        ];
      };
      pricing_rules: {
        Row: {
          active: boolean;
          agent_price: number;
          created_at: string;
          customer_price: number;
          discount_expires_at: string | null;
          discount_percent: number;
          id: string;
          markup_value: number;
          min_margin_threshold: number;
          pricing_type: Database["public"]["Enums"]["pricing_type"];
          profit_margin: number;
          service_id: string;
          super_agent_price: number;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          active?: boolean;
          agent_price?: number;
          created_at?: string;
          customer_price?: number;
          discount_expires_at?: string | null;
          discount_percent?: number;
          id?: string;
          markup_value?: number;
          min_margin_threshold?: number;
          pricing_type?: Database["public"]["Enums"]["pricing_type"];
          profit_margin?: number;
          service_id: string;
          super_agent_price?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          active?: boolean;
          agent_price?: number;
          created_at?: string;
          customer_price?: number;
          discount_expires_at?: string | null;
          discount_percent?: number;
          id?: string;
          markup_value?: number;
          min_margin_threshold?: number;
          pricing_type?: Database["public"]["Enums"]["pricing_type"];
          profit_margin?: number;
          service_id?: string;
          super_agent_price?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "pricing_rules_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: true;
            referencedRelation: "service_products";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          address: string | null;
          agent_tier: Database["public"]["Enums"]["agent_tier"] | null;
          avatar_url: string | null;
          biometric_enabled: boolean | null;
          country: string | null;
          created_at: string;
          date_of_birth: string | null;
          email: string | null;
          full_name: string | null;
          gender: string | null;
          id: string;
          last_seen_at: string | null;
          phone: string | null;
          pin_hash: string | null;
          referral_code: string | null;
          referred_by: string | null;
          state: string | null;
          status: Database["public"]["Enums"]["account_status"];
          two_fa_enabled: boolean | null;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          address?: string | null;
          agent_tier?: Database["public"]["Enums"]["agent_tier"] | null;
          avatar_url?: string | null;
          biometric_enabled?: boolean | null;
          country?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          full_name?: string | null;
          gender?: string | null;
          id: string;
          last_seen_at?: string | null;
          phone?: string | null;
          pin_hash?: string | null;
          referral_code?: string | null;
          referred_by?: string | null;
          state?: string | null;
          status?: Database["public"]["Enums"]["account_status"];
          two_fa_enabled?: boolean | null;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          address?: string | null;
          agent_tier?: Database["public"]["Enums"]["agent_tier"] | null;
          avatar_url?: string | null;
          biometric_enabled?: boolean | null;
          country?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          full_name?: string | null;
          gender?: string | null;
          id?: string;
          last_seen_at?: string | null;
          phone?: string | null;
          pin_hash?: string | null;
          referral_code?: string | null;
          referred_by?: string | null;
          state?: string | null;
          status?: Database["public"]["Enums"]["account_status"];
          two_fa_enabled?: boolean | null;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey";
            columns: ["referred_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      referrals: {
        Row: {
          code: string;
          created_at: string;
          id: string;
          referee_id: string;
          referrer_id: string;
          reward_amount: number;
          reward_paid: boolean;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: string;
          referee_id: string;
          referrer_id: string;
          reward_amount?: number;
          reward_paid?: boolean;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: string;
          referee_id?: string;
          referrer_id?: string;
          reward_amount?: number;
          reward_paid?: boolean;
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          id: string;
          permission_id: string;
          role: Database["public"]["Enums"]["app_role"];
        };
        Insert: {
          id?: string;
          permission_id: string;
          role: Database["public"]["Enums"]["app_role"];
        };
        Update: {
          id?: string;
          permission_id?: string;
          role?: Database["public"]["Enums"]["app_role"];
        };
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey";
            columns: ["permission_id"];
            isOneToOne: false;
            referencedRelation: "permissions";
            referencedColumns: ["id"];
          },
        ];
      };
      service_products: {
        Row: {
          category: string;
          created_at: string;
          face_value: number | null;
          id: string;
          last_synced_at: string | null;
          metadata: Json;
          network: string | null;
          provider: string;
          provider_price: number;
          service_code: string;
          service_name: string;
          status: boolean;
          updated_at: string;
          variation_code: string | null;
        };
        Insert: {
          category: string;
          created_at?: string;
          face_value?: number | null;
          id?: string;
          last_synced_at?: string | null;
          metadata?: Json;
          network?: string | null;
          provider?: string;
          provider_price?: number;
          service_code: string;
          service_name: string;
          status?: boolean;
          updated_at?: string;
          variation_code?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          face_value?: number | null;
          id?: string;
          last_synced_at?: string | null;
          metadata?: Json;
          network?: string | null;
          provider?: string;
          provider_price?: number;
          service_code?: string;
          service_name?: string;
          status?: boolean;
          updated_at?: string;
          variation_code?: string | null;
        };
        Relationships: [];
      };
      support_tickets: {
        Row: {
          assigned_to: string | null;
          category: string | null;
          created_at: string;
          id: string;
          priority: Database["public"]["Enums"]["ticket_priority"];
          resolved_at: string | null;
          status: Database["public"]["Enums"]["ticket_status"];
          subject: string;
          ticket_number: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          assigned_to?: string | null;
          category?: string | null;
          created_at?: string;
          id?: string;
          priority?: Database["public"]["Enums"]["ticket_priority"];
          resolved_at?: string | null;
          status?: Database["public"]["Enums"]["ticket_status"];
          subject: string;
          ticket_number?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          assigned_to?: string | null;
          category?: string | null;
          created_at?: string;
          id?: string;
          priority?: Database["public"]["Enums"]["ticket_priority"];
          resolved_at?: string | null;
          status?: Database["public"]["Enums"]["ticket_status"];
          subject?: string;
          ticket_number?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      ticket_messages: {
        Row: {
          attachments: Json | null;
          created_at: string;
          id: string;
          is_internal: boolean | null;
          message: string;
          sender_id: string;
          ticket_id: string;
        };
        Insert: {
          attachments?: Json | null;
          created_at?: string;
          id?: string;
          is_internal?: boolean | null;
          message: string;
          sender_id: string;
          ticket_id: string;
        };
        Update: {
          attachments?: Json | null;
          created_at?: string;
          id?: string;
          is_internal?: boolean | null;
          message?: string;
          sender_id?: string;
          ticket_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: false;
            referencedRelation: "support_tickets";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          amount: number;
          bill_code: string | null;
          cashback: number;
          commission: number;
          created_at: string;
          currency: string;
          description: string | null;
          device_id: string | null;
          fee: number;
          id: string;
          ip_address: string | null;
          metadata: Json;
          network: string | null;
          parent_transaction_id: string | null;
          provider: string | null;
          provider_reference: string | null;
          recipient: string | null;
          reference: string;
          status: Database["public"]["Enums"]["tx_status"];
          type: Database["public"]["Enums"]["tx_type"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          bill_code?: string | null;
          cashback?: number;
          commission?: number;
          created_at?: string;
          currency?: string;
          description?: string | null;
          device_id?: string | null;
          fee?: number;
          id?: string;
          ip_address?: string | null;
          metadata?: Json;
          network?: string | null;
          parent_transaction_id?: string | null;
          provider?: string | null;
          provider_reference?: string | null;
          recipient?: string | null;
          reference: string;
          status?: Database["public"]["Enums"]["tx_status"];
          type: Database["public"]["Enums"]["tx_type"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          bill_code?: string | null;
          cashback?: number;
          commission?: number;
          created_at?: string;
          currency?: string;
          description?: string | null;
          device_id?: string | null;
          fee?: number;
          id?: string;
          ip_address?: string | null;
          metadata?: Json;
          network?: string | null;
          parent_transaction_id?: string | null;
          provider?: string | null;
          provider_reference?: string | null;
          recipient?: string | null;
          reference?: string;
          status?: Database["public"]["Enums"]["tx_status"];
          type?: Database["public"]["Enums"]["tx_type"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_parent_transaction_id_fkey";
            columns: ["parent_transaction_id"];
            isOneToOne: false;
            referencedRelation: "transactions";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          granted_by: string | null;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          granted_by?: string | null;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          granted_by?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      wallet_ledger: {
        Row: {
          amount: number;
          balance_after: number;
          balance_before: number;
          created_at: string;
          entry: Database["public"]["Enums"]["ledger_entry"];
          id: string;
          narration: string | null;
          transaction_id: string | null;
          user_id: string;
          wallet_id: string;
        };
        Insert: {
          amount: number;
          balance_after: number;
          balance_before: number;
          created_at?: string;
          entry: Database["public"]["Enums"]["ledger_entry"];
          id?: string;
          narration?: string | null;
          transaction_id?: string | null;
          user_id: string;
          wallet_id: string;
        };
        Update: {
          amount?: number;
          balance_after?: number;
          balance_before?: number;
          created_at?: string;
          entry?: Database["public"]["Enums"]["ledger_entry"];
          id?: string;
          narration?: string | null;
          transaction_id?: string | null;
          user_id?: string;
          wallet_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wallet_ledger_transaction_id_fkey";
            columns: ["transaction_id"];
            isOneToOne: false;
            referencedRelation: "transactions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wallet_ledger_wallet_id_fkey";
            columns: ["wallet_id"];
            isOneToOne: false;
            referencedRelation: "wallets";
            referencedColumns: ["id"];
          },
        ];
      };
      wallets: {
        Row: {
          balance: number;
          commission_balance: number;
          created_at: string;
          currency: string;
          daily_limit: number | null;
          id: string;
          ledger_balance: number;
          monthly_limit: number | null;
          status: Database["public"]["Enums"]["account_status"];
          updated_at: string;
          user_id: string;
          virtual_account_bank: string | null;
          virtual_account_name: string | null;
          virtual_account_number: string | null;
        };
        Insert: {
          balance?: number;
          commission_balance?: number;
          created_at?: string;
          currency?: string;
          daily_limit?: number | null;
          id?: string;
          ledger_balance?: number;
          monthly_limit?: number | null;
          status?: Database["public"]["Enums"]["account_status"];
          updated_at?: string;
          user_id: string;
          virtual_account_bank?: string | null;
          virtual_account_name?: string | null;
          virtual_account_number?: string | null;
        };
        Update: {
          balance?: number;
          commission_balance?: number;
          created_at?: string;
          currency?: string;
          daily_limit?: number | null;
          id?: string;
          ledger_balance?: number;
          monthly_limit?: number | null;
          status?: Database["public"]["Enums"]["account_status"];
          updated_at?: string;
          user_id?: string;
          virtual_account_bank?: string | null;
          virtual_account_name?: string | null;
          virtual_account_number?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      admin_set_user_role: {
        Args: {
          _actor: string;
          _grant: boolean;
          _role: Database["public"]["Enums"]["app_role"];
          _target: string;
        };
        Returns: undefined;
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      notify_user: {
        Args: {
          _body: string;
          _category?: string;
          _metadata?: Json;
          _title: string;
          _user_id: string;
        };
        Returns: string;
      };
    };
    Enums: {
      account_status: "active" | "suspended" | "frozen" | "pending" | "closed";
      agent_tier: "starter" | "bronze" | "silver" | "gold" | "platinum";
      app_role: "admin" | "agent" | "customer" | "super_admin" | "support";
      fraud_action: "flagged" | "reviewed" | "blocked" | "cleared" | "frozen";
      kyc_status: "pending" | "approved" | "rejected" | "expired";
      kyc_tier: "tier_0" | "tier_1" | "tier_2" | "tier_3";
      ledger_entry: "debit" | "credit";
      price_request_status: "pending" | "approved" | "rejected" | "cancelled";
      pricing_type: "fixed" | "percent" | "tier";
      ticket_priority: "low" | "medium" | "high" | "urgent";
      ticket_status: "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";
      tx_status: "pending" | "processing" | "successful" | "failed" | "reversed" | "refunded";
      tx_type: "airtime" | "data" | "cable" | "electricity" | "education" | "betting" | "wallet_fund" | "withdrawal" | "transfer" | "commission" | "cashback" | "refund" | "adjustment" | "bulk";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      account_status: ["active", "suspended", "frozen", "pending", "closed"],
      agent_tier: ["starter", "bronze", "silver", "gold", "platinum"],
      app_role: ["admin", "agent", "customer", "super_admin", "support"],
      fraud_action: ["flagged", "reviewed", "blocked", "cleared", "frozen"],
      kyc_status: ["pending", "approved", "rejected", "expired"],
      kyc_tier: ["tier_0", "tier_1", "tier_2", "tier_3"],
      ledger_entry: ["debit", "credit"],
      price_request_status: ["pending", "approved", "rejected", "cancelled"],
      pricing_type: ["fixed", "percent", "tier"],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: ["open", "in_progress", "waiting_customer", "resolved", "closed"],
      tx_status: ["pending", "processing", "successful", "failed", "reversed", "refunded"],
      tx_type: ["airtime", "data", "cable", "electricity", "education", "betting", "wallet_fund", "withdrawal", "transfer", "commission", "cashback", "refund", "adjustment", "bulk"],
    },
  },
} as const;
