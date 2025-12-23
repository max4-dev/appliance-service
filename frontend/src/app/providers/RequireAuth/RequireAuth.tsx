import { useAuth } from "@/features/auth/model/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router";

export const RequireAuth = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user, isLoading } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles) {
    return <Outlet />;
  }

  return allowedRoles.some((role) => user?.role?.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};
