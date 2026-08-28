import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, UserPlus } from "lucide-react";
import { createAdminUser, listAdminUsers, type AdminUserRole } from "@/lib/admin-api";

const initialForm = {
  username: "",
  email: "",
  password: "",
  role: "admin" as AdminUserRole,
};

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: listAdminUsers,
    retry: false,
  });

  const createUser = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      setForm(initialForm);
      setMessage("Usuario cadastrado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : "Não foi possível cadastrar o usuário.");
    },
  });

  const submitUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    createUser.mutate(form);
  };

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        <div className="rounded-xl border border-[#8b4114]/10 bg-[#fffaf5] p-6 shadow-[0_14px_34px_rgba(93,51,29,0.05)]">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#e4e7d9] px-3 py-1 font-sans text-[0.68rem] font-normal uppercase tracking-[0.18em] text-[#76877e]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Acessos do painel
          </p>
          <h1 className="mt-3 font-sans text-3xl font-extralight leading-tight text-[#8b4114] md:text-4xl">
            Usuarios autorizados
          </h1>
          <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-6 text-[#8b4114]/72">
            Cadastre quem pode entrar no painel administrativo do atelie.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.86fr)_minmax(22rem,0.64fr)]">
          <form onSubmit={submitUser} className="rounded-xl border border-[#8b4114]/10 bg-white p-5 shadow-[0_14px_34px_rgba(93,51,29,0.05)]">
            <div className="mb-4 flex items-center gap-3 border-b border-[#8b4114]/10 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0dfd4] text-[#8b4114]">
                <UserPlus className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-sans text-xl font-light text-[#8b4114]">Novo acesso</h2>
                <p className="font-sans text-xs font-light text-[#8b4114]/65">Use uma senha forte e unica para cada pessoa.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="font-sans text-xs font-light uppercase tracking-[0.14em] text-[#76877e]">
                Usuario
                <input required value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#8b4114]/15 bg-[#fffaf5] px-3 font-sans text-sm normal-case tracking-normal text-[#8b4114] outline-none" />
              </label>
              <label className="font-sans text-xs font-light uppercase tracking-[0.14em] text-[#76877e]">
                Email
                <input required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#8b4114]/15 bg-[#fffaf5] px-3 font-sans text-sm normal-case tracking-normal text-[#8b4114] outline-none" />
              </label>
              <label className="font-sans text-xs font-light uppercase tracking-[0.14em] text-[#76877e]">
                Senha inicial
                <input required type="password" minLength={8} value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="mt-1 h-10 w-full rounded-md border border-[#8b4114]/15 bg-[#fffaf5] px-3 font-sans text-sm normal-case tracking-normal text-[#8b4114] outline-none" />
              </label>
              <label className="font-sans text-xs font-light uppercase tracking-[0.14em] text-[#76877e]">
                Perfil
                <select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as AdminUserRole }))} className="mt-1 h-10 w-full rounded-md border border-[#8b4114]/15 bg-[#fffaf5] px-3 font-sans text-sm normal-case tracking-normal text-[#8b4114] outline-none">
                  <option value="admin">Administrador</option>
                  <option value="owner">Admin principal</option>
                </select>
              </label>
            </div>

            {message && (
              <p className="mt-4 rounded-md bg-[#f8f1e9] px-3 py-2 font-sans text-sm font-light text-[#8b4114]">
                {message}
              </p>
            )}

            <button disabled={createUser.isPending} className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-[#7d876d] px-5 font-sans text-sm font-medium text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">
              {createUser.isPending ? "Cadastrando..." : "Cadastrar usuario"}
            </button>
          </form>

          <aside className="rounded-xl border border-[#8b4114]/10 bg-white p-5 shadow-[0_14px_34px_rgba(93,51,29,0.05)]">
            <h2 className="font-sans text-xl font-light text-[#8b4114]">Usuarios cadastrados</h2>
            <div className="mt-4 space-y-2">
              {isLoading ? (
                <p className="font-sans text-sm font-light text-[#8b4114]/65">Carregando usuarios...</p>
              ) : data?.users.length ? (
                data.users.map((user) => (
                  <article key={user.id} className="rounded-lg border border-[#8b4114]/10 bg-[#fffaf5] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-sans text-sm font-medium text-[#8b4114]">{user.username}</h3>
                        <p className="font-sans text-xs font-light text-[#8b4114]/65">{user.email}</p>
                      </div>
                      <span className="rounded-full bg-[#e4e7d9] px-2 py-1 font-sans text-[0.62rem] font-light uppercase tracking-[0.12em] text-[#76877e]">
                        {user.role === "owner" ? "Principal" : "Admin"}
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <p className="font-sans text-sm font-light text-[#8b4114]/65">Nenhum usuario cadastrado ainda.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default AdminUsers;
