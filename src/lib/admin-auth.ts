const adminSessionKey = "maiara_admin_session";

export type AdminSession = {
  email: string;
  signedInAt: string;
};

export function getAdminSession(): AdminSession | null {
  const rawSession = window.localStorage.getItem(adminSessionKey);
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as AdminSession;
  } catch {
    window.localStorage.removeItem(adminSessionKey);
    return null;
  }
}

export function signInAdmin(email: string) {
  const session: AdminSession = {
    email,
    signedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(adminSessionKey, JSON.stringify(session));
  return session;
}

export function signOutAdmin() {
  window.localStorage.removeItem(adminSessionKey);
}
