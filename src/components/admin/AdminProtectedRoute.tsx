import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminSession } from "@/lib/admin-auth";

export function AdminProtectedRoute() {
  const location = useLocation();
  const session = getAdminSession();

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
