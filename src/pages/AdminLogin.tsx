import { FormEvent, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole, LogIn, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { getAdminSession, signInAdmin, type AdminSession } from "@/lib/admin-auth";

type LoginLocationState = {
  from?: string;
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const from = (location.state as LoginLocationState | null)?.from ?? "/admin";

  useEffect(() => {
    let isMounted = true;

    getAdminSession().then((currentSession) => {
      if (!isMounted) return;
      setSession(currentSession);
      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#d19c88] px-5 text-[#8b4114]">
        <div className="rounded-2xl border border-white/45 bg-[#fffaf5] px-6 py-5 text-center shadow-[0_18px_45px_rgba(93,51,29,0.12)]">
          <p className="font-sans text-sm font-light text-[#8b4114]">Preparando acesso ao ateliê...</p>
        </div>
      </main>
    );
  }

  if (session) {
    return <Navigate to={from} replace />;
  }

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const data = new FormData(event.currentTarget);
    const login = String(data.get("login") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!login || !password) {
      setError("Preencha usuário ou e-mail e senha para acessar.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signInAdmin(login, password);
      navigate(from, { replace: true });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#d19c88] px-5 py-6 text-[#8b4114] sm:px-8">
      {/* Decorative Botanical Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <img
          src="/image/elementosFloral/floral7.png"
          alt=""
          className="garden-sway-slow absolute -left-10 -top-4 h-44 w-auto opacity-75 sm:h-56 lg:h-72"
        />
        <img
          src="/image/elementosFloral/floral1.png"
          alt=""
          className="garden-sway absolute -bottom-28 -left-28 h-[22rem] w-auto opacity-45 sm:h-[30rem] lg:h-[38rem]"
        />
        <img
          src="/image/elementosFloral/floral5.png"
          alt=""
          className="garden-sway-slow absolute -right-32 bottom-2 h-[20rem] w-auto opacity-45 sm:h-[28rem] lg:h-[34rem]"
        />
        <img
          src="/image/elementosFloral/floral2.png"
          alt=""
          className="garden-sway absolute -right-24 top-20 h-44 w-auto opacity-35 sm:h-56 lg:h-72"
        />
      </div>

      <a
        href="/"
        className="relative z-10 inline-flex h-9 items-center gap-2 rounded-xl border border-white/45 bg-white/20 px-3.5 font-sans text-xs font-light text-[#8b4114] backdrop-blur-xs transition-colors hover:bg-white/30"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Voltar à loja</span>
      </a>

      <div className="mx-auto grid max-w-6xl items-center gap-8 py-6 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        {/* Left Intro Hero */}
        <section className="relative max-w-xl">
          <span
            aria-hidden="true"
            className="block h-14 w-32 bg-[#f9e7d6] sm:h-18 sm:w-40"
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

          <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/30 px-3 py-1 font-sans text-xs font-medium uppercase tracking-[0.16em] text-[#8b4114] backdrop-blur-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Painel Administrativo</span>
          </div>

          <h1 className="mt-3 font-sans text-3xl font-light leading-tight text-[#8b4114] sm:text-4xl lg:text-5xl">
            Gestão elegante e centralizada do ateliê.
          </h1>

          <p className="mt-4 font-sans text-sm sm:text-base font-light leading-relaxed text-[#8b4114]/85">
            Acompanhe pedidos, clientes, orçamentos e personalize sua galeria de arte com facilidade e precisão.
          </p>

          <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-2">
            <div className="rounded-2xl border border-white/40 bg-white/20 p-4 backdrop-blur-xs">
              <Sparkles className="h-5 w-5 text-[#8b4114]" />
              <p className="mt-2.5 font-sans text-xs font-light leading-relaxed text-[#8b4114]/90">
                Orçamentos e pedidos centralizados em um fluxo simples.
              </p>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/20 p-4 backdrop-blur-xs">
              <span className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#8b4114]">
                Ateliê Online
              </span>
              <p className="mt-2.5 font-sans text-xs font-light leading-relaxed text-[#8b4114]/90">
                Acesso seguro e restrito para administrar todo o catálogo.
              </p>
            </div>
          </div>
        </section>

        {/* Right Login Card */}
        <section className="relative rounded-3xl border border-white/60 bg-[#fffaf5] p-6 sm:p-8 shadow-[0_24px_60px_rgba(93,51,29,0.15)]">
          <div className="mb-6 rounded-2xl bg-[#f8f1e9] p-4 border border-[#8b4114]/10">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#76877e]">
              Acesso Seguro
            </p>
            <h2 className="mt-1 font-sans text-2xl font-light text-[#8b4114]">Entrar no Painel</h2>
            <p className="mt-1 font-sans text-xs font-light text-[#8b4114]/70">
              Digite seu usuário ou e-mail e senha para continuar.
            </p>
          </div>

          <form onSubmit={submitLogin} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#76877e]">
                Usuário ou E-mail
              </span>
              <div className="flex h-11 items-center gap-2 rounded-xl border border-[#8b4114]/15 bg-white px-3.5 shadow-xs transition-all focus-within:border-[#8b4114]">
                <Mail className="h-4 w-4 shrink-0 text-[#76877e]" />
                <input
                  name="login"
                  type="text"
                  autoComplete="username"
                  required
                  className="w-full bg-transparent font-sans text-xs sm:text-sm font-light text-[#8b4114] outline-none placeholder:text-[#76877e]/60"
                  placeholder="usuario ou email@exemplo.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#76877e]">
                Senha
              </span>
              <div className="flex h-11 items-center gap-2 rounded-xl border border-[#8b4114]/15 bg-white px-3.5 shadow-xs transition-all focus-within:border-[#8b4114]">
                <LockKeyhole className="h-4 w-4 shrink-0 text-[#76877e]" />
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-transparent font-sans text-xs sm:text-sm font-light text-[#8b4114] outline-none placeholder:text-[#76877e]/60"
                  placeholder="Sua senha secreta"
                />
              </div>
            </label>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 font-sans text-xs font-light text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#8b4114] px-5 font-sans text-sm font-medium text-white shadow-md transition-all hover:bg-[#72340e] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{isSubmitting ? "Autenticando..." : "Entrar no Sistema"}</span>
              <LogIn className="h-4 w-4" />
            </button>

            <p className="rounded-xl bg-[#f8f1e9]/70 px-3 py-2 text-center font-sans text-[11px] font-light text-[#8b4114]/70">
              Caso tenha esquecido sua senha, solicite suporte ao administrador.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AdminLogin;

