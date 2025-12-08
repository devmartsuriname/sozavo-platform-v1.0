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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      case_events: {
        Row: {
          actor_id: string | null
          case_id: string
          created_at: string
          event_type: string
          id: string
          meta: Json | null
          new_status: Database["public"]["Enums"]["case_status"] | null
          old_status: Database["public"]["Enums"]["case_status"] | null
        }
        Insert: {
          actor_id?: string | null
          case_id: string
          created_at?: string
          event_type: string
          id?: string
          meta?: Json | null
          new_status?: Database["public"]["Enums"]["case_status"] | null
          old_status?: Database["public"]["Enums"]["case_status"] | null
        }
        Update: {
          actor_id?: string | null
          case_id?: string
          created_at?: string
          event_type?: string
          id?: string
          meta?: Json | null
          new_status?: Database["public"]["Enums"]["case_status"] | null
          old_status?: Database["public"]["Enums"]["case_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "case_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          case_handler_id: string | null
          case_reference: string
          citizen_id: string
          closed_at: string | null
          created_at: string
          current_status: Database["public"]["Enums"]["case_status"]
          id: string
          intake_office_id: string | null
          intake_officer_id: string | null
          notes: string | null
          priority: string | null
          reviewer_id: string | null
          service_type_id: string
          updated_at: string
          wizard_data: Json | null
        }
        Insert: {
          case_handler_id?: string | null
          case_reference: string
          citizen_id: string
          closed_at?: string | null
          created_at?: string
          current_status?: Database["public"]["Enums"]["case_status"]
          id?: string
          intake_office_id?: string | null
          intake_officer_id?: string | null
          notes?: string | null
          priority?: string | null
          reviewer_id?: string | null
          service_type_id: string
          updated_at?: string
          wizard_data?: Json | null
        }
        Update: {
          case_handler_id?: string | null
          case_reference?: string
          citizen_id?: string
          closed_at?: string | null
          created_at?: string
          current_status?: Database["public"]["Enums"]["case_status"]
          id?: string
          intake_office_id?: string | null
          intake_officer_id?: string | null
          notes?: string | null
          priority?: string | null
          reviewer_id?: string | null
          service_type_id?: string
          updated_at?: string
          wizard_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_case_handler_id_fkey"
            columns: ["case_handler_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "citizens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_intake_office_id_fkey"
            columns: ["intake_office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_intake_officer_id_fkey"
            columns: ["intake_officer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
        ]
      }
      citizens: {
        Row: {
          address: string | null
          bis_person_id: string | null
          bis_verified: boolean
          bis_verified_at: string | null
          country_of_residence: string | null
          created_at: string
          date_of_birth: string | null
          district: string | null
          email: string | null
          first_name: string
          gender: string | null
          household_members: Json | null
          id: string
          last_name: string
          national_id: string
          phone: string | null
          portal_user_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          bis_person_id?: string | null
          bis_verified?: boolean
          bis_verified_at?: string | null
          country_of_residence?: string | null
          created_at?: string
          date_of_birth?: string | null
          district?: string | null
          email?: string | null
          first_name: string
          gender?: string | null
          household_members?: Json | null
          id?: string
          last_name: string
          national_id: string
          phone?: string | null
          portal_user_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          bis_person_id?: string | null
          bis_verified?: boolean
          bis_verified_at?: string | null
          country_of_residence?: string | null
          created_at?: string
          date_of_birth?: string | null
          district?: string | null
          email?: string | null
          first_name?: string
          gender?: string | null
          household_members?: Json | null
          id?: string
          last_name?: string
          national_id?: string
          phone?: string | null
          portal_user_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      document_requirements: {
        Row: {
          created_at: string
          description: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          id: string
          is_mandatory: boolean
          service_type_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          id?: string
          is_mandatory?: boolean
          service_type_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          id?: string
          is_mandatory?: boolean
          service_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_requirements_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          case_id: string | null
          citizen_id: string
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"]
          expires_at: string | null
          file_name: string
          file_path: string
          file_size: number
          id: string
          mime_type: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["document_status"]
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          case_id?: string | null
          citizen_id: string
          created_at?: string
          document_type: Database["public"]["Enums"]["document_type"]
          expires_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          id?: string
          mime_type: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          case_id?: string | null
          citizen_id?: string
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          expires_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "citizens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      eligibility_evaluations: {
        Row: {
          case_id: string
          criteria_results: Json
          evaluated_at: string
          evaluated_by: string | null
          id: string
          override_by: string | null
          override_reason: string | null
          result: string
        }
        Insert: {
          case_id: string
          criteria_results: Json
          evaluated_at?: string
          evaluated_by?: string | null
          id?: string
          override_by?: string | null
          override_reason?: string | null
          result: string
        }
        Update: {
          case_id?: string
          criteria_results?: Json
          evaluated_at?: string
          evaluated_by?: string | null
          id?: string
          override_by?: string | null
          override_reason?: string | null
          result?: string
        }
        Relationships: [
          {
            foreignKeyName: "eligibility_evaluations_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eligibility_evaluations_evaluated_by_fkey"
            columns: ["evaluated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eligibility_evaluations_override_by_fkey"
            columns: ["override_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      eligibility_rules: {
        Row: {
          condition: Json
          created_at: string
          error_message: string
          id: string
          is_active: boolean
          is_mandatory: boolean
          priority: number
          rule_name: string
          rule_type: string
          service_type_id: string
        }
        Insert: {
          condition: Json
          created_at?: string
          error_message: string
          id?: string
          is_active?: boolean
          is_mandatory?: boolean
          priority?: number
          rule_name: string
          rule_type: string
          service_type_id: string
        }
        Update: {
          condition?: Json
          created_at?: string
          error_message?: string
          id?: string
          is_active?: boolean
          is_mandatory?: boolean
          priority?: number
          rule_name?: string
          rule_type?: string
          service_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "eligibility_rules_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_risk_scores: {
        Row: {
          case_id: string
          created_at: string
          id: string
          last_evaluated_at: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          risk_score: number
          signal_count: number
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          id?: string
          last_evaluated_at?: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          risk_score: number
          signal_count?: number
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          id?: string
          last_evaluated_at?: string
          risk_level?: Database["public"]["Enums"]["risk_level"]
          risk_score?: number
          signal_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_risk_scores_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: true
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_signals: {
        Row: {
          case_id: string
          created_at: string
          description: string
          evidence: Json | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          severity: Database["public"]["Enums"]["fraud_severity"]
          signal_type: string
          status: string
        }
        Insert: {
          case_id: string
          created_at?: string
          description: string
          evidence?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity: Database["public"]["Enums"]["fraud_severity"]
          signal_type: string
          status?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          description?: string
          evidence?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: Database["public"]["Enums"]["fraud_severity"]
          signal_type?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_signals_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_signals_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          address: string
          bis_household_id: string | null
          citizen_id: string
          created_at: string
          district: string
          id: string
          member_count: number
          members: Json | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          address: string
          bis_household_id?: string | null
          citizen_id: string
          created_at?: string
          district: string
          id?: string
          member_count?: number
          members?: Json | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          address?: string
          bis_household_id?: string | null
          citizen_id?: string
          created_at?: string
          district?: string
          id?: string
          member_count?: number
          members?: Json | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "households_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "citizens"
            referencedColumns: ["id"]
          },
        ]
      }
      incomes: {
        Row: {
          amount: number
          case_id: string
          citizen_id: string
          created_at: string
          employer_name: string | null
          end_date: string | null
          id: string
          income_type: string
          is_verified: boolean
          start_date: string | null
          subema_verified: boolean | null
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          amount: number
          case_id: string
          citizen_id: string
          created_at?: string
          employer_name?: string | null
          end_date?: string | null
          id?: string
          income_type: string
          is_verified?: boolean
          start_date?: string | null
          subema_verified?: boolean | null
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          amount?: number
          case_id?: string
          citizen_id?: string
          created_at?: string
          employer_name?: string | null
          end_date?: string | null
          id?: string
          income_type?: string
          is_verified?: boolean
          start_date?: string | null
          subema_verified?: boolean | null
          updated_at?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incomes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incomes_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "citizens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incomes_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
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
          related_case_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_case_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_case_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_case_id_fkey"
            columns: ["related_case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      offices: {
        Row: {
          address: string | null
          created_at: string
          district_id: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          district_id: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          district_id?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      payment_batches: {
        Row: {
          batch_reference: string
          created_at: string
          created_by: string | null
          id: string
          payment_count: number
          processed_at: string | null
          status: Database["public"]["Enums"]["batch_status"]
          submitted_at: string | null
          total_amount: number
        }
        Insert: {
          batch_reference: string
          created_at?: string
          created_by?: string | null
          id?: string
          payment_count?: number
          processed_at?: string | null
          status?: Database["public"]["Enums"]["batch_status"]
          submitted_at?: string | null
          total_amount?: number
        }
        Update: {
          batch_reference?: string
          created_at?: string
          created_by?: string | null
          id?: string
          payment_count?: number
          processed_at?: string | null
          status?: Database["public"]["Enums"]["batch_status"]
          submitted_at?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "payment_batches_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_items: {
        Row: {
          amount: number
          bank_account: string | null
          batch_id: string
          citizen_id: string
          created_at: string
          disbursement_method: string
          error_message: string | null
          id: string
          payment_id: string
          processed_at: string | null
          status: Database["public"]["Enums"]["payment_item_status"]
          subema_item_reference: string | null
        }
        Insert: {
          amount: number
          bank_account?: string | null
          batch_id: string
          citizen_id: string
          created_at?: string
          disbursement_method?: string
          error_message?: string | null
          id?: string
          payment_id: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_item_status"]
          subema_item_reference?: string | null
        }
        Update: {
          amount?: number
          bank_account?: string | null
          batch_id?: string
          citizen_id?: string
          created_at?: string
          disbursement_method?: string
          error_message?: string | null
          id?: string
          payment_id?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_item_status"]
          subema_item_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "payment_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_items_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "citizens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_items_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          bank_account: string | null
          case_id: string
          citizen_id: string
          created_at: string
          id: string
          notes: string | null
          payment_date: string
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"]
          subema_reference: string | null
          subema_synced_at: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          bank_account?: string | null
          case_id: string
          citizen_id: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_date: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subema_reference?: string | null
          subema_synced_at?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          bank_account?: string | null
          case_id?: string
          citizen_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subema_reference?: string | null
          subema_synced_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "citizens"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_notifications: {
        Row: {
          citizen_id: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_case_id: string | null
          title: string
          type: string
        }
        Insert: {
          citizen_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_case_id?: string | null
          title: string
          type?: string
        }
        Update: {
          citizen_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_case_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_notifications_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "citizens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_notifications_related_case_id_fkey"
            columns: ["related_case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      service_types: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      subema_sync_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          payment_id: string
          request_payload: Json
          response_payload: Json | null
          retries: number
          status: string
          subema_reference: string | null
          sync_type: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          payment_id: string
          request_payload: Json
          response_payload?: Json | null
          retries?: number
          status?: string
          subema_reference?: string | null
          sync_type: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          payment_id?: string
          request_payload?: Json
          response_payload?: Json | null
          retries?: number
          status?: string
          subema_reference?: string | null
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "subema_sync_logs_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_user_id: string
          created_at: string
          district_id: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean
          office_id: string | null
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          district_id?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          office_id?: string | null
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          district_id?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          office_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_definitions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_required: boolean
          service_type_id: string
          step_config: Json
          step_key: string
          step_order: number
          step_title: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          service_type_id: string
          step_config: Json
          step_key: string
          step_order: number
          step_title: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          service_type_id?: string
          step_config?: Json
          step_key?: string
          step_order?: number
          step_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "wizard_definitions_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_definitions: {
        Row: {
          created_at: string
          from_status: Database["public"]["Enums"]["case_status"]
          id: string
          is_active: boolean
          required_role: Database["public"]["Enums"]["app_role"]
          service_type_id: string
          to_status: Database["public"]["Enums"]["case_status"]
        }
        Insert: {
          created_at?: string
          from_status: Database["public"]["Enums"]["case_status"]
          id?: string
          is_active?: boolean
          required_role: Database["public"]["Enums"]["app_role"]
          service_type_id: string
          to_status: Database["public"]["Enums"]["case_status"]
        }
        Update: {
          created_at?: string
          from_status?: Database["public"]["Enums"]["case_status"]
          id?: string
          is_active?: boolean
          required_role?: Database["public"]["Enums"]["app_role"]
          service_type_id?: string
          to_status?: Database["public"]["Enums"]["case_status"]
        }
        Relationships: [
          {
            foreignKeyName: "workflow_definitions_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_id: { Args: never; Returns: string }
      get_user_internal_id: { Args: never; Returns: string }
      get_user_roles_array: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_case_access: { Args: { _case_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_audit_viewer: { Args: never; Returns: boolean }
      is_case_handler: { Args: never; Returns: boolean }
      is_case_reviewer: { Args: never; Returns: boolean }
      is_department_head: { Args: never; Returns: boolean }
      is_district_intake_officer: { Args: never; Returns: boolean }
      is_finance_officer: { Args: never; Returns: boolean }
      is_fraud_officer: { Args: never; Returns: boolean }
      perform_case_transition: {
        Args: {
          p_case_id: string
          p_metadata?: Json
          p_reason?: string
          p_target_status: Database["public"]["Enums"]["case_status"]
        }
        Returns: Json
      }
      validate_case_transition: {
        Args: {
          p_actor_id: string
          p_case_id: string
          p_reason?: string
          p_target_status: Database["public"]["Enums"]["case_status"]
        }
        Returns: undefined
      }
      validate_document_verification: {
        Args: {
          p_actor: string
          p_document_id: string
          p_new_status: Database["public"]["Enums"]["document_status"]
          p_reason: string
        }
        Returns: undefined
      }
      verify_case_document: {
        Args: {
          p_document_id: string
          p_metadata?: Json
          p_new_status: Database["public"]["Enums"]["document_status"]
          p_reason?: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role:
        | "citizen"
        | "district_intake_officer"
        | "case_handler"
        | "case_reviewer"
        | "department_head"
        | "finance_officer"
        | "fraud_officer"
        | "system_admin"
        | "audit_viewer"
      audit_event_type:
        | "create"
        | "read"
        | "update"
        | "delete"
        | "login"
        | "logout"
        | "export"
        | "import"
        | "approval"
        | "rejection"
        | "override"
        | "escalation"
      batch_status:
        | "draft"
        | "pending_approval"
        | "approved"
        | "submitted"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      case_status:
        | "intake"
        | "validation"
        | "eligibility_check"
        | "under_review"
        | "approved"
        | "rejected"
        | "payment_pending"
        | "payment_processed"
        | "closed"
        | "on_hold"
      document_status: "pending" | "verified" | "rejected" | "expired"
      document_type:
        | "id_card"
        | "income_proof"
        | "medical_certificate"
        | "birth_certificate"
        | "school_enrollment"
        | "residency_proof"
        | "bank_statement"
        | "marriage_certificate"
        | "death_certificate"
        | "household_composition"
      fraud_severity: "low" | "medium" | "high" | "critical"
      payment_item_status:
        | "pending"
        | "submitted"
        | "processing"
        | "completed"
        | "failed"
        | "returned"
      payment_status: "pending" | "processed" | "failed" | "cancelled"
      risk_level: "minimal" | "low" | "medium" | "high" | "critical"
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
      app_role: [
        "citizen",
        "district_intake_officer",
        "case_handler",
        "case_reviewer",
        "department_head",
        "finance_officer",
        "fraud_officer",
        "system_admin",
        "audit_viewer",
      ],
      audit_event_type: [
        "create",
        "read",
        "update",
        "delete",
        "login",
        "logout",
        "export",
        "import",
        "approval",
        "rejection",
        "override",
        "escalation",
      ],
      batch_status: [
        "draft",
        "pending_approval",
        "approved",
        "submitted",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      case_status: [
        "intake",
        "validation",
        "eligibility_check",
        "under_review",
        "approved",
        "rejected",
        "payment_pending",
        "payment_processed",
        "closed",
        "on_hold",
      ],
      document_status: ["pending", "verified", "rejected", "expired"],
      document_type: [
        "id_card",
        "income_proof",
        "medical_certificate",
        "birth_certificate",
        "school_enrollment",
        "residency_proof",
        "bank_statement",
        "marriage_certificate",
        "death_certificate",
        "household_composition",
      ],
      fraud_severity: ["low", "medium", "high", "critical"],
      payment_item_status: [
        "pending",
        "submitted",
        "processing",
        "completed",
        "failed",
        "returned",
      ],
      payment_status: ["pending", "processed", "failed", "cancelled"],
      risk_level: ["minimal", "low", "medium", "high", "critical"],
    },
  },
} as const
