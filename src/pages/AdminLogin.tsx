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
        <div className="rounded-xl border border-white/45 bg-[#fffaf5] px-5 py-4 text-center shadow-[0_18px_45px_rgba(93,51,29,0.12)]">
          <p className="font-sans text-sm font-light">Preparando acesso...</p>
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
      setError("Preencha usuario ou email e senha para acessar.");
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
        className="relative z-10 inline-flex h-10 items-center gap-2 rounded-full border border-white/45 bg-white/20 px-4 font-sans text-sm font-light text-[#8b4114] backdrop-blur-sm transition-transform hover:-translate-y-0.5"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao site
      </a>

      <div className="mx-auto grid max-w-6xl items-center gap-6 py-6 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:py-8">
        <section className="relative max-w-2xl">
          <span
            aria-hidden="true"
            className="block h-14 w-28 bg-[#f9e7d6] sm:h-20 sm:w-36"
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
          <p className="mt-5 inline-flex items-center gap-2 font-sans text-[0.68rem] font-normal uppercase tracking-[0.2em] text-white sm:mt-8">
            <ShieldCheck className="h-3.5 w-3.5" />
            Painel administrativo
          </p>
          <h1 className="mt-3 max-w-xl font-sans text-3xl font-extralight leading-[1.08] text-[#8b4114] sm:mt-4 sm:text-5xl lg:text-6xl">
            Um cantinho reservado para cuidar dos projetos.
          </h1>
          <p className="mt-4 max-w-xl font-sans text-sm font-light leading-6 text-[#8b4114]/82 sm:mt-5 sm:text-lg sm:leading-8">
            Entre para acompanhar orçamentos, organizar conversas e guardar cada etapa com a mesma delicadeza do ateliê.
          </p>

          <div className="mt-7 hidden max-w-lg gap-3 sm:grid sm:grid-cols-2">
            <div className="-rotate-1 rounded-[1.5rem_0.9rem_1.7rem_1rem] border border-white/45 bg-white/25 p-4 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-[#f9e7d6]" />
              <p className="mt-3 font-sans text-xs font-light leading-5 text-[#8b4114]/78">Orcamentos, pedidos e contatos em um fluxo simples.</p>
            </div>
            <div className="rotate-1 rounded-[1rem_1.5rem_1rem_1.7rem] border border-white/45 bg-[#f9e7d6]/50 p-4 backdrop-blur-sm">
              <p className="font-sans text-xs font-normal uppercase tracking-[0.14em] text-[#76877e]">Ateliê online</p>
              <p className="mt-2 font-sans text-xs font-light leading-5 text-[#8b4114]/78">Acesso interno para organizar a parte silenciosa do trabalho.</p>
            </div>
          </div>
        </section>

        <section className="relative rounded-[2rem_1.2rem_2.3rem_1.35rem] border border-white/55 bg-[#fffaf5] p-5 shadow-[0_28px_70px_rgba(93,51,29,0.18)] sm:p-7">
          <span className="absolute left-1/2 top-0 h-8 w-32 -translate-x-1/2 -translate-y-1/2 rotate-2 bg-[#e4e7d9] opacity-95 shadow-sm" aria-hidden="true" />
          <span className="absolute -right-4 top-24 h-5 w-5 rounded-full bg-[#7d876d]" aria-hidden="true" />
          <span className="absolute -right-8 top-16 h-3 w-3 rounded-full bg-[#ddb8a6]" aria-hidden="true" />

          <div className="mb-6 rounded-[1.4rem_0.8rem_1.4rem_0.8rem] bg-[#f8f1e9] p-4">
            <p className="font-sans text-xs font-normal uppercase tracking-[0.18em] text-[#76877e]">Login</p>
            <h2 className="mt-2 font-sans text-2xl font-extralight text-[#8b4114]">Entrar no painel</h2>
            <p className="mt-2 font-sans text-xs font-light leading-5 text-[#8b4114]/65">
              Use seu usuario ou email cadastrado pelo administrador principal.
            </p>
          </div>

          <form onSubmit={submitLogin} className="space-y-4">
            <label className="block font-sans text-sm font-light text-[#8b4114]">
              Usuario ou email
              <span className="mt-2 flex h-12 items-center gap-2 rounded-full border border-[#ddb8a6] bg-white px-4 shadow-[0_8px_20px_rgba(93,51,29,0.05)] focus-within:border-[#c68043]">
                <Mail className="h-4 w-4 shrink-0 text-[#76877e]" />
                <input
                  name="login"
                  type="text"
                  autoComplete="username"
                  className="w-full bg-transparent font-sans text-sm font-light outline-none"
                  placeholder="maiara ou email@exemplo.com"
                />
              </span>
            </label>

            <label className="block font-sans text-sm font-light text-[#8b4114]">
              Senha
              <span className="mt-2 flex h-12 items-center gap-2 rounded-full border border-[#ddb8a6] bg-white px-4 shadow-[0_8px_20px_rgba(93,51,29,0.05)] focus-within:border-[#c68043]">
                <LockKeyhole className="h-4 w-4 shrink-0 text-[#76877e]" />
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full bg-transparent font-sans text-sm font-light outline-none"
                  placeholder="Digite sua senha"
                />
              </span>
            </label>

            {error && (
              <p className="rounded-md bg-[#f0dfd4] px-3 py-2 font-sans text-sm font-light text-[#8b4114]">
                {error}
              </p>
            )}

            <button disabled={isSubmitting} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#7d876d] px-5 font-sans text-base font-medium text-white shadow-[0_12px_26px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? "Entrando..." : "Entrar"}
              <LogIn className="h-4 w-4" />
            </button>

            <p className="rounded-md bg-[#f8f1e9] px-3 py-2 text-center font-sans text-xs font-light leading-5 text-[#8b4114]/70">
              Se você ainda não tem acesso, peça para o administrador principal criar seu usuário.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AdminLogin;
