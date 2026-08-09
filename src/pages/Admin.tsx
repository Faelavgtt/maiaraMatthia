import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FolderKanban, Images, Layers3, Sparkles } from "lucide-react";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { metricConfig, mockAdminOrders } from "@/components/admin/admin-data";
import { listAdminOrders } from "@/lib/admin-api";

const quickLinks = [
  {
    title: "Ver pedidos",
    description: "Acompanhe orcamentos, clientes e andamento dos projetos.",
    href: "/admin/pedidos",
    icon: FolderKanban,
  },
  {
    title: "Fotos do site",
    description: "Organize imagens da home, portfolio e feedbacks.",
    href: "/admin/fotos",
    icon: Images,
  },
  {
    title: "Produtos da galeria",
    description: "Cadastre produtos, quadros e carrosseis exibidos na home.",
    href: "/admin/galeria",
    icon: Layers3,
  },
];

const Admin = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: listAdminOrders,
    retry: false,
  });

  const orders = data?.orders?.length ? data.orders : mockAdminOrders;
  const latestOrders = orders.slice(0, 3);

  const metrics = useMemo(
    () =>
      metricConfig.map((metric) => ({
        ...metric,
        value: orders.filter((order) => order.status === metric.key).length,
      })),
    [orders],
  );

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        <div className="relative overflow-hidden rounded-xl border border-[#8b4114]/10 bg-[#fffaf5] p-6 shadow-[0_14px_34px_rgba(93,51,29,0.05)] lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#8b4114_0.7px,transparent_0.7px)] [background-size:22px_22px] opacity-[0.035]" aria-hidden="true" />
          <div>
            <p className="relative inline-flex items-center gap-2 rounded-full bg-[#e4e7d9] px-3 py-1 font-sans text-[0.68rem] font-normal uppercase tracking-[0.18em] text-[#76877e]">
              <Sparkles className="h-3.5 w-3.5" />
              Painel do atelie
            </p>
            <h1 className="relative mt-3 font-sans text-3xl font-extralight leading-tight text-[#8b4114] md:text-4xl">Resumo do dia</h1>
            <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-6 text-[#8b4114]/72">
              Uma visao rapida dos pedidos, contatos recentes e areas principais para cuidar do site com calma.
            </p>
          </div>
          <div className="relative mt-4 w-fit rounded-full border border-[#8b4114]/10 bg-white px-4 py-2 font-sans text-xs font-light text-[#8b4114]/70 lg:mt-0">
            {isLoading ? "Atualizando informacoes..." : isError ? "Mostrando uma previa local" : "Informacoes atualizadas"}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <AdminMetricCard key={metric.key} icon={metric.icon} label={metric.label} value={metric.value} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-sans text-[0.68rem] font-normal uppercase tracking-[0.16em] text-[#76877e]">Acompanhamento</p>
                <h2 className="font-sans text-xl font-light text-[#8b4114]">Pedidos recentes</h2>
              </div>
              <Link to="/admin/pedidos" className="inline-flex h-9 items-center gap-2 rounded-full border border-[#8b4114]/10 bg-white px-3 font-sans text-xs font-light text-[#8b4114] hover:bg-[#f0dfd4]">
                Ver todos
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <AdminOrdersTable orders={latestOrders} />
          </div>

          <aside className="rounded-xl border border-[#8b4114]/10 bg-white p-4 shadow-[0_14px_34px_rgba(93,51,29,0.05)]">
            <div className="mb-3">
              <p className="font-sans text-xs font-light uppercase tracking-[0.18em] text-[#76877e]">Acessos rapidos</p>
              <h2 className="font-sans text-xl font-light text-[#8b4114]">Gerenciar site</h2>
            </div>

            <div className="space-y-3">
              {quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="group flex items-start gap-3 rounded-lg border border-[#8b4114]/10 bg-[#fffaf5] p-3 transition-colors hover:bg-[#f8f1e9]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e4e7d9] text-[#76877e]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-sans text-sm font-medium text-[#8b4114]">{item.title}</h3>
                        <ArrowRight className="h-4 w-4 shrink-0 text-[#76877e] transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="mt-1 font-sans text-xs font-light leading-5 text-[#8b4114]/68">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Admin;
