import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, FolderKanban, Images, LogOut } from "lucide-react";
import { signOutAdmin } from "@/lib/admin-auth";

const navigationItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Pedidos", href: "/admin/pedidos", icon: FolderKanban },
  { label: "Fotos do site", href: "/admin/fotos", icon: Images },
];

export function AdminLayout() {
  const navigate = useNavigate();

  const signOut = () => {
    signOutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f9e7d6] text-[#8b4114]">
      <div className="grid min-h-screen lg:grid-cols-[17rem_1fr]">
        <aside className="hidden border-r border-[#8b4114]/15 bg-[#ddb8a6] px-4 py-5 lg:block">
          <div
            aria-hidden="true"
            className="h-16 w-32 bg-[#8b4114]"
            style={{
              WebkitMaskImage: 'url("/logoMaiara.svg")',
              maskImage: 'url("/logoMaiara.svg")',
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "left center",
              maskPosition: "left center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />

          <p className="mt-6 font-sans text-[0.68rem] font-normal uppercase tracking-[0.18em] text-white">
            Administrativo
          </p>

          <nav className="mt-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === "/admin"}
                  className={({ isActive }) =>
                    `flex h-11 items-center gap-3 rounded-md px-3 font-sans text-sm font-light transition-colors ${
                      isActive ? "bg-[#8b4114] text-white" : "text-[#8b4114] hover:bg-white/45"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={signOut}
            className="mt-8 flex h-11 w-full items-center gap-3 rounded-md border border-[#8b4114]/20 bg-white/40 px-3 font-sans text-sm font-light text-[#8b4114] transition-colors hover:bg-white"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-[#8b4114]/15 bg-[#ddb8a6]/90 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <span className="font-sans text-sm font-normal uppercase tracking-[0.14em] text-white">Admin</span>
              <button
                type="button"
                onClick={signOut}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/55 text-[#8b4114]"
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === "/admin"}
                    className={({ isActive }) =>
                      `inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3 font-sans text-xs font-light ${
                        isActive ? "bg-[#8b4114] text-white" : "bg-white/50 text-[#8b4114]"
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
