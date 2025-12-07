import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

// Types
export interface CaseDocument {
  id: string;
  case_id: string | null;
  citizen_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  status: string;
  verified_by: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
  expires_at: string | null;
  created_at: string;
}

/**
 * Get all documents for a case
 * Returns documents ordered by created_at descending (newest first)
 */
export async function getCaseDocuments(caseId: string): Promise<{
  data: CaseDocument[] | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("documents")
    .select("id, case_id, citizen_id, document_type, file_name, file_path, file_size, mime_type, status, verified_by, verified_at, rejection_reason, expires_at, created_at")
    .eq("case_id", caseId)
    .order("created_at", { ascending: false });

  return {
    data: data as CaseDocument[] | null,
    error,
  };
}
