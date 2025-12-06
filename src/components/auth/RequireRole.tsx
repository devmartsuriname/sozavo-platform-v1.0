import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/integrations/supabase/AuthContext';
import { ModuleKey, hasModuleAccess } from '@/integrations/supabase/permissions/rolePermissions';

interface RequireRoleProps {
  allowed: ModuleKey[];
  children: ReactNode;
}

/**
 * Phase 9C: Role-based route protection component
 * Wraps protected routes and redirects to /admin/access-denied if user lacks required modules
 */
export function RequireRole({ allowed, children }: RequireRoleProps) {
  const { roles, isLoading } = useAuth();

  // Show loading while auth state is being determined
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // No roles assigned - deny access
  if (!roles || roles.length === 0) {
    return <Navigate to="/admin/access-denied" replace />;
  }

  // Check if user has any of the required module permissions
  if (!hasModuleAccess(roles, allowed)) {
    return <Navigate to="/admin/access-denied" replace />;
  }

  return <>{children}</>;
}
