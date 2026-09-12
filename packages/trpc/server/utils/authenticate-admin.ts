import { getAuth } from "@clerk/express";
import type { Request } from "express";
import { userService } from "../services";

export function authenticateAdminFactory(req: Request) {
  return async function authenticateAdmin() {
    const { userId: clerkId } = getAuth(req);

    const result = await userService.getUserByClerkId({ clerkId });
    return { role: result[0]?.role, clerkId };
  };
}
