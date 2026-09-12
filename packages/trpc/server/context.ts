import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { checkAuthenticationUserFactory } from "./utils/authenticate-user";
import { authenticateAdminFactory } from "./utils/authenticate-admin";

type TRPCContext = {
  checkAuthenticationUser: ReturnType<typeof checkAuthenticationUserFactory>;
  authenticateAdmin: ReturnType<typeof authenticateAdminFactory>;
};

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<TRPCContext> {
  const ctx: TRPCContext = {
    checkAuthenticationUser: checkAuthenticationUserFactory(req),
    authenticateAdmin: authenticateAdminFactory(req),
  };

  return ctx;
}
export type Context = Awaited<ReturnType<typeof createContext>>;
