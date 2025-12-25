import { useAuth } from "@/features/auth/model/hooks/useAuth";
import { Navigate, useLocation } from "react-router";

export const RequireAuth = ({ allowedRoles, children }: { allowedRoles?: string[], children?: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles) {
    return children;
  }

  return allowedRoles.some((role) => user?.role?.includes(role)) ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};
