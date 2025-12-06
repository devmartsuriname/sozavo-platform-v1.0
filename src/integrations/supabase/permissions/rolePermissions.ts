/**
 * Role-Based Access Control - Central Permission Mapping
 * Phase 9C: Single source of truth for admin module access
 */

export type ModuleKey =
  | "dashboard"
  | "cases"
  | "eligibility"
  | "documents"
  | "payments"
  | "fraud"
  | "config"
  | "users"
  | "ui_kit";

export type AppRole =
  | "citizen"
  | "district_intake_officer"
  | "case_handler"
  | "case_reviewer"
  | "department_head"
  | "finance_officer"
  | "fraud_officer"
  | "system_admin"
  | "audit_viewer";

/**
 * Maps each role to their allowed module keys
 * This is the single source of truth for sidebar visibility and route protection
 */
export const rolePermissions: Record<AppRole, ModuleKey[]> = {
  system_admin: ["dashboard", "cases", "eligibility", "documents", "payments", "fraud", "config", "users", "ui_kit"],
  case_handler: ["dashboard", "cases", "eligibility", "documents"],
  case_reviewer: ["dashboard", "cases", "eligibility", "documents"],
  department_head: ["dashboard", "cases", "eligibility", "documents", "payments", "fraud", "config"],
  finance_officer: ["dashboard", "payments"],
  fraud_officer: ["dashboard", "fraud", "cases", "documents"],
  audit_viewer: ["dashboard", "config"],
  district_intake_officer: ["dashboard", "cases", "documents"],
  citizen: [],
};

/**
 * Computes the set of allowed modules for a given array of role strings
 */
export function getAllowedModules(roles: string[]): Set<ModuleKey> {
  const allowed = new Set<ModuleKey>();
  
  for (const role of roles) {
    const perms = rolePermissions[role as AppRole];
    if (perms) {
      perms.forEach((m) => allowed.add(m));
    }
  }
  
  return allowed;
}

/**
 * Checks if any of the user's roles grant access to any of the required modules
 */
export function hasModuleAccess(roles: string[], requiredModules: ModuleKey[]): boolean {
  const allowed = getAllowedModules(roles);
  return requiredModules.some((m) => allowed.has(m));
}
