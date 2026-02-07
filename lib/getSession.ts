import { cookies } from "next/headers";

export type Session = {
  userId: string;
  role: "ADMIN" | "CUSTOMER";
};

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie.value) as Session;
  } catch {
    return null;
  }
}
