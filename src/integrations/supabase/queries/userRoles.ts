import { supabase } from '../client';

export type AppRole = 
  | 'citizen'
  | 'district_intake_officer'
  | 'case_handler'
  | 'case_reviewer'
  | 'department_head'
  | 'finance_officer'
  | 'fraud_officer'
  | 'system_admin'
  | 'audit_viewer';

/**
 * Fetches all roles for a given user ID.
 * Uses RLS - user can only see their own roles unless admin.
 */
export async function getCurrentUserRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user roles:', error.message);
    return [];
  }

  return (data || []).map((r) => r.role as AppRole);
}

/**
 * Check if the current user has a specific role.
 */
export async function hasRole(userId: string, role: AppRole): Promise<boolean> {
  const roles = await getCurrentUserRoles(userId);
  return roles.includes(role);
}

/**
 * Check if the current user is a system admin.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  return hasRole(userId, 'system_admin');
}
