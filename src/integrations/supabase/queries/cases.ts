import { supabase } from '../client';
import type { Tables, Enums } from '../types';
import type { PostgrestError } from '@supabase/supabase-js';

// Base types from schema
type Case = Tables<'cases'>;
type CaseEvent = Tables<'case_events'>;
type CaseStatus = Enums<'case_status'>;

// Join summary types
interface CitizenSummary {
  first_name: string;
  last_name: string;
}

interface ServiceTypeSummary {
  name: string;
}

interface OfficeSummary {
  name: string;
  district_id: string;
}

// Extended types with relations
export interface CaseWithRelations extends Case {
  citizens: CitizenSummary | null;
  service_types: ServiceTypeSummary | null;
}

export interface CaseDetailWithRelations extends Case {
  citizens: Tables<'citizens'> | null;
  service_types: Tables<'service_types'> | null;
  offices: OfficeSummary | null;
}

// Query parameters
export interface GetCasesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: CaseStatus;
  serviceTypeId?: string;
  officeId?: string;
}

/**
 * Fetch paginated list of cases with citizen and service type joins.
 * Respects RLS - only returns cases the authenticated user can access.
 */
export async function getCases(params: GetCasesParams = {}): Promise<{
  data: CaseWithRelations[] | null;
  count: number | null;
  error: PostgrestError | null;
}> {
  const {
    page = 1,
    pageSize = 10,
    search,
    status,
    serviceTypeId,
    officeId,
  } = params;

  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from('cases')
    .select(
      `
      id,
      case_reference,
      citizen_id,
      service_type_id,
      current_status,
      created_at,
      citizens (
        first_name,
        last_name
      ),
      service_types (
        name
      )
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(start, end);

  // Apply filters conditionally
  if (status) {
    query = query.eq('current_status', status);
  }

  if (serviceTypeId) {
    query = query.eq('service_type_id', serviceTypeId);
  }

  if (officeId) {
    query = query.eq('intake_office_id', officeId);
  }

  // Search on case_reference (MVP approach)
  if (search) {
    query = query.ilike('case_reference', `%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('[getCases] Error:', error.message);
  }

  return { data: data as CaseWithRelations[] | null, count, error };
}

/**
 * Fetch full case details by ID with all contextual joins.
 * Returns null if case not found or user has no access.
 */
export async function getCaseById(caseId: string): Promise<{
  data: CaseDetailWithRelations | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from('cases')
    .select(
      `
      *,
      citizens (*),
      service_types (
        id,
        name,
        description,
        code
      ),
      offices:intake_office_id (
        name,
        district_id
      )
    `
    )
    .eq('id', caseId)
    .maybeSingle();

  if (error) {
    console.error('[getCaseById] Error:', error.message);
  }

  return { data: data as CaseDetailWithRelations | null, error };
}

// Timeline event type (subset of CaseEvent)
export interface TimelineEvent {
  id: string;
  event_type: string;
  old_status: Enums<'case_status'> | null;
  new_status: Enums<'case_status'> | null;
  meta: Record<string, unknown> | null;
  created_at: string;
  actor_id: string | null;
}

/**
 * Fetch case timeline (events) sorted by created_at descending.
 * Returns all events for the given case that the user can access via RLS.
 */
export async function getCaseTimeline(caseId: string): Promise<{
  data: TimelineEvent[] | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from('case_events')
    .select(
      `
      id,
      event_type,
      old_status,
      new_status,
      meta,
      created_at,
      actor_id
    `
    )
    .eq('case_id', caseId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getCaseTimeline] Error:', error.message);
  }

  return { data: data as TimelineEvent[] | null, error };
}
