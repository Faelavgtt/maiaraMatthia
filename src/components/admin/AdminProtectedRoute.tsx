import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdminSession } from "@/lib/admin-auth";

export function AdminProtectedRoute() {
  const location = useLocation();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getAdminSession().then((session) => {
      if (!isMounted) return;
      setIsAuthenticated(Boolean(session));
      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f1e9] px-5 text-[#8b4114]">
        <div className="rounded-xl border border-[#8b4114]/10 bg-[#fffaf5] px-5 py-4 text-center shadow-[0_14px_34px_rgba(93,51,29,0.06)]">
          <p className="font-sans text-sm font-light">Verificando acesso...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
