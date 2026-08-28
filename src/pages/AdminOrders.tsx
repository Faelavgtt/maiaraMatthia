import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { deleteAdminOrder, listAdminOrders, updateAdminOrderStatus, type AdminOrderSource, type AdminOrderStatus, type AdminOrderType } from "@/lib/admin-api";

const AdminOrders = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AdminOrderStatus | "all">("all");
  const [type, setType] = useState<AdminOrderType | "all">("all");
  const [source, setSource] = useState<AdminOrderSource | "all">("all");
  const [fileState, setFileState] = useState<"all" | "with_files" | "without_files">("all");
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: listAdminOrders,
    retry: false,
  });

  const orders = data?.orders ?? [];
  const updateStatus = useMutation({
    mutationFn: ({ code, nextStatus }: { code: string; nextStatus: AdminOrderStatus }) =>
      updateAdminOrderStatus(code, nextStatus, nextStatus === "payment_confirmed" ? "Pagamento confirmado no painel" : undefined),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const deleteOrder = useMutation({
    mutationFn: deleteAdminOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const orderStats = useMemo(() => {
    const awaitingPayment = orders.filter((order) => order.status === "awaiting_payment").length;
    const inProgress = orders.filter((order) => ["payment_confirmed", "in_production", "awaiting_approval"].includes(order.status)).length;
    const withFiles = orders.filter((order) => order.files?.length > 0).length;

    return [
      { label: "Total", value: orders.length },
      { label: "Aguardando pagamento", value: awaitingPayment },
      { label: "Em andamento", value: inProgress },
      { label: "Com arquivo", value: withFiles },
    ];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = status === "all" || order.status === status;
      const matchesType = type === "all" || order.order_type === type || (order.items?.some((item) => item.order_type === type) ?? false);
      const matchesSource = source === "all" || order.source === source;
      const matchesFiles =
        fileState === "all" ||
        (fileState === "with_files" && order.files?.length > 0) ||
        (fileState === "without_files" && (!order.files || order.files.length === 0));
      const matchesSearch =
        searchTerm.length === 0 ||
        [order.code, order.customer_name, order.customer_phone, order.customer_email, order.product, order.colors, order.size, order.notes]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchTerm));

      return matchesStatus && matchesType && matchesSource && matchesFiles && matchesSearch;
    });
  }, [orders, search, status, type, source, fileState]);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setType("all");
    setSource("all");
    setFileState("all");
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sans text-sm font-light uppercase tracking-[0.18em] text-[#76877e]">Pedidos</p>
            <h1 className="font-sans text-2xl font-extralight leading-tight text-[#8b4114] sm:text-3xl md:text-4xl">Orçamentos e pedidos</h1>
            <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-6 text-[#8b4114]/72">
              Busque contatos recebidos pelo site e acompanhe cada projeto em andamento.
            </p>
          </div>
          <div className="rounded-md border border-[#8b4114]/15 bg-white/60 px-4 py-2 font-sans text-xs font-light text-[#8b4114]/70">
            {isLoading ? "Atualizando informações..." : isError ? "Não foi possível carregar os pedidos" : "Informações atualizadas"}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {orderStats.map((item) => (
              <div key={item.label} className="rounded-md border border-[#8b4114]/10 bg-white/75 px-4 py-3">
                <p className="font-sans text-xs font-light uppercase tracking-[0.14em] text-[#76877e]">{item.label}</p>
                <p className="mt-1 font-sans text-2xl font-light text-[#8b4114]">{item.value}</p>
              </div>
            ))}
          </div>

          <AdminToolbar
            search={search}
            status={status}
            type={type}
            source={source}
            fileState={fileState}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onTypeChange={setType}
            onSourceChange={setSource}
            onFileStateChange={setFileState}
            onClearFilters={clearFilters}
          />
          <AdminOrdersTable
            orders={filteredOrders}
            onStatusChange={(code, nextStatus) => updateStatus.mutate({ code, nextStatus })}
            onDeleteOrder={(code) => deleteOrder.mutate(code)}
            isUpdatingStatus={updateStatus.isPending}
            isDeletingOrder={deleteOrder.isPending}
          />
        </div>
      </div>
    </section>
  );
};

export default AdminOrders;
