import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { checkAuthenticationUserFactory } from "./utils/authenticate-user";

type TRPCContext = {
  checkAuthenticationUser: ReturnType<typeof checkAuthenticationUserFactory>;
};

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<TRPCContext> {
  const ctx: TRPCContext = {
    checkAuthenticationUser: checkAuthenticationUserFactory(req),
  };

  return ctx;
}
export type Context = Awaited<ReturnType<typeof createContext>>;
