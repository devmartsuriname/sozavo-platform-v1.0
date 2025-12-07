import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Phase 9D-2F: Configuration Query Layer (Read-Only)
 * 
 * Provides typed read-only access to system configuration tables.
 * No mutations allowed - informational display only.
 * 
 * All authenticated users can read these tables per RLS policies.
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface ServiceTypeRow {
  id: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OfficeRow {
  id: string;
  name: string;
  district_id: string;
  address: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

export interface WorkflowDefinitionRow {
  id: string;
  service_type_id: string;
  from_status: string;
  to_status: string;
  required_role: string;
  is_active: boolean;
  created_at: string;
}

export interface EligibilityRuleRow {
  id: string;
  service_type_id: string;
  rule_name: string;
  rule_type: string;
  condition: unknown;
  error_message: string;
  priority: number;
  is_mandatory: boolean;
  is_active: boolean;
  created_at: string;
}

// Extended types with joined service info
export interface WorkflowDefinitionWithService extends WorkflowDefinitionRow {
  service_types: { code: string; name: string } | null;
}

export interface EligibilityRuleWithService extends EligibilityRuleRow {
  service_types: { code: string; name: string } | null;
}

// ============================================================================
// Query Functions (Read-Only)
// ============================================================================

/**
 * Fetch all service types (max 20 rows for Phase 9)
 */
export async function getServiceTypes(limit = 20): Promise<{
  data: ServiceTypeRow[] | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("service_types")
    .select("id, code, name, description, is_active, created_at, updated_at")
    .order("code", { ascending: true })
    .limit(limit);

  return { data, error };
}

/**
 * Fetch all offices (max 20 rows for Phase 9)
 */
export async function getOffices(limit = 20): Promise<{
  data: OfficeRow[] | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("offices")
    .select("id, name, district_id, address, phone, is_active, created_at")
    .order("district_id", { ascending: true })
    .order("name", { ascending: true })
    .limit(limit);

  return { data, error };
}

/**
 * Fetch all workflow definitions with service type info (max 20 rows for Phase 9)
 */
export async function getWorkflowDefinitions(limit = 20): Promise<{
  data: WorkflowDefinitionWithService[] | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("workflow_definitions")
    .select(`
      id,
      service_type_id,
      from_status,
      to_status,
      required_role,
      is_active,
      created_at,
      service_types ( code, name )
    `)
    .order("service_type_id", { ascending: true })
    .order("from_status", { ascending: true })
    .limit(limit);

  return { data: data as WorkflowDefinitionWithService[] | null, error };
}

/**
 * Fetch all eligibility rules with service type info (max 20 rows for Phase 9)
 */
export async function getEligibilityRules(limit = 20): Promise<{
  data: EligibilityRuleWithService[] | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("eligibility_rules")
    .select(`
      id,
      service_type_id,
      rule_name,
      rule_type,
      condition,
      error_message,
      priority,
      is_mandatory,
      is_active,
      created_at,
      service_types ( code, name )
    `)
    .order("service_type_id", { ascending: true })
    .order("priority", { ascending: true })
    .limit(limit);

  return { data: data as EligibilityRuleWithService[] | null, error };
}

// ============================================================================
// Count Functions for Summary Cards
// ============================================================================

/**
 * Get count of active service types
 */
export async function getActiveServiceTypesCount(): Promise<{
  count: number | null;
  error: PostgrestError | null;
}> {
  const { count, error } = await supabase
    .from("service_types")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  return { count, error };
}

/**
 * Get count of active offices
 */
export async function getActiveOfficesCount(): Promise<{
  count: number | null;
  error: PostgrestError | null;
}> {
  const { count, error } = await supabase
    .from("offices")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  return { count, error };
}

/**
 * Get total count of workflow definitions
 */
export async function getWorkflowDefinitionsCount(): Promise<{
  count: number | null;
  error: PostgrestError | null;
}> {
  const { count, error } = await supabase
    .from("workflow_definitions")
    .select("*", { count: "exact", head: true });

  return { count, error };
}

/**
 * Get total count of eligibility rules
 */
export async function getEligibilityRulesCount(): Promise<{
  count: number | null;
  error: PostgrestError | null;
}> {
  const { count, error } = await supabase
    .from("eligibility_rules")
    .select("*", { count: "exact", head: true });

  return { count, error };
}
