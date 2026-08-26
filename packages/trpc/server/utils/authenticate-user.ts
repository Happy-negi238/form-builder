import { getAuth } from "@clerk/express";
import type { Request } from "express";

export function checkAuthenticationUserFactory(req: Request) {
  return function checkAuthenticationUser() {
    const { isAuthenticated, userId: clerkId } = getAuth(req);

    return { clerkId, isAuthenticated };
  };
}
