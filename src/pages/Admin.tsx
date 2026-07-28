import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FolderKanban, Images } from "lucide-react";
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
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sans text-sm font-light uppercase tracking-[0.18em] text-[#76877e]">Dashboard</p>
            <h1 className="font-sans text-3xl font-extralight text-[#8b4114] md:text-4xl">Resumo do atelie</h1>
            <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-6 text-[#8b4114]/72">
              Uma visao rapida dos contatos, pedidos e conteudos que alimentam o site.
            </p>
          </div>
          <div className="rounded-md border border-[#8b4114]/15 bg-white/60 px-4 py-2 font-sans text-xs font-light text-[#8b4114]/70">
            {isLoading ? "Carregando API..." : isError ? "Usando dados de exemplo" : "Dados conectados"}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {metrics.map((metric) => (
            <AdminMetricCard key={metric.key} icon={metric.icon} label={metric.label} value={metric.value} />
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className="group rounded-md border border-[#8b4114]/15 bg-white p-5 shadow-[0_14px_34px_rgba(93,51,29,0.08)] transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#d39a7e] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#76877e] transition-transform group-hover:translate-x-1" />
                </div>
                <h2 className="mt-5 font-sans text-xl font-light text-[#8b4114]">{item.title}</h2>
                <p className="mt-2 font-sans text-sm font-light leading-6 text-[#8b4114]/68">{item.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-sans text-xl font-light text-[#8b4114]">Pedidos recentes</h2>
            <Link to="/admin/pedidos" className="font-sans text-sm font-light text-[#76877e] hover:text-[#8b4114]">
              Ver todos
            </Link>
          </div>
          <AdminOrdersTable orders={latestOrders} />
        </div>
      </div>
    </section>
  );
};

export default Admin;
