import "server-only";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-constants";

export { ADMIN_SESSION_COOKIE };

export async function isAdminAuthenticated() {
  const store = await cookies();
  const value = store.get(ADMIN_SESSION_COOKIE)?.value;
  return Boolean(value) && value === process.env.ADMIN_SESSION_SECRET;
}

export function checkAdminPassword(password: string) {
  return password.length > 0 && password === process.env.ADMIN_PASSWORD;
}
