const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export type AdminSession = {
  id: string;
  username: string;
  email: string;
  role: "owner" | "admin";
  name?: string;
};

export async function signInAdmin(login: string, password: string): Promise<AdminSession> {
  const response = await fetch(`${apiBaseUrl}/api/admin/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ login, password }),
  });

  if (!response.ok) {
    throw new Error(await readAuthError(response));
  }

  const data = (await response.json()) as { user: AdminSession };
  return data.user;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/session`, {
      credentials: "include",
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { user?: AdminSession };
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function signOutAdmin() {
  await fetch(`${apiBaseUrl}/api/admin/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => undefined);

  window.location.assign("/admin/login");
}

async function readAuthError(response: Response) {
  try {
    const body = await response.json();
    return typeof body.error === "string" ? body.error : "Nao foi possivel entrar.";
  } catch {
    return "Nao foi possivel entrar.";
  }
}
