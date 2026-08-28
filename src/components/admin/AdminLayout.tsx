import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, ChevronLeft, ChevronRight, Database, FolderKanban, Images, Layers3, LogOut, PackageOpen, Users } from "lucide-react";
import { getAdminSession, signOutAdmin, type AdminSession } from "@/lib/admin-auth";

const navigationItems = [
  { label: "Painel", href: "/admin", icon: BarChart3 },
  { label: "Pedidos", href: "/admin/pedidos", icon: FolderKanban },
  { label: "Galeria", href: "/admin/galeria", icon: Layers3 },
  { label: "Outros projetos", href: "/admin/outros", icon: PackageOpen },
  { label: "Fotos do site", href: "/admin/fotos", icon: Images },
  { label: "Bucket", href: "/admin/bucket", icon: Database },
  { label: "Usuarios", href: "/admin/usuarios", icon: Users, ownerOnly: true },
];

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [session, setSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    getAdminSession().then(setSession);
  }, []);

  const visibleNavigationItems = useMemo(
    () => navigationItems.filter((item) => !item.ownerOnly || session?.role === "owner"),
    [session?.role],
  );

  const signOut = () => {
    signOutAdmin();
  };

  return (
    <main className="min-h-screen bg-[#f8f1e9] text-[#8b4114]">
      <div className={`grid min-h-screen transition-[grid-template-columns] duration-300 ${isSidebarOpen ? "lg:grid-cols-[18rem_1fr]" : "lg:grid-cols-[5.5rem_1fr]"}`}>
        <aside className="hidden border-r border-[#8b4114]/10 bg-[#fffaf5] px-3 py-5 shadow-[8px_0_30px_rgba(93,51,29,0.04)] lg:sticky lg:top-0 lg:block lg:h-screen">
          <div className={`flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
            <div
              aria-hidden="true"
              className={`${isSidebarOpen ? "h-14 w-32" : "h-11 w-11"} bg-[#8b4114] transition-all duration-300`}
              style={{
                WebkitMaskImage: 'url("/logoMaiara.svg")',
                maskImage: 'url("/logoMaiara.svg")',
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskSize: "contain",
                maskSize: "contain",
              }}
            />
            {isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8b4114]/12 bg-white text-[#8b4114] transition-colors hover:bg-[#f0dfd4]"
                aria-label="Recolher menu"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>

          {!isSidebarOpen && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="mx-auto mt-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#8b4114]/12 bg-white text-[#8b4114] transition-colors hover:bg-[#f0dfd4]"
              aria-label="Abrir menu"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {isSidebarOpen && (
            <p className="mt-6 px-3 font-sans text-[0.68rem] font-normal uppercase tracking-[0.18em] text-[#76877e]">
              Ateliê Maiara
            </p>
          )}

          <nav className="mt-4 space-y-2">
            {visibleNavigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === "/admin"}
                  className={({ isActive }) =>
                    `flex h-11 items-center rounded-full font-sans text-sm font-light transition-all ${
                      isSidebarOpen ? "gap-3 px-3" : "justify-center px-0"
                    } ${
                      isActive ? "bg-[#8b4114] text-white shadow-[0_8px_18px_rgba(93,51,29,0.12)]" : "text-[#8b4114] hover:bg-[#f0dfd4]"
                    }`
                  }
                  title={isSidebarOpen ? undefined : item.label}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={signOut}
            className={`mt-8 flex h-11 w-full items-center rounded-full border border-[#8b4114]/12 bg-white font-sans text-sm font-light text-[#8b4114] transition-colors hover:bg-[#f0dfd4] ${
              isSidebarOpen ? "gap-3 px-3" : "justify-center px-0"
            }`}
            title={isSidebarOpen ? undefined : "Sair"}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {isSidebarOpen && <span>Sair</span>}
          </button>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-[#8b4114]/10 bg-[#fffaf5]/92 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <span className="font-sans text-sm font-normal uppercase tracking-[0.14em] text-[#8b4114]">Painel</span>
              <button
                type="button"
                onClick={signOut}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0dfd4] text-[#8b4114]"
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visibleNavigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === "/admin"}
                    className={({ isActive }) =>
                      `inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3 font-sans text-xs font-light ${
                        isActive ? "bg-[#8b4114] text-white" : "bg-white text-[#8b4114]"
                      }`
                    }
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </header>

          <Outlet />
        </div>
      </div>
    </main>
  );
}
