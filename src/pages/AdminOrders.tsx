import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { mockAdminOrders } from "@/components/admin/admin-data";
import { listAdminOrders, type AdminOrderStatus } from "@/lib/admin-api";

const AdminOrders = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AdminOrderStatus | "all">("all");

  const { data, isError, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: listAdminOrders,
    retry: false,
  });

  const orders = data?.orders?.length ? data.orders : mockAdminOrders;

  const filteredOrders = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = status === "all" || order.status === status;
      const matchesSearch =
        searchTerm.length === 0 ||
        [order.code, order.customer_name, order.customer_phone, order.product, order.colors, order.size]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchTerm));

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, status]);

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sans text-sm font-light uppercase tracking-[0.18em] text-[#76877e]">Pedidos</p>
            <h1 className="font-sans text-3xl font-extralight text-[#8b4114] md:text-4xl">Orcamentos e pedidos</h1>
            <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-6 text-[#8b4114]/72">
              Busque contatos recebidos pelo site e acompanhe cada projeto em andamento.
            </p>
          </div>
          <div className="rounded-md border border-[#8b4114]/15 bg-white/60 px-4 py-2 font-sans text-xs font-light text-[#8b4114]/70">
            {isLoading ? "Atualizando informacoes..." : isError ? "Mostrando uma previa local" : "Informacoes atualizadas"}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <AdminToolbar search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} />
          <AdminOrdersTable orders={filteredOrders} />
        </div>
      </div>
    </section>
  );
};

export default AdminOrders;
